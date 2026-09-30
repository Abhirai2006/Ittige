# Ittige website

Next.js static site with a scroll-driven brick animation (Three.js, drawn live from code).

## Run
    npm install
    npm run dev        # http://localhost:3000

## Deploy
Vercel: import the folder or repo, no settings needed.
Netlify: build command `npm run build`, publish directory `out` (already set in netlify.toml).

## Edit
- Team photos, roles and links: `TEAM` array at the top of `app/page.jsx`. Put photos in `public/team/` and use paths like `/team/abhishek.jpg`.
- Animation captions: `CAP` array in `components/BrickScene.jsx`.
- Numbers on the page come from the report. Change them in `app/page.jsx` if the report changes.
