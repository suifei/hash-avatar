# Changelog

The npm major version tracks the avatar contract version. Any change that alters existing avatars bumps the contract to the next `vN` (see README, "Versioning contract").

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
