📦 Container Loading Planner
Aplikasi web sederhana untuk membantu merencanakan dan memvisualisasikan pemuatan barang (kargo) ke dalam kontainer pengiriman secara 3D. Aplikasi ini dibangun dengan HTML, CSS, dan JavaScript murni, dengan bantuan Three.js untuk rendering 3D.

Tujuan dari proyek ini adalah menyediakan alat bantu visual yang intuitif bagi siapa saja yang perlu mengoptimalkan ruang di dalam kontainer.

✨ Fitur Utama
Pilihan Kontainer Standar: Pilih dengan cepat antara kontainer 20' Standard, 40' Standard, dan 40' High Cube (HC).

Dimensi Kontainer Custom: Masukkan panjang, lebar, dan tinggi sendiri untuk jenis kontainer non-standar.

Input Material Dinamis: Tambah atau hapus daftar barang yang akan dimuat dengan mudah.

Dua Bentuk Barang: Mendukung input barang berbentuk kotak (Panjang x Lebar x Tinggi) dan silinder/bulat (Diameter x Tinggi).

Visualisasi 3D Interaktif: Putar (orbit), geser (pan), dan perbesar/perkecil (zoom) tampilan kontainer untuk melihat dari segala sudut.

Kode Warna Otomatis: Setiap jenis material secara otomatis diberi warna yang berbeda untuk memudahkan identifikasi visual.

Kontrol Sudut Pandang: Ubah kamera dengan sekali klik untuk melihat dari atas, depan, atau samping.

Simpan ke PDF: Ekspor tampilan visual denah pemuatan Anda saat ini sebagai file PDF.

🚀 Teknologi yang Digunakan
Proyek ini murni front-end dan tidak memerlukan back-end. Semua library dimuat melalui CDN.

HTML5

CSS3 (Modern layout dengan Flexbox)

JavaScript (ES6+)

Three.js: Library utama untuk membuat dan merender adegan 3D di browser.

jsPDF: Untuk membuat dokumen PDF di sisi klien.

html2canvas: Untuk "mengambil tangkapan layar" dari elemen kanvas 3D yang akan dimasukkan ke dalam PDF.

⚙️ Cara Menjalankan
Karena proyek ini adalah situs web statis, Anda tidak memerlukan web server atau proses instalasi yang rumit.

Clone repositori ini:

Bash

git clone https://github.com/nama-anda/container-planner.git
(Jangan lupa ganti nama-anda dengan username GitHub Anda)

Masuk ke direktori proyek:

Bash

cd container-planner
Buka file index.html:
Cukup klik dua kali pada file index.html atau buka langsung melalui browser Anda.

Selesai! Aplikasi akan berjalan secara lokal di browser Anda.

📂 Struktur Folder
Struktur proyek ini sengaja dibuat sederhana dan mudah dipahami.

/container-planner
|-- index.html      # Struktur utama halaman web (UI)
|-- style.css       # Semua aturan styling (CSS)
|-- script.js       # Seluruh logika aplikasi dan manipulasi 3D
|-- README.md       # File dokumentasi yang sedang Anda baca
🔮 Rencana Pengembangan (Roadmap)
Beberapa fitur yang dapat ditambahkan di masa depan:

[ ] Algoritma Packing yang Lebih Optimal: Mengimplementasikan algoritma 3D Bin Packing untuk menyusun barang secara otomatis dan lebih efisien.

[ ] Fitur Drag-and-Drop: Memungkinkan pengguna untuk memindahkan barang secara manual di dalam kontainer 3D.

[ ] Simpan & Muat Sesi: Menyimpan denah pemuatan saat ini ke dalam file (misal: JSON) dan memuatnya kembali nanti.

[ ] Kalkulasi Berat: Menambahkan input berat untuk setiap barang dan menghitung total berat serta titik keseimbangan (center of gravity).

[ ] Validasi Lanjutan: Memberi peringatan jika satu barang lebih besar dari ukuran kontainer itu sendiri.

📄 Lisensi
Didistribusikan di bawah Lisensi MIT. Lihat LICENSE untuk informasi lebih lanjut.
