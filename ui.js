// ── ui.js — Sidebar, filters, search, popups, kanban, unit view, URL state ─
// Depends on: window.SERVICES  (populated by bootstrap in index.html)
//             window.MapModule  (defined in map.js)
//             window.i18n       (defined in i18n.js)

// ── Constants ──────────────────────────────────────────────────────────────
const PHASE_COLORS = {
  "Planning & Design":     "var(--phase-planning)",
  "Data Collection":       "var(--phase-collection)",
  "Processing & Analysis": "var(--phase-processing)",
  "Use & Store":           "var(--phase-store)",
  "Publication & Sharing": "var(--phase-publish)",
  "Archiving":             "var(--phase-archive)",
  "Discover & Reuse":      "var(--phase-reuse)",
  "All":                   "var(--phase-all)",
};

const PHASE_ORDER = [
  "Planning & Design",
  "Data Collection",
  "Processing & Analysis",
  "Use & Store",
  "Publication & Sharing",
  "Archiving",
  "Discover & Reuse",
];

// Maps CSV phase values to i18n keys for display
const PHASE_I18N_KEY = {
  "Planning & Design":     "cycle.plan",
  "Data Collection":       "cycle.col",
  "Processing & Analysis": "cycle.process",
  "Use & Store":           "cycle.store",
  "Publication & Sharing": "cycle.pub",
  "Archiving":             "cycle.arch",
  "Discover & Reuse":      "cycle.disc",
};

// ── Helpers ────────────────────────────────────────────────────────────────

function phaseColor(phase) {
  if (!phase) return PHASE_COLORS["All"];
  for (const [key, color] of Object.entries(PHASE_COLORS)) {
    if (phase.includes(key)) return color;
  }
  return PHASE_COLORS["All"];
}

function primaryPhase(phase) {
  if (!phase) return "All";
  for (const key of Object.keys(PHASE_COLORS)) {
    if (phase.includes(key)) return key;
  }
  return phase;
}

function planUrl(office) {
  if (!office) return null;
  return `https://plan.epfl.ch/?room==${encodeURIComponent(office)}`;
}

function phaseTagHTML(label, color) {
  const key = PHASE_I18N_KEY[label];
  const displayLabel = key ? i18n.t(key) : label;
  return `<span class="phase-tag" style="background:${color}20;color:${color}">${esc(displayLabel)}</span>`;
}

function scrollToActive() {
  requestAnimationFrame(() => {
    const el = document.querySelector(".list-item.active");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
}

function debounce(fn, ms) {
  let timer;
  return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), ms); };
}

// Escape HTML — prevents XSS from CSV content injected into innerHTML
function esc(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Returns the localised description for a service row.
// Falls back to French description if EN is empty.
function serviceDesc(s) {
  if (i18n.lang === "en" && s.Description_EN && s.Description_EN.trim()) {
    return s.Description_EN.trim();
  }
  return s.Description || "";
}

// ── State ──────────────────────────────────────────────────────────────────
let activeFilter   = "all";
let searchQuery    = "";
let activeIdx      = null;
let clusterIndices = null;
let activeView     = "map"; // "map" | "kanban" | "units"
let activeDetail   = null;
let mapFullscreen  = false;

// ── URL state ──────────────────────────────────────────────────────────────

function pushURLState(idx) {
  const params = new URLSearchParams(window.location.search);
  if (idx !== null) {
    const s = window.SERVICES[idx];
    if (s) params.set("service", s.Service);
  } else {
    params.delete("service");
  }
  if (activeFilter !== "all") {
    params.set("phase", activeFilter);
  } else {
    params.delete("phase");
  }
  if (activeView !== "map") {
    params.set("view", activeView);
  } else {
    params.delete("view");
  }
  // Lang is managed by i18n.js — don't touch it here, just preserve it
  const newURL = `${window.location.pathname}${params.toString() ? "?" + params : ""}`;
  window.history.replaceState({}, "", newURL);
}

// Build a shareable URL for current filter/view/lang state
function buildShareURL() {
  const params = new URLSearchParams();
  if (activeFilter !== "all") params.set("phase", activeFilter);
  if (activeView !== "map")   params.set("view", activeView);
  if (searchQuery)            params.set("q", searchQuery);
  if (i18n.lang !== "fr")    params.set("lang", i18n.lang);
  return `${window.location.origin}${window.location.pathname}${params.toString() ? "?" + params : ""}`;
}

function restoreURLState() {
  const params = new URLSearchParams(window.location.search);

  // Restore language first so everything renders in the right lang
  const lang = params.get("lang");
  if (lang === "en" || lang === "fr") {
    i18n.setLang(lang);
    document.querySelectorAll("[data-lang]").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.lang === lang);
    });
    document.querySelectorAll(".panel-lang-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.lang === lang);
    });
    applyI18n();
  }

  const view = params.get("view");
  if (view === "kanban" || view === "units") {
    switchView(view);
  }

  const phase = params.get("phase");
  if (phase) {
    activeFilter = phase;
    document.querySelectorAll(".filter-chip").forEach(b => b.classList.remove("active"));
    const chip = document.querySelector(`.filter-chip[data-phase="${phase}"]`);
    if (chip) chip.classList.add("active");
    resetAndRefresh();
  }

  const q = params.get("q");
  if (q) {
    searchQuery = q;
    document.querySelectorAll(".search-input-field").forEach(el => el.value = q);
    resetAndRefresh();
  }

  const name = params.get("service");
  if (name) {
    const idx = (window.SERVICES || []).findIndex(
      s => s.Service.toLowerCase() === name.toLowerCase()
    );
    if (idx !== -1) setTimeout(() => selectFromList(idx), 400);
  }
}

// ── Visibility predicate ───────────────────────────────────────────────────
function isVisible(s, idx) {
  if (!s) return false;
  if (clusterIndices !== null && !clusterIndices.includes(idx)) return false;
  const matchPhase  = activeFilter === "all" || s.Phase === "All" || s.Phase.includes(activeFilter);
  const q           = searchQuery.toLowerCase();
  const desc        = serviceDesc(s);
  const matchSearch = !q
    || s.Service.toLowerCase().includes(q)
    || s.Unit.toLowerCase().includes(q)
    || (s.Office      || "").toLowerCase().includes(q)
    || (s.Contact     || "").toLowerCase().includes(q)
    || (desc          || "").toLowerCase().includes(q);
  return matchPhase && matchSearch;
}

// ── Phase counts for chip badges ───────────────────────────────────────────
function computePhaseCounts() {
  const services = window.SERVICES || [];
  const counts   = { all: services.length };
  for (const phase of PHASE_ORDER) {
    counts[phase] = services.filter(s =>
      s.Phase === "All" || s.Phase.includes(phase)
    ).length;
  }
  return counts;
}

function updateChipCounts() {
  const counts = computePhaseCounts();
  document.querySelectorAll(".filter-chip").forEach(btn => {
    const phase = btn.dataset.phase;
    const count = counts[phase] ?? 0;
    const badge = btn.querySelector(".chip-count");
    if (badge) badge.textContent = count;
  });
}

// ── Reset cluster + refresh ────────────────────────────────────────────────
function resetAndRefresh() {
  clusterIndices = null;
  document.getElementById("cluster-bar").classList.remove("visible");
  renderList();
  if (activeView === "map")    window.MapModule.applyVisibility(isVisible);
  if (activeView === "kanban") renderKanban();
  if (activeView === "units")  renderUnits();
  pushURLState(activeDetail);
}

// ── View switching ─────────────────────────────────────────────────────────
function switchView(view) {
  activeView = view;
  document.getElementById("view-map-btn").classList.toggle("active", view === "map");
  document.getElementById("view-kanban-btn").classList.toggle("active", view === "kanban");
  document.getElementById("view-units-btn").classList.toggle("active", view === "units");

  document.getElementById("map-container").classList.toggle("hidden", view !== "map");
  document.getElementById("kanban-container").classList.toggle("hidden", view !== "kanban");
  document.getElementById("units-container").classList.toggle("hidden", view !== "units");

  document.getElementById("panel").classList.toggle("hidden", view !== "map");
  document.getElementById("filterbar").classList.toggle("hidden", view !== "map");

  if (view === "kanban") renderKanban();
  else if (view === "units") renderUnits();
  else window.MapModule.applyVisibility(isVisible);

  pushURLState(activeDetail);
}

// ── Fullscreen map toggle ──────────────────────────────────────────────────
function toggleFullscreen() {
  mapFullscreen = !mapFullscreen;
  document.getElementById("panel").classList.toggle("hidden", mapFullscreen);
  document.getElementById("filterbar").classList.toggle("hidden", mapFullscreen);
  const btn = document.getElementById("fullscreen-btn");
  btn.title = mapFullscreen ? i18n.t("map.fullscreen.exit") : i18n.t("map.fullscreen.enter");
  btn.innerHTML = mapFullscreen
    ? `<svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M5 1H1v4M9 1h4v4M5 13H1V9M9 13h4V9"/></svg>`
    : `<svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M1 5V1h4M9 1h4v4M1 9v4h4M13 9v4H9"/></svg>`;
  setTimeout(() => window.MapModule.invalidateSize(), 50);
}

// ── Mobile drawer ──────────────────────────────────────────────────────────
function openDrawer() {
  document.getElementById("panel").classList.add("drawer-open");
  document.getElementById("drawer-backdrop").classList.add("visible");
}

function closeDrawer() {
  document.getElementById("panel").classList.remove("drawer-open");
  document.getElementById("drawer-backdrop").classList.remove("visible");
}

// ── Detail panel ───────────────────────────────────────────────────────────
function openDetail(idx, mode = "open") {
  const panel = document.getElementById("detail-panel");

  if (activeDetail === idx) {
    activeDetail = null;
    panel.classList.remove("open", "open-kanban");
    pushURLState(null);
    return;
  }

  activeDetail = idx;
  activeIdx    = idx;
  pushURLState(idx);
  renderList();
  renderDetailPanel(idx);
  panel.classList.remove("open", "open-kanban");
  panel.classList.add(mode);
}

function closeDetail() {
  if (activeDetail === null) return;
  activeDetail = null;
  document.getElementById("detail-panel").classList.remove("open", "open-kanban");
  pushURLState(null);
}

function renderDetailPanel(idx) {
  const s = window.SERVICES[idx];
  if (!s) return;

  const t           = k => i18n.t(k);
  const phases      = s.Phase.split(",").map(p => p.trim()).filter(Boolean);
  const safeURL     = s.URL ? s.URL.replace(/'/g, "%27") : null;
  const shareURL    = `${window.location.origin}${window.location.pathname}?service=${encodeURIComponent(s.Service)}${i18n.lang !== "fr" ? "&lang=" + i18n.lang : ""}`;
  const safeShareURL = shareURL.replace(/'/g, "%27");
  const desc        = serviceDesc(s);

  document.getElementById("detail-content").innerHTML = `
    <div class="detail-header">
      <div class="detail-phases">
        ${phases.map(p => phaseTagHTML(p, phaseColor(p))).join("")}
      </div>
      <h2 class="detail-name">${esc(s.Service)}</h2>
      <div class="detail-unit">${esc(s.Unit)}</div>
      ${s.Audience ? `<div class="detail-audience">◉ ${esc(s.Audience)}</div>` : ""}
    </div>
    <div class="detail-body">
      ${s.Office ? `
        <div class="detail-field">
          <div class="detail-field-label">${t("detail.field.office")}</div>
          <div class="detail-field-value">
            <a href="${planUrl(s.Office)}" target="_blank">⌖ ${esc(s.Office)} — ${t("detail.plan")}</a>
          </div>
        </div>` : ""}
      ${s.Contact ? `
        <div class="detail-field">
          <div class="detail-field-label">${t("detail.field.contact")}</div>
          <div class="detail-field-value">
            <a href="mailto:${esc(s.Contact)}">${esc(s.Contact)}</a>
          </div>
        </div>` : ""}
      ${desc ? `
        <div class="detail-field">
          <div class="detail-field-label">${t("detail.field.description")}</div>
          <div class="detail-field-value">${esc(desc)}</div>
        </div>` : ""}
    </div>
    <div class="detail-actions">
      ${safeURL ? `
        <a href="${safeURL}" target="_blank" class="detail-btn-primary">
          ${t("detail.access")}
        </a>` : ""}
      <button class="detail-btn-secondary"
        onclick="navigator.clipboard?.writeText('${safeShareURL}').then(()=>{this.textContent='${t("detail.link.copied")}';this.dataset.copied='1'});setTimeout(()=>{this.textContent='${t("detail.copy.link")}';delete this.dataset.copied},1500)">
        ${t("detail.copy.link")}
      </button>
    </div>
  `;
}

function getFilterLabel() {
  if (activeFilter === "all") return i18n.t("panel.all");
  const key = PHASE_I18N_KEY[activeFilter];
  return key ? i18n.t(key) : activeFilter;
}

// ── List rendering ─────────────────────────────────────────────────────────
function renderList() {
  const t        = k => i18n.t(k);
  const services = window.SERVICES || [];
  const list     = document.getElementById("panel-list");
  const countEl  = document.getElementById("panel-count-num");
  const labelEl  = document.getElementById("panel-count-text");
  const visible  = services.filter((s, i) => isVisible(s, i));

  document.getElementById("header-count").textContent = `${services.length} ${i18n.t("kanban.stat.services")}`;
  countEl.textContent = visible.length;

  if (clusterIndices !== null) {
    const offices = clusterIndices.map(i => services[i]?.Office).filter(Boolean);
    const freq    = {};
    offices.forEach(o => { freq[o] = (freq[o] || 0) + 1; });
    const top = Object.entries(freq).sort((a, b) => b[1] - a[1])[0];
    const loc = top ? top[0].split(" ").slice(0, 2).join(" ") : i18n.t("cluster.same.location");
    document.getElementById("cluster-bar-label").textContent =
      `${clusterIndices.length} services · ${loc}`;
    document.getElementById("cluster-bar").classList.add("visible");
    labelEl.textContent = i18n.t("panel.building");
  } else if (activeFilter !== "all") {
    labelEl.textContent = getFilterLabel();
  } else if (searchQuery) {
    labelEl.textContent = `"${searchQuery}"`;
  } else {
    labelEl.textContent = i18n.t("panel.all");
  }

  if (visible.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">⌕</div>
        <div class="empty-title">${t("empty.title")}</div>
        <div class="empty-sub">${t("empty.sub")}</div>
        <a href="mailto:researchdata@epfl.ch" class="empty-link">researchdata@epfl.ch</a>
      </div>`;
    return;
  }

  list.innerHTML = visible.map(s => {
    const idx         = services.indexOf(s);
    const color       = phaseColor(s.Phase);
    const tag         = primaryPhase(s.Phase);
    const contactHTML = s.Contact
      ? `<span class="item-contact">· <a href="mailto:${esc(s.Contact)}"
             onclick="event.stopPropagation()">${esc(s.Contact)}</a></span>`
      : "";

    return `<div
      class="list-item ${activeIdx === idx ? "active" : ""}"
      role="listitem"
      tabindex="0"
      aria-label="${esc(s.Service)}, ${esc(s.Unit)}"
      onclick="UIModule.selectFromList(${idx})"
      onkeydown="if(event.key==='Enter')UIModule.selectFromList(${idx})"
    >
      <div class="item-name">${esc(s.Service)}</div>
      <div class="item-meta">
        <span class="item-unit">${esc(s.Unit)}</span>
        ${contactHTML}
      </div>
      ${phaseTagHTML(tag, color)}
    </div>`;
  }).join("");
}

// ── Kanban rendering ───────────────────────────────────────────────────────
function renderKanban() {
  const t         = k => i18n.t(k);
  const services  = window.SERVICES || [];
  const container = document.getElementById("kanban-board");
  const q         = searchQuery.toLowerCase();

  const filtered = services.filter(s => {
    if (!q) return true;
    const desc = serviceDesc(s);
    return s.Service.toLowerCase().includes(q)
      || s.Unit.toLowerCase().includes(q)
      || (s.Office      || "").toLowerCase().includes(q)
      || (s.Contact     || "").toLowerCase().includes(q)
      || (desc          || "").toLowerCase().includes(q);
  });

  const unitCount = new Set(services.map(s => s.Unit).filter(Boolean)).size;
  const statsEl   = document.getElementById("kanban-stats");
  if (statsEl) {
    statsEl.innerHTML = `
      <span class="kstat"><strong>${services.length}</strong> ${t("kanban.stat.services")}</span>
      <span class="kstat-sep">·</span>
      <span class="kstat"><strong>${PHASE_ORDER.length}</strong> ${t("kanban.stat.phases")}</span>
      <span class="kstat-sep">·</span>
      <span class="kstat"><strong>${unitCount}</strong> ${t("kanban.stat.units")}</span>
    `;
  }

  container.innerHTML = PHASE_ORDER.map(phase => {
    const cols  = filtered.filter(s => s.Phase === "All" || s.Phase.includes(phase));
    const color = phaseColor(phase);

    const cards = cols.map(s => {
      const idx = services.indexOf(s);
      return `<div class="kanban-card"
                  onclick="UIModule.openDetail(${idx}, 'open-kanban')"
                  onmouseenter="UIModule.highlightPhase('${phase}')"
                  onmouseleave="UIModule.highlightPhase(null)"
                  tabindex="0"
                  onkeydown="if(event.key==='Enter')UIModule.openDetail(${idx}, 'open-kanban')">
        <div class="kanban-card-name">${esc(s.Service)}</div>
        ${s.Contact ? `<div class="kanban-card-contact">${esc(s.Contact)}</div>` : ""}
        <div class="kanban-card-meta">
          <span class="kanban-card-unit">${esc(s.Unit)}</span>
          ${s.Audience ? `<span class="kanban-card-audience">· ${esc(s.Audience)}</span>` : ""}
        </div>
        ${s.Office  ? `<div class="kanban-card-office">◎ ${esc(s.Office)}</div>` : ""}
        ${s.Phase === "All" ? `<span class="kanban-card-all-badge">${t("kanban.all.badge")}</span>` : ""}
      </div>`;
    }).join("");

    return `<div class="kanban-col" data-phase="${esc(phase)}">
      <div class="kanban-col-header" style="border-top-color:${color}">
        <span class="kanban-col-title">${esc(t(PHASE_I18N_KEY[phase] || phase))}</span>
        <span class="kanban-col-count" style="background:${color}20;color:${color}">${cols.length}</span>
      </div>
      <div class="kanban-col-body">
        ${cards || `<div class="kanban-empty">${t("kanban.empty")}</div>`}
      </div>
    </div>`;
  }).join("");
}

// ── Unit view rendering ────────────────────────────────────────────────────
function renderUnits() {
  const t         = k => i18n.t(k);
  const services  = window.SERVICES || [];
  const container = document.getElementById("units-board");
  const q         = searchQuery.toLowerCase();

  const filtered = services.filter(s => {
    if (!q) return true;
    const desc = serviceDesc(s);
    return s.Service.toLowerCase().includes(q)
      || s.Unit.toLowerCase().includes(q)
      || (s.Office      || "").toLowerCase().includes(q)
      || (s.Contact     || "").toLowerCase().includes(q)
      || (desc          || "").toLowerCase().includes(q);
  });

  const byUnit = {};
  filtered.forEach(s => {
    const unit = s.Unit || t("units.no.unit");
    if (!byUnit[unit]) byUnit[unit] = [];
    byUnit[unit].push(s);
  });

  const sortedUnits = Object.keys(byUnit).sort((a, b) => a.localeCompare(b, i18n.lang));

  const statsEl = document.getElementById("units-stats");
  if (statsEl) {
    statsEl.innerHTML = `
      <span class="kstat"><strong>${sortedUnits.length}</strong> ${t("units.stat.units")}</span>
      <span class="kstat-sep">·</span>
      <span class="kstat"><strong>${filtered.length}</strong> ${t("units.stat.services")}</span>
    `;
  }

  if (sortedUnits.length === 0) {
    container.innerHTML = `<div class="units-empty">${t("units.empty")} "${esc(searchQuery)}"</div>`;
    return;
  }

  container.innerHTML = sortedUnits.map(unit => {
    const unitServices = byUnit[unit];
    const cards = unitServices.map(s => {
      const idx   = services.indexOf(s);
      const color = phaseColor(s.Phase);
      const tag   = primaryPhase(s.Phase);
      return `<div class="unit-card"
                  onclick="UIModule.openDetail(${idx}, 'open-kanban')"
                  tabindex="0"
                  onkeydown="if(event.key==='Enter')UIModule.openDetail(${idx}, 'open-kanban')">
        <div class="unit-card-name">${esc(s.Service)}</div>
        ${s.Contact ? `<div class="unit-card-contact">${esc(s.Contact)}</div>` : ""}
        ${phaseTagHTML(tag, color)}
      </div>`;
    }).join("");

    return `<div class="unit-group">
      <div class="unit-group-header">
        <span class="unit-group-name">${esc(unit)}</span>
        <span class="unit-group-count">${unitServices.length}</span>
      </div>
      <div class="unit-group-cards">${cards}</div>
    </div>`;
  }).join("");
}

// ── Kanban phase highlight (cross-view visual link) ────────────────────────
function highlightPhase(phase) {
  document.querySelectorAll(".kanban-col").forEach(col => {
    if (phase === null) {
      col.classList.remove("dimmed");
    } else {
      col.classList.toggle("dimmed", col.dataset.phase !== phase);
    }
  });
}

// ── Select from list ───────────────────────────────────────────────────────
function selectFromList(idx) {
  activeIdx = idx;
  renderList();
  scrollToActive();
  openDetail(idx);
  const s = window.SERVICES[idx];
  if (s?.Latitude && s?.Longitude && activeView === "map") {
    window.MapModule.flyToAndShow(idx);
  }
  closeDrawer();
}

// ── Called by map on marker hover/click ────────────────────────────────────
function setActiveMarker(idx) {
  activeIdx = idx;
  renderList();
  scrollToActive();
  pushURLState(idx);
}

// ── Cluster drill-down ─────────────────────────────────────────────────────
function enterClusterView(indices) {
  clusterIndices = indices;
  activeIdx      = null;
  renderList();
  if (window.innerWidth <= 720) openDrawer();
}

function exitClusterView() {
  clusterIndices = null;
  activeIdx      = null;
  closeDetail();
  renderList();
  document.getElementById("cluster-bar").classList.remove("visible");
  window.MapModule.resetView();
}

function clearClusterFilter() {
  if (clusterIndices === null) return;
  clusterIndices = null;
  document.getElementById("cluster-bar").classList.remove("visible");
  renderList();
  window.MapModule.applyVisibility(isVisible);
}

function isInCluster(idx) {
  return clusterIndices !== null && clusterIndices.includes(idx);
}

// ── Popup HTML (map hover/click — compact) ─────────────────────────────────
function buildPopupHTML(idx) {
  const t = k => i18n.t(k);
  const s = window.SERVICES[idx];
  if (!s) return `<div class='popup-inner'>${t("detail.not.found")}</div>`;

  const phases  = s.Phase.split(",").map(p => p.trim()).filter(Boolean);
  const safeURL = s.URL ? s.URL.replace(/'/g, "%27") : null;

  return `<div class="popup-inner">
    <div class="popup-unit">${esc(s.Unit)}</div>
    <div class="popup-name">${esc(s.Service)}</div>
    ${s.Audience ? `<div class="popup-audience">◉ ${esc(s.Audience)}</div>` : ""}
    ${s.Office
      ? `<div class="popup-office">
           <a href="${planUrl(s.Office)}" target="_blank" title="${t("popup.plan")}">
              ⌖ ${esc(s.Office)} — ${t("popup.plan.link")}
           </a>
         </div>`
      : ""}
    <div class="popup-phases">
      ${phases.map(p => phaseTagHTML(p, phaseColor(p))).join("")}
    </div>
    ${s.Contact
      ? `<div class="popup-contact"><a href="mailto:${esc(s.Contact)}">${esc(s.Contact)}</a></div>`
      : ""}
    <div class="popup-actions">
      ${safeURL
        ? `<button class="popup-btn" onclick="window.open('${safeURL}','_blank')">
             ${t("popup.access")}
           </button>`
        : ""}
      <button class="popup-btn-secondary" onclick="UIModule.openDetail(${idx})">
        ${t("popup.detail")}
      </button>
    </div>
  </div>`;
}

// ── Reset to initial state ─────────────────────────────────────────────────
function resetAll() {
  activeFilter   = "all";
  searchQuery    = "";
  activeIdx      = null;
  activeDetail   = null;
  clusterIndices = null;

  document.querySelectorAll(".search-input-field").forEach(el => el.value = "");

  document.querySelectorAll(".filter-chip").forEach(b => b.classList.remove("active"));
  const allChip = document.querySelector(".filter-chip[data-phase='all']");
  if (allChip) allChip.classList.add("active");

  document.getElementById("detail-panel").classList.remove("open", "open-kanban");

  if (activeView !== "map") switchView("map");
  if (mapFullscreen) toggleFullscreen();

  pushURLState(null);
  renderList();
  window.MapModule.resetView();
}

// ── Language toggle ────────────────────────────────────────────────────────
function setupLangToggle() {
  function syncLangButtons(lang) {
    document.querySelectorAll("[data-lang]").forEach(b => {
      b.classList.toggle("active", b.dataset.lang === lang);
    });
    document.querySelectorAll(".panel-lang-btn").forEach(b => {
      b.classList.toggle("active", b.dataset.lang === lang);
    });
  }

  document.querySelectorAll("[data-lang]").forEach(btn => {
    btn.addEventListener("click", () => {
      const lang = btn.dataset.lang;
      i18n.setLang(lang);
      syncLangButtons(lang);
    });
  });

  document.querySelectorAll(".panel-lang-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const lang = btn.dataset.lang;
      i18n.setLang(lang);
      syncLangButtons(lang);
    });
  });
}

function applyI18n() {
  // Keys whose translation contains HTML (e.g. <strong>) — use innerHTML
  const HTML_KEYS = new Set(["footer.initiative", "error.csv"]);

  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.dataset.i18n;
    const val = i18n.t(key);
    // Only update leaf nodes (no element children) OR known HTML keys
    // This prevents overwriting chip-dot / chip-count siblings
    if (HTML_KEYS.has(key)) {
      el.innerHTML = val;
    } else if (el.children.length === 0) {
      el.textContent = val;
    }
    // Elements with children but no HTML key are translated
    // via their own child [data-i18n] spans — skip them here
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    el.placeholder = i18n.t(el.dataset.i18nPlaceholder);
  });
  document.querySelectorAll("[data-i18n-aria]").forEach(el => {
    el.setAttribute("aria-label", i18n.t(el.dataset.i18nAria));
  });

  // Update suggest mailto href with correct language content
  const suggestBtn = document.querySelector(".header-suggest-btn");
  if (suggestBtn) {
    const subj = i18n.t("header.suggest.mailto.subject");
    const body = i18n.t("header.suggest.mailto.body");
    suggestBtn.href = `mailto:researchdata@epfl.ch?subject=${subj}&body=${body}`;
  }
}

// ── Init ───────────────────────────────────────────────────────────────────
function init() {
  // Apply translations to static DOM before anything else
  applyI18n();
  i18n.onChange(() => {
    applyI18n();
    renderList();
    if (activeView === "kanban") renderKanban();
    if (activeView === "units") renderUnits();
    // Re-render detail panel if open
    if (activeDetail !== null) renderDetailPanel(activeDetail);
    // Re-render open map popup if any
    if (activeIdx !== null && window.MapModule) {
      window.MapModule.refreshOpenPopup(activeIdx);
    }
  });
  setupLangToggle();
  renderList();
  restoreURLState();

  // Filter chips
  document.querySelectorAll(".filter-chip").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-chip").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activeFilter = btn.dataset.phase;
      resetAndRefresh();
    });
  });

  // Kanban click-outside closes detail
  document.querySelector(".kanban-board").addEventListener("click", e => {
    if (!e.target.closest(".kanban-card")) closeDetail();
  });

  // Units click-outside closes detail
  document.querySelector(".units-board").addEventListener("click", e => {
    if (!e.target.closest(".unit-card")) closeDetail();
  });

  // Search — sync both inputs (header + panel), debounced
  const onSearch = debounce(val => {
    searchQuery = val;
    document.querySelectorAll(".search-input-field").forEach(el => {
      if (el.value !== val) el.value = val;
    });
    resetAndRefresh();
  }, 150);

  document.querySelectorAll(".search-input-field").forEach(el => {
    el.addEventListener("input", e => onSearch(e.target.value.trim()));
  });

  // View switcher
  document.getElementById("view-map-btn").addEventListener("click",    () => { switchView("map");    closeDetail(); });
  document.getElementById("view-kanban-btn").addEventListener("click", () => { switchView("kanban"); closeDetail(); });
  document.getElementById("view-units-btn").addEventListener("click",  () => { switchView("units");  closeDetail(); });

  // Fullscreen
  document.getElementById("fullscreen-btn").addEventListener("click", toggleFullscreen);

  // Share view button
  document.getElementById("share-view-btn").addEventListener("click", function() {
    const url = buildShareURL();
    navigator.clipboard?.writeText(url).then(() => {
      this.dataset.copied = "1";
      this.textContent = i18n.t("header.share.copied");
      setTimeout(() => {
        this.textContent = i18n.t("header.share");
        delete this.dataset.copied;
      }, 2000);
    });
  });

  // Detail close
  document.getElementById("detail-close").addEventListener("click", closeDetail);

  // Mobile drawer
  const toggleBtn = document.getElementById("drawer-toggle");
  if (toggleBtn) toggleBtn.addEventListener("click", openDrawer);
  const backdrop = document.getElementById("drawer-backdrop");
  if (backdrop) backdrop.addEventListener("click", closeDrawer);

  updateChipCounts();
  renderList();
  restoreURLState();
}

// ── Public API ─────────────────────────────────────────────────────────────
window.UIModule = {
  init,
  resetAll,
  renderList,
  renderKanban,
  renderUnits,
  selectFromList,
  setActiveMarker,
  enterClusterView,
  exitClusterView,
  clearClusterFilter,
  isInCluster,
  openDetail,
  closeDetail,
  buildPopupHTML,
  highlightPhase,
  phaseColor,
  isVisible,
  openDrawer,
  closeDrawer,
  switchView,
  toggleFullscreen,
};
