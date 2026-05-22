// ── map.js — Leaflet map, markers, clusters ────────────────────────────────
(function () {
  let map, clusterGroup;
  const markers = {};

  const POPUP_OPTIONS = {
    maxWidth: 320, minWidth: 260,
    closeButton: true, autoPan: true,
  };
  const POPUP_OPTIONS_HOVER = {
    ...POPUP_OPTIONS, closeButton: false, autoPan: false,
  };

  // ── Map init ──────────────────────────────────────────────────────────────
  function initMap() {
    map = L.map("map", { center: [46.5194, 6.5665], zoom: 16, zoomControl: true });

    L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 20,
    }).addTo(map);

    clusterGroup = L.markerClusterGroup({
      maxClusterRadius: 40,
      showCoverageOnHover: false,
      spiderfyOnMaxZoom: true,
      iconCreateFunction(cluster) {
        const count = cluster.getChildCount();
        const size  = count > 20 ? 46 : count > 10 ? 40 : 34;
        return L.divIcon({
          html:      `<div class="marker-cluster-epfl" style="width:${size}px;height:${size}px">${count}</div>`,
          iconSize:  [size, size], iconAnchor: [size / 2, size / 2], className: "",
        });
      },
    });

    map.addLayer(clusterGroup);

    map.on("moveend zoomend", updateOffscreenIndicator);

    map.on("click", () => {
      window.UIModule.clearClusterFilter();
      window.UIModule.closeDetail();
    });

    clusterGroup.on("clusterclick", e => {
      L.DomEvent.stopPropagation(e);
      const indices = e.layer.getAllChildMarkers()
        .map(m => m._serviceIdx).filter(i => i !== undefined);
      if (indices.length > 0) window.UIModule.enterClusterView(indices);
    });
  }

  // ── Build markers ─────────────────────────────────────────────────────────
  function buildMarkers() {
    (window.SERVICES || []).forEach((s, i) => {
      const lat = parseFloat(s.Latitude);
      const lng = parseFloat(s.Longitude);
      if (isNaN(lat) || isNaN(lng)) return;

      const color = window.UIModule.phaseColor(s.Phase);
      const delay = Math.min(i * 12, 800);

      const icon = L.divIcon({
        html:        `<div class="custom-marker marker-enter" style="background:${color};animation-delay:${delay}ms"></div>`,
        iconSize:    [28, 28], iconAnchor: [14, 26], popupAnchor: [0, -28], className: "",
      });

      const marker = L.marker([lat, lng], { icon });
      marker._serviceIdx = i;

      marker.on("mouseover", function () {
        window.UIModule.setActiveMarker(i);
        this.unbindPopup();
        this.bindPopup(window.UIModule.buildPopupHTML(i), POPUP_OPTIONS_HOVER).openPopup();
      });

      marker.on("click", function (e) {
        L.DomEvent.stopPropagation(e);
        if (!window.UIModule.isInCluster(i)) window.UIModule.clearClusterFilter();
        window.UIModule.setActiveMarker(i);
        this.unbindPopup();
        this.bindPopup(window.UIModule.buildPopupHTML(i), POPUP_OPTIONS).openPopup();
      });

      markers[i] = marker;
      clusterGroup.addLayer(marker);
    });
  }

  // ── Apply visibility filter ───────────────────────────────────────────────
  function applyVisibility(isVisibleFn) {
    clusterGroup.clearLayers();
    (window.SERVICES || []).forEach((s, i) => {
      if (markers[i] && isVisibleFn(s, i)) clusterGroup.addLayer(markers[i]);
    });
    updateOffscreenIndicator();
  }

  // ── Fly to marker ─────────────────────────────────────────────────────────
  function flyToAndShow(idx) {
    const marker = markers[idx];
    if (!marker) return;
    clusterGroup.zoomToShowLayer(marker, () => {
      marker.unbindPopup();
      marker.bindPopup(window.UIModule.buildPopupHTML(idx), POPUP_OPTIONS).openPopup();
    });
  }

  // ── Off-screen markers indicator — 8 directions ───────────────────────────
  let offscreenTimer = null;

  const DIRS = [
    { id: 'n',  label: '↑',  tipKey: 'offscreen.tip.n'  },
    { id: 'ne', label: '↗',  tipKey: 'offscreen.tip.ne' },
    { id: 'e',  label: '→',  tipKey: 'offscreen.tip.e'  },
    { id: 'se', label: '↘',  tipKey: 'offscreen.tip.se' },
    { id: 's',  label: '↓',  tipKey: 'offscreen.tip.s'  },
    { id: 'sw', label: '↙',  tipKey: 'offscreen.tip.sw' },
    { id: 'w',  label: '←',  tipKey: 'offscreen.tip.w'  },
    { id: 'nw', label: '↖',  tipKey: 'offscreen.tip.nw' },
  ];

  function angleToDir(lat, lng, center) {
    const dLat   = lat - center.lat;
    const dLng   = lng - center.lng;
    const angle  = Math.atan2(dLng, dLat) * 180 / Math.PI;
    const sector = Math.round(((angle + 360) % 360) / 45) % 8;
    return DIRS[sector].id;
  }

  function updateOffscreenIndicator() {
    clearTimeout(offscreenTimer);
    offscreenTimer = setTimeout(() => {
      const bounds  = map.getBounds();
      const center  = bounds.getCenter();
      const latMargin = (bounds.getNorth() - bounds.getSouth());
      const lngMargin = (bounds.getEast()  - bounds.getWest());

      const tolerantBounds = L.latLngBounds(
        [bounds.getSouth() - latMargin, bounds.getWest() - lngMargin],
        [bounds.getNorth() + latMargin, bounds.getEast() + lngMargin]
      );

      const byDir = {};
      DIRS.forEach(d => { byDir[d.id] = []; });

      (window.SERVICES || []).forEach((s, i) => {
        if (!markers[i] || !clusterGroup.hasLayer(markers[i])) return;
        const lat = parseFloat(s.Latitude);
        const lng = parseFloat(s.Longitude);
        if (isNaN(lat) || isNaN(lng)) return;
        if (tolerantBounds.contains([lat, lng])) return;
        byDir[angleToDir(lat, lng, center)].push([lat, lng]);
      });

      const container = document.getElementById('map-container');

      DIRS.forEach(d => {
        const pts  = byDir[d.id];
        let badge  = document.getElementById(`offscreen-${d.id}`);
        const tip  = window.i18n ? window.i18n.t(d.tipKey) : d.tipKey;
        const verb = window.i18n ? window.i18n.t("offscreen.tooltip") : "service(s) au";
        const act  = window.i18n ? window.i18n.t("offscreen.tooltip.action") : "cliquer pour voir";

        if (pts.length > 0) {
          if (!badge) {
            badge = document.createElement('button');
            badge.id        = `offscreen-${d.id}`;
            badge.className = `offscreen-badge offscreen-${d.id}`;
            container.appendChild(badge);
          }

          badge.onclick = () => {
            const b = L.latLngBounds(pts);
            b.extend([center.lat, center.lng]);
            map.fitBounds(b, { padding: [60, 60], maxZoom: 17, animate: true });
          };

          badge.title      = `${pts.length} ${verb} ${tip} — ${act}`;
          badge.innerHTML  = `${d.label}<span>${pts.length}</span>`;
          badge.style.display = 'flex';
        } else if (badge) {
          badge.style.display = 'none';
        }
      });
    }, 200);
  }

  // ── Reset to default campus view ──────────────────────────────────────────
  function resetView() {
    applyVisibility(window.UIModule.isVisible);
    map.flyTo([46.5194, 6.5665], 16, { duration: 0.6 });
  }

  // ── Public API ────────────────────────────────────────────────────────────
  window.MapModule = {
    init() { initMap(); buildMarkers(); },
    applyVisibility,
    flyToAndShow,
    resetView,
    invalidateSize() { if (map) map.invalidateSize(); },
  };
})();
