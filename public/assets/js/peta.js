// ============================================================
// PETA INTERAKTIF — Dusun Macanan
// Semua fitur: base layer switcher, marker + cluster + filter
// kategori, search, popup, heatmap, polygon batas wilayah,
// routing, pengukuran jarak/luas, fullscreen, legenda, reset view.
// ============================================================

const KATEGORI_STYLE = {
  "Posko KKN":      { color: "#c0392b", emoji: "🏕️" },
  "Pendidikan":     { color: "#2980b9", emoji: "🏫" },
  "Kesehatan":      { color: "#16a085", emoji: "⚕️" },
  "Ekonomi/UMKM":   { color: "#b8860b", emoji: "🛒" },
  "Fasilitas Umum": { color: "#8e44ad", emoji: "🏛️" },
  "Lainnya":        { color: "#7f8c8d", emoji: "📍" },
};

const DEFAULT_CENTER = [-7.6560, 110.2808]; // fallback kalau data profil belum ada (kec. Ngluwar, Magelang)
const DEFAULT_ZOOM = 15;

let map;
let initialView = { center: DEFAULT_CENTER, zoom: DEFAULT_ZOOM };
let markersData = []; // {id, nama, kategori, lat, lng, deskripsi, foto_url, kontak, bobot}
let categoryLayers = {}; // kategori -> L.markerClusterGroup
let heatLayer = null;
let routingControl = null;

function buildIcon(kategori) {
  const style = KATEGORI_STYLE[kategori] || KATEGORI_STYLE["Lainnya"];
  return L.divIcon({
    className: "",
    html: `<div style="background:${style.color};width:28px;height:28px;border-radius:50%;
             display:flex;align-items:center;justify-content:center;font-size:14px;
             border:2px solid white;box-shadow:0 1px 3px rgba(0,0,0,0.4)">${style.emoji}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -16],
  });
}

function popupHtml(row) {
  const foto = row.foto_url ? `<img src="${row.foto_url}" alt="${escapeHtml(row.nama)}" style="width:100%;border-radius:4px;margin-bottom:6px;" />` : "";
  const kontak = row.kontak ? `<p style="font-size:12px;color:#a9772f;margin-top:4px;">Kontak: ${escapeHtml(row.kontak)}</p>` : "";
  return `
    <div style="min-width:180px;">
      ${foto}
      <strong style="color:#5b4636;">${escapeHtml(row.nama)}</strong>
      <p style="font-size:12px;color:#8a8072;margin:2px 0;">${escapeHtml(row.kategori)}</p>
      <p style="font-size:13px;">${escapeHtml(row.deskripsi || "")}</p>
      ${kontak}
    </div>`;
}

async function initMap() {
  // 1. Ambil titik pusat dari tabel profil (kalau ada)
  try {
    const { data } = await supabaseClient.from("profil").select("pusat_lat, pusat_lng").eq("id", 1).single();
    if (data && data.pusat_lat && data.pusat_lng) {
      initialView.center = [data.pusat_lat, data.pusat_lng];
    }
  } catch (e) { /* pakai default kalau gagal */ }

  map = L.map("map", { fullscreenControl: true, zoomControl: false }).setView(initialView.center, initialView.zoom);
  L.control.zoom({ position: "topright" }).addTo(map);

  // 2. Base layer (semuanya gratis, tanpa API key)
  // Voyager jadi default: lebih bersih & modern dibanding OSM klasik yang warnanya ramai
  const voyager = L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
    attribution: "&copy; OpenStreetMap contributors &copy; CARTO",
    maxZoom: 20,
  }).addTo(map);

  const osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
  });

  const satelit = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
    attribution: "Tiles &copy; Esri",
  });

  const topo = L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors, SRTM | &copy; OpenTopoMap",
  });

  L.control.layers(
    { "Bersih (default)": voyager, "Jalan (OSM)": osm, "Satelit": satelit, "Topografi": topo },
    {},
    { collapsed: true, position: "topright" }
  ).addTo(map);

  // 3. Kontrol tambahan
  L.control.measure({
    position: "topleft",
    primaryLengthUnit: "meters",
    primaryAreaUnit: "sqmeters",
    activeColor: "#a9772f",
    completedColor: "#5b4636",
  }).addTo(map);

  addResetViewControl();

  // 4. Muat data (marker, batas wilayah) secara paralel
  await Promise.all([loadMarkers(), loadBatasWilayah()]);

  // 5. Legenda (dibuat setelah tahu kategori mana yang benar-benar dipakai)
  addLegendControl();
}

function addResetViewControl() {
  const ResetControl = L.Control.extend({
    options: { position: "topleft" },
    onAdd: function () {
      const btn = L.DomUtil.create("button", "leaflet-bar");
      btn.innerHTML = "⟲";
      btn.title = "Reset tampilan peta";
      btn.style.cssText = "width:34px;height:34px;font-size:16px;background:white;cursor:pointer;";
      btn.onclick = () => map.setView(initialView.center, initialView.zoom);
      return btn;
    },
  });
  map.addControl(new ResetControl());
}

function addLegendControl() {
  const usedCategories = [...new Set(markersData.map(m => m.kategori))];
  if (usedCategories.length === 0) return;

  const LegendControl = L.Control.extend({
    options: { position: "bottomright" },
    onAdd: function () {
      const div = L.DomUtil.create("div", "leaflet-bar legend-box");
      div.style.cssText = "background:white;padding:10px 12px;font-size:12px;line-height:1.7;";
      div.innerHTML = "<strong>Legenda</strong><br/>" + usedCategories.map(k => {
        const style = KATEGORI_STYLE[k] || KATEGORI_STYLE["Lainnya"];
        return `<span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:${style.color};margin-right:6px;"></span>${k}`;
      }).join("<br/>");
      return div;
    },
  });
  map.addControl(new LegendControl());
}

async function loadMarkers() {
  const statusEl = document.getElementById("map-status");
  const { data, error } = await supabaseClient.from("lokasi_peta").select("*");

  if (error) {
    statusEl.classList.remove("hidden");
    statusEl.textContent = "Data lokasi belum bisa dimuat. Peta dasar tetap bisa dipakai.";
    return;
  }
  if (!data || data.length === 0) {
    statusEl.classList.remove("hidden");
    statusEl.textContent = "Belum ada titik lokasi. Tambahkan lewat admin panel (tab Lokasi Peta).";
    return;
  }

  markersData = data;

  // Kelompokkan marker per kategori supaya bisa difilter lewat layer control
  const overlays = {};
  Object.keys(KATEGORI_STYLE).forEach(kategori => {
    const rowsInCategory = data.filter(r => r.kategori === kategori);
    if (rowsInCategory.length === 0) return;

    const clusterGroup = L.markerClusterGroup({ maxClusterRadius: 40 });
    rowsInCategory.forEach(row => {
      const marker = L.marker([row.lat, row.lng], { icon: buildIcon(row.kategori) });
      marker.bindPopup(popupHtml(row));
      marker._lokasiId = row.id;
      clusterGroup.addLayer(marker);
    });
    clusterGroup.addTo(map);
    categoryLayers[kategori] = clusterGroup;
    overlays[`${KATEGORI_STYLE[kategori].emoji} ${kategori}`] = clusterGroup;
  });

  L.control.layers(null, overlays, { collapsed: true, position: "topright" }).addTo(map);

  // Isi dropdown rute
  const fromSelect = document.getElementById("route-from");
  const toSelect = document.getElementById("route-to");
  data.forEach(row => {
    const opt1 = document.createElement("option");
    opt1.value = row.id; opt1.textContent = row.nama;
    fromSelect.appendChild(opt1);
    const opt2 = opt1.cloneNode(true);
    toSelect.appendChild(opt2);
  });

  // Siapkan layer heatmap (belum ditambahkan ke peta sampai toggle dinyalakan)
  const heatPoints = data.map(row => [row.lat, row.lng, Number(row.bobot) || 1]);
  heatLayer = L.heatLayer(heatPoints, { radius: 30, blur: 20, maxZoom: 17 });
}

async function loadBatasWilayah() {
  const { data, error } = await supabaseClient.from("batas_wilayah").select("*");
  if (error || !data || data.length === 0) return;

  data.forEach(row => {
    try {
      const geojson = JSON.parse(row.geojson);
      L.geoJSON(geojson, {
        style: { color: row.warna || "#56693f", weight: 2, fillOpacity: 0.08 },
      }).bindPopup(`<strong>${escapeHtml(row.nama)}</strong>`).addTo(map);
    } catch (e) {
      console.warn(`GeoJSON tidak valid untuk "${row.nama}":`, e);
    }
  });
}

// --- Search sederhana (client-side, cocokkan nama marker) -----------------
document.getElementById("search-input").addEventListener("input", (e) => {
  const q = e.target.value.trim().toLowerCase();
  if (q.length < 2) return;
  const match = markersData.find(r => r.nama.toLowerCase().includes(q));
  if (match) {
    map.setView([match.lat, match.lng], 17);
    Object.values(categoryLayers).forEach(layer => {
      layer.eachLayer(marker => {
        if (marker._lokasiId === match.id) marker.openPopup();
      });
    });
  }
});

// --- Heatmap toggle ---------------------------------------------------------
document.getElementById("heatmap-toggle").addEventListener("change", (e) => {
  if (!heatLayer) return;
  if (e.target.checked) heatLayer.addTo(map);
  else map.removeLayer(heatLayer);
});

// --- Routing ------------------------------------------------------------------
document.getElementById("route-btn").addEventListener("click", () => {
  const fromId = Number(document.getElementById("route-from").value);
  const toId = Number(document.getElementById("route-to").value);
  const fromRow = markersData.find(r => r.id === fromId);
  const toRow = markersData.find(r => r.id === toId);

  if (!fromRow || !toRow) {
    alert("Pilih lokasi asal dan tujuan terlebih dahulu.");
    return;
  }
  if (routingControl) map.removeControl(routingControl);

  routingControl = L.Routing.control({
    waypoints: [L.latLng(fromRow.lat, fromRow.lng), L.latLng(toRow.lat, toRow.lng)],
    router: L.Routing.osrmv1({ serviceUrl: "https://router.project-osrm.org/route/v1" }),
    routeWhileDragging: false,
    addWaypoints: false,
    show: true,
    lineOptions: { styles: [{ color: "#a9772f", weight: 5 }] },
  }).addTo(map);
});

document.getElementById("route-clear-btn").addEventListener("click", () => {
  if (routingControl) {
    map.removeControl(routingControl);
    routingControl = null;
  }
});

// --- init ---
initMap();
