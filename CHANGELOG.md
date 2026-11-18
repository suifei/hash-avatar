# Changelog

The npm major version tracks the avatar contract version. Any change that alters existing avatars bumps the contract to the next `vN` (see README, "Versioning contract").

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
