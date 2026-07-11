// ============================================================
// HELPER BERSAMA — dipakai di semua halaman publik
// ============================================================

function showLoading(container, message = "Memuat data...") {
  container.innerHTML = `<div class="state-box">${escapeHtml(message)}</div>`;
}

function showEmpty(container, message = "Belum ada data untuk ditampilkan.") {
  container.innerHTML = `<div class="state-box">${escapeHtml(message)}</div>`;
}

function showError(container, message = "Data belum bisa dimuat. Coba muat ulang halaman ini.") {
  container.innerHTML = `<div class="state-box">${escapeHtml(message)}</div>`;
}

function escapeHtml(str) {
  if (str === null || str === undefined) return "";
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function formatTanggal(isoDate) {
  if (!isoDate) return "";
  const d = new Date(isoDate);
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

function splitFotoUrls(fotoUrls) {
  if (!fotoUrls) return [];
  return fotoUrls.split(",").map(s => s.trim()).filter(Boolean);
}

function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}
