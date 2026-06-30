// ============================================================
// GAD Database — public dashboard logic
// ============================================================

const SECTOR_LABELS = {
  social: "I. Social",
  economic: "II. Economic",
  infrastructure: "III. Infrastructure",
  environmental: "IV. Environmental",
  institutional: "V. Institutional",
};

const SECTOR_COLORS = {
  social: "#6E1E45",
  economic: "#A8512E",
  infrastructure: "#2E6171",
  environmental: "#4F6F52",
  institutional: "#8A6D1F",
};

const INK_SOFT = "#5B5043";
const GOLD = "#B8893B";

let sectorData = {};   // { social: [rows...], ... }
let activeSector = "all";
let charts = {};

document.getElementById("m-updated").textContent = new Date().toLocaleDateString(
  undefined, { year: "numeric", month: "short", day: "numeric" }
);

function cleanNumber(raw) {
  if (raw == null) return NaN;
  const v = String(raw).trim();
  if (v === "" ) return NaN;
  if (/[%:\/A-Za-z]/.test(v)) return NaN; // exclude % ratios and text like "No Data"
  const n = parseFloat(v.replace(/,/g, ""));
  return Number.isFinite(n) ? n : NaN;
}

function isRowFilled(row) {
  const male = (row["Male"] || "").trim();
  const female = (row["Female"] || "").trim();
  const total = (row["Total"] || "").trim();
  const src = (row["Data Source"] || "").trim();
  return !!(male || female || total || src);
}

function isIndicatorRow(row) {
  return !!(row["Indicator"] && row["Indicator"].trim());
}

async function loadSector(key, url) {
  if (!url) return [];
  return new Promise((resolve) => {
    Papa.parse(url, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => resolve(results.data || []),
      error: () => resolve([]),
    });
  });
}

async function loadAll() {
  const banner = document.getElementById("status-banner");
  const keys = Object.keys(SHEET_CSV_URLS);
  let anyUrl = keys.some(k => SHEET_CSV_URLS[k]);

  if (!anyUrl) {
    banner.innerHTML = "No data source connected yet. Paste your published Google Sheet CSV links into <code>config.js</code> to bring this dashboard live. See README.md for steps.";
    return;
  }

  document.getElementById("lgu-name") && (document.getElementById("lgu-name").textContent = LGU_NAME);
  document.querySelectorAll(".lgu-name").forEach(el => el.textContent = `${LGU_NAME} · Municipal Planning and Development Office`);

  for (const key of keys) {
    const rows = await loadSector(key, SHEET_CSV_URLS[key]);
    sectorData[key] = rows.filter(isIndicatorRow);
  }

  const loadedCount = keys.filter(k => sectorData[k] && sectorData[k].length).length;
  if (loadedCount === 0) {
    banner.textContent = "Couldn't load data from the configured links. Make sure each sheet tab is published to the web as CSV (see README.md) and that the links in config.js are correct.";
    return;
  }

  banner.classList.add("ok");
  banner.textContent = `Live data connected — ${loadedCount} of ${keys.length} sector tabs loaded successfully.`;

  renderAll();
}

function getRows(sector) {
  if (sector === "all") {
    return Object.values(sectorData).flat();
  }
  return sectorData[sector] || [];
}

function computeStats(rows) {
  const total = rows.length;
  const filled = rows.filter(isRowFilled).length;
  const pct = total ? Math.round((filled / total) * 100) : 0;
  const sources = new Set(
    rows.map(r => (r["Data Source"] || "").trim()).filter(Boolean)
  );
  let male = 0, female = 0;
  rows.forEach(r => {
    const m = cleanNumber(r["Male"]);
    const f = cleanNumber(r["Female"]);
    if (Number.isFinite(m)) male += m;
    if (Number.isFinite(f)) female += f;
  });
  return { total, filled, pct, sourceCount: sources.size, male, female };
}

function renderTopStats() {
  const rows = getRows("all");
  const stats = computeStats(rows);
  document.getElementById("m-total").textContent = stats.total.toLocaleString();
  document.getElementById("m-complete").textContent = stats.pct + "%";
}

function renderSectionStats() {
  const rows = getRows(activeSector);
  const stats = computeStats(rows);
  document.getElementById("s-indicators").textContent = stats.total.toLocaleString();
  document.getElementById("s-filled").textContent = stats.filled.toLocaleString();
  document.getElementById("s-pct").textContent = stats.pct + "%";
  document.getElementById("s-sources").textContent = stats.sourceCount.toLocaleString();
}

function sectorBarColors(highlightAll) {
  return Object.keys(SECTOR_LABELS).map(k =>
    highlightAll || k === activeSector ? SECTOR_COLORS[k] : "#D8CBB0"
  );
}

function renderCompletionChart() {
  const ctx = document.getElementById("chartCompletion");
  const labels = Object.keys(SECTOR_LABELS).map(k => SECTOR_LABELS[k]);
  const data = Object.keys(SECTOR_LABELS).map(k => computeStats(sectorData[k] || []).pct);
  if (charts.completion) charts.completion.destroy();
  charts.completion = new Chart(ctx, {
    type: "bar",
    data: { labels, datasets: [{ data, backgroundColor: sectorBarColors(activeSector === "all"), borderRadius: 3 }] },
    options: {
      indexAxis: "y",
      plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => c.parsed.x + "% complete" } } },
      scales: { x: { min: 0, max: 100, ticks: { callback: v => v + "%" }, grid: { color: "#EAE0CF" } }, y: { grid: { display: false } } },
    }
  });
}

function renderIndicatorsChart() {
  const ctx = document.getElementById("chartIndicators");
  const labels = Object.keys(SECTOR_LABELS).map(k => SECTOR_LABELS[k]);
  const data = Object.keys(SECTOR_LABELS).map(k => (sectorData[k] || []).length);
  if (charts.indicators) charts.indicators.destroy();
  charts.indicators = new Chart(ctx, {
    type: "bar",
    data: { labels, datasets: [{ data, backgroundColor: sectorBarColors(activeSector === "all"), borderRadius: 3 }] },
    options: {
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true, grid: { color: "#EAE0CF" } }, x: { grid: { display: false } } },
    }
  });
}

function renderGenderChart() {
  const ctx = document.getElementById("chartGender");
  const rows = getRows(activeSector);
  const stats = computeStats(rows);
  if (charts.gender) charts.gender.destroy();
  charts.gender = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Male", "Female"],
      datasets: [{ data: [stats.male, stats.female], backgroundColor: ["#2E6171", "#A8512E"], borderWidth: 0 }]
    },
    options: {
      plugins: { legend: { position: "bottom", labels: { font: { family: "IBM Plex Mono", size: 11 } } } },
      cutout: "62%",
    }
  });
}

function renderLegend() {
  const ul = document.getElementById("sector-legend");
  ul.innerHTML = "";
  Object.keys(SECTOR_LABELS).forEach(k => {
    const n = (sectorData[k] || []).length;
    const li = document.createElement("li");
    li.innerHTML = `<span class="sw" style="background:${SECTOR_COLORS[k]}"></span>${SECTOR_LABELS[k]} — ${n} indicators tracked`;
    ul.appendChild(li);
  });
}

function renderAll() {
  renderTopStats();
  renderSectionStats();
  renderCompletionChart();
  renderIndicatorsChart();
  renderGenderChart();
  renderLegend();
}

document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    activeSector = btn.dataset.sector;
    renderSectionStats();
    renderCompletionChart();
    renderIndicatorsChart();
    renderGenderChart();
  });
});

loadAll();
