// ══════════════════════════════════════════════════════════════════════════════
//  RDSN Map — Configuration file
//  ─────────────────────────────
//  This is the ONLY file you need to edit to adapt this map to your institution.
//  All other files (map.js, ui.js, i18n.js, style.css) can be left untouched.
//
//  HOW TO EDIT THIS FILE ON GITHUB:
//    1. Open this file in your GitHub repository
//    2. Click the pencil icon (✏) in the top-right corner
//    3. Make your changes
//    4. Click "Commit changes" at the bottom
//    5. Your GitHub Pages site will update automatically within ~1 minute
// ══════════════════════════════════════════════════════════════════════════════

window.RDSN_CONFIG = {

  // ── Institution ─────────────────────────────────────────────────────────────
  institution: {

    // Short name of your institution, used in page titles and aria labels.
    name: "EPFL",

    // Full name, used in the browser tab title.
    fullName: "EPFL — École Polytechnique Fédérale de Lausanne",

    // Path to your logo image file.
    // → Place your logo file in the same folder as index.html and update this path.
    // → Recommended: PNG or SVG, height around 60–80px, transparent background.
    // → Set to null to hide the logo entirely.
    logo: "EPFL-caution-RDSN_red-black.png",

    // Alt text for the logo image (for screen readers).
    logoAlt: "EPFL Research Data Support Network",

    // Main contact email address.
    // Used in the footer, in the empty-state message, and in the "Suggest a service" button.
    contactEmail: "researchdata@epfl.ch",

    // URL of your institution's interactive campus map (used for office links in service cards).
    // The office room code from services.csv will be appended to this URL.
    // Example for EPFL: "https://plan.epfl.ch/?room=="
    // → Set to null to hide campus map links entirely.
    campusPlanUrl: "https://plan.epfl.ch/?room==",

  },

  // ── Map ─────────────────────────────────────────────────────────────────────
  map: {

    // Geographic center of the map on initial load.
    // → Find your coordinates at: https://www.openstreetmap.org
    //   Right-click on your campus → "Show address" (coordinates shown at the bottom).
    // → Format: [latitude, longitude]
    center: [46.5194, 6.5665],

    // Zoom level on initial load (1 = world, 18 = building level).
    // 15–17 is usually a good range for a university campus.
    zoom: 16,

  },

  // ── Branding ─────────────────────────────────────────────────────────────────
  branding: {

    // Favicon: a small icon shown in the browser tab.
    // It is generated automatically from the two values below.
    // → faviconColor: background color of the favicon (any CSS hex color).
    // → faviconText:  1–2 letters shown on the favicon.
    faviconColor: "#FF0000",
    faviconText:  "RDSN",

    // Loading screen text (the large word shown while the map loads).
    // Usually your institution's short name.
    loadingText: "EPFL",

  },

  // ── Colors ───────────────────────────────────────────────────────────────────
  // All colors used in the interface. Change these to match your institution's
  // visual identity. Use standard CSS hex color codes (e.g. "#FF0000").
  //
  // TIP: You only need to change the top block (brand palette).
  //      The phase colors below reference those brand colors automatically.
  colors: {

    // ── Brand palette ────────────────────────────────────────────────────────
    // Primary accent color (used for active states, highlights, "publish" phase).
    // → Use your institution's main brand color here.
    accent:     "#FF0000",
    accentDark: "#B51F1F",  // darker variant, used for hover states

    // Secondary color family (used for "collection", "processing", "archive" phases).
    // → Use your institution's secondary brand color here (e.g. a darker shade of your primary).
    secondary:       "#00A79F",
    secondaryMid:    "#007480",
    secondaryDark:   "#004248",

    // Text and neutral colors — usually fine to leave as-is unless your brand
    // requires a specific dark color for text.
    text:       "#413D3A",  // main body text
    white:      "#FFFFFF",
    muted:      "#CAC7C7",  // subtle borders and disabled states
    gray100:    "#EDEDED",  // very light backgrounds
    gray200:    "#D5D5D5",  // borders
    gray500:    "#8E8E8E",  // secondary text
    gray600:    "#707070",  // muted text

    // Three additional accent colors used for the remaining lifecycle phases.
    // → Replace with colors from your institution's extended palette if available,
    //   or leave as-is for a neutral look.
    phase1Color: "#EC6608",  // "Use & Store" phase
    phase2Color: "#5C2483",  // "Planning & Design" phase
    phase3Color: "#4F8FCC",  // "Discover & Reuse" phase

  },

  // ── Interface ────────────────────────────────────────────────────────────────
  ui: {

    // Default language shown on first visit.
    // Must be one of the values listed in availableLangs below.
    defaultLang: "fr",

    // Languages shown in the language selector.
    // Remove any language you don't need. At minimum, keep one.
    // Available: "fr" (French), "en" (English), "de" (German), "it" (Italian)
    availableLangs: ["fr", "en", "de", "it"],

  },

  // ── Footer ───────────────────────────────────────────────────────────────────
  // Text shown at the bottom of the sidebar.
  // You can use basic HTML like <strong>text</strong> for bold.
  // Write one entry per language — use the same language codes as ui.availableLangs.
  footer: {
    fr: "Une initiative de la <strong>Research Data Management Team</strong> financée par Swiss Universities et EPFL Library",
    en: "An initiative of the <strong>Research Data Management Team</strong> funded by Swiss Universities and EPFL Library",
    de: "Eine Initiative des <strong>Research Data Management Teams</strong>, finanziert von Swiss Universities und der EPFL-Bibliothek",
    it: "Un'iniziativa del <strong>Research Data Management Team</strong> finanziata da Swiss Universities e dalla Biblioteca EPFL",
  },

};
