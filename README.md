# GAD Database — Public Dashboard

A free, static website that shows live summary charts from your LGU's GAD
Database Google Sheet: indicators tracked per sector, data-completion rate,
and aggregate Male/Female counts. No backend, no database, no cost — it's
just 3 files that read your Google Sheet directly in the visitor's browser.

## 1. Publish your Google Sheet (one-time setup, ~5 min)

You need to publish **each of the 5 sector tabs** as CSV so this website can
read them. Your Accounts/private tabs (Instructions, Cover) don't need this.

1. Open your GAD Database Google Sheet.
2. Go to **File → Share → Publish to web**.
3. In the dialog, use the first dropdown to select **one specific sheet**
   (e.g. "I. Social Development") — not "Entire Document".
4. In the second dropdown, choose **Comma-separated values (.csv)**.
5. Click **Publish**, confirm, then copy the link it gives you.
6. Repeat for all 5 sector tabs: I. Social Development, II. Economic
   Development, III. Infrastructure, IV. Environmental, V. Institutional.

You'll end up with 5 links that look like:
`https://docs.google.com/spreadsheets/d/e/2PACX-.../pub?gid=123456&single=true&output=csv`

⚠️ Anyone with these links can view that tab's data as CSV — same level of
exposure as the dashboard itself, since the whole point is public viewing.

## 2. Paste the links into `config.js`

Open `config.js` in this folder and paste each link next to its matching
sector, between the quotes:

```js
const SHEET_CSV_URLS = {
  social:         "https://docs.google.com/.../output=csv",
  economic:       "https://docs.google.com/.../output=csv",
  infrastructure: "https://docs.google.com/.../output=csv",
  environmental:  "https://docs.google.com/.../output=csv",
  institutional:  "https://docs.google.com/.../output=csv",
};
const LGU_NAME = "Municipality of ______"; // change this too
```

Save the file. That's it — no other code needs to change. The dashboard
re-fetches the Google Sheet fresh every time someone opens the page, so it's
always up to date with whatever your departments have filled in.

## 3. Publish it for free

### Option A — GitHub Pages
1. Create a free GitHub account if you don't have one, and a new repository
   (e.g. `gad-database`).
2. Upload these 3 files: `index.html`, `app.js`, `config.js`.
3. Go to the repo's **Settings → Pages**, set Source to the `main` branch /
   root folder, and save.
4. After a minute, your site will be live at
   `https://<your-username>.github.io/gad-database/`.

### Option B — Netlify
1. Create a free Netlify account.
2. Drag and drop this folder (containing the 3 files) onto the Netlify
   "Deploy" page.
3. Netlify gives you a live link immediately (e.g.
   `https://your-site-name.netlify.app`), which you can rename in settings.

Either option is free and requires no server or database to maintain — the
page just talks directly to your published Google Sheet.

## Notes

- The "Aggregate Male vs Female" chart only sums indicator rows where the
  Male/Female cell is a plain number (e.g. "1,234"). Percentages, ratios
  (e.g. "31:1"), and text entries ("No Data Available") are automatically
  excluded so the total isn't misleading.
- If a sector tab isn't published yet, that card in `config.js` can be left
  as `""` — the dashboard will simply skip it until you add the link.
- If you ever reorganize columns in the Google Sheet, keep the header names
  exactly as: `Subsector`, `Indicator`, `Male`, `Female`, `Total`,
  `Normal/Desirable State (Mandated Target, if applicable)`, `Data Source` —
  the script matches on `Indicator`, `Male`, `Female`, `Total`, and
  `Data Source`.
