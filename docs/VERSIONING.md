# LearnWithUs versioning

LearnWithUs uses semantic versioning: `MAJOR.MINOR.PATCH`.

- Increase **MAJOR** for a breaking change that requires deployment or content migration work, for example `1.3.0` → `2.0.0`.
- Increase **MINOR** for a backward-compatible feature, new learning section or meaningful interface improvement, for example `1.3.0` → `1.4.0`.
- Increase **PATCH** for a backward-compatible correction, content fix or small visual repair, for example `1.3.0` → `1.3.1`.

For every release, update `VERSION`, `package.json`, the service-worker cache name and `docs/CHANGELOG.md`. The ZIP and its top-level folder use the same version, such as `LearnWithUs-v1.3.0.zip`.
