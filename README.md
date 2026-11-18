# hash-avatar

[![npm](https://img.shields.io/npm/v/@suifei/hash-avatar?color=2f6feb&label=npm)](https://www.npmjs.com/package/@suifei/hash-avatar)
[![CI](https://github.com/suifei/hash-avatar/actions/workflows/ci.yml/badge.svg)](https://github.com/suifei/hash-avatar/actions/workflows/ci.yml)
[![license](https://img.shields.io/badge/license-Apache--2.0-blue)](LICENSE)

English | [简体中文](README.zh-CN.md)

Deterministic SVG avatars from a name or email, via SHA-256. Zero dependencies, synchronous, runs in browsers and Node. About 0.1 ms and 6 KB per avatar.

<p>
<img src="https://__HOST__/v1/alice.svg?gender=female&size=96" width="96" alt="">
<img src="https://__HOST__/v1/bob.svg?gender=male&age=middle&race=black&size=96" width="96" alt="">
<img src="https://__HOST__/v1/carol.svg?gender=female&age=old&race=asian&size=96" width="96" alt="">
<img src="https://__HOST__/v1/dave.svg?gender=male&age=teen&race=brown&size=96" width="96" alt="">
<img src="https://__HOST__/v1/eve.svg?age=baby&size=96" width="96" alt="">
<img src="https://__HOST__/v1/octocat.svg?gender=male&race=white&size=96" width="96" alt="">
</p>

**Live demo:** https://suifei.github.io/hash-avatar/

There are three ways to use it:

| | Use when | Needs |
|---|---|---|
| [Image URL](#1-image-url-no-code) | READMEs, Markdown, any `<img>` | nothing |
| [CDN script](#2-browser-via-cdn) | rendering in a web page | one `<script>` tag |
| [npm package](#3-npm) | Node, bundlers, server-side rendering | `npm i @suifei/hash-avatar` |

## 1. Image URL (no code)

Works anywhere an image URL works, the same way shields.io badges do:

```html
<img src="https://__HOST__/v1/octocat.svg?gender=male&size=128" width="128" alt="octocat">
```

```markdown
![avatar](https://__HOST__/v1/octocat.svg?size=128)
```

| URL | Behaviour |
|---|---|
| `/v1/<name>.svg` | Pinned to contract v1. **Recommended.** Cached for a year. |
| `/<name>.svg` | Follows the latest contract version. Cached for a day. |
| `/avatar.svg?name=<name>` | Query-string form, for names that are awkward in a path. |

Query parameters: `gender`, `age`, `race`, `size` (16–1024) and `fp=0` (hide the fingerprint ring). They take the same values as the [options](#options) below. URL-encode the name (`encodeURIComponent`). Names are limited to 256 characters.

> Avoid putting real email addresses in public image URLs: they end up in server logs and `Referer` headers. See [Privacy](#privacy).

The service is a small Cloudflare Worker ([`worker/index.js`](worker/index.js)). To self-host it, run `npx wrangler deploy`.

## 2. Browser via CDN

```html
<script src="https://cdn.jsdelivr.net/npm/@suifei/hash-avatar@1/src/hash-avatar.js"></script>
<div id="me"></div>
<script>
  document.getElementById('me').innerHTML =
    HashAvatar.svg('alice@example.com', { gender: 'female', age: 'youth', size: 96 });
</script>
```

unpkg works too: `https://unpkg.com/@suifei/hash-avatar@1/src/hash-avatar.js`. The script defines `window.HashAvatar`.

## 3. npm

```sh
npm i @suifei/hash-avatar
```

```js
const HashAvatar = require('@suifei/hash-avatar');

const svg = HashAvatar.svg('alice@example.com', { gender: 'female', age: 'youth', race: 'auto', size: 128 });
// => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" ...>'

// Use as a data URL:
const src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
```

## API

### `svg(input, options?) → string`

Returns a complete SVG document as a string.

#### Options

| Option | Values | Default |
|---|---|---|
| `gender` | `male` · `female` · `neutral` | `neutral` |
| `age` | `baby` · `teen` · `youth` · `middle` · `old` | `youth` |
| `race` | `asian` · `white` · `black` · `brown` · `auto` | `auto` |
| `size` | width/height in px (the viewBox is always 256) | `256` |
| `salt` | any string, mixed into the hash | `''` |
| `fingerprint` | draw the 128-bit fingerprint ring | `true` |

Invalid values fall back to the defaults.

### `hash(input, salt?) → { input, bytes, hex }`

The normalized input, the 32-byte SHA-256 digest (`Uint8Array`) and its hex string.

### `normalize(input) → string`

NFC, trim, then collapse runs of whitespace to one space. Only email-like input (`x@y`) is lowercased, so `Alice@Example.com` and `alice@example.com` give the same avatar, but `Alice` and `alice` do not.

### `sha256(bytes) → Uint8Array`

The built-in synchronous SHA-256.

### `GENDERS`, `AGES`, `RACES`, `version`

The accepted option values and the contract version (`'v1'`).

## Why avatars are unique

Facial features, hairstyles and accessories only have a finite number of combinations, so they cannot make avatars unique on their own. Each avatar therefore has an outer ring of **128 ticks**, one per bit of the first 128 bits of the hash. Ticks are drawn most significant bit first, clockwise from 12 o'clock. A long tick means 1 and a faint dot means 0.

If the first 128 bits differ, the rings differ. Two different inputs share a ring only when SHA-256 truncated to 128 bits collides, which is **less likely than a UUIDv4 collision** (122 random bits).

Gender, age and race are **not** hashed. They are rendering parameters, so the same identity keeps the same ring and recognisable traits when they change.

## Known limitations

- **Small sizes.** Below about 96 px the ring ticks cannot be told apart by eye. Uniqueness then becomes probabilistic and rests on the combination of features.
- **Privacy.** The ring is the hash in plain sight. For emails, anyone can read those 128 bits and run a dictionary lookup. When you display avatars publicly, render them on your server with a secret `salt`. The public image service cannot do this, because a salt in a URL is not secret, so pass it a username or opaque ID rather than an email.
- **What race changes.** Race only changes the range of skin, hair and eye colours and the weighting of hair textures. **Facial geometry is never changed.** This is deliberate, to avoid drawing stereotypes.

## Versioning contract

Once an avatar has been shown to someone, the mapping from input to picture is a public contract. Under contract v1:

1. The hash input is `'hash-avatar/v1\0' + salt + '\0' + normalize(input)`.
2. Bytes 0–15 are drawn as the fingerprint ring. Bytes 16–31 drive the main features through fixed slots. Secondary features reuse bytes 0–15.
3. Gender, age and race are not part of the hash.

Any change to **slot assignment, the contents or order of any list** (picking uses modulo, so even appending an item breaks existing avatars), **palettes or geometry** changes existing avatars. Such a change requires a **v2** release with a new hash tag and a CHANGELOG entry. Golden snapshot tests (`test/golden.json`) enforce this rule.

The npm major version follows the contract version: `1.x` is always contract v1.

## Development

```sh
npm test             # node:test, runs in a few seconds
npm run build:demo   # inlines the library into a single-file dist/index.html
npm run sheet        # renders every hair / hat / beard / clothing / glasses variant (needs rsvg-convert)
npm run worker:dev   # run the image service locally
```

## License

[Apache-2.0](LICENSE)
