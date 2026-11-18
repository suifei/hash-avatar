# Changelog

The npm major version tracks the avatar contract version. Any change that alters existing avatars bumps the contract to the next `vN` (see README, "Versioning contract").

## 1.0.0 — 2026-11-18

First release. **Contract v1 is now frozen.**

- `svg(input, opts)` with `gender`, `age`, `race`, `size`, `salt` and `fingerprint` options.
- A 128-bit fingerprint ring drawn from the first 16 bytes of `SHA-256('hash-avatar/v1\0' + salt + '\0' + normalize(input))`.
- `hash`, `normalize`, `sha256`, `GENDERS`, `AGES` and `RACES` exports.
- An image service (Cloudflare Worker) for `<img src>` embedding, at `/v1/<name>.svg`.
