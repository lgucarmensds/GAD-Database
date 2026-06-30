// ============================================================
// CONFIG — paste your Google Sheet's published CSV links here
// ============================================================
// How to get these links: see README.md, section "1. Publish your
// Google Sheet". You need ONE link per sector tab (5 total).
// Leave a value as "" (empty string) if that tab isn't ready yet —
// the dashboard will just skip it.

const SHEET_CSV_URLS = {
  social:         "https://docs.google.com/spreadsheets/d/e/2PACX-1vSd_5KxH_g06mR7QkTKEMPwwICAAj2Sn6mNjXX7iT1jmNi0lKJyHgBVKZC8v5oKQtU7LxJ1zNQMHZKj/pub?gid=1854872426&single=true&output=csv",  // paste link for the "I. Social Development" tab
  economic:       "https://docs.google.com/spreadsheets/d/e/2PACX-1vSd_5KxH_g06mR7QkTKEMPwwICAAj2Sn6mNjXX7iT1jmNi0lKJyHgBVKZC8v5oKQtU7LxJ1zNQMHZKj/pub?gid=1108497444&single=true&output=csv",  // paste link for the "II. Economic Development" tab
  infrastructure: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSd_5KxH_g06mR7QkTKEMPwwICAAj2Sn6mNjXX7iT1jmNi0lKJyHgBVKZC8v5oKQtU7LxJ1zNQMHZKj/pub?gid=292113420&single=true&output=csv",  // paste link for the "III. Infrastructure" tab
  environmental:  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSd_5KxH_g06mR7QkTKEMPwwICAAj2Sn6mNjXX7iT1jmNi0lKJyHgBVKZC8v5oKQtU7LxJ1zNQMHZKj/pub?gid=1646003046&single=true&output=csv",  // paste link for the "IV. Environmental" tab
  institutional:  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSd_5KxH_g06mR7QkTKEMPwwICAAj2Sn6mNjXX7iT1jmNi0lKJyHgBVKZC8v5oKQtU7LxJ1zNQMHZKj/pub?gid=798893776&single=true&output=csv",  // paste link for the "V. Institutional" tab
};

// Optional: change the LGU name shown in the page header
const LGU_NAME = "LGU CARMEN, SURIGAO DEL SUR";
