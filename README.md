# Research Data Services Network Map

An interactive campus map for visualising research data management services at your institution — filterable by lifecycle phase, searchable, multilingual, and deployable in minutes with no coding required.

**Live example:** [EPFL RDSN Map](https://go.epfl.ch/epfl-rdsn-map)

---

## What does this tool do?

This map lets researchers and staff discover research data support services available at your institution. Services appear as markers on an interactive campus map and can be filtered by lifecycle phase (Planning, Collection, Processing…), searched by name or keyword, and browsed in list or kanban views. The interface supports four languages out of the box: French, English, German, and Italian.

---

## Table of contents

- [Research Data Services Network Map](#research-data-services-network-map)
  - [What does this tool do?](#what-does-this-tool-do)
  - [Table of contents](#table-of-contents)
  - [1. Before you start](#1-before-you-start)
  - [2. Fork the repository](#2-fork-the-repository)
  - [3. Enable GitHub Pages](#3-enable-github-pages)
  - [4. Customise your instance](#4-customise-your-instance)
    - [Step 1 — Edit config.js](#step-1--edit-configjs)
    - [Step 2 — Upload your logo](#step-2--upload-your-logo)
    - [Step 3 — Replace the service data](#step-3--replace-the-service-data)
  - [5. Reference — config.js](#5-reference--configjs)
    - [`institution`](#institution)
    - [`map`](#map)
    - [`branding`](#branding)
    - [`colors`](#colors)
    - [`ui`](#ui)
    - [`footer`](#footer)
  - [6. Reference — services.csv](#6-reference--servicescsv)
    - [Column descriptions](#column-descriptions)
    - [Valid Phase values](#valid-phase-values)
    - [Finding coordinates for your buildings](#finding-coordinates-for-your-buildings)
  - [7. Troubleshooting](#7-troubleshooting)
  - [8. License and attribution](#8-license-and-attribution)
    - [Known deployments](#known-deployments)

---

## 1. Before you start

You will need:

- A **GitHub account** (free). Create one at [github.com](https://github.com) if you don't have one yet.
- Your institution's **logo file** (PNG or SVG, ideally with a transparent background).
- A list of **research data services** at your institution: name, contact, location, and a short description for each.
- Optionally: the **hex color codes** of your institution's visual identity. These look like `#3A7BD5`. Your communications or web team can usually provide them.

No coding knowledge is required. All editing is done directly through GitHub's website.

---

## 2. Fork the repository

"Forking" creates your own personal copy of this project that you can freely modify without affecting the original.

1. Go to [github.com/epfllibrary/epfl-rdsn-map](https://github.com/epfllibrary/epfl-rdsn-map).
2. Click the **Fork** button in the top-right corner of the page.
3. Under "Owner", select your personal GitHub account or your institution's GitHub organisation.
4. Give your repository a name, for example `rdm-map` or `research-data-services-map`.
5. Click **Create fork**.

You now have your own copy at `github.com/YOUR-USERNAME/YOUR-REPO-NAME`.

---

## 3. Enable GitHub Pages

GitHub Pages turns your repository into a live public website, for free.

1. In your forked repository, click the **Settings** tab (near the top of the page, with a gear icon ⚙️).
2. In the left sidebar, scroll down and click **Pages**.
3. Under "Source", choose **Deploy from a branch**.
4. Under "Branch", select **main** and leave the folder set to **/ (root)**.
5. Click **Save**.

After about one minute, your map will be live at:

```
https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/
```

The site updates automatically every time you save a change in the repository — no manual publishing needed.

---

## 4. Customise your instance

Your map is ready to use, but it currently shows EPFL's branding and services. Here is what to change to make it your own.

### Step 1 — Edit config.js

`config.js` is the single file that controls your institution's name, colors, logo, contact email, map location, and footer text.

**How to edit it on GitHub:**

1. In your repository, click the file `config.js` to open it.
2. Click the **pencil icon** (✏️) in the top-right area of the file. This opens the editor.
3. Make your changes. The file is well-commented — each setting has an explanation directly above it.
4. When done, scroll down and click **Commit changes…**
5. In the dialog that appears, click **Commit changes** again to confirm.

Your live site will update within about one minute.

> **Made a mistake?** As long as you have not clicked "Commit changes", you can click **Cancel changes** to undo everything. GitHub also keeps a full history of all commits — nothing is ever permanently lost.

See the [full config.js reference](#5-reference--configjs) for a description of every available option.

### Step 2 — Upload your logo

1. Prepare a logo file. PNG or SVG format recommended, with a transparent background if possible. The logo is displayed at roughly 60–80 pixels tall, so make sure it is legible at that size.
2. In your repository, click **Add file → Upload files**.
3. Drag your logo onto the upload area and click **Commit changes**.
4. Open `config.js` again and update the `logo` line to match your filename exactly, including the file extension. For example:
   ```
   logo: "my-university-logo.png",
   ```
   Filename matching is case-sensitive: `Logo.PNG` and `logo.png` are different files.

### Step 3 — Replace the service data

The map reads its data from `services.csv`. This file contains all the services shown on the map, one row per service.

**Recommended approach:**

1. In your repository, click `services.csv`, then click the **download icon** (⬇️) or the **Raw** button and save the file to your computer.
2. Open it in **Excel** or **LibreOffice Calc**. When prompted about the format, choose **semicolon** as the delimiter (not comma).
3. Delete all existing rows below the header row, and enter your own services. See the [services.csv reference](#6-reference--servicescsv) for a description of each column.
4. Save the file as CSV with semicolons. In Excel, choose **Save As → CSV UTF-8 (Semicolon Delimited)**. In LibreOffice, choose **Keep Current Format** and confirm semicolon as the field delimiter.
5. Back in GitHub, go to your repository, click **Add file → Upload files**, and upload your new `services.csv`. GitHub will ask if you want to replace the existing file — confirm that you do.

> **Important:** Keep the header row exactly as it is. The map reads column names directly. You can leave individual cells empty, but do not rename, add, or remove columns.

---

## 5. Reference — config.js

### `institution`

Controls your institution's identity throughout the interface.

| Key | Description | Example |
|-----|-------------|---------|
| `name` | Short name. Appears in the page title and accessibility labels. | `"University of .."` |
| `fullName` | Full name. Used in the browser tab title. | `"University of .."` |
| `logo` | Filename of your logo. Must be uploaded to the repository. Set to `null` to hide the logo. | `"..-logo.png"` |
| `logoAlt` | Short description of the logo for screen readers. | `"University of .. logo"` |
| `contactEmail` | Your team's email. Appears in the footer, the empty search result state, and the "Suggest a service" button. | `"rdm@university.ch"` |
| `campusPlanUrl` | Base URL of your campus map. The office code from services.csv is appended to this. Set to `null` to hide office links. | `"https://campusmap.ch/?room="` |

---

### `map`

Controls the initial position and zoom of the map.

| Key | Description | Example |
|-----|-------------|---------|
| `center` | Coordinates `[latitude, longitude]` of your campus centre. Find yours by right-clicking on your campus at [openstreetmap.org](https://www.openstreetmap.org) and choosing "Show address". | `[47.3744, 8.5512]` |
| `zoom` | Initial zoom level. `15` shows a neighbourhood, `17` shows individual buildings. `16` is a good starting point for most campuses. | `16` |

---

### `branding`

Controls the small visual elements that identify your instance.

| Key | Description | Example |
|-----|-------------|---------|
| `faviconColor` | Background color of the browser tab icon. | `"#3A7BD5"` |
| `faviconText` | Letters shown on the browser tab icon. | `"RDSN"` |
| `loadingText` | Word shown on the loading screen before the map appears. Usually your institution's short name. | `"RDM"` |

---

### `colors`

All interface colors, expressed as hex codes. Your communications team can usually provide your institution's official color codes.

**Primary colors** — change these to match your brand:

| Key | What it affects |
|-----|----------------|
| `accent` | Your main brand color. Active states, selected items, "Publication & Sharing" phase. |
| `accentDark` | Darker variant of your main color, used for hover and pressed states. |
| `secondary` | Your secondary brand color. "Data Collection", "Processing & Analysis", and "Archiving" phases. |
| `secondaryMid` | Medium-dark variant of your secondary color. |
| `secondaryDark` | Darkest variant of your secondary color. |

**Phase colors** — one color per additional lifecycle phase:

| Key | Phase |
|-----|-------|
| `phase1Color` | Use & Store |
| `phase2Color` | Planning & Design |
| `phase3Color` | Discover & Reuse |

**Neutral colors** — usually fine to leave unchanged:

| Key | Role |
|-----|------|
| `text` | Main body text color. |
| `white` | Background of cards and panels. |
| `muted` | Subtle borders and disabled elements. |
| `gray100` | Very light background (hover states). |
| `gray200` | Light borders. |
| `gray500` | Secondary text. |
| `gray600` | Muted text. |

---

### `ui`

| Key | Description | Example |
|-----|-------------|---------|
| `defaultLang` | Language shown on first visit. Must be one of the values in `availableLangs`. | `"en"` |
| `availableLangs` | Languages available in the selector. Options: `"fr"`, `"en"`, `"de"`, `"it"`. Remove any you don't need. At least one required. | `["en", "fr"]` |

---

### `footer`

Text shown at the bottom of the sidebar. Write one entry per language. Basic HTML formatting is supported (e.g. `<strong>bold</strong>`).

```js
footer: {
  en: "A service of the <strong>Research Data Team</strong> — University of ..",
  fr: "Un service de l'<strong>équipe données de recherche</strong> — Université de ..",
  de: "Ein Service des <strong>Forschungsdaten-Teams</strong> — Universität ..",
  it: "Un'iniziativa del <strong>Research Data Management Team</strong> - Universita",
},
```

If you only support one language, a single entry is enough — just make sure its code matches the one in `ui.availableLangs`.

---

## 6. Reference — services.csv

Each row in `services.csv` is one service on the map. Columns are separated by **semicolons (`;`)**, not commas.

### Column descriptions

| Column | Required | Description |
|--------|:--------:|-------------|
| `Service` | ✅ | Name of the service. Shown as the marker label and in the list. |
| `Unit` | ✅ | Team, lab, or department that provides the service. |
| `Contact` | | Email address for the service. Shown as a clickable link in the service card. |
| `Audience` | | Who the service is for. Free text — use values like `Researchers`, `Students`, `All staff`. |
| `Phase` | ✅ | Research data lifecycle phase. Must be one of the exact values listed below. |
| `URL` | | Link to the service's website. Shown as a button in the service card. |
| `Latitude` | | Latitude of the service's location. Used to place the marker on the map. If empty, the service appears in list views only. |
| `Longitude` | | Longitude of the service's location. |
| `Office` | | Room or office code. Used to generate a campus map link if `campusPlanUrl` is set in config.js. |
| `Description` | ✅ | Service description in your default language. |
| `Description_EN` | | English description. Falls back to `Description` if empty. |
| `Description_DE` | | German description. Falls back to English, then to `Description`. |
| `Description_IT` | | Italian description. Falls back in the same order. |

### Valid Phase values

The `Phase` column only accepts these exact values (spelling and capitalisation matter):

| Value | Meaning |
|-------|---------|
| `Planning & Design` | Services for the planning stage of a research project |
| `Data Collection` | Data gathering, instruments, surveys |
| `Processing & Analysis` | Data cleaning, transformation, computation |
| `Use & Store` | Storage solutions, data management during active research |
| `Publication & Sharing` | Repositories, open access, data publishing |
| `Archiving` | Long-term preservation |
| `Discover & Reuse` | Finding and reusing existing datasets |
| `All` | Cross-cutting services that apply to the full lifecycle |

To assign a service to **multiple phases**, separate the values with a pipe character (`|`), with no spaces:

```
Planning & Design|Data Collection
```

### Finding coordinates for your buildings

1. Go to [openstreetmap.org](https://www.openstreetmap.org).
2. Navigate to the building where the service is located.
3. Right-click on the building and select **"Show address"**. The coordinates appear at the bottom of the screen in the format `latitude, longitude`.
4. Copy both values into the `Latitude` and `Longitude` columns of your CSV.

## 7. Troubleshooting

**The map still shows EPFL services.**
You haven't replaced `services.csv` yet, or the upload did not overwrite the existing file. Confirm the file in your repository shows your content by clicking it and checking the Raw view.

**My logo does not appear.**
The filename in `config.js` must exactly match the file you uploaded, including capitalisation and extension. `Logo.PNG` and `logo.png` are different.

**The map is still centred on EPFL's campus.**
Update `map.center` in `config.js` with your institution's coordinates. See the [map section](#map) above.

**My changes are not showing on the live site.**
GitHub Pages can take up to 2 minutes to rebuild. Wait a moment, then force-refresh the page: **Ctrl+Shift+R** on Windows or Linux, **Cmd+Shift+R** on Mac.

**Colors haven't changed.**
Verify that your hex codes start with `#` and contain exactly 6 characters (digits 0–9 and letters A–F). Example: `"#3A7BD5"`.

**A service is in the list but not on the map.**
That service has empty `Latitude` and `Longitude` columns. Fill them in using coordinates from OpenStreetMap.

**The CSV looks broken after editing in Excel.**
Excel sometimes saves with commas instead of semicolons, or changes the encoding. Use **Save As → CSV UTF-8 (Semicolon Delimited)**, and verify by opening the file in a plain text editor — each row should have fields separated by `;`.

**I need help with something not listed here.**
Open an issue on the [original repository](https://github.com/epfllibrary/epfl-rdsn-map/issues) and describe your problem. A link to your forked repository helps us assist you faster.

---

## 8. License and attribution

This project is published under the [MIT License](LICENSE). You are free to use, copy, modify, merge, publish, and distribute it — including for institutional or commercial purposes — provided you include the original copyright notice.

We encourage you to keep a mention of the original project in your footer text via Zenodo's DOI citation (Tremblay, C. (2026). Research Data Service Mapping Template (v1.0.0). Zenodo. https://doi.org/10.5281/zenodo.20611538) , but this is not required.

If you adapt this map for your institution and would like to appear as a known deployment, open a pull request adding your institution's name and URL to this section.

### Known deployments

- [EPFL](https://go.epfl.ch/epfl-rdsn-map) — original project
