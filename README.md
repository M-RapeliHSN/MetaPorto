# MetaPorto — Metaphor: ReFantazio Interactive Developer Portfolio

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://meta-porto.vercel.app/)
[![PHP](https://img.shields.io/badge/PHP%208.3-777BB4?style=for-the-badge&logo=php&logoColor=white)](https://php.net)
[![Laravel](https://img.shields.io/badge/Laravel%2013-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)](https://laravel.com)
[![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://mysql.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

> **"A portfolio designed not merely as a resume list, but as a living, cohesive, and high-performance RPG game interface system."**

**MetaPorto** adalah portofolio web interaktif personal milik **Muhammad Raffly Husaini** (Backend-focused Fullstack Developer & Pelajar RPL di SMK Telkom 1 Medan), yang dibangun dengan konsep antarmuka game legendaris ***Metaphor: ReFantazio*** (Atlus). 

Seluruh sistem dibangun dari nol menggunakan **Vanilla Web Technologies (HTML5, Modern CSS, ES6+ JavaScript, Canvas API, dan Web Audio API)** tanpa framework frontend berat untuk memastikan interaktivitas yang responsif, kepatuhan arsitektur, dan rendering antarmuka yang efisien.

---

## 🌟 Key Features & Architecture

### 1. Interactive Metaphor Command Stack
- **Dynamic Ribbon & Sub-Labels**: Struktur menu 9 gerbang (`SKILL`, `ITEM`, `EQUIPMENT`, `PARTY`, `FOLLOWER`, `QUEST`, `CALENDAR`, `JOURNAL`, `SYSTEM`) dengan translasi fungsional langsung untuk efisiensi peninjauan recruiter.
- **Protagonist Quick Dossier**: Widget HUD di layar utama yang langsung mengidentifikasi profil pengembang, spesialisasi stack, dan ketersediaan project dalam 2 detik pertama.
- **Programmatic SVG Brush & Slice FX**: Efek sapuan kuas kaligrafi Jepang dinamis yang diinjeksi via SVG manipulasi procedural, bukan sekadar file gambar statis.

### 2. Low-Latency Synthesized Web Audio SFX
- Semua efek suara antarmuka (hover clicks, enter snaps, error bumps, menu toggles) disintesis secara real-time menggunakan **Web Audio API** (`OscillatorNode`, `BiquadFilterNode`, dan custom procedural noise bursts) tanpa bergantung pada file `.mp3` eksternal.
- Sistem **BGM Controller** terisolasi penuh dengan status default *OFF/PAUSED* untuk kenyamanan browsing multi-tab recruiter.

### 3. JRPG Keyboard Navigation System
Navigasi penuh tanpa mouse di seluruh layar:
- `Arrow Up` / `Arrow Down` atau `W` / `S` : Navigasi elemen menu & daftar project.
- `Angka 1 — 9` : Shortcut instan melompat ke menu spesifik.
- `Enter` / `Space` : Masuk ke sub-menu.
- `Escape` / `Backspace` : Kembali ke Command Hub.
- `Arrow Left` / `Arrow Right` atau `A` / `D` : Navigasi 3-slide inspection deck project di menu ITEM.

### 4. High-Performance & Memory Optimization
- **Hardware-Accelerated Compositing**: Menggunakan `transform: translateZ(0)` dan layer isolasi GPU untuk mencegah repainting layar.
- **Smart On-Demand Preloader**: Hanya memuat background Home di awal; aset latar menu lain baru dimuat secara dinamis saat kursor melakukan hover atau fokus pada navigasi untuk meminimalkan alokasi memori browser sejak pemuatan pertama.
- **Tab Visibility Hibernation**: Siklus rendering partikel Canvas dan animasi visual otomatis dihentikan sementara (*paused*) menggunakan Page Visibility API saat pengguna beralih ke tab lain untuk menghemat daya dan siklus komputasi.
- **Accessibility Friendly**: Dilengkapi dukungan `@media (prefers-reduced-motion: reduce)` dan text-selection terbuka untuk mempermudah recruiter menyalin informasi.

---

## 💼 Featured Engineering Works (Menu: ITEM)

Portofolio ini menampilkan rekayasa sistem backend terverifikasi, bukan sekadar tampilan antarmuka:

| Project | Role | Tech Stack | Highlights & Architecture |
| :--- | :--- | :--- | :--- |
| **[WilmarBooks](https://donasi-buku.wbi.ac.id)** | Backend & DB Developer (PKL) | PHP 8.3, Laravel 13, MySQL, Reverb, Socialite | **Live Campus Production** di Politeknik Wilmar Bisnis Indonesia. Arsitektur MVC terstruktur, alur verifikasi donasi & upload bukti transfer bank, Google OAuth SSO, real-time Reverb WebSocket notifications, dan dynamic PDF receipts. |
| **[KAPI](https://github.com/M-RapeliHSN/KAPI)** | Solo Fullstack Developer | Laravel 12, MySQL, Pest PHP, TailwindCSS | Platform reservasi tiket kereta api dengan **Transactional Seat Reservation & Integrity Logic** untuk mitigasi double booking. Teruji komprehensif oleh **37 automated tests / 98 assertions** (Pest PHP). |
| **[Inventaris WBI](https://github.com/r4hmansun/inventartis-WBI)** | Backend Developer (PKL) | PHP 8, Laravel, MySQL | Sistem inventaris aset kampus dengan Role-Based Access Control (Admin & Super Admin), siklus mutasi barang, dan audit tahun anggaran. |
| **[Grow-a-Garden](https://github.com/Apisikma123/Grow-a-garden)** | Backend Developer (Team) | PHP 8.3, Laravel 13, MySQL, Reverb, Weather API | Multi-domain smart garden platform. Merancang logika plant lifecycle, arsitektur modular service-layer (`AutopilotService`, `WeatherService`), scheduled console commands, dan event broadcasting real-time via Laravel Reverb. |
| **[Ökiro Café](https://okiro-cafe.vercel.app)** | Solo Frontend & UI/UX | HTML5, CSS3, JS, Vercel | **Live Demo Showcase**. Website company profile & katalog menu kedai kopi artisan bertema Japanese-Minimalist terhubung order WhatsApp. |
| **[Horus Barbershop](https://horus-barbershop.vercel.app)** | Solo Web Developer | TailwindCSS, JavaScript, Vercel | **Live Demo Showcase**. Website barbershop premium royal grooming dengan lookbook artisan dan sistem booking WhatsApp. |
| **[Toriel Store](https://toriel-store.vercel.app)** | Solo Web Developer | TailwindCSS, JavaScript, Vercel | **Live Demo Showcase**. Katalog belanja online retail UMKM lokal dengan keranjang belanja interaktif dan pemesanan WhatsApp. |

---

## 🛠️ Tech Stack

- **Core**: HTML5, Semantic Markup, Open Graph Protocol
- **Styling**: Vanilla CSS3, CSS Custom Properties, CSS Grid, Flexbox, Keyframe Animations
- **Logic & Interactions**: Modern JavaScript (ES6+), Web Audio API, Canvas 2D API
- **Design Inspiration**: *Metaphor: ReFantazio* © ATLUS / SEGA

---

## 🚀 Running Locally

Tidak memerlukan build step, bundler, atau dependensi node_modules:

```bash
# Clone repository
git clone https://github.com/M-RapeliHSN/MetaPorto.git

# Masuk ke direktori
cd MetaPorto

# Jalankan server lokal sederhana (misal menggunakan Python)
python -m http.server 5500

# Atau gunakan Live Server extension di VS Code
# Buka http://localhost:5500 di browser pilihan Anda
```

---

## 👤 Author & Contact

**Muhammad Raffly Husaini**  
*Backend Developer · Pelajar Tingkat Akhir RPL SMK Telkom 1 Medan (Estimasi Kelulusan Mei 2027)*  
*Medan, Sumatera Utara, Indonesia*

- ✉️ **Email**: [raflyhusaini0290@gmail.com](mailto:raflyhusaini0290@gmail.com)
- 🐙 **GitHub**: [@M-RapeliHSN](https://github.com/M-RapeliHSN)
- 💬 **WhatsApp**: [Direct Message &amp; Consultation](https://wa.me/6283846480183)
- 📸 **Instagram**: [@blanks_raa](https://instagram.com/blanks_raa)

---

### ⚖️ Disclaimer & Credits
*Antarmuka visual dan audio terinspirasi dari game **Metaphor: ReFantazio** oleh Studio Zero / ATLUS / SEGA. Proyek ini dibuat secara non-komersial semata-mata sebagai tribut kreatif dan portofolio pengembangan perangkat lunak personal.*
