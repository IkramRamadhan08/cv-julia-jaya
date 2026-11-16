# BESI KITA — Landing Page (Varian Pembatas)

Landing page statis untuk **CV Indo Jaya**, pembeli limbah besi dan logam skala industri (B2B).

Varian ini memakai **batas section yang tegas**: section kontak berlatar cream, peta dibungkus kartu rounded dengan ring dan shadow, gradient gelap hanya di dalam kartu peta.

## Struktur

```
index.html          # halaman utama (hanya HTML + JSON-LD)
tentang.html        # halaman profil perusahaan
assets/
  css/
    base.css        # dipakai semua halaman: token, reset, navbar, footer, tombol WA
    index.css       # khusus index.html
    tentang.css     # khusus tentang.html
  js/
    common.js       # dipakai semua halaman: menu mobile
    index.js        # khusus index.html: peta, slider galeri, reveal, dropdown
  hero/             # foto hero
  gallery/          # 7 foto galeri (slider horizontal)
  materials/        # 6 foto jenis limbah
robots.txt
sitemap.xml
```

Urutan muat CSS: `base.css` dulu, baru file khusus halaman. Menambah halaman baru cukup membuat `assets/css/<halaman>.css` lalu memuat keduanya.

## Menjalankan lokal

Tidak ada build step. Tetap tanpa framework.

Buka `index.html` langsung di browser, atau:

```powershell
python -m http.server 8000
```

lalu buka http://localhost:8000

## Status: DEMO

- Nomor WhatsApp, email, telepon, alamat, sosial media, dan pin peta masih **placeholder**.
- Foto material dan galeri masih **foto stok (Wikimedia)** — ganti dengan foto asli sebelum publish.
- Domain di canonical, Open Graph, JSON-LD, `robots.txt`, dan `sitemap.xml` masih `besikita.co.id`.

## Deploy

Vercel: Framework Preset **Other**, Build Command kosong, Output Directory `./`.
