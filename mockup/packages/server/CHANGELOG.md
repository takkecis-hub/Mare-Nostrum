# Changelog

## [0.2.0] - 2026-04-10

### Changed
- Synchronized version bump to 0.2.0 for client UI redesign release.

## [0.1.0] - 2026-04-09

### Added
- Added validated rumor-spread and richer turn-resolution API support.
- Added optional PostgreSQL snapshot persistence for singleplayer state via `DATABASE_URL`.

### Changed
- Hardened API request validation for whispers, turn resolution, cargo actions, repair, and market purchases.
- Expanded bootstrap state with quest, contract, visited-port, and market-visibility data.

### Fixed
- Fixed cargo-capacity checks to use item quantities instead of array length.
- Restricted CORS to configured origins instead of allowing every origin.
