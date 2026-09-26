# LearnWithUs versioning

The release number uses `MAJOR.MINOR.PATCH`.

| Change | Example | Next version from 1.0.0 |
| --- | --- | --- |
| Bug fix, spelling correction, data correction, small styling fix | Correct a broken Telugu button | `1.0.1` |
| New backward-compatible feature, page, quiz, language or category | Add mathematics lessons | `1.1.0` |
| Breaking URL, storage, deployment or architecture change | Replace the current static-page architecture | `2.0.0` |

For every release, update all four locations:

1. `package.json` → `version`
2. `VERSION`
3. `docs/CHANGELOG.md`
4. ZIP filename: `LearnWithUs-vX.Y.Z.zip`

Run `npm test` before creating the ZIP. The feature test fails if `package.json` and `VERSION` are different.
