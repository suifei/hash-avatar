<div align="center">

<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=asian&size=180" width="180" alt="flynn · male · youth · asian" title="flynn · male · youth · asian">

<sub>☝️ <code>flynn</code>, generated live from <code>avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=asian</code></sub>

# hash-avatar

Deterministic SVG avatars from a name or email, via SHA-256.<br>Zero dependencies · synchronous · browser & Node · ~0.1 ms / ~6 KB per avatar.

[![npm](https://img.shields.io/npm/v/@suifei/hash-avatar?color=2f6feb&label=npm)](https://www.npmjs.com/package/@suifei/hash-avatar)
[![CI](https://github.com/suifei/hash-avatar/actions/workflows/ci.yml/badge.svg)](https://github.com/suifei/hash-avatar/actions/workflows/ci.yml)
[![size](https://img.shields.io/badge/deps-0-brightgreen)](package.json)
[![license](https://img.shields.io/badge/license-Apache--2.0-blue)](LICENSE)

<a href="https://suifei.github.io/hash-avatar/">Live demo</a> · <a href="#1-image-url-no-code">Embed as an image</a> · <a href="#3-npm">npm</a> · <a href="#versioning-contract">Contract</a>

English | [简体中文](README.zh-CN.md)

</div>

## One identity, every dimension

Gender, age and race are **rendering parameters, not hash input**, so the same person stays recognisable: same ring, same colours, same traits. Here is `flynn` (race `asian`) in all 15 gender × age combinations:

<table align="center">
<tr><th></th><th>baby</th><th>teen</th><th>youth</th><th>middle</th><th>old</th></tr>
<tr><th>male</th><td><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=baby&race=asian&size=96" width="96" alt="flynn · male · baby · asian" title="flynn · male · baby · asian"></td><td><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=teen&race=asian&size=96" width="96" alt="flynn · male · teen · asian" title="flynn · male · teen · asian"></td><td><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=asian&size=96" width="96" alt="flynn · male · youth · asian" title="flynn · male · youth · asian"></td><td><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=middle&race=asian&size=96" width="96" alt="flynn · male · middle · asian" title="flynn · male · middle · asian"></td><td><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=old&race=asian&size=96" width="96" alt="flynn · male · old · asian" title="flynn · male · old · asian"></td></tr>
<tr><th>female</th><td><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=female&age=baby&race=asian&size=96" width="96" alt="flynn · female · baby · asian" title="flynn · female · baby · asian"></td><td><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=female&age=teen&race=asian&size=96" width="96" alt="flynn · female · teen · asian" title="flynn · female · teen · asian"></td><td><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=female&age=youth&race=asian&size=96" width="96" alt="flynn · female · youth · asian" title="flynn · female · youth · asian"></td><td><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=female&age=middle&race=asian&size=96" width="96" alt="flynn · female · middle · asian" title="flynn · female · middle · asian"></td><td><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=female&age=old&race=asian&size=96" width="96" alt="flynn · female · old · asian" title="flynn · female · old · asian"></td></tr>
<tr><th>neutral</th><td><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=neutral&age=baby&race=asian&size=96" width="96" alt="flynn · neutral · baby · asian" title="flynn · neutral · baby · asian"></td><td><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=neutral&age=teen&race=asian&size=96" width="96" alt="flynn · neutral · teen · asian" title="flynn · neutral · teen · asian"></td><td><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=neutral&age=youth&race=asian&size=96" width="96" alt="flynn · neutral · youth · asian" title="flynn · neutral · youth · asian"></td><td><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=neutral&age=middle&race=asian&size=96" width="96" alt="flynn · neutral · middle · asian" title="flynn · neutral · middle · asian"></td><td><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=neutral&age=old&race=asian&size=96" width="96" alt="flynn · neutral · old · asian" title="flynn · neutral · old · asian"></td></tr>
</table>

And `flynn` as a young man across the `race` setting (`auto` draws from all palettes). Race only shifts colour ranges and hair-texture weights. It never changes facial geometry.

<table align="center">
<tr><th><code>asian</code></th><th><code>white</code></th><th><code>black</code></th><th><code>brown</code></th><th><code>auto</code></th></tr>
<tr><td><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=asian&size=96" width="96" alt="flynn · male · youth · asian" title="flynn · male · youth · asian"></td><td><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=white&size=96" width="96" alt="flynn · male · youth · white" title="flynn · male · youth · white"></td><td><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=black&size=96" width="96" alt="flynn · male · youth · black" title="flynn · male · youth · black"></td><td><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=brown&size=96" width="96" alt="flynn · male · youth · brown" title="flynn · male · youth · brown"></td><td><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=auto&size=96" width="96" alt="flynn · male · youth · auto" title="flynn · male · youth · auto"></td></tr>
</table>

## The fingerprint ring

The outer ring draws the first **128 bits** of the hash, one tick per bit, clockwise from 12 o'clock. Different input means a different ring, with collision odds below a UUIDv4. Below about 96 px the ticks blur together, so `fp=0` turns the ring off for small sizes.

<table align="center"><tr>
<td align="center" valign="bottom"><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=asian&size=192" width="192" alt="flynn" title="flynn"><br><sub>ring on, 192 px</sub></td>
<td align="center" valign="bottom"><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=asian&fp=0&size=192" width="192" alt="flynn" title="flynn"><br><sub>ring off (<code>fp=0</code>)</sub></td>
<td align="center" valign="bottom"><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=asian&size=96" width="96" alt="flynn" title="flynn"><br><sub>96 px</sub></td>
<td align="center" valign="bottom"><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=asian&size=48" width="48" alt="flynn" title="flynn"><br><sub>48 px</sub></td>
<td align="center" valign="bottom"><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=asian&fp=0&size=32" width="32" alt="flynn" title="flynn"><br><sub>32 px</sub></td>
</tr></table>

## Gallery

48 different names, rotating through every gender, age and race. Each image is a plain `<img>` pointing at the live service.

<p align="center">
<img src="https://avatar.onrpc.com/v1/alice.svg?gender=male&age=baby&race=asian&size=80" width="80" alt="alice · male · baby · asian" title="alice · male · baby · asian">
<img src="https://avatar.onrpc.com/v1/bob.svg?gender=female&age=youth&race=white&size=80" width="80" alt="bob · female · youth · white" title="bob · female · youth · white">
<img src="https://avatar.onrpc.com/v1/carol.svg?gender=neutral&age=old&race=black&size=80" width="80" alt="carol · neutral · old · black" title="carol · neutral · old · black">
<img src="https://avatar.onrpc.com/v1/dave.svg?gender=male&age=teen&race=brown&size=80" width="80" alt="dave · male · teen · brown" title="dave · male · teen · brown">
<img src="https://avatar.onrpc.com/v1/eve.svg?gender=female&age=old&race=auto&size=80" width="80" alt="eve · female · old · auto" title="eve · female · old · auto">
<img src="https://avatar.onrpc.com/v1/frank.svg?gender=neutral&age=teen&race=asian&size=80" width="80" alt="frank · neutral · teen · asian" title="frank · neutral · teen · asian">
<img src="https://avatar.onrpc.com/v1/grace.svg?gender=male&age=middle&race=white&size=80" width="80" alt="grace · male · middle · white" title="grace · male · middle · white">
<img src="https://avatar.onrpc.com/v1/heidi.svg?gender=female&age=baby&race=black&size=80" width="80" alt="heidi · female · baby · black" title="heidi · female · baby · black">
<img src="https://avatar.onrpc.com/v1/ivan.svg?gender=neutral&age=middle&race=auto&size=80" width="80" alt="ivan · neutral · middle · auto" title="ivan · neutral · middle · auto">
<img src="https://avatar.onrpc.com/v1/judy.svg?gender=male&age=baby&race=asian&size=80" width="80" alt="judy · male · baby · asian" title="judy · male · baby · asian">
<img src="https://avatar.onrpc.com/v1/mallory.svg?gender=female&age=youth&race=white&size=80" width="80" alt="mallory · female · youth · white" title="mallory · female · youth · white">
<img src="https://avatar.onrpc.com/v1/niaj.svg?gender=neutral&age=old&race=black&size=80" width="80" alt="niaj · neutral · old · black" title="niaj · neutral · old · black">
<img src="https://avatar.onrpc.com/v1/olivia.svg?gender=male&age=youth&race=brown&size=80" width="80" alt="olivia · male · youth · brown" title="olivia · male · youth · brown">
<img src="https://avatar.onrpc.com/v1/peggy.svg?gender=female&age=old&race=auto&size=80" width="80" alt="peggy · female · old · auto" title="peggy · female · old · auto">
<img src="https://avatar.onrpc.com/v1/rupert.svg?gender=neutral&age=teen&race=asian&size=80" width="80" alt="rupert · neutral · teen · asian" title="rupert · neutral · teen · asian">
<img src="https://avatar.onrpc.com/v1/sybil.svg?gender=male&age=middle&race=white&size=80" width="80" alt="sybil · male · middle · white" title="sybil · male · middle · white">
<img src="https://avatar.onrpc.com/v1/trent.svg?gender=female&age=teen&race=brown&size=80" width="80" alt="trent · female · teen · brown" title="trent · female · teen · brown">
<img src="https://avatar.onrpc.com/v1/victor.svg?gender=neutral&age=middle&race=auto&size=80" width="80" alt="victor · neutral · middle · auto" title="victor · neutral · middle · auto">
<img src="https://avatar.onrpc.com/v1/walter.svg?gender=male&age=baby&race=asian&size=80" width="80" alt="walter · male · baby · asian" title="walter · male · baby · asian">
<img src="https://avatar.onrpc.com/v1/xiao.ming.svg?gender=female&age=youth&race=white&size=80" width="80" alt="xiao.ming · female · youth · white" title="xiao.ming · female · youth · white">
<img src="https://avatar.onrpc.com/v1/%E6%9D%8E%E4%BC%9F.svg?gender=neutral&age=baby&race=black&size=80" width="80" alt="李伟 · neutral · baby · black" title="李伟 · neutral · baby · black">
<img src="https://avatar.onrpc.com/v1/%E7%8E%8B%E8%8A%B3.svg?gender=male&age=youth&race=brown&size=80" width="80" alt="王芳 · male · youth · brown" title="王芳 · male · youth · brown">
<img src="https://avatar.onrpc.com/v1/%E5%BC%B5%E5%81%89.svg?gender=female&age=old&race=auto&size=80" width="80" alt="張偉 · female · old · auto" title="張偉 · female · old · auto">
<img src="https://avatar.onrpc.com/v1/yuki.svg?gender=neutral&age=teen&race=asian&size=80" width="80" alt="yuki · neutral · teen · asian" title="yuki · neutral · teen · asian">
<img src="https://avatar.onrpc.com/v1/amara.svg?gender=male&age=old&race=black&size=80" width="80" alt="amara · male · old · black" title="amara · male · old · black">
<img src="https://avatar.onrpc.com/v1/kwame.svg?gender=female&age=teen&race=brown&size=80" width="80" alt="kwame · female · teen · brown" title="kwame · female · teen · brown">
<img src="https://avatar.onrpc.com/v1/priya.svg?gender=neutral&age=middle&race=auto&size=80" width="80" alt="priya · neutral · middle · auto" title="priya · neutral · middle · auto">
<img src="https://avatar.onrpc.com/v1/arjun.svg?gender=male&age=baby&race=asian&size=80" width="80" alt="arjun · male · baby · asian" title="arjun · male · baby · asian">
<img src="https://avatar.onrpc.com/v1/sofia.svg?gender=female&age=middle&race=white&size=80" width="80" alt="sofia · female · middle · white" title="sofia · female · middle · white">
<img src="https://avatar.onrpc.com/v1/mateo.svg?gender=neutral&age=baby&race=black&size=80" width="80" alt="mateo · neutral · baby · black" title="mateo · neutral · baby · black">
<img src="https://avatar.onrpc.com/v1/noah.svg?gender=male&age=youth&race=brown&size=80" width="80" alt="noah · male · youth · brown" title="noah · male · youth · brown">
<img src="https://avatar.onrpc.com/v1/zoe.svg?gender=female&age=old&race=auto&size=80" width="80" alt="zoe · female · old · auto" title="zoe · female · old · auto">
<img src="https://avatar.onrpc.com/v1/liam.svg?gender=neutral&age=youth&race=white&size=80" width="80" alt="liam · neutral · youth · white" title="liam · neutral · youth · white">
<img src="https://avatar.onrpc.com/v1/emma.svg?gender=male&age=old&race=black&size=80" width="80" alt="emma · male · old · black" title="emma · male · old · black">
<img src="https://avatar.onrpc.com/v1/chen.jie.svg?gender=female&age=teen&race=brown&size=80" width="80" alt="chen.jie · female · teen · brown" title="chen.jie · female · teen · brown">
<img src="https://avatar.onrpc.com/v1/lin.mei.svg?gender=neutral&age=middle&race=auto&size=80" width="80" alt="lin.mei · neutral · middle · auto" title="lin.mei · neutral · middle · auto">
<img src="https://avatar.onrpc.com/v1/hiro.svg?gender=male&age=teen&race=asian&size=80" width="80" alt="hiro · male · teen · asian" title="hiro · male · teen · asian">
<img src="https://avatar.onrpc.com/v1/sakura.svg?gender=female&age=middle&race=white&size=80" width="80" alt="sakura · female · middle · white" title="sakura · female · middle · white">
<img src="https://avatar.onrpc.com/v1/min-jun.svg?gender=neutral&age=baby&race=black&size=80" width="80" alt="min-jun · neutral · baby · black" title="min-jun · neutral · baby · black">
<img src="https://avatar.onrpc.com/v1/ji-woo.svg?gender=male&age=youth&race=brown&size=80" width="80" alt="ji-woo · male · youth · brown" title="ji-woo · male · youth · brown">
<img src="https://avatar.onrpc.com/v1/fatima.svg?gender=female&age=baby&race=asian&size=80" width="80" alt="fatima · female · baby · asian" title="fatima · female · baby · asian">
<img src="https://avatar.onrpc.com/v1/omar.svg?gender=neutral&age=youth&race=white&size=80" width="80" alt="omar · neutral · youth · white" title="omar · neutral · youth · white">
<img src="https://avatar.onrpc.com/v1/chidi.svg?gender=male&age=old&race=black&size=80" width="80" alt="chidi · male · old · black" title="chidi · male · old · black">
<img src="https://avatar.onrpc.com/v1/ngozi.svg?gender=female&age=teen&race=brown&size=80" width="80" alt="ngozi · female · teen · brown" title="ngozi · female · teen · brown">
<img src="https://avatar.onrpc.com/v1/lucas.svg?gender=neutral&age=old&race=auto&size=80" width="80" alt="lucas · neutral · old · auto" title="lucas · neutral · old · auto">
<img src="https://avatar.onrpc.com/v1/ines.svg?gender=male&age=teen&race=asian&size=80" width="80" alt="ines · male · teen · asian" title="ines · male · teen · asian">
<img src="https://avatar.onrpc.com/v1/olaf.svg?gender=female&age=middle&race=white&size=80" width="80" alt="olaf · female · middle · white" title="olaf · female · middle · white">
<img src="https://avatar.onrpc.com/v1/freya.svg?gender=neutral&age=baby&race=black&size=80" width="80" alt="freya · neutral · baby · black" title="freya · neutral · baby · black">
</p>

## Usage

There are three ways to use it:

| | Use when | Needs |
|---|---|---|
| [Image URL](#1-image-url-no-code) | READMEs, Markdown, any `<img>` | nothing |
| [CDN script](#2-browser-via-cdn) | rendering in a web page | one `<script>` tag |
| [npm package](#3-npm) | Node, bundlers, server-side rendering | `npm i @suifei/hash-avatar` |

### 1. Image URL (no code)

Works anywhere an image URL works, the same way shields.io badges do:

```html
<img src="https://avatar.onrpc.com/v1/octocat.svg?gender=male&size=128" width="128" alt="octocat">
```

```markdown
![avatar](https://avatar.onrpc.com/v1/octocat.svg?size=128)
```

| URL | Behaviour |
|---|---|
| `/v1/<name>.svg` | Pinned to contract v1. **Recommended.** Cached for a year. |
| `/<name>.svg` | Follows the latest contract version. Cached for a day. |
| `/avatar.svg?name=<name>` | Query-string form, for names that are awkward in a path. |

Query parameters: `gender`, `age`, `race`, `size` (16–1024) and `fp=0` (hide the fingerprint ring). They take the same values as the [options](#options) below. URL-encode the name (`encodeURIComponent`). Names are limited to 256 characters.

> Avoid putting real email addresses in public image URLs: they end up in server logs and `Referer` headers. See [Privacy](#known-limitations).

> **Hosts and mainland China:** the service runs on two hosts with identical output. `avatar.onrpc.com` is the primary host and is reachable from mainland China. `hash-avatar.suifei.workers.dev` is a mirror, but `*.workers.dev` is blocked in mainland China without a proxy. GitHub READMEs work with either host, because GitHub serves README images through its own `camo` proxy.

The service is a small Cloudflare Worker ([`worker/index.js`](worker/index.js)). To self-host it, run `npx wrangler deploy`.

### 2. Browser via CDN

```html
<script src="https://cdn.jsdelivr.net/npm/@suifei/hash-avatar@1/src/hash-avatar.js"></script>
<div id="me"></div>
<script>
  document.getElementById('me').innerHTML =
    HashAvatar.svg('alice@example.com', { gender: 'female', age: 'youth', size: 96 });
</script>
```

unpkg works too: `https://unpkg.com/@suifei/hash-avatar@1/src/hash-avatar.js`. The script defines `window.HashAvatar`.

### 3. npm

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
