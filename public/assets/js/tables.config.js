// ============================================================
// KONFIGURASI TABEL UNTUK ADMIN PANEL
// Tambah tabel baru cukup tambah satu blok di sini.
// ============================================================

const TABLE_CONFIGS = {
  profil: {
    label: "Profil Dusun",
    singleRow: true,
    titleField: "nama_dusun",
    fields: [
      { name: "nama_dusun", label: "Nama Dusun", type: "text" },
      { name: "tagline", label: "Tagline", type: "text" },
      { name: "sejarah", label: "Sejarah (satu paragraf per baris)", type: "textarea" },
      { name: "hero_image_url", label: "URL Foto Utama", type: "text" },
      { name: "alamat", label: "Alamat", type: "text" },
      { name: "peta_query", label: "Lokasi untuk Peta (contoh: Dusun Macanan, Bligo, Magelang)", type: "text" },
      { name: "pusat_lat", label: "Latitude pusat peta interaktif (contoh: -7.4034)", type: "number" },
      { name: "pusat_lng", label: "Longitude pusat peta interaktif (contoh: 110.1553)", type: "number" },
      { name: "struktur_url", label: "URL Gambar Bagan Struktur Organisasi Pemerintahan", type: "text" },
    ],
  },
  perangkat: {
    label: "Struktur Pemerintahan",
    titleField: "nama",
    orderBy: "urutan",
    fields: [
      { name: "nama", label: "Nama", type: "text" },
      { name: "jabatan", label: "Jabatan", type: "text" },
      { name: "foto_url", label: "URL Foto", type: "text" },
      { name: "urutan", label: "Urutan Tampil", type: "number" },
    ],
  },
  umkm: {
    label: "Potensi & UMKM",
    titleField: "nama_usaha",
    fields: [
      { name: "nama_usaha", label: "Nama Usaha", type: "text" },
      { name: "deskripsi", label: "Deskripsi", type: "textarea" },
      { name: "kontak", label: "Kontak (No. HP/WA)", type: "text" },
      { name: "foto_url", label: "URL Foto", type: "text" },
    ],
  },
  demografi: {
    label: "Data Demografis",
    titleField: "label",
    orderBy: "urutan",
    fields: [
      { name: "label", label: "Label (misal: Jumlah Penduduk)", type: "text" },
      { name: "nilai", label: "Nilai/Angka", type: "text" },
      { name: "keterangan", label: "Satuan (misal: jiwa)", type: "text" },
      { name: "urutan", label: "Urutan Tampil", type: "number" },
    ],
  },
  galeri: {
    label: "Galeri Foto",
    titleField: "judul",
    fields: [
      { name: "judul", label: "Judul Foto", type: "text" },
      { name: "foto_url", label: "URL Foto", type: "text" },
      { name: "kategori", label: "Kategori", type: "select", options: ["Fasilitas", "Kegiatan"] },
    ],
  },
  aktivitas: {
    label: "Aktivitas / Artikel",
    titleField: "judul",
    orderBy: "tanggal",
    orderDirection: "desc",
    fields: [
      { name: "judul", label: "Judul Artikel", type: "text" },
      { name: "slug", label: "Slug URL (huruf kecil, pakai tanda -, tanpa spasi)", type: "text" },
      { name: "tanggal", label: "Tanggal", type: "date" },
      { name: "kategori", label: "Kategori", type: "select",
        options: ["Kerja Bakti", "Sosial", "Pendidikan", "Kesehatan", "Keagamaan", "Ekonomi", "Lainnya"] },
      { name: "ringkasan", label: "Ringkasan Singkat", type: "textarea" },
      { name: "isi", label: "Isi Lengkap (satu paragraf per baris)", type: "textarea" },
      { name: "foto_urls", label: "URL Foto (pisahkan dengan koma jika lebih dari satu)", type: "textarea" },
      { name: "status", label: "Status", type: "select", options: ["aktif", "nonaktif"] },
    ],
  },
  lokasi_peta: {
    label: "Lokasi Peta (Marker)",
    titleField: "nama",
    fields: [
      { name: "nama", label: "Nama Lokasi", type: "text" },
      { name: "kategori", label: "Kategori", type: "select",
        options: ["Posko KKN", "Pendidikan", "Kesehatan", "Ekonomi/UMKM", "Fasilitas Umum", "Lainnya"] },
      { name: "lat", label: "Latitude", type: "number" },
      { name: "lng", label: "Longitude", type: "number" },
      { name: "deskripsi", label: "Deskripsi", type: "textarea" },
      { name: "foto_url", label: "URL Foto", type: "text" },
      { name: "kontak", label: "Kontak (opsional)", type: "text" },
      { name: "bobot", label: "Bobot untuk Heatmap", type: "number" },
    ],
  },
  batas_wilayah: {
    label: "Batas Wilayah (Polygon)",
    titleField: "nama",
    fields: [
      { name: "nama", label: "Nama Wilayah", type: "text" },
      { name: "geojson", label: "GeoJSON (dari geojson.io)", type: "textarea" },
      { name: "warna", label: "Warna Garis (kode HEX)", type: "text" },
    ],
  },
};
