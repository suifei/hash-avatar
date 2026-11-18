// Cloudflare Worker: serves hash-avatar SVGs over HTTP so any page can embed them with <img src>.
//
//   GET /<name>.svg?gender=female&age=youth&race=asian&size=128&fp=0
//   GET /v1/<name>.svg?...            (pinned to contract v1, cached forever)
//   GET /avatar.svg?name=<name>&...   (query form)
//
// Output depends only on the URL, so responses are cached at the edge.
import HA from '../src/hash-avatar.js';

const MAX_INPUT = 256;
const SVG_HEADERS = {
  'content-type': 'image/svg+xml; charset=utf-8',
  'access-control-allow-origin': '*',
  'x-content-type-options': 'nosniff',
  'content-security-policy': "default-src 'none'; style-src 'unsafe-inline'",
};

function parse(url) {
  const p = url.pathname;
  let m;
  if (p === '/avatar.svg' || p === '/avatar') return { name: url.searchParams.get('name') || '', pinned: false };
  if ((m = p.match(/^\/v1\/(.+?)(?:\.svg)?$/))) return { name: decodeURIComponent(m[1]), pinned: true };
  if ((m = p.match(/^\/(?!v\d+\/)(.+?)\.svg$/))) return { name: decodeURIComponent(m[1]), pinned: false };
  return null;
}

function options(q) {
  const opts = {};
  for (const k of ['gender', 'age', 'race']) if (q.has(k)) opts[k] = q.get(k);
  if (q.has('size')) {
    const s = parseInt(q.get('size'), 10);
    if (s > 0) opts.size = Math.min(1024, Math.max(16, s));
  }
  if (q.has('fp')) opts.fingerprint = !/^(0|false|no|off)$/i.test(q.get('fp'));
  return opts;
}

function home(url) {
  const base = url.origin;
  const body = `hash-avatar ${HA.version} — deterministic SVG avatars

  ${base}/<name>.svg
  ${base}/v1/<name>.svg          pinned to contract v1
  ${base}/avatar.svg?name=<name>

query: gender=male|female|neutral  age=baby|teen|youth|middle|old
       race=asian|white|black|brown|auto  size=16..1024  fp=0 (hide ring)

example: ${base}/octocat.svg?gender=male&age=youth&size=128
source:  https://github.com/suifei/hash-avatar
`;
  return new Response(body, { headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'public, max-age=3600' } });
}

export default {
  async fetch(request, env, ctx) {
    if (request.method !== 'GET' && request.method !== 'HEAD') return new Response('method not allowed', { status: 405 });
    const url = new URL(request.url);
    if (url.pathname === '/' || url.pathname === '') return home(url);
    if (url.pathname === '/favicon.ico') return new Response(null, { status: 204 });

    let target;
    try { target = parse(url); } catch (e) { return new Response('bad name encoding', { status: 400 }); }
    if (!target) return new Response('not found', { status: 404 });
    if (target.name.length > MAX_INPUT) return new Response('name too long', { status: 414 });

    const cache = caches.default;
    const hit = await cache.match(request);
    if (hit) return hit;

    const svg = HA.svg(target.name, options(url.searchParams));
    // /v1/ URLs are frozen by contract; unpinned URLs follow the latest major and are cached for a day.
    const cc = target.pinned ? 'public, max-age=31536000, immutable' : 'public, max-age=86400, s-maxage=604800';
    const res = new Response(svg, { headers: { ...SVG_HEADERS, 'cache-control': cc } });
    ctx.waitUntil(cache.put(request, res.clone()));
    return res;
  },
};
