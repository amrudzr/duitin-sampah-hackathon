/* ==========================================================================
   Sirkula Intelligence — Interactive Network & Spatial Map
   UNS Innovation Hackathon 2026
   ========================================================================== */

(function () {
  const { MACHINES, CENTRAL_HUB } = window.SirkulaData;

  let mapInstance = null;
  let tileLayer = null;
  let markers = {};
  let networkLines = [];
  let showTopology = true;
  let activeFilter = 'all';
  let selectedNodeId = null;

  const UNS_CENTER = [-7.5589, 110.8562];
  const DEFAULT_ZOOM = 16;

  function isDarkTheme() {
    return document.documentElement.classList.contains('dark');
  }

  function getTileConfig(dark) {
    if (dark) {
      return {
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
        attribution: '&copy; Esri, OpenStreetMap contributors',
        maxZoom: 18
      };
    }
    return {
      url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors',
      maxZoom: 19
    };
  }

  function updateTileLayer() {
    if (!mapInstance) return;
    if (tileLayer) {
      mapInstance.removeLayer(tileLayer);
      tileLayer = null;
    }
    const config = getTileConfig(isDarkTheme());
    tileLayer = L.tileLayer(config.url, {
      attribution: config.attribution,
      maxZoom: config.maxZoom
    }).addTo(mapInstance);
  }

  function createMarkerIcon(status, isHub) {
    if (isHub) {
      return L.divIcon({
        className: 'custom-rvm-icon',
        html: `
          <div class="rvm-marker-wrap hub" title="${CENTRAL_HUB.name}">
            <div class="rvm-pulse-ring"></div>
            <div class="rvm-node-core">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
                <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
                <line x1="6" y1="6" x2="6.01" y2="6"></line>
                <line x1="6" y1="18" x2="6.01" y2="18"></line>
              </svg>
            </div>
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
        popupAnchor: [0, -18]
      });
    }

    return L.divIcon({
      className: 'custom-rvm-icon',
      html: `
        <div class="rvm-marker-wrap ${status}">
          <div class="rvm-pulse-ring"></div>
          <div class="rvm-node-core">
            <span class="rvm-node-dot"></span>
          </div>
        </div>
      `,
      iconSize: [34, 34],
      iconAnchor: [17, 17],
      popupAnchor: [0, -18]
    });
  }

  function createPopupContent(machine) {
    const totalCount = machine.petCount + machine.aluCount;
    const totalCap = machine.petCap + machine.aluCap;
    const totalPct = Math.round((totalCount / totalCap) * 100);

    let badgeClass = 'badge-success';
    if (machine.status === 'warning') badgeClass = 'badge-warning';
    if (machine.status === 'offline') badgeClass = 'badge-destructive';

    return `
      <div class="map-popup-card">
        <div class="map-popup-header">
          <div>
            <div class="mono text-xs font-semibold" style="color:hsl(var(--muted-foreground));">${machine.id}</div>
            <div class="map-popup-title">${machine.name}</div>
            <div class="map-popup-zone">${machine.zone}</div>
          </div>
          <span class="badge ${badgeClass}">${machine.statusLabel}</span>
        </div>

        <div style="margin:0.75rem 0;">
          <div class="row-between text-xs" style="margin-bottom:0.35rem;">
            <span class="text-muted">Kapasitas Wadah</span>
            <span class="mono font-semibold">${totalPct}%</span>
          </div>
          <div class="progress">
            <div class="progress-bar ${totalPct >= 80 ? 'warn' : 'primary'}" style="width:${totalPct}%"></div>
          </div>
          <div class="row-between text-xs text-muted mono" style="margin-top:0.35rem;">
            <span>${machine.petCount} PET · ${machine.aluCount} Alu</span>
            <span>${totalCount}/${totalCap} unit</span>
          </div>
        </div>

        <div class="map-popup-footer">
          <span class="text-xs text-muted mono">${machine.wifiRssi.split(' ')[0]}</span>
          <a href="mesin.html" class="btn btn-outline btn-sm" style="font-size:0.75rem;padding:0.25rem 0.55rem;">
            Lihat Mesin
          </a>
        </div>
      </div>
    `;
  }

  function createHubPopupContent() {
    return `
      <div class="map-popup-card">
        <div class="map-popup-header">
          <div>
            <div class="mono text-xs font-semibold" style="color:hsl(var(--muted-foreground));">${CENTRAL_HUB.id}</div>
            <div class="map-popup-title">${CENTRAL_HUB.name}</div>
            <div class="map-popup-zone">${CENTRAL_HUB.zone}</div>
          </div>
          <span class="badge badge-success">Pusat Server</span>
        </div>
        <p class="text-xs text-muted" style="margin-top:0.35rem;">
          Server gateway MQTT &amp; ingestion telemetri seluruh RVM Kampus UNS.
        </p>
      </div>
    `;
  }

  function renderTopologyLines() {
    networkLines.forEach(line => mapInstance.removeLayer(line));
    networkLines = [];

    if (!showTopology) return;

    MACHINES.forEach(m => {
      if (activeFilter === 'online' && m.status !== 'online') return;
      if (activeFilter === 'attention' && m.status === 'online') return;

      let lineColor = '#16a34a'; // Emerald
      let lineClass = 'net-line-pulse';
      let opacity = 0.75;
      let dashArray = '6, 6';

      if (m.status === 'warning') {
        lineColor = '#d97706'; // Amber
      } else if (m.status === 'offline') {
        lineColor = '#dc2626'; // Destructive
        lineClass = '';
        opacity = 0.35;
        dashArray = '3, 6';
      }

      const poly = L.polyline(
        [
          [CENTRAL_HUB.lat, CENTRAL_HUB.lng],
          [m.lat, m.lng]
        ],
        {
          color: lineColor,
          weight: m.status === 'offline' ? 1.5 : 2.5,
          opacity: opacity,
          dashArray: dashArray,
          className: lineClass
        }
      ).addTo(mapInstance);

      networkLines.push(poly);
    });
  }

  function renderMarkers() {
    Object.values(markers).forEach(m => mapInstance.removeLayer(m));
    markers = {};

    // 1. Central Hub Marker
    const hubMarker = L.marker([CENTRAL_HUB.lat, CENTRAL_HUB.lng], {
      icon: createMarkerIcon('online', true),
      zIndexOffset: 1000
    }).addTo(mapInstance);
    hubMarker.bindPopup(createHubPopupContent(), { maxWidth: 300 });
    markers[CENTRAL_HUB.id] = hubMarker;

    // 2. Machine Markers
    MACHINES.forEach(m => {
      if (activeFilter === 'online' && m.status !== 'online') return;
      if (activeFilter === 'attention' && m.status === 'online') return;

      const marker = L.marker([m.lat, m.lng], {
        icon: createMarkerIcon(m.status, false)
      }).addTo(mapInstance);

      marker.bindPopup(createPopupContent(m), { maxWidth: 300 });

      marker.on('click', () => {
        selectNode(m.id);
      });

      markers[m.id] = marker;
    });

    renderTopologyLines();
  }

  function selectNode(id) {
    selectedNodeId = id;

    document.querySelectorAll('.telemetry-node-card').forEach(el => {
      const match = el.getAttribute('data-id') === id;
      el.classList.toggle('selected', match);
    });

    const target = id === CENTRAL_HUB.id ? CENTRAL_HUB : MACHINES.find(m => m.id === id);
    if (target && mapInstance) {
      mapInstance.flyTo([target.lat, target.lng], 17, { duration: 0.6 });
      if (markers[id]) {
        markers[id].openPopup();
      }
    }
  }

  function renderNodeList() {
    const listEl = document.getElementById('telemetry-node-list');
    if (!listEl) return;

    const filtered = MACHINES.filter(m => {
      if (activeFilter === 'online') return m.status === 'online';
      if (activeFilter === 'attention') return m.status !== 'online';
      return true;
    });

    let html = `
      <div class="telemetry-node-card ${selectedNodeId === CENTRAL_HUB.id ? 'selected' : ''}" data-id="${CENTRAL_HUB.id}">
        <div class="row-between">
          <span class="mono text-xs font-semibold" style="color:hsl(var(--muted-foreground));">${CENTRAL_HUB.id}</span>
          <span class="badge badge-outline">Pusat Server</span>
        </div>
        <div class="font-medium text-sm" style="margin-top:0.25rem;">${CENTRAL_HUB.name}</div>
        <div class="text-xs text-muted">${CENTRAL_HUB.zone}</div>
      </div>
    `;

    html += filtered.map(m => {
      const totalCount = m.petCount + m.aluCount;
      const totalCap = m.petCap + m.aluCap;
      const totalPct = Math.round((totalCount / totalCap) * 100);

      let badge = '<span class="badge badge-success">Online</span>';
      if (m.status === 'warning') badge = '<span class="badge badge-warning">Hampir Penuh</span>';
      if (m.status === 'offline') badge = '<span class="badge badge-destructive">Offline</span>';

      return `
        <div class="telemetry-node-card ${selectedNodeId === m.id ? 'selected' : ''}" data-id="${m.id}">
          <div class="row-between">
            <span class="mono text-xs font-semibold" style="color:hsl(var(--muted-foreground));">${m.id}</span>
            ${badge}
          </div>
          <div class="font-medium text-sm" style="margin-top:0.25rem;">${m.name}</div>
          <div class="text-xs text-muted">${m.zone}</div>
          
          <div style="margin-top:0.6rem;">
            <div class="row-between text-xs mono text-muted" style="margin-bottom:0.25rem;">
              <span>Kapasitas</span>
              <span class="font-semibold text-foreground">${totalPct}% (${totalCount}/${totalCap})</span>
            </div>
            <div class="progress">
              <div class="progress-bar ${totalPct >= 80 ? 'warn' : 'primary'}" style="width:${totalPct}%"></div>
            </div>
          </div>
        </div>
      `;
    }).join('');

    listEl.innerHTML = html;

    listEl.querySelectorAll('.telemetry-node-card').forEach(card => {
      card.addEventListener('click', () => {
        selectNode(card.getAttribute('data-id'));
      });
    });
  }

  function initMap(containerId = 'map-view') {
    const el = document.getElementById(containerId);
    if (!el) return;

    if (mapInstance) {
      mapInstance.remove();
      mapInstance = null;
      tileLayer = null;
    }

    mapInstance = L.map(containerId, {
      center: UNS_CENTER,
      zoom: DEFAULT_ZOOM,
      zoomControl: false
    });

    L.control.zoom({ position: 'topright' }).addTo(mapInstance);

    updateTileLayer();
    renderMarkers();
    renderNodeList();
    bindMapControls();

    // Trigger multiple resize invalidations so tiles paint regardless of CSS transitions
    mapInstance.invalidateSize();
    setTimeout(() => { if (mapInstance) mapInstance.invalidateSize(); }, 100);
    setTimeout(() => { if (mapInstance) mapInstance.invalidateSize(); }, 300);

    window.addEventListener('sirkula:themechange', () => {
      updateTileLayer();
    });
  }

  function bindMapControls() {
    const filterTabs = document.getElementById('map-filter-tabs');
    if (filterTabs) {
      filterTabs.querySelectorAll('button[data-filter]').forEach(btn => {
        btn.addEventListener('click', () => {
          filterTabs.querySelectorAll('button').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          activeFilter = btn.getAttribute('data-filter');
          renderMarkers();
          renderNodeList();
        });
      });
    }

    const topoBtn = document.getElementById('btn-toggle-topology');
    if (topoBtn) {
      topoBtn.addEventListener('click', () => {
        showTopology = !showTopology;
        topoBtn.classList.toggle('active', showTopology);
        renderTopologyLines();
      });
    }

    const focusBtn = document.getElementById('btn-focus-uns');
    if (focusBtn) {
      focusBtn.addEventListener('click', () => {
        if (mapInstance) {
          mapInstance.flyTo(UNS_CENTER, DEFAULT_ZOOM, { duration: 0.6 });
        }
      });
    }
  }

  window.SirkulaMap = {
    initMap,
    renderMarkers,
    selectNode,
    invalidateSize: () => {
      if (mapInstance) {
        mapInstance.invalidateSize();
      }
    }
  };

  if (document.getElementById('map-view') && window.SirkulaLayout) {
    window.SirkulaLayout.renderShell('peta', 'Peta Jaringan');
    initMap('map-view');
    bindMapControls();
  }
})();
