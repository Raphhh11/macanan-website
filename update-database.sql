-- ============================================================
-- SCRIPT UPDATE — jalankan di Supabase SQL Editor > New query
-- Ini untuk database yang SUDAH ADA (bukan schema.sql dari nol),
-- supaya data lama ikut ter-update sesuai revisi terbaru.
-- ============================================================

-- 1. Tambah kolom baru yang belum ada di database kamu
alter table profil add column if not exists struktur_url text;

-- 2. Update data profil: alamat, lokasi peta, dan gambar bagan struktur
update profil set
  alamat = '[Contoh: Dusun Macanan, Desa Bligo, Kecamatan Ngluwar, Kabupaten Magelang, Jawa Tengah]',
  peta_query = 'Dusun Macanan, Bligo, Ngluwar, Magelang, Jawa Tengah',
  pusat_lat = -7.6560,
  pusat_lng = 110.2808,
  struktur_url = '/assets/img/struktur-organisasi.png'
where id = 1;

-- 3. Update koordinat 5 marker contoh ke area Ngluwar/Bligo yang benar
update lokasi_peta set lat = -7.6560, lng = 110.2808 where nama = '[Contoh] Posko KKN';
update lokasi_peta set lat = -7.6552, lng = 110.2816 where nama = '[Contoh] Balai Dusun Macanan';
update lokasi_peta set lat = -7.6568, lng = 110.2800 where nama = '[Contoh] SD Setempat';
update lokasi_peta set lat = -7.6545, lng = 110.2795 where nama = '[Contoh] Puskesmas Pembantu';
update lokasi_peta set lat = -7.6575, lng = 110.2820 where nama = '[Contoh] UMKM Keripik';

-- 4. Update polygon batas wilayah contoh ke area Ngluwar/Bligo + warna hijau baru
update batas_wilayah set
  geojson = '{"type":"Polygon","coordinates":[[[110.2780,-7.6535],[110.2840,-7.6535],[110.2840,-7.6590],[110.2780,-7.6590],[110.2780,-7.6535]]]}',
  warna = '#2f8f5b'
where nama like '[Contoh]%';

-- ============================================================
-- SELESAI. Setelah ini jalan, refresh website kamu — alamat,
-- peta, dan bagan struktur organisasi harusnya sudah ter-update.
-- ============================================================
