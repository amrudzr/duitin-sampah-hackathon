# Sirkula Intelligence — Admin Dashboard Prototype

Prototipe antarmuka **Admin Dashboard Sirkula Intelligence** (*AI-Powered Smart Beverage Container Recovery & Reward Ecosystem*) untuk keperluan dokumentasi visual & demonstrasi konsep pada **UNS Innovation Hackathon 2026**.

Dibangun menggunakan **HTML, CSS, dan JavaScript murni (tanpa build step)** dengan sistem desain mengacu pada [shadcn/ui](https://ui.shadcn.com/), siap di-push ke GitHub dan di-deploy langsung ke **Vercel**.

---

## Daftar Halaman

| Halaman | File | Deskripsi |
|---|---|---|
| **Login Operator** | `index.html` | Halaman masuk admin dengan ringkasan 4 pilar *Material Intelligence*. |
| **Ringkasan Operasional** | `dashboard.html` | KPI utama, grafik tren 14 hari (unit & berat kg), proporsi PET vs Aluminium, transaksi terbaru, dan status unit RVM. |
| **Monitoring Mesin** | `mesin.html` | Pemantauan perangkat keras ESP32, kamera AI, sensor berat, konektivitas Wi-Fi, dan kapasitas wadah PET/Aluminium terpisah. |
| **Manajemen Transaksi** | `transaksi.html` | Tabel audit transaksi dengan ID unik, *Idempotency Key*, skor klasifikasi CV, berat sensor, serta *slide-over sheet* 5 tahap verifikasi. |
| **Analitik Material** | `analitik.html` | Akumulasi mingguan PET vs Aluminium, distribusi lokasi kampus UNS, dan rincian penolakan objek multi-modal tanpa klaim emisi yang belum tervalidasi. |
| **Manajemen Reward** | `reward.html` | Pengaturan nilai saldo virtual per kategori material & kalkulator simulasi margin operasional (§12). |
| **Pengumpulan & Batch** | `pengumpulan.html` | Antrean prioritas pengangkutan wadah penuh & tabel keterlacakan batch penyaluran ke mitra daur ulang. |
| **Deteksi Anomali** | `anomali.html` | Log pencegahan kecurangan: botol masih berisi cairan, benda asing, *stringing*, dan proteksi transaksi ganda. |

---

## Fitur Bantu untuk Screenshot Proposal

- **Mode Screenshot** (tombol di kanan atas header): Menyembunyikan lencana *"Data Ilustrasi Prototipe"* dan tombol bantu simulasi dengan satu klik agar tangkapan layar bersih saat dimasukkan ke dokumen proposal.
- **Mode Terang & Gelap (Light / Dark)**: Tombol bulan/matahari di kanan atas untuk memilih varian visual terang atau gelap sesuai kebutuhan tata letak proposal.
- **Filter Prototipe MVP vs Jaringan Kampus** (`mesin.html`): Memungkinkan pengambilan screenshot untuk 1 mesin MVP saja (`RVM-UNS-01`) maupun skenario jaringan klaster 4 mesin.
- **Simulasi Transaksi Masuk** (`dashboard.html` & `transaksi.html`): Menambahkan transaksi baru secara langsung untuk mendemonstrasikan alur pencatatan *end-to-end*.

---

## Menjalankan Secara Lokal

Karena tidak menggunakan bundler, Anda dapat menjalankan server statis apa pun di root repositori:

```bash
# Opsi 1: Menggunakan Python
python -m http.server 5500

# Opsi 2: Menggunakan Node.js (npx)
npx serve . -l 5500
```

Lalu buka `http://localhost:5500` di browser.

---

## Deploy ke Vercel

1. Push repositori ini ke GitHub:
   ```bash
   git remote add origin https://github.com/<username>/<nama-repo>.git
   git branch -M main
   git push -u origin main
   ```
2. Buka [vercel.com/new](https://vercel.com/new) dan pilih repositori GitHub tersebut.
3. Biarkan pengaturan default (**Framework Preset: Other**, **Build Command: kosong**, **Output Directory: kosong**).
4. Klik **Deploy**. File `vercel.json` sudah mengaktifkan `cleanUrls` sehingga rute seperti `/dashboard`, `/mesin`, dan `/transaksi` langsung aktif.

---

## Dokumen Referensi Konsep

Dokumen rancangan awal proyek tersimpan pada direktori `docs/`:
- `docs/brainstorming.md`
- `docs/briefing_document_rubrik.md`
