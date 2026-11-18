# Changelog

The npm major version tracks the avatar contract version. Any change that alters existing avatars bumps the contract to the next `vN` (see README, "Versioning contract").

## 1.3.0 — 2026-11-19

Rendering is unchanged (contract v1, golden snapshots untouched).

- React and Vue components: `@suifei/hash-avatar/react` and `@suifei/hash-avatar/vue` (ESM and CommonJS, SSR-safe). React and Vue are optional peer dependencies, so the core stays dependency-free. Vue components also work as a plugin (`app.use(HashAvatar)`).
- TypeScript types for the library and both components.
- `exports` map in `package.json`. `import HashAvatar from '@suifei/hash-avatar'` works in ES modules.
- The minified build now carries its license banner.
- Repository artwork: a README banner, a logo, a social preview card and a world map of 583 avatars (`npm run build:logo`, `npm run build:map`).

## 1.2.0 — 2026-11-18

**Contract v1 is redrawn again**, at the user's request, while the project still has almost no users. The hash input and the fingerprint ring are unchanged, so every avatar keeps its identity, but its pixels change.

- `race` grows from 31 to 88 values, grouped and exported as `GROUPS` (`human`, `fantasy`, `animal`, `scifi`):
  - Humans: new `southasian`, `seasian`, `mideast`, `latino`, `indigenous`, `pacific`.
  - Fantasy and myth: new `goblin`, `troll`, `mermaid`, `fairy`, `tengu`, `jinn`, `mummy`, `qilin`, `phoenix`, `unicorn`, `nian`, `tanuki`, `yeti`, `werewolf`, `golem`.
  - Animals: the full Chinese zodiac (`mouse`, `ox`, `tiger`, `snake`, `horse`, `goat`, `rooster`, `pig` join the existing ones) plus `lion`, `wolf`, `leopard`, `redpanda`, `koala`, `raccoon`, `hamster`, `hedgehog`, `capybara`, `zebra`, `giraffe`, `deer`, `sheep`, `elephant`, `octopus`, `chick`, `duck`, `parrot`, `bee`.
  - Sci-fi and oddities: new `android`, `hologram`, `insectoid`, `mushroom`, `pumpkin`, `snowman`, `cactus`, `star`.
- Human skin tone is now continuous. The hash picks a point on the Monk Skin Tone scale inside the race's range (ranges overlap) and one of four undertones. Race still never changes facial geometry.
- New creatures are assembled from part recipes (head shape, ears, muzzle, markings, extras). The hash varies ear size, markings, colourway, an optional extra and a neck or head accessory, so two avatars of the same species look different.
- Art styles reworked: `comic` keeps natural colours with bold ink lines and halftone shadows; `pop` is a four-ink screen-print gradient map picked by the hash; `sketch` is graphite on warm paper with hatching; `neon` keeps a dim fill so faces stay readable; `pixel` gets sprite outlines and a slightly larger cell. `pixel`, `comic`, `sketch` and `pop` now filter only the portrait, so the fingerprint ring stays crisp. Below 180 px, line styles use a thinner one-sided edge.
- The package ships a minified build, `src/hash-avatar.min.js` (about 94 KB, 32 KB gzipped), and the `unpkg`/`jsdelivr` CDN entries point to it. `npm run build:min` builds it and checks that it renders byte-identical SVGs.
- The avatar element id now encodes the race index in two base-36 characters.

## 1.1.0 — 2026-11-18

**Contract v1 is redrawn.** This is a one-time exception, made while the project had almost no users. The hash input and the fingerprint ring are unchanged, so every avatar keeps its identity, but its pixels change.

- Animation is on by default (`animate: false` / `anim=0` turns it off). Every motion parameter comes from a hash-seeded PRNG: head motion, amplitude and tempo, blink timing, the light wave over the ring's bits (speed, direction, number of crests), background orbit and sparkles. Hovering an inline SVG gives a card effect: the avatar tilts in 3D away from the pointer (nine hover zones, pure CSS), a glare follows the pointer, and the ring wave speeds up. Pixel art is drawn with 1-px cells (no filter) below 96 px and inside QR codes, where a coarser grid would be unreadable. `prefers-reduced-motion` stops everything.
- `race` now covers 31 values: the 5 human values, fantasy races (`elf`, `orc`, `vampire`, `zombie`, `oni`, `demon`, `angel`, `cyborg`), creatures and machines (`cat`, `dog`, `fox`, `kitsune`, `panda`, `rabbit`, `bear`, `owl`, `penguin`, `frog`, `monkey`, `dragon`, `robot`, `ai`, `alien`, `ghost`, `skeleton`, `slime`), plus `any`, which lets the hash pick one.
- New `art` option with 10 styles built as SVG filters: `flat` (default), `pixel`, `ink`, `comic`, `sketch`, `neon`, `pop`, `mood`, `watercolor`, `glitch`.
- New `qr` option: a built-in QR encoder (byte mode, level H, versions 1–40) puts the avatar in the middle of a QR code. `qrMatrix()` is exported.
- Image service: new `art`, `anim` and `qr` query parameters. `/v1/` responses are now cached for a week instead of a year.

## 1.0.1 — 2026-11-18

Documentation only. Rendering is unchanged (contract v1).

- Image service moves to `avatar.onrpc.com`, which is reachable from mainland China. `hash-avatar.suifei.workers.dev` stays as a mirror.
- The README showcases live avatars: one identity across every dimension, the fingerprint ring, and a 48-avatar gallery.

## 1.0.0 — 2026-11-18

First release. **Contract v1 is now frozen.**

- `svg(input, opts)` with `gender`, `age`, `race`, `size`, `salt` and `fingerprint` options.
- A 128-bit fingerprint ring drawn from the first 16 bytes of `SHA-256('hash-avatar/v1\0' + salt + '\0' + normalize(input))`.
- `hash`, `normalize`, `sha256`, `GENDERS`, `AGES` and `RACES` exports.
- An image service (Cloudflare Worker) for `<img src>` embedding, at `/v1/<name>.svg`.
