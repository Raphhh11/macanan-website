# Website Profil Dusun Macanan — Versi Astro (BizLand theme)

Website ini dibangun dengan **Astro**, memakai template gratis **BizLand**
(BootstrapMade) yang sudah direstyle jadi tema dusun, dan tersambung ke
**Supabase** sebagai database + panel admin (sama seperti versi sebelumnya,
sekarang dibungkus rapi dalam struktur Astro).

Sudah dicoba di-build lokal dan berhasil tanpa error (`astro build` -> 10
halaman ter-generate).

## Yang kamu butuhkan sebelum mulai

1. **Node.js** versi 18 ke atas — cek dengan `node -v` di terminal. Kalau
   belum ada, install dari [nodejs.org](https://nodejs.org) (pilih versi LTS).
2. **Akun Supabase gratis** — [supabase.com](https://supabase.com), tanpa kartu kredit.
3. Editor kode seperti VS Code (opsional tapi memudahkan).

## Langkah menjalankan project

### 1. Install dependency

Buka terminal di folder project ini, jalankan:

```bash
npm install
```

Ini akan mengunduh Astro dan dependency lain (sekali saja, hasilnya masuk ke
folder `node_modules`, tidak perlu di-commit/upload).

### 2. Siapkan database Supabase

1. Buat project baru di [supabase.com](https://supabase.com)
2. Buka **SQL Editor > New query**, tempel seluruh isi `sql/schema.sql`, klik **Run**
   — ini otomatis membuat semua tabel + data contoh
3. Buka **Authentication > Users > Add user**, buat 1 akun (email + password)
   khusus untuk login ke admin panel
4. Buka **Settings > API**, salin `Project URL` dan `anon public key`

### 3. Isi kredensial Supabase

Buka file `public/assets/js/config.js`, ganti dua baris ini dengan nilai dari langkah 2 tadi:

```js
const SUPABASE_URL = "ISI_URL_SUPABASE_KAMU_DI_SINI";
const SUPABASE_ANON_KEY = "ISI_ANON_KEY_SUPABASE_KAMU_DI_SINI";
```

### 4. Jalankan di komputer kamu (mode pengembangan)

```bash
npm run dev
```

Buka `http://localhost:4321` di browser. Setiap kali kamu simpan perubahan
file, halaman otomatis refresh.

### 5. Build untuk production

```bash
npm run build
```

Hasilnya masuk ke folder `dist/` — inilah yang nanti di-upload ke hosting.
(Sudah dicoba di sini dan berhasil tanpa error.)

### 6. Deploy ke Netlify/Vercel (gratis)

- **Termudah:** drag & drop folder `dist/` ke [app.netlify.com/drop](https://app.netlify.com/drop)
- **Direkomendasikan untuk jangka panjang:** hubungkan repo GitHub project ini
  ke Netlify/Vercel, set **Build command**: `npm run build`, **Publish
  directory**: `dist` — supaya setiap kali kamu update kode dan push ke
  GitHub, website otomatis rebuild sendiri

### 7. Login admin & isi konten asli

Buka `namawebsite.com/admin/login`, login pakai akun dari langkah 2.3, lalu
mulai ganti data contoh (`[Contoh] ...`) dengan data asli hasil survei dan
wawancara.

## Struktur folder

```
dusun-astro/
├── package.json / astro.config.mjs
├── public/
│   └── assets/           → CSS, JS, gambar (bawaan BizLand + custom)
│       ├── css/main.css       → CSS asli BizLand (jangan diubah, biar gampang update)
│       ├── css/custom.css     → override warna & style tambahan punya kita
│       ├── js/config.js       → isi kredensial Supabase di sini
│       ├── js/dusun.js        → helper bersama (format tanggal, dll)
│       ├── js/peta.js         → logika peta interaktif Leaflet
│       ├── js/admin.js        → logika CRUD admin panel
│       └── js/tables.config.js → konfigurasi field per tabel database
├── src/
│   ├── layouts/BaseLayout.astro → head, header/nav, footer bersama
│   └── pages/
│       ├── index.astro        → Beranda
│       ├── profil.astro       → Profil & Sejarah + Struktur Pemerintahan
│       ├── umkm.astro         → Potensi & UMKM
│       ├── aktivitas.astro    → Daftar aktivitas (filter kategori)
│       ├── artikel.astro      → Detail 1 aktivitas (?slug=...)
│       ├── peta.astro         → Peta interaktif Leaflet
│       ├── galeri.astro       → Galeri foto (lightbox)
│       ├── kontak.astro       → Kontak
│       └── admin/
│           ├── login.astro
│           └── dashboard.astro
└── sql/schema.sql          → skema database + data contoh
```

## Menambah/mengubah konten

Semua konten (profil, perangkat, UMKM, demografi, galeri, aktivitas, lokasi
peta, batas wilayah) dikelola lewat `/admin/dashboard` — tambah, edit, hapus,
tanpa perlu sentuh kode. Detail cara pakainya sama seperti sebelumnya:

- **Titik lokasi di peta**: ambil koordinat dari Google Maps (klik kanan
  pada titik > salin koordinat)
- **Batas wilayah (polygon)**: gambar di [geojson.io](https://geojson.io) (gratis), lalu
  tempel hasil GeoJSON-nya ke admin panel

## Form Kontak

Form di halaman `/kontak` **belum terhubung ke layanan pengiriman pesan**
sungguhan — ini karena website di-hosting statis (tanpa server PHP seperti
`forms/contact.php` bawaan template asli BizLand). Untuk mengaktifkannya,
pilih salah satu (keduanya gratis untuk penggunaan kecil):

- **[Formspree](https://formspree.io)** — ganti `action` form ke endpoint
  Formspree, form langsung berfungsi tanpa kode tambahan
- **Arahkan ke WhatsApp** — ganti tombol submit jadi link
  `https://wa.me/62xxxxxxxxxx?text=...` yang otomatis menyusun pesan dari
  isian form

## Tentang template BizLand

Website ini pakai template gratis **BizLand** dari
[BootstrapMade.com](https://bootstrapmade.com/bizland-bootstrap-business-template/).
Sesuai lisensi versi gratisnya, tautan kredit "Designed by BootstrapMade,
Distributed by ThemeWagon" di footer **wajib dipertahankan** kecuali kamu
membeli lisensi berbayar yang mengizinkan penghapusan kredit. Lisensi
lengkap: https://bootstrapmade.com/license/

## Catatan lain

- Semua bagian tetap gratis: Astro (open-source), Supabase (free tier),
  Leaflet + plugin-nya (open-source), hosting Netlify/Vercel (free tier)
- Cegah Supabase project di-pause (free tier pause otomatis kalau 7 hari
  tanpa aktivitas): pasang cron gratis via GitHub Actions atau UptimeRobot
  yang ping URL project secara berkala
