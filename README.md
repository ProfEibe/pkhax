# PkHax

PkHax.com is a Pokémon Romhack Database created as index and reference for all this great hacks created by an awesome community.

## Contribution
To contribute, please add an issue with your idea or add it yourself and create a pull request to this project.
If there are any questions please write me a PM on reddit (https://www.reddit.com/user/Prof_Eibe).

This project is created with Angular, [Optimus UI](https://optimus.openng.org/) (the MIT-licensed continuation of PrimeNG) and Tailwind CSS.

## Development

```bash
npm install
npm start            # http://localhost:4200, real Auth0 login, API proxied to pkhax.com
npm run start:mock   # fake login, writes are answered locally – safe for testing
npm test             # unit tests (Vitest)
npm run lint
npm run format
```

Auth0 only accepts `http://localhost:4200` as local callback URL.

## Deployment

1. `npm run build` – production build into `dist/pkhax/`.
2. Upload the **contents** of `dist/pkhax/` (including the hidden `.htaccess`) to the web root.
   Upload the new files first and do not delete the old `*.js`/`*.css` files right away – tabs that are
   still open may need them. They can be removed with a later deployment.

`src/.htaccess` is part of the build. It routes all app URLs to `index.html`, returns a real 404 for missing
files, disables caching of `index.html` and caches the hashed build files for a year.
