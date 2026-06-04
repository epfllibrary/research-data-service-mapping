(function () {

  // ── Dictionnaires ──────────────────────────────────────────────────────────
  const TRANSLATIONS = {
    fr: {
      // Header
      "header.search.placeholder": "Rechercher un service, unité…",
      "header.search.aria":        "Rechercher un service",
      "header.share":              "↗ Partager cette vue",
      "header.share.copied":       "✓ Lien copié !",
      "header.suggest":            "+ Suggérer un service",
      "header.suggest.mailto.subject": "Suggestion%20de%20service%20RDSN",
      "header.suggest.mailto.body":
        "Bonjour%2C%0A%0AJe%20souhaite%20signaler%20un%20service%20manquant%20%3A%0A%0ANom%20du%20service%20%3A%0AUnit%C3%A9%20%3A%0AContact%20%3A%0AURL%20%3A%0A%0AMerci%20!",

      // View switcher
      "view.aria": "Choisir la vue",
      "view.map":    "Carte",
      "view.kanban": "Cycle de vie",
      "view.units":  "Par unité",
      "view.map.aria":    "Vue carte",
      "view.kanban.aria": "Vue cycle de vie",
      "view.units.aria":  "Vue par unité",

      // Filter bar
      "filter.label": "Phase :",
      "filter.all":   "Tous",
      "filter.bar.aria": "Filtrer par phase du cycle de vie des données",

      // Sidebar panel
      "panel.all":      "Tous les services",
      "panel.building": "Dans ce bâtiment",
      "panel.back":     "← Retour",

      // Empty state
      "empty.title": "Aucun service trouvé",
      "empty.sub":   "Essayez d'autres termes ou contactez l'équipe RDM pour signaler un service manquant.",

      // Detail panel
      "detail.label":       "Fiche service",
      "detail.close.aria":  "Fermer la fiche",
      "detail.field.office":      "Bureau",
      "detail.field.contact":     "Contact",
      "detail.field.description": "Description",
      "detail.plan":        "voir sur le plan ↗",
      "detail.access":      "Accéder au service →",
      "detail.copy.link":   "⧉ Copier le lien",
      "detail.link.copied": "✓ Lien copié!",
      "detail.not.found":   "Service introuvable.",

      // Popup (map)
      "popup.plan":     "Voir sur le plan EPFL",
      "popup.plan.link": "voir sur le plan ↗",
      "popup.access":   "Accéder au service →",
      "popup.detail":   "Voir la fiche complète",

      // Kanban stats
      "kanban.stat.services": "services",
      "kanban.stat.phases":   "phases RDLC",
      "kanban.stat.units":    "unités impliquées",
      "kanban.all.badge":     "Toutes phases",
      "kanban.empty":         "—",

      // Units stats
      "units.stat.units":    "unités",
      "units.stat.services": "services",
      "units.empty":         "Aucun résultat pour",
      "units.no.unit":       "Sans unité",

      // Map / fullscreen
      "map.fullscreen.enter": "Plein écran",
      "map.fullscreen.exit":  "Quitter le plein écran",
      "map.fullscreen.aria":  "Plein écran",
      "map.legend.title":     "Phase RDLC",

      // Offscreen badges
      "offscreen.tip.n":  "nord",
      "offscreen.tip.ne": "nord-est",
      "offscreen.tip.e":  "est",
      "offscreen.tip.se": "sud-est",
      "offscreen.tip.s":  "sud",
      "offscreen.tip.sw": "sud-ouest",
      "offscreen.tip.w":  "ouest",
      "offscreen.tip.nw": "nord-ouest",
      "offscreen.tooltip": "service(s) au",
      "offscreen.tooltip.action": "cliquer pour voir",

      // Phases du Cycle
      "cycle.plan":"Planification & Conception",
      "cycle.col":"Collection des données",
      "cycle.process":"Processus & Analyses",
      "cycle.store":"Utilisation & Stockage",
      "cycle.pub":"Publication & Partage",
      "cycle.arch":"Archive",
      "cycle.disc":"Découvrir & Réutiliser",

      // Loading / error
      "loading.text": "Chargement des services…",
      "error.csv":    "Impossible de charger <code>services.csv</code>. Vérifiez que le fichier est dans le même dossier que <code>index.html</code> et que vous utilisez un serveur HTTP (pas <code>file://</code>).",

      // Noscript
      "noscript": "JavaScript est requis pour afficher cette carte interactive.",

      // Page meta
      "meta.title":       "Research Data Services Network — EPFL",
      "meta.description": "Carte interactive des services de données de recherche disponibles sur le campus EPFL.",
      "meta.og.title":    "EPFL Research Data Services Network",
      "meta.og.desc":     "Carte interactive des services de données de recherche sur le campus EPFL.",

      "footer.initiative": "Une initiative de la <strong>Research Data Management Team</strong> financée par Swiss Universities et EPFL Library",

      // Mobile drawer
      "drawer.toggle.aria": "Afficher la liste des services",

      // Search panel (mobile)
      "panel.search.placeholder": "Rechercher un service, unité…",
      "panel.search.aria":        "Rechercher un service",

      // Map aria
      "map.aria": "Carte du campus EPFL avec les services de données de recherche",
      "kanban.container.aria": "Vue cycle de vie des données",
      "units.container.aria":  "Vue par unité",
      "detail.panel.aria":     "Fiche service",
      "panel.aria":            "Liste des services",
      "legend.aria":           "Légende des phases",
    },

    en: {
      // Header
      "header.search.placeholder": "Search for a service, unit…",
      "header.search.aria":        "Search for a service",
      "header.share":              "↗ Share this view",
      "header.share.copied":       "✓ Link copied!",
      "header.suggest":            "+ Suggest a service",
      "header.suggest.mailto.subject": "RDSN%20service%20suggestion",
      "header.suggest.mailto.body":
        "Hello%2C%0A%0AI%20would%20like%20to%20report%20a%20missing%20service%3A%0A%0AService%20name%3A%0AUnit%3A%0AContact%3A%0AURL%3A%0A%0AThank%20you!",

      // View switcher
      "view.aria": "Choose view",
      "view.map":    "Map",
      "view.kanban": "Lifecycle",
      "view.units":  "By unit",
      "view.map.aria":    "Map view",
      "view.kanban.aria": "Lifecycle view",
      "view.units.aria":  "By unit view",

      // Filter bar
      "filter.label": "Phase:",
      "filter.all":   "All",
      "filter.bar.aria": "Filter by data lifecycle phase",

      // Sidebar panel
      "panel.all":      "All services",
      "panel.building": "In this building",
      "panel.back":     "← Back",

      // Empty state
      "empty.title": "No services found",
      "empty.sub":   "Try different terms or contact the RDM team to report a missing service.",

      // Detail panel
      "detail.label":       "Service details",
      "detail.close.aria":  "Close details",
      "detail.field.office":      "Office",
      "detail.field.contact":     "Contact",
      "detail.field.description": "Description",
      "detail.plan":        "view on map ↗",
      "detail.access":      "Access service →",
      "detail.copy.link":   "⧉ Copy link",
      "detail.link.copied": "✓ Link copied!",
      "detail.not.found":   "Service not found.",

      // Popup (map)
      "popup.plan":      "View on EPFL map",
      "popup.plan.link": "view on map ↗",
      "popup.access":    "Access service →",
      "popup.detail":    "View full details",

      // Kanban stats
      "kanban.stat.services": "services",
      "kanban.stat.phases":   "RDLC phases",
      "kanban.stat.units":    "units involved",
      "kanban.all.badge":     "All phases",
      "kanban.empty":         "—",

      // Units stats
      "units.stat.units":    "units",
      "units.stat.services": "services",
      "units.empty":         "No results for",
      "units.no.unit":       "No unit",

      // Map / fullscreen
      "map.fullscreen.enter": "Fullscreen",
      "map.fullscreen.exit":  "Exit fullscreen",
      "map.fullscreen.aria":  "Fullscreen",
      "map.legend.title":     "RDLC Phase",

      // Offscreen badges
      "offscreen.tip.n":  "north",
      "offscreen.tip.ne": "north-east",
      "offscreen.tip.e":  "east",
      "offscreen.tip.se": "south-east",
      "offscreen.tip.s":  "south",
      "offscreen.tip.sw": "south-west",
      "offscreen.tip.w":  "west",
      "offscreen.tip.nw": "north-west",
      "offscreen.tooltip": "service(s) to the",
      "offscreen.tooltip.action": "click to view",

      // Phases du Cycle
      "cycle.plan":"Planning & Design",
      "cycle.col":"Data Collection",
      "cycle.process":"Processing & Analysis",
      "cycle.store":"Use & Store",
      "cycle.pub":"Publication & Sharing",
      "cycle.arch":"Archiving",
      "cycle.disc":"Discover & Reuse",

      // Loading / error
      "loading.text": "Loading services…",
      "error.csv":    "Unable to load <code>services.csv</code>. Make sure the file is in the same folder as <code>index.html</code> and that you are using an HTTP server (not <code>file://</code>).",

      // Noscript
      "noscript": "JavaScript is required to display this interactive map.",

      // Footer
      "footer.initiative": "An initiative of the <strong>Research Data Management Team</strong> funded by Swiss Universities and EPFL Library",

      // Mobile drawer
      "drawer.toggle.aria": "Show service list",

      // Page meta
      "meta.title":       "Research Data Services Network — EPFL",
      "meta.description": "Interactive map of research data services available on the EPFL campus.",
      "meta.og.title":    "EPFL Research Data Services Network",
      "meta.og.desc":     "Interactive map of research data services on the EPFL campus.",


      // Search panel (mobile)
      "panel.search.placeholder": "Search for a service, unit…",
      "panel.search.aria":        "Search for a service",

      // Map aria
      "map.aria": "Map of the EPFL campus with research data services",
      "kanban.container.aria": "Data lifecycle view",
      "units.container.aria":  "By unit view",
      "detail.panel.aria":     "Service details",
      "panel.aria":            "Service list",
      "legend.aria":           "Phase legend",
    },
    de: {
      "header.search.placeholder": "Dienst, Einheit suchen…",
      "header.search.aria": "Dienst suchen",
      "header.share": "↗ Ansicht teilen",
      "header.share.copied": "✓ Link kopiert!",
      "header.suggest": "+ Dienst vorschlagen",
      "header.suggest.mailto.subject": "RDSN%20Dienstvorschlag",
      "header.suggest.mailto.body": "Guten%20Tag%2C%0A%0AIch%20m%C3%B6chte%20einen%20fehlenden%20Dienst%20melden%3A%0A%0ADienstname%3A%0AEinheit%3A%0AKontakt%3A%0AURL%3A%0A%0AVielen%20Dank!",
      "view.aria": "Ansicht wählen",
      "view.map": "Karte",
      "view.kanban": "Lebenszyklus",
      "view.units": "Nach Einheit",
      "view.map.aria": "Kartenansicht",
      "view.kanban.aria": "Lebenszyklusansicht",
      "view.units.aria": "Ansicht nach Einheit",
      "filter.label": "Phase:",
      "filter.all": "Alle",
      "filter.bar.aria": "Nach Datenlebenszyklusphase filtern",
      "panel.all": "Alle Dienste",
      "panel.building": "In diesem Gebäude",
      "panel.back": "← Zurück",
      "empty.title": "Keine Dienste gefunden",
      "empty.sub": "Versuchen Sie andere Begriffe oder kontaktieren Sie das RDM-Team, um einen fehlenden Dienst zu melden.",
      "detail.label": "Dienstinformationen",
      "detail.close.aria": "Details schliessen",
      "detail.field.office": "Büro",
      "detail.field.contact": "Kontakt",
      "detail.field.description": "Beschreibung",
      "detail.plan": "auf Karte ansehen ↗",
      "detail.access": "Dienst aufrufen →",
      "detail.copy.link": "⧉ Link kopieren",
      "detail.link.copied": "✓ Link kopiert!",
      "detail.not.found": "Dienst nicht gefunden.",
      "popup.plan": "Auf EPFL-Karte ansehen",
      "popup.plan.link": "auf Karte ansehen ↗",
      "popup.access": "Dienst aufrufen →",
      "popup.detail": "Vollständige Details ansehen",
      "kanban.stat.services": "Dienste",
      "kanban.stat.phases": "RDLZ-Phasen",
      "kanban.stat.units": "beteiligte Einheiten",
      "kanban.all.badge": "Alle Phasen",
      "kanban.empty": "—",
      "units.stat.units": "Einheiten",
      "units.stat.services": "Dienste",
      "units.empty": "Keine Ergebnisse für",
      "units.no.unit": "Ohne Einheit",
      "map.fullscreen.enter": "Vollbild",
      "map.fullscreen.exit": "Vollbild beenden",
      "map.fullscreen.aria": "Vollbild",
      "map.legend.title": "RDLZ-Phase",
      "offscreen.tip.n": "Norden",
      "offscreen.tip.ne": "Nordosten",
      "offscreen.tip.e": "Osten",
      "offscreen.tip.se": "Südosten",
      "offscreen.tip.s": "Süden",
      "offscreen.tip.sw": "Südwesten",
      "offscreen.tip.w": "Westen",
      "offscreen.tip.nw": "Nordwesten",
      "offscreen.tooltip": "Dienst(e) im",
      "offscreen.tooltip.action": "klicken zum Anzeigen",
      "cycle.plan": "Planung & Konzeption",
      "cycle.col": "Datenerhebung",
      "cycle.process": "Verarbeitung & Analyse",
      "cycle.store": "Nutzung & Speicherung",
      "cycle.pub": "Publikation & Teilen",
      "cycle.arch": "Archivierung",
      "cycle.disc": "Entdecken & Wiederverwenden",
      "loading.text": "Dienste werden geladen…",
      "error.csv": "Datei <code>services.csv</code> konnte nicht geladen werden. Stellen Sie sicher, dass die Datei im selben Ordner wie <code>index.html</code> liegt und ein HTTP-Server verwendet wird (nicht <code>file://</code>).",
      "noscript": "JavaScript ist erforderlich, um diese interaktive Karte anzuzeigen.",
      "footer.initiative": "Eine Initiative des <strong>Research Data Management Teams</strong>, finanziert von Swiss Universities und der EPFL-Bibliothek",
      "drawer.toggle.aria": "Dienstliste anzeigen",
      "meta.title": "Research Data Services Network — EPFL",
      "meta.description": "Interaktive Karte der Forschungsdatendienste auf dem EPFL-Campus.",
      "meta.og.title": "EPFL Research Data Services Network",
      "meta.og.desc": "Interaktive Karte der Forschungsdatendienste auf dem EPFL-Campus.",
      "panel.search.placeholder": "Dienst, Einheit suchen…",
      "panel.search.aria": "Dienst suchen",
      "map.aria": "Karte des EPFL-Campus mit Forschungsdatendiensten",
      "kanban.container.aria": "Datenlebenszyklusansicht",
      "units.container.aria": "Ansicht nach Einheit",
      "detail.panel.aria": "Dienstinformationen",
      "panel.aria": "Dienstliste",
      "legend.aria": "Phasenlegende"
    },

    it: {
      "header.search.placeholder": "Cerca un servizio, unità…",
      "header.search.aria": "Cerca un servizio",
      "header.share": "↗ Condividi questa vista",
      "header.share.copied": "✓ Link copiato!",
      "header.suggest": "+ Suggerisci un servizio",
      "header.suggest.mailto.subject": "Suggerimento%20servizio%20RDSN",
      "header.suggest.mailto.body": "Buongiorno%2C%0A%0ADesidero%20segnalare%20un%20servizio%20mancante%3A%0A%0ANome%20del%20servizio%3A%0AUnit%C3%A0%3A%0AContatto%3A%0AURL%3A%0A%0AGrazie!",
      "view.aria": "Scegli la vista",
      "view.map": "Mappa",
      "view.kanban": "Ciclo di vita",
      "view.units": "Per unità",
      "view.map.aria": "Vista mappa",
      "view.kanban.aria": "Vista ciclo di vita",
      "view.units.aria": "Vista per unità",
      "filter.label": "Fase:",
      "filter.all": "Tutti",
      "filter.bar.aria": "Filtra per fase del ciclo di vita dei dati",
      "panel.all": "Tutti i servizi",
      "panel.building": "In questo edificio",
      "panel.back": "← Indietro",
      "empty.title": "Nessun servizio trovato",
      "empty.sub": "Prova altri termini o contatta il team RDM per segnalare un servizio mancante.",
      "detail.label": "Scheda servizio",
      "detail.close.aria": "Chiudi i dettagli",
      "detail.field.office": "Ufficio",
      "detail.field.contact": "Contatto",
      "detail.field.description": "Descrizione",
      "detail.plan": "vedi sulla mappa ↗",
      "detail.access": "Accedi al servizio →",
      "detail.copy.link": "⧉ Copia link",
      "detail.link.copied": "✓ Link copiato!",
      "detail.not.found": "Servizio non trovato.",
      "popup.plan": "Vedi sulla mappa EPFL",
      "popup.plan.link": "vedi sulla mappa ↗",
      "popup.access": "Accedi al servizio →",
      "popup.detail": "Vedi scheda completa",
      "kanban.stat.services": "servizi",
      "kanban.stat.phases": "fasi RDLC",
      "kanban.stat.units": "unità coinvolte",
      "kanban.all.badge": "Tutte le fasi",
      "kanban.empty": "—",
      "units.stat.units": "unità",
      "units.stat.services": "servizi",
      "units.empty": "Nessun risultato per",
      "units.no.unit": "Senza unità",
      "map.fullscreen.enter": "Schermo intero",
      "map.fullscreen.exit": "Esci da schermo intero",
      "map.fullscreen.aria": "Schermo intero",
      "map.legend.title": "Fase RDLC",
      "offscreen.tip.n": "nord",
      "offscreen.tip.ne": "nord-est",
      "offscreen.tip.e": "est",
      "offscreen.tip.se": "sud-est",
      "offscreen.tip.s": "sud",
      "offscreen.tip.sw": "sud-ovest",
      "offscreen.tip.w": "ovest",
      "offscreen.tip.nw": "nord-ovest",
      "offscreen.tooltip": "servizio/i a",
      "offscreen.tooltip.action": "clicca per vedere",
      "cycle.plan": "Pianificazione & Progettazione",
      "cycle.col": "Raccolta dati",
      "cycle.process": "Elaborazione & Analisi",
      "cycle.store": "Utilizzo & Archiviazione",
      "cycle.pub": "Pubblicazione & Condivisione",
      "cycle.arch": "Archiviazione",
      "cycle.disc": "Scopri & Riutilizza",
      "loading.text": "Caricamento dei servizi…",
      "error.csv": "Impossibile caricare <code>services.csv</code>. Assicurarsi che il file si trovi nella stessa cartella di <code>index.html</code> e che si utilizzi un server HTTP (non <code>file://</code>).",
      "noscript": "JavaScript è necessario per visualizzare questa mappa interattiva.",
      "footer.initiative": "Un'iniziativa del <strong>Research Data Management Team</strong> finanziata da Swiss Universities e dalla Biblioteca EPFL",
      "drawer.toggle.aria": "Mostra elenco servizi",
      "meta.title": "Research Data Services Network — EPFL",
      "meta.description": "Mappa interattiva dei servizi per i dati di ricerca disponibili sul campus EPFL.",
      "meta.og.title": "EPFL Research Data Services Network",
      "meta.og.desc": "Mappa interattiva dei servizi per i dati di ricerca sul campus EPFL.",
      "panel.search.placeholder": "Cerca un servizio, unità…",
      "panel.search.aria": "Cerca un servizio",
      "map.aria": "Mappa del campus EPFL con i servizi per i dati di ricerca",
      "kanban.container.aria": "Vista ciclo di vita dei dati",
      "units.container.aria": "Vista per unità",
      "detail.panel.aria": "Scheda servizio",
      "panel.aria": "Elenco servizi",
      "legend.aria": "Legenda delle fasi"
    },
  };

  let lang = "fr";
  const listeners = [];
  function t(key) {
    return (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) || key;
  }
  function setLang(l) {
    lang = ["fr", "en", "de", "it"].includes(l) ? l : "fr";
    document.documentElement.lang = lang;
    listeners.forEach(fn => fn(lang));
  }
  function onChange(fn) {
    listeners.push(fn);
  }
  function getLang() {
    return lang;
  }
  window.i18n = {
    t,
    setLang,
    onChange,
    get lang() { return lang; },
    getLang
  };
})();