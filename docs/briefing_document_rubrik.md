# **SIRKULA INTELLIGENCE**

## **AI-Powered Smart Beverage Container Recovery & Reward Ecosystem**

**Konsep dan Rancangan Proyek – UNS Innovation Hackathon 2026**

---

# **1\. Pendahuluan**

Sampah kemasan minuman merupakan salah satu jenis sampah yang sering dijumpai dalam kehidupan sehari-hari. Botol plastik, gelas plastik, dan kaleng minuman banyak digunakan karena praktis, tetapi tidak semuanya berakhir dalam kondisi yang dapat didaur ulang.

Salah satu tantangan dalam pengelolaan sampah kemasan adalah rendahnya kebiasaan masyarakat untuk memilah dan mengembalikan kemasan setelah digunakan. Kemasan yang sebenarnya masih memiliki nilai ekonomi sering kali tercampur dengan sampah lain, terkontaminasi sisa minuman, atau dibuang begitu saja.

Di sisi lain, proses pengumpulan material daur ulang masih membutuhkan pemilahan, pencatatan, dan pengelolaan yang baik agar material dapat dimanfaatkan kembali.

Berangkat dari permasalahan tersebut, tim kami mengembangkan sebuah gagasan bernama **Sirkula Intelligence**, yaitu ekosistem pengumpulan dan pemilahan kemasan minuman berbasis Artificial Intelligence (AI), Internet of Things (IoT), dan sistem insentif digital.

Sirkula dirancang untuk menghubungkan masyarakat sebagai pengguna, mesin pengumpulan pintar sebagai titik pengembalian kemasan, dan pengelola sebagai pihak yang memantau serta mengelola material yang terkumpul.

Tujuan utamanya adalah mengubah kebiasaan membuang kemasan menjadi kebiasaan mengembalikan kemasan yang memiliki nilai ekonomi dan dapat ditelusuri proses pengumpulannya.

# **2\. Gambaran Umum Sirkula Intelligence**

Sirkula Intelligence merupakan sistem terpadu yang terdiri dari tiga komponen utama:

1. **User Application** – aplikasi bagi masyarakat untuk menggunakan mesin, melihat saldo reward, dan memantau riwayat pengembalian kemasan.  
2. **Smart Reverse Vending Machine (RVM)** – mesin fisik yang menerima, mengidentifikasi, memvalidasi, dan memilah kemasan minuman secara otomatis.  
3. **Admin Dashboard** – sistem bagi pengelola untuk memantau mesin, transaksi, jumlah material, dan aktivitas pengumpulan.

Ketiga komponen tersebut saling terhubung melalui backend sebagai pusat pengelolaan data dan transaksi.

### **Konsep sederhana**

Masyarakat membawa botol plastik PET atau kaleng aluminium ke mesin Sirkula. Pengguna memulai transaksi melalui aplikasi, kemudian memasukkan kemasan satu per satu ke mesin.

Mesin menggunakan kamera berbasis AI untuk mengenali kategori kemasan dan sensor untuk melakukan pemeriksaan fisik tambahan. Jika objek memenuhi kriteria penerimaan, mesin mengarahkannya ke tempat penyimpanan sesuai kategori material.

Setelah sistem memastikan proses penerimaan berhasil, backend mencatat transaksi dan menambahkan reward virtual ke akun pengguna.

Dengan demikian, pengguna memperoleh insentif, sedangkan pengelola memperoleh data mengenai material yang berhasil dikumpulkan.

# **3\. Permasalahan yang Ingin Diselesaikan**

Sirkula berangkat dari beberapa permasalahan yang saling berkaitan.

### **3.1 Rendahnya kebiasaan memilah dan mengembalikan kemasan**

Masyarakat belum tentu memiliki motivasi atau akses yang mudah untuk mengembalikan kemasan minuman agar dapat didaur ulang.

### **3.2 Material bernilai ekonomi tercampur**

Botol plastik dan kaleng aluminium berpotensi memiliki nilai jual, tetapi pencampuran dengan jenis sampah lain dapat menurunkan kualitas dan mempersulit proses pengumpulan.

### **3.3 Pemilahan dan pencatatan masih membutuhkan tenaga**

Pengumpulan material membutuhkan proses identifikasi, pemilahan, penimbangan, dan pencatatan. Otomatisasi pada tahap awal dapat membantu membuat proses lebih terstruktur.

### **3.4 Kurangnya keterhubungan antara pengguna dan pengelola**

Pengguna membutuhkan informasi mengenai manfaat pengembalian kemasan, sementara pengelola membutuhkan data jumlah dan kategori material yang dikumpulkan.

### **3.5 Belum optimalnya insentif pengembalian kemasan**

Sistem insentif digital dapat menjadi salah satu pendekatan untuk meningkatkan motivasi masyarakat dalam mengembalikan kemasan.

# **4\. Solusi yang Ditawarkan**

Sirkula menawarkan sebuah ekosistem pengumpulan kemasan minuman yang mengintegrasikan identifikasi material, pemeriksaan fisik, pemilahan otomatis, insentif digital, dan pencatatan material.

Solusi ini memiliki lima tahapan utama:

1. **Identification:** mengenali kategori kemasan menggunakan computer vision.  
2. **Validation:** memeriksa kesesuaian objek menggunakan kamera dan sensor.  
3. **Sorting:** mengarahkan kemasan ke tempat penyimpanan sesuai kategori.  
4. **Rewarding:** memberikan reward virtual kepada pengguna berdasarkan aturan nilai material.  
5. **Traceability:** mencatat dan memantau material yang dikumpulkan melalui dashboard.

Fokus awal pengembangan adalah dua kategori material, yaitu:

* Botol plastik PET (*Polyethylene Terephthalate*).  
* Kaleng minuman aluminium.

Pemilihan dua kategori ini bertujuan menjaga kompleksitas prototipe tetap realistis sekaligus memungkinkan sistem menunjukkan proses pemilahan dua material yang berbeda.

Pengembangan untuk gelas plastik, HDPE, dan jenis kemasan lainnya dapat menjadi tahap lanjutan.

# **5\. Tiga Komponen Utama Sistem**

## **5.1 User Application**

Aplikasi pengguna ditujukan bagi masyarakat yang ingin mengembalikan kemasan minuman melalui mesin Sirkula.

Fitur yang direncanakan:

**A. Registrasi dan Login**

Pengguna dapat membuat akun dan masuk ke aplikasi untuk mengakses layanan Sirkula.

**B. Scan QR Code Mesin**

Pengguna memindai QR code pada mesin untuk memulai sesi transaksi. Sistem akan menghubungkan aktivitas pengguna dengan mesin yang digunakan.

**C. Digital Wallet**

Pengguna dapat melihat saldo reward virtual yang diperoleh dari pengembalian kemasan.

**D. Transaction History**

Pengguna dapat melihat riwayat transaksi, termasuk kategori dan jumlah kemasan yang berhasil diterima.

**E. Environmental Impact**

Pengguna dapat melihat kontribusi pengumpulan kemasan berdasarkan data transaksi, misalnya jumlah botol PET dan kaleng aluminium yang telah dikembalikan.

**F. Reward Information**

Pengguna dapat melihat aturan pemberian reward dan informasi penukaran saldo apabila mekanisme tersebut sudah tersedia.

Untuk prototipe hackathon, wallet menggunakan saldo virtual. Integrasi pembayaran uang sungguhan belum menjadi prioritas.

## **5.2 Smart Reverse Vending Machine (RVM)**

Smart RVM merupakan komponen fisik utama Sirkula.

Mesin ini berfungsi menerima kemasan minuman, mengenali kategorinya, melakukan pemeriksaan fisik, dan memisahkannya berdasarkan material.

### **Komponen mesin**

**A. Input Section**

Bagian tempat pengguna memasukkan satu kemasan dalam satu waktu.

**B. Camera Module**

Kamera mengambil gambar objek untuk diproses oleh model computer vision.

**C. Sensor Module**

Sensor digunakan untuk mendapatkan informasi fisik tambahan, seperti keberadaan objek dan beratnya.

**D. Processing Unit**

ESP32 atau mini-computer digunakan sesuai kebutuhan pemrosesan. ESP32 dapat menangani pembacaan sensor dan kendali aktuator, sedangkan pemrosesan AI dapat dilakukan pada perangkat yang lebih sesuai atau melalui backend.

**E. Sorting Mechanism**

Mekanisme pemilah menggunakan servo atau aktuator sederhana untuk mengarahkan objek ke wadah yang sesuai.

**F. Storage Section**

Terdapat dua wadah penyimpanan:

* Wadah PET.  
* Wadah aluminium.

**G. Connectivity Module**

Mesin terhubung ke backend melalui Wi-Fi untuk mengirimkan hasil pemeriksaan dan menerima instruksi sistem.

### **Alur kerja mesin**

1. Pengguna memulai sesi melalui QR code.  
2. Pengguna memasukkan satu kemasan.  
3. Kamera mengambil gambar kemasan.  
4. AI mengklasifikasikan objek sebagai PET, aluminium, atau tidak dikenali.  
5. Sensor melakukan pemeriksaan fisik tambahan.  
6. Backend atau pengendali mesin menentukan apakah objek memenuhi kriteria penerimaan.  
7. Jika diterima, mekanisme pemilah mengarahkan objek ke wadah yang sesuai.  
8. Sistem mengonfirmasi keberhasilan penerimaan.  
9. Transaksi dicatat dan reward virtual ditambahkan ke akun pengguna.

Jika objek tidak memenuhi kriteria, mesin menolak atau mengembalikannya apabila mekanisme prototipe memungkinkan.

**Catatan teknis:** kamera dan sensor dasar tidak dapat memastikan kemurnian kimia suatu material. Oleh karena itu, Sirkula hanya akan mengklaim pemeriksaan kategori dan indikator fisik yang benar-benar dapat diukur.

## **5.3 Admin Dashboard**

Dashboard ditujukan bagi pengelola atau operator Sirkula.

Fitur yang direncanakan:

**A. Overview Dashboard**

Menampilkan ringkasan aktivitas sistem, seperti jumlah transaksi, jumlah kemasan, dan total material yang dikumpulkan.

**B. Material Analytics**

Menampilkan statistik berdasarkan kategori PET dan aluminium.

**C. Transaction Management**

Menampilkan riwayat transaksi pengguna dan status penerimaan material.

**D. Machine Monitoring**

Menampilkan status mesin, konektivitas, kapasitas wadah, dan kondisi operasional apabila sensor pendukung tersedia.

**E. Reward Management**

Mengelola aturan pemberian reward berdasarkan kategori material.

**F. Collection Management**

Membantu pengelola memantau jumlah material yang telah terkumpul dan kebutuhan pengangkutannya.

Dashboard ini diharapkan dapat membantu pengelola mengambil keputusan berdasarkan data, bukan hanya perkiraan jumlah sampah.

# **6\. Inovasi Utama: Sirkula Material Intelligence**

Inovasi utama Sirkula bukan sekadar membuat tempat sampah otomatis atau aplikasi pemberian poin.

Gagasan utama yang ingin dikembangkan adalah **Material Intelligence**, yaitu pendekatan yang menghubungkan identifikasi material, validasi fisik, keputusan penerimaan, sistem reward, dan keterlacakan material dalam satu alur.

Terdapat empat aspek utama.

### **6.1 AI-Based Material Identification**

Sirkula menggunakan computer vision untuk mengenali kategori kemasan minuman.

Pada tahap awal, model difokuskan untuk membedakan:

* Botol PET.  
* Kaleng aluminium.  
* Objek yang tidak termasuk kategori penerimaan.

Model akan diuji menggunakan sampel dengan variasi bentuk, warna, kondisi, dan pencahayaan.

### **6.2 Sensor-Assisted Physical Validation**

Hasil klasifikasi AI tidak langsung menjadi satu-satunya dasar penerimaan.

Sensor membantu memeriksa karakteristik fisik objek, misalnya berat dan keberadaan objek.

Sebagai contoh, botol yang masih berisi banyak cairan dapat memiliki berat yang berbeda dari botol kosong. Informasi tersebut dapat digunakan sebagai indikator untuk pemeriksaan lebih lanjut.

Namun, berat saja tidak dapat membuktikan kebersihan atau kemurnian material.

### **6.3 Intelligent Reward System**

Sirkula menerapkan sistem reward berdasarkan kategori material dan aturan nilai yang dapat dikonfigurasi.

Pada pengembangan berikutnya, aturan reward dapat mempertimbangkan berat atau indikator kualitas material jika pengukurannya telah tervalidasi.

Tujuannya adalah membangun insentif yang lebih relevan terhadap nilai material yang dikumpulkan.

### **6.4 Material Traceability**

Setiap kemasan yang diterima menghasilkan catatan transaksi digital.

Data tersebut dapat digunakan untuk mengetahui:

* Jumlah PET yang terkumpul.  
* Jumlah aluminium yang terkumpul.  
* Waktu dan lokasi mesin.  
* Total reward yang diberikan.  
* Riwayat pengumpulan material.

Dalam pengembangan jangka panjang, data tersebut dapat digunakan untuk menghubungkan mesin Sirkula dengan bank sampah, pengepul, atau mitra daur ulang.

# **7\. Rancangan Arsitektur Sistem**

Secara konseptual, Sirkula menggunakan arsitektur yang terdiri dari perangkat pengguna, perangkat IoT, AI, backend, dan database.

### **Alur komunikasi**

**User Application**

Pengguna melakukan autentikasi dan memulai sesi melalui QR code.

↓

**Backend API**

Backend memvalidasi akun, sesi, dan identitas mesin.

↓

**Smart RVM**

Mesin menerima objek dan menjalankan proses identifikasi serta validasi.

↓

**AI & Sensor Processing**

Sistem mengolah citra dan data sensor untuk menentukan kategori serta status objek.

↓

**Sorting Mechanism**

Objek diterima dan diarahkan ke wadah PET atau aluminium.

↓

**Backend & Database**

Hasil penerimaan disimpan sebagai transaksi yang memiliki identitas unik.

↓

**Reward System**

Saldo virtual pengguna diperbarui setelah mesin mengonfirmasi penerimaan.

↓

**User Application & Admin Dashboard**

Pengguna melihat reward, sedangkan pengelola melihat statistik dan aktivitas mesin.

### **Prinsip penting arsitektur**

Reward tidak boleh diberikan hanya karena AI mengidentifikasi suatu objek.

Backend harus menunggu konfirmasi bahwa objek benar-benar diterima dan proses pemilahan berhasil. Setiap transaksi harus memiliki ID unik agar satu objek tidak menghasilkan reward berulang akibat pengiriman data ganda.

Jika koneksi internet terputus atau mesin mengalami gangguan, transaksi perlu ditandai sebagai gagal atau menunggu verifikasi, bukan langsung dianggap berhasil.

# **8\. Rancangan Teknologi**

Teknologi berikut merupakan usulan awal dan dapat disesuaikan dengan kemampuan tim serta ketersediaan komponen.

| Komponen | Teknologi yang dipertimbangkan | Fungsi |
| ----- | ----- | ----- |
| User Application | Next.js / React | Antarmuka pengguna |
| Admin Dashboard | Next.js / React | Pemantauan dan pengelolaan |
| Backend | Python FastAPI atau Node.js | API dan logika bisnis |
| Database | PostgreSQL / Supabase | Penyimpanan data |
| AI | Python, OpenCV, model computer vision | Klasifikasi objek |
| IoT Controller | ESP32 | Sensor dan aktuator |
| Camera | Modul kamera yang kompatibel | Pengambilan citra |
| Sensor | Load cell, sensor keberadaan objek | Pemeriksaan fisik |
| Sorting | Servo motor / aktuator | Pemilahan objek |
| Communication | Wi-Fi / HTTP API | Komunikasi mesin dan backend |

Pemilihan teknologi final perlu mempertimbangkan kemampuan perangkat keras, anggaran, waktu pengembangan, dan kemudahan integrasi.

Tidak semua komponen harus menggunakan teknologi yang paling canggih. Prioritasnya adalah sistem dapat bekerja secara konsisten.

# **9\. Rancangan Prototipe MVP**

MVP (*Minimum Viable Product*) merupakan versi paling sederhana dari produk yang sudah dapat membuktikan gagasan utamanya.

Untuk UNS Innovation Hackathon 2026, Sirkula akan menggunakan pendekatan **custom partial prototype**.

Artinya, tim membuat sendiri bagian inti yang menunjukkan inovasi, tetapi tetap menggunakan komponen siap pakai untuk mempercepat pengembangan.

### **Batasan MVP**

**Material yang diterima:**

* Botol PET.  
* Kaleng aluminium.

**Fitur mesin:**

* Input satu objek.  
* Kamera dan klasifikasi AI.  
* Sensor fisik dasar.  
* Pemilahan dua kategori.  
* Dua wadah penampungan.

**Fitur aplikasi:**

* Login sederhana.  
* Scan QR code.  
* Saldo reward virtual.  
* Riwayat transaksi.

**Fitur dashboard:**

* Statistik transaksi.  
* Jumlah material.  
* Riwayat penerimaan.  
* Status mesin.

### **Fitur yang belum menjadi prioritas**

* Gelas plastik, HDPE, dan multilayer.  
* Pembayaran uang sungguhan.  
* Banyak mesin dalam satu jaringan.  
* Deteksi komposisi kimia material secara otomatis.  
* Prediksi pengangkutan berbasis machine learning.  
* Integrasi penuh dengan mitra daur ulang.

Fitur-fitur tersebut dapat menjadi arah pengembangan setelah MVP terbukti berjalan.

# **10\. Pembagian Tugas Tim**

Tim Sirkula terdiri dari empat anggota Teknik Informatika dan satu anggota Teknik Kimia.

Pembagian kerja dirancang berdasarkan kompetensi masing-masing, tetapi tetap membutuhkan kolaborasi antardivisi.

## **Anggota 1 – Backend & System Architect (Teknik Informatika)**

**Tanggung jawab:**

* Merancang arsitektur backend.  
* Membuat API.  
* Merancang database.  
* Mengelola autentikasi pengguna.  
* Membuat sistem transaksi.  
* Mengimplementasikan wallet virtual.  
* Mengintegrasikan aplikasi, mesin, dan dashboard.  
* Menjaga keamanan dan konsistensi data.

**Output:** backend dan database yang menjadi pusat komunikasi seluruh sistem.

## **Anggota 2 – AI/ML Engineer (Teknik Informatika)**

**Tanggung jawab:**

* Mengumpulkan dataset PET dan aluminium.  
* Melakukan preprocessing data.  
* Memilih dan mengadaptasi model computer vision.  
* Mengembangkan klasifikasi objek.  
* Menguji akurasi model.  
* Mengintegrasikan hasil klasifikasi dengan sistem validasi.

**Output:** model AI yang mampu mengklasifikasikan kategori kemasan dalam batas pengujian yang ditentukan.

## **Anggota 3 – Frontend & IoT Engineer (Teknik Informatika)**

**Tanggung jawab:**

* Mengembangkan user application.  
* Mengembangkan admin dashboard.  
* Merancang antarmuka mesin.  
* Mengintegrasikan ESP32 dan sensor.  
* Mengendalikan servo atau aktuator.  
* Mengintegrasikan komunikasi perangkat dengan backend.  
* Melakukan pengujian perangkat keras.

**Output:** aplikasi, dashboard, dan prototipe fisik yang saling terhubung.

## **Anggota 4 – Product Strategy & Research Lead (Teknik Informatika)**

**Tanggung jawab:**

* Melakukan riset permasalahan.  
* Mengidentifikasi target pengguna.  
* Melakukan wawancara dan validasi kebutuhan.  
* Menganalisis solusi dan kompetitor.  
* Menyusun model bisnis.  
* Meneliti potensi nilai ekonomi material.  
* Menyusun proposal.  
* Menyiapkan presentasi dan pitch deck.  
* Memastikan seluruh klaim proposal sesuai kemampuan prototipe.

**Output:** landasan riset, strategi produk, model bisnis, proposal, dan materi presentasi.

Peran ini bukan sekadar menulis proposal. Anggota ini bertanggung jawab memastikan Sirkula menyelesaikan masalah yang benar dan memiliki alasan kuat untuk dikembangkan.

## **Anggota 5 – Material & Recycling Process Engineer (Teknik Kimia)**

**Tanggung jawab:**

* Meneliti karakteristik PET dan aluminium.  
* Menentukan kriteria penerimaan material.  
* Mempelajari pengaruh kontaminasi terhadap kualitas material.  
* Meneliti proses pemilahan dan pengolahan material.  
* Menentukan indikator kualitas yang dapat diukur.  
* Memberikan masukan untuk desain mesin.  
* Menghubungi pengepul atau mitra daur ulang.  
* Meneliti harga dan kelayakan ekonomi material.

**Output:** dasar ilmiah material, kriteria penerimaan, rekomendasi proses pemilahan, dan data pendukung kelayakan daur ulang.

# **11\. Tahapan Pengembangan Prototipe**

Pengembangan Sirkula dilakukan secara bertahap agar tim dapat memprioritaskan fitur yang paling penting.

### **Tahap 1 – Research & System Design**

* Memvalidasi permasalahan.  
* Mengidentifikasi kebutuhan pengguna.  
* Menentukan kriteria PET dan aluminium.  
* Merancang alur sistem.  
* Menentukan komponen dan teknologi.

**Target:** spesifikasi MVP dan rancangan sistem disepakati seluruh anggota.

### **Tahap 2 – Core Development**

* Membangun backend.  
* Mengembangkan model AI awal.  
* Merakit prototipe mesin.  
* Membuat aplikasi dan dashboard awal.

**Target:** setiap komponen dapat bekerja secara terpisah.

### **Tahap 3 – System Integration**

* Menghubungkan mesin dengan backend.  
* Mengintegrasikan AI dan sensor.  
* Menghubungkan aplikasi dengan QR code mesin.  
* Menghubungkan transaksi dengan wallet.  
* Menampilkan data di dashboard.

**Target:** alur transaksi dari pengguna hingga dashboard berhasil dijalankan.

### **Tahap 4 – Testing & Evaluation**

* Menguji botol PET.  
* Menguji kaleng aluminium.  
* Menguji objek yang tidak diterima.  
* Menguji ketepatan klasifikasi.  
* Menguji mekanisme pemilahan.  
* Menguji pencatatan transaksi.  
* Mengukur waktu pemrosesan.

**Target:** terdapat bukti pengujian dan evaluasi kinerja prototipe.

### **Tahap 5 – Finalization & Presentation**

* Menyempurnakan prototipe.  
* Menyusun dokumentasi.  
* Menyiapkan video demonstrasi.  
* Menyusun hasil pengujian.  
* Menyelesaikan proposal.  
* Menyiapkan presentasi dan tanya jawab.

**Target:** seluruh klaim dalam presentasi dapat dibuktikan melalui rancangan, data, atau demonstrasi.

# **12\. Potensi Model Bisnis dan Keberlanjutan**

Sirkula tidak hanya dirancang sebagai proyek teknologi, tetapi juga sebagai sistem yang berpotensi diterapkan secara berkelanjutan.

Beberapa potensi sumber pendapatan atau dukungan operasional:

1. **Penjualan material daur ulang:** PET dan aluminium yang terkumpul dapat disalurkan kepada pengepul atau mitra daur ulang.  
2. **Kemitraan perusahaan:** perusahaan minuman atau pihak yang memiliki program pengurangan sampah kemasan berpotensi menjadi mitra.  
3. **Program CSR dan lingkungan:** mesin dapat ditempatkan melalui kerja sama dengan kampus, fasilitas publik, atau perusahaan.  
4. **Pengelolaan jaringan mesin:** dalam jangka panjang, pengelola dapat menyediakan layanan pengumpulan dan pelaporan material untuk mitra.

Namun, keberlanjutan finansial perlu diuji.

Secara sederhana:

**Margin operasional \= Pendapatan material – (Reward \+ Biaya pengumpulan \+ Biaya operasional)**

Perhitungan lebih lengkap juga perlu mempertimbangkan biaya perawatan, penggantian komponen, dan penyusutan mesin.

Reward tidak boleh ditetapkan tanpa mempertimbangkan nilai jual material dan biaya yang dibutuhkan untuk mengumpulkannya.

# **13\. Potensi Dampak**

Sirkula diharapkan dapat menghasilkan dampak pada beberapa aspek.

**Lingkungan**

* Mendorong pengumpulan kemasan minuman.  
* Membantu memisahkan PET dan aluminium.  
* Mengurangi kemungkinan kemasan bernilai daur ulang tercampur dengan sampah lain.

**Ekonomi**

* Memberikan insentif kepada masyarakat.  
* Membantu menyediakan material yang lebih terpilah bagi mitra daur ulang.  
* Membuka peluang kolaborasi dengan pelaku ekonomi sirkular.

**Teknologi**

* Mengimplementasikan AI dan IoT untuk pengelolaan material.  
* Menghasilkan data pengumpulan secara digital.  
* Mengembangkan sistem pemantauan dan pengelolaan material.

**Sosial**

* Mendorong kebiasaan mengembalikan kemasan.  
* Meningkatkan kesadaran masyarakat terhadap nilai ekonomi material.  
* Membuat proses pengumpulan lebih menarik dan transparan.

Dampak tersebut merupakan tujuan yang ingin dicapai dan perlu dibuktikan melalui pengujian serta penerapan nyata.

# **14\. Risiko dan Tantangan Pengembangan**

Tim perlu menyadari beberapa risiko sejak awal.

| Risiko | Antisipasi |
| ----- | ----- |
| AI salah mengenali material | Menguji dataset yang bervariasi dan menggunakan validasi sensor |
| Objek yang tidak sesuai tetap diterima | Membuat aturan penerimaan dan mekanisme penolakan |
| Mesin mengalami kemacetan | Membuat jalur input sederhana dan akses perawatan |
| Reward diberikan dua kali | Menggunakan ID transaksi unik dan konfirmasi penerimaan |
| Koneksi internet terputus | Menyediakan status transaksi gagal atau menunggu verifikasi |
| Reward tidak sebanding dengan nilai material | Melakukan riset harga material dan menghitung biaya operasional |
| Material terkumpul tidak tersalurkan | Mencari mitra pengepul atau daur ulang sejak tahap riset |

Keselamatan juga perlu diperhatikan. Bagian bergerak harus terlindungi dari jangkauan tangan pengguna, komponen elektronik harus terlindung dari cairan, dan mesin harus memiliki cara penanganan jika terjadi kemacetan atau wadah penuh.

# **15\. Hal yang Harus Dibuktikan oleh Tim**

Agar Sirkula tidak hanya menjadi konsep yang menarik di atas kertas, terdapat beberapa hal yang wajib dibuktikan:

1. Apakah AI mampu membedakan botol PET dan kaleng aluminium dengan tingkat keberhasilan yang dapat diukur?  
2. Apakah sensor dapat membantu mengurangi kesalahan penerimaan?  
3. Apakah mekanisme mesin dapat memisahkan kedua kategori?  
4. Apakah transaksi dapat tercatat dengan benar dan reward tidak diberikan secara ganda?  
5. Apakah pengguna memahami cara menggunakan mesin?  
6. Apakah material yang terkumpul memiliki jalur penyaluran yang jelas?  
7. Apakah nilai ekonomi material berpotensi mendukung sistem reward dan operasional?

Jawaban atas pertanyaan tersebut akan menjadi dasar evaluasi kelayakan Sirkula.

# **16\. Visi Pengembangan Jangka Panjang**

Dalam jangka panjang, Sirkula tidak hanya ingin menjadi satu mesin pengumpulan kemasan, tetapi berkembang menjadi jaringan pengelolaan kemasan minuman yang saling terhubung.

Beberapa pengembangan yang dapat dilakukan:

* Penambahan kategori material.  
* Penempatan mesin di kampus, pusat perbelanjaan, dan fasilitas publik.  
* Integrasi dengan bank sampah dan mitra daur ulang.  
* Sistem pemantauan kapasitas dan pengangkutan material.  
* Analisis data untuk mengetahui pola pengumpulan.  
* Sistem pelaporan dampak lingkungan.  
* Integrasi insentif dengan mitra atau program lingkungan.

Dengan jaringan tersebut, Sirkula berpotensi menjadi penghubung antara masyarakat, pengelola pengumpulan, dan industri daur ulang.

# **17\. Kesimpulan**

**Sirkula Intelligence merupakan ekosistem pengumpulan dan pemilahan kemasan minuman berbasis AI, IoT, dan insentif digital yang dirancang untuk mengubah kemasan bekas menjadi material bernilai ekonomi.**

Melalui integrasi aplikasi pengguna, smart reverse vending machine, dan dashboard pengelola, Sirkula berupaya membangun proses pengumpulan yang lebih terstruktur, terukur, dan transparan.

Inovasi utamanya adalah pendekatan Material Intelligence yang menghubungkan identifikasi kategori material, validasi fisik, sistem reward, dan keterlacakan hasil pengumpulan.

Pada tahap awal, pengembangan difokuskan pada botol PET dan kaleng aluminium dengan prototipe custom partial. Fokus ini dipilih agar tim dapat membuktikan fungsi inti sistem secara nyata sebelum mengembangkan fitur yang lebih kompleks.

Keberhasilan Sirkula tidak hanya diukur dari apakah mesin dapat mengenali dan memilah kemasan, tetapi juga dari apakah sistem mampu memberikan manfaat bagi pengguna, menyediakan material yang lebih terorganisasi bagi mitra daur ulang, dan memiliki potensi keberlanjutan secara ekonomi.

**Sirkula Intelligence — Turning Beverage Waste into Economic Value.**

---

## **CATATAN UNTUK SELURUH ANGGOTA TIM**

Dokumen ini merupakan rancangan awal bersama, bukan spesifikasi final yang tidak boleh berubah.

Setiap anggota diharapkan:

1. Memahami keseluruhan konsep, bukan hanya bagian tugasnya sendiri.  
2. Memberikan masukan terhadap kelayakan teknis dan ilmiah.  
3. Mengutamakan fitur inti yang dapat benar-benar didemonstrasikan.  
4. Tidak membuat klaim kemampuan teknologi tanpa hasil pengujian.  
5. Mengomunikasikan kendala dan perkembangan kepada anggota lain.

