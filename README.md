# Vishwas B M · Portfolio

React + Vite. The theme is an occupancy map: grey "unknown" page, white "free"
rooms with black walls, an RViz-style robot you can drive in the hero, and an
Ubuntu-style terminal.

## Run it locally

```bash
npm install
npm run dev
```

Open the link Vite prints (usually http://localhost:5173).

## Edit your content

Everything you'll want to change is in **`src/data.js`**: projects, skills,
leadership, certificates, education, channels and links.

- Anything set to `null` shows as a hatched **Unmapped** box so you can see
  what's left to fill in.
- When you're ready to share the site, set `SHOW_PLACEHOLDERS = false` at the
  top of `src/data.js`. Every unfilled box disappears.
- Project images go in `public/images/` and are referenced as
  `"/images/your-file.jpg"`. GIFs work too.
- Replace `public/vishwas_resume.pdf` to update your resume (keep the name, or
  change `resume` in `data.js`).

Add a project by copying one of the objects in the `projects` array.
`status` can be `"done"`, `"in-progress"` or `"planned"`.

Add a terminal command in `src/components/Terminal.jsx`, inside `run()`.

## Deploy on Vercel

1. Push this folder to a GitHub repo.
2. On vercel.com, choose **Add New → Project** and import the repo.
3. Vercel detects Vite automatically (build: `npm run build`, output: `dist`).
   Click **Deploy**.

Every push to `main` redeploys the site.

## Files

```
src/
  data.js                    your content
  App.jsx                    page layout and sections
  styles.css                 theme and layout
  components/
    RobotViewport.jsx        the drivable robot in the hero
    Terminal.jsx             the terminal section
public/
  certificates/              certificate PDFs linked from data.js
  images/                    project screenshots
  vishwas_resume.pdf
  favicon.svg
```
