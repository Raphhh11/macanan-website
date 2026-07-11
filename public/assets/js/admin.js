// ============================================================
// LOGIKA ADMIN PANEL GENERIK
// ============================================================

let currentTable = null;

async function requireLogin() {
  const { data } = await supabaseClient.auth.getSession();
  if (!data.session) {
    window.location.href = "/admin/login";
    return false;
  }
  document.getElementById("user-email").textContent = data.session.user.email;
  return true;
}

function renderTabs() {
  const tabsEl = document.getElementById("tabs");
  tabsEl.innerHTML = Object.entries(TABLE_CONFIGS).map(([key, cfg]) => `
    <button data-table="${key}" class="admin-tab-btn">${cfg.label}</button>`).join("");

  tabsEl.querySelectorAll(".admin-tab-btn").forEach(btn => {
    btn.addEventListener("click", () => loadTable(btn.dataset.table));
  });
}

async function loadTable(tableName) {
  currentTable = tableName;
  const cfg = TABLE_CONFIGS[tableName];
  document.querySelectorAll(".admin-tab-btn").forEach(b => {
    b.classList.toggle("active", b.dataset.table === tableName);
  });

  document.getElementById("table-title").textContent = cfg.label;
  document.getElementById("add-btn").classList.toggle("hidden", !!cfg.singleRow);

  const listEl = document.getElementById("list-container");
  showLoading(listEl, "Memuat data...");

  let query = supabaseClient.from(tableName).select("*");
  if (cfg.orderBy) query = query.order(cfg.orderBy, { ascending: cfg.orderDirection !== "desc" });
  const { data, error } = await query;

  if (error) return showError(listEl, "Gagal memuat data: " + error.message);
  if (!data || data.length === 0) return showEmpty(listEl, 'Belum ada data. Klik "+ Tambah" untuk mengisi.');

  listEl.innerHTML = data.map(row => `
    <div class="admin-list-row">
      <span>${escapeHtml(row[cfg.titleField] || "(tanpa judul)")}</span>
      <div class="d-flex gap-3">
        <button class="btn btn-link btn-sm" onclick='openForm(${JSON.stringify(row)})'>Edit</button>
        ${cfg.singleRow ? "" : `<button class="btn btn-link btn-sm text-danger" onclick="deleteRow(${row.id})">Hapus</button>`}
      </div>
    </div>`).join("");
}

function openForm(existingRow = null) {
  const cfg = TABLE_CONFIGS[currentTable];
  const modal = document.getElementById("form-modal");
  const fieldsEl = document.getElementById("form-fields");

  fieldsEl.innerHTML = cfg.fields.map(f => {
    const value = existingRow ? (existingRow[f.name] ?? "") : "";
    if (f.type === "textarea") {
      return `<div class="admin-field"><label>${f.label}</label><textarea name="${f.name}" rows="4">${escapeHtml(value)}</textarea></div>`;
    }
    if (f.type === "select") {
      return `<div class="admin-field"><label>${f.label}</label>
        <select name="${f.name}">${f.options.map(o => `<option value="${o}" ${o === value ? "selected" : ""}>${o}</option>`).join("")}</select>
      </div>`;
    }
    return `<div class="admin-field"><label>${f.label}</label>
      <input type="${f.type}" ${f.type === "number" ? 'step="any"' : ""} name="${f.name}" value="${escapeHtml(value)}" />
    </div>`;
  }).join("");

  document.getElementById("form-modal-title").textContent = existingRow ? `Edit ${cfg.label}` : `Tambah ${cfg.label}`;
  modal.dataset.rowId = existingRow ? existingRow.id : "";
  modal.classList.remove("hidden");
}

function closeForm() {
  document.getElementById("form-modal").classList.add("hidden");
}

async function submitForm(e) {
  e.preventDefault();
  const cfg = TABLE_CONFIGS[currentTable];
  const modal = document.getElementById("form-modal");
  const formData = new FormData(e.target);
  const payload = {};
  cfg.fields.forEach(f => {
    let value = formData.get(f.name);
    if (f.type === "number") value = value === "" ? null : Number(value);
    payload[f.name] = value;
  });

  const rowId = modal.dataset.rowId;
  let result;
  if (cfg.singleRow) {
    result = await supabaseClient.from(currentTable).update(payload).eq("id", 1);
  } else if (rowId) {
    result = await supabaseClient.from(currentTable).update(payload).eq("id", rowId);
  } else {
    result = await supabaseClient.from(currentTable).insert(payload);
  }

  if (result.error) {
    alert("Gagal menyimpan: " + result.error.message);
    return;
  }
  closeForm();
  loadTable(currentTable);
}

async function deleteRow(id) {
  if (!confirm("Yakin ingin menghapus data ini? Tindakan ini tidak bisa dibatalkan.")) return;
  const { error } = await supabaseClient.from(currentTable).delete().eq("id", id);
  if (error) { alert("Gagal menghapus: " + error.message); return; }
  loadTable(currentTable);
}

async function logout() {
  await supabaseClient.auth.signOut();
  window.location.href = "/admin/login";
}

(async () => {
  const ok = await requireLogin();
  if (!ok) return;
  renderTabs();
  const firstTable = Object.keys(TABLE_CONFIGS)[0];
  loadTable(firstTable);

  document.getElementById("add-btn").addEventListener("click", () => openForm(null));
  document.getElementById("form-cancel").addEventListener("click", closeForm);
  document.getElementById("form-modal-form").addEventListener("submit", submitForm);
  document.getElementById("logout-btn").addEventListener("click", logout);
})();
