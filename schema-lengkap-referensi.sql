-- ============================================================
-- SKEMA DATABASE — Website Profil Dusun Macanan, Magelang
-- Jalankan file ini di Supabase Dashboard > SQL Editor > New query
-- ============================================================

-- 1. PROFIL DUSUN (hanya 1 baris, disimpan sebagai tabel supaya mudah diedit lewat admin panel)
create table profil (
  id int primary key default 1,
  nama_dusun text not null,
  tagline text,
  sejarah text,
  hero_image_url text,
  alamat text,
  peta_query text, -- teks pencarian untuk Google Maps, misal "Dusun Macanan, Bligo, Magelang"
  pusat_lat double precision, -- koordinat pusat peta interaktif (Leaflet)
  pusat_lng double precision,
  struktur_url text, -- URL gambar bagan struktur organisasi pemerintahan desa
  updated_at timestamptz default now(),
  constraint hanya_satu_baris check (id = 1)
);

insert into profil (id, nama_dusun, tagline, sejarah, hero_image_url, alamat, peta_query, pusat_lat, pusat_lng, struktur_url)
values (
  1,
  'Dusun Macanan',
  '[Contoh tagline — ganti dengan tagline dusun yang sebenarnya]',
  '[Contoh: Tulis di sini sejarah dan asal-usul Dusun Macanan setelah data wawancara terkumpul. Bagian ini akan tampil di halaman Profil & Sejarah.]',
  'https://placehold.co/1600x900/2f8f5b/ffffff?text=Foto+Dusun+Macanan',
  '[Contoh: Dusun Macanan, Desa Bligo, Kecamatan Ngluwar, Kabupaten Magelang, Jawa Tengah]',
  'Dusun Macanan, Bligo, Ngluwar, Magelang, Jawa Tengah',
  -7.6560,
  110.2808,
  '/assets/img/struktur-organisasi.png'
);

-- 2. PERANGKAT DUSUN (Kepala Dusun, RT/RW)
create table perangkat (
  id bigint generated always as identity primary key,
  nama text not null,
  jabatan text not null,
  foto_url text,
  urutan int default 0,
  created_at timestamptz default now()
);

insert into perangkat (nama, jabatan, foto_url, urutan) values
  ('[Nama Kepala Dusun]', 'Kepala Dusun', 'https://placehold.co/400x400/2f8f5b/ffffff?text=Foto', 1),
  ('[Nama Ketua RW]', 'Ketua RW 01', 'https://placehold.co/400x400/2f8f5b/ffffff?text=Foto', 2),
  ('[Nama Ketua RT]', 'Ketua RT 01', 'https://placehold.co/400x400/2f8f5b/ffffff?text=Foto', 3);

-- 3. UMKM / POTENSI DESA
create table umkm (
  id bigint generated always as identity primary key,
  nama_usaha text not null,
  deskripsi text,
  kontak text,
  foto_url text,
  created_at timestamptz default now()
);

insert into umkm (nama_usaha, deskripsi, kontak, foto_url) values
  ('[Contoh: Keripik Singkong Bu ___]', '[Deskripsi singkat produk UMKM, ganti setelah survei]', '[No. HP/WA]', 'https://placehold.co/600x400/2f8f5b/ffffff?text=Foto+UMKM'),
  ('[Contoh UMKM lain]', '[Deskripsi singkat]', '[No. HP/WA]', 'https://placehold.co/600x400/2f8f5b/ffffff?text=Foto+UMKM');

-- 4. DATA DEMOGRAFIS (statistik ringkas, ditampilkan sebagai angka besar)
create table demografi (
  id bigint generated always as identity primary key,
  label text not null,
  nilai text not null,
  keterangan text,
  urutan int default 0
);

insert into demografi (label, nilai, keterangan, urutan) values
  ('Jumlah Penduduk', '[isi angka]', 'jiwa', 1),
  ('Jumlah KK', '[isi angka]', 'kepala keluarga', 2),
  ('Jumlah RT', '[isi angka]', 'RT', 3),
  ('Luas Wilayah', '[isi angka]', 'hektar', 4);

-- 5. GALERI FOTO (fasilitas umum & kegiatan warga)
create table galeri (
  id bigint generated always as identity primary key,
  judul text,
  foto_url text not null,
  kategori text default 'Kegiatan',
  created_at timestamptz default now()
);

insert into galeri (judul, foto_url, kategori) values
  ('[Contoh: Balai Dusun]', 'https://placehold.co/800x600/2f8f5b/ffffff?text=Foto+Fasilitas', 'Fasilitas'),
  ('[Contoh: Kerja Bakti Warga]', 'https://placehold.co/800x600/2f8f5b/ffffff?text=Foto+Kegiatan', 'Kegiatan');

-- 6. AKTIVITAS / ARTIKEL (bisa terus bertambah tanpa perlu file HTML baru)
create table aktivitas (
  id bigint generated always as identity primary key,
  slug text not null unique,
  judul text not null,
  tanggal date not null default current_date,
  kategori text not null default 'Lainnya' check (kategori in ('Kerja Bakti', 'Sosial', 'Pendidikan', 'Kesehatan', 'Keagamaan', 'Ekonomi', 'Lainnya')),
  ringkasan text,
  isi text,
  foto_urls text, -- pisahkan banyak URL dengan koma
  status text not null default 'aktif' check (status in ('aktif', 'nonaktif')),
  created_at timestamptz default now()
);

insert into aktivitas (slug, judul, tanggal, kategori, ringkasan, isi, foto_urls, status) values
  (
    'contoh-artikel-pertama',
    '[Contoh Judul: Kerja Bakti Bersih Dusun]',
    current_date,
    'Kerja Bakti',
    '[Ringkasan 1-2 kalimat yang muncul di halaman daftar aktivitas]',
    '[Isi lengkap artikel. Ganti dengan cerita aktivitas dusun yang sebenarnya setelah data terkumpul. Bagian ini bisa ditulis cukup panjang.]',
    'https://placehold.co/800x600/2f8f5b/ffffff?text=Foto+Aktivitas',
    'aktif'
  );

-- 7. LOKASI PETA (marker untuk peta interaktif Leaflet)
create table lokasi_peta (
  id bigint generated always as identity primary key,
  nama text not null,
  kategori text not null default 'Lainnya' check (kategori in ('Posko KKN', 'Pendidikan', 'Kesehatan', 'Ekonomi/UMKM', 'Fasilitas Umum', 'Lainnya')),
  lat double precision not null,
  lng double precision not null,
  deskripsi text,
  foto_url text,
  kontak text,
  bobot numeric default 1, -- dipakai untuk heatmap; contoh: perkiraan jumlah warga/aktivitas di titik ini
  created_at timestamptz default now()
);

insert into lokasi_peta (nama, kategori, lat, lng, deskripsi, bobot) values
  ('[Contoh] Posko KKN', 'Posko KKN', -7.6560, 110.2808, 'Titik contoh — ganti dengan koordinat asli posko KKN.', 3),
  ('[Contoh] Balai Dusun Macanan', 'Fasilitas Umum', -7.6552, 110.2816, 'Titik contoh — ganti dengan koordinat asli balai dusun.', 5),
  ('[Contoh] SD Setempat', 'Pendidikan', -7.6568, 110.2800, 'Titik contoh — ganti dengan koordinat asli sekolah.', 4),
  ('[Contoh] Puskesmas Pembantu', 'Kesehatan', -7.6545, 110.2795, 'Titik contoh — ganti dengan koordinat asli fasilitas kesehatan.', 2),
  ('[Contoh] UMKM Keripik', 'Ekonomi/UMKM', -7.6575, 110.2820, 'Titik contoh — ganti dengan koordinat asli UMKM.', 2);

-- 8. BATAS WILAYAH (polygon GeoJSON, dibuat manual lewat geojson.io lalu ditempel di admin panel)
create table batas_wilayah (
  id bigint generated always as identity primary key,
  nama text not null,
  geojson text not null, -- tempel hasil export dari geojson.io (harus GeoJSON Polygon/MultiPolygon valid)
  warna text default '#2f8f5b',
  created_at timestamptz default now()
);

insert into batas_wilayah (nama, geojson, warna) values (
  '[Contoh] Batas Dusun Macanan — GANTI dengan data asli',
  '{"type":"Polygon","coordinates":[[[110.2780,-7.6535],[110.2840,-7.6535],[110.2840,-7.6590],[110.2780,-7.6590],[110.2780,-7.6535]]]}',
  '#2f8f5b'
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- Publik hanya boleh MEMBACA data. Menambah/mengedit/menghapus 
-- hanya boleh dilakukan lewat admin panel yang sudah login.
-- ============================================================

alter table profil enable row level security;
alter table perangkat enable row level security;
alter table umkm enable row level security;
alter table demografi enable row level security;
alter table galeri enable row level security;
alter table aktivitas enable row level security;
alter table lokasi_peta enable row level security;
alter table batas_wilayah enable row level security;

-- Semua orang (publik) boleh baca
create policy "Publik boleh baca profil" on profil for select using (true);
create policy "Publik boleh baca perangkat" on perangkat for select using (true);
create policy "Publik boleh baca umkm" on umkm for select using (true);
create policy "Publik boleh baca demografi" on demografi for select using (true);
create policy "Publik boleh baca galeri" on galeri for select using (true);
create policy "Publik boleh baca aktivitas aktif" on aktivitas for select using (true);
create policy "Publik boleh baca lokasi peta" on lokasi_peta for select using (true);
create policy "Publik boleh baca batas wilayah" on batas_wilayah for select using (true);

-- Hanya user yang sudah login (admin/tim KKN) yang boleh tambah/edit/hapus
create policy "Admin boleh kelola profil" on profil for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admin boleh kelola perangkat" on perangkat for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admin boleh kelola umkm" on umkm for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admin boleh kelola demografi" on demografi for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admin boleh kelola galeri" on galeri for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admin boleh kelola aktivitas" on aktivitas for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admin boleh kelola lokasi peta" on lokasi_peta for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admin boleh kelola batas wilayah" on batas_wilayah for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ============================================================
-- SELESAI. Langkah berikutnya:
-- 1. Buka Authentication > Users di Supabase Dashboard
-- 2. Buat 1 user admin (email + password) untuk login ke admin panel
-- 3. Salin Project URL dan anon public key dari Settings > API
--    ke file js/config.js
-- ============================================================
