# Changelog

## 2.0.0

Complete modernisation of the frontend. Same API, same URLs.

### New

- New, clean interface: header navigation, account menu, light/dark mode (follows the system setting until changed).
- Romhack list: search, column selection, filters and sorting are kept for the session; card list on phones instead of a sideways-scrolling table.
- Detail page: screenshot grid with full-screen viewer, rating with average and vote count, all hack data and features at a glance.
- Rating sort weights the number of votes ("Better rating sort", now live for the first time).

### Changed

- Angular 13 → 22 (standalone components, signals, zoneless change detection).
- PrimeNG 13 → [Optimus UI](https://optimus.openng.org/) 2, the MIT-licensed continuation of PrimeNG.
- PrimeFlex and the Sakai template replaced by Tailwind CSS 4.
- Font (Inter) is self-hosted; no requests to Google Fonts anymore.
- Google Analytics removed. Matomo runs without cookies, so no consent banner is needed.
- Faster initial load: routes are loaded on demand, no duplicate editor library.

### Fixed

- Comments, ratings, edits and the profile now send the login token in production as well.
- Rating no longer crashes for logged-in users and no longer shows `NaN` without votes.
- "Edited" label on comments is now shown only for comments that were actually edited.
- Duplicate-link check in the editor no longer flags the hack's own link or empty links.
- After a new deployment, open tabs reload instead of breaking on missing files.

### Development

- Tests run with Vitest, linting with ESLint 9 (flat config), formatting with Prettier.
- `npm run start:mock` runs the app with a fake login and local answers for all write requests.
- Deployment: see `README.md`.
