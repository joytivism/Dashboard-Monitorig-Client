# UI/UX Design System: Command Center (Finexy Aesthetic)

## 1. Design Philosophy
- **Theme:** Clean Light Mode. Profesional, rapi, dan cerah.
- **Vibe:** "Finexy Dashboard" aesthetic. Tata letak klasik yang disempurnakan dengan proporsi luas, kontras tinggi antara sidebar putih dan *background* abu-abu terang, serta elemen kapsul (*pill*) yang konsisten.
- **Struktur:** Sidebar di sebelah kiri (tetap/fixed), Header di atas dengan pencarian sentral, dan area konten utama yang luas dengan grid kartu.

## 2. Color Palette System

- **Primary Accent / Brand:** `#ff6301` (Orange) - Digunakan untuk menu aktif di Sidebar, tombol utama, dan grafik utama.
- **Success / Positive Trend:** `#00a1a6` (Tosca) / Hijau terang - Digunakan untuk persentase naik (growth up), status 'Completed', dan *success badges*. Background menggunakan transparansi rendah (misal: `bg-green-100 text-green-700`).
- **Alert / Negative Trend:** `#e50000` (Merah) - Digunakan untuk peringatan, status 'Pending/Error', dan persentase turun. Background menggunakan transparansi rendah (misal: `bg-red-100 text-red-700`).

### Neutrals (Core Structure)
- **App Background:** `#F9FAFB` atau `#F4F6F8` (Abu-abu terang) - Untuk *background* layar utama agar kartu menonjol.
- **Surface / Cards / Sidebar:** `#ffffff` (Putih) - Sidebar, Header, dan semua kartu menggunakan putih bersih.
- **Primary Text:** `#111827` (Hitam/Dark Grey) - Teks utama dan angka metrik.
- **Secondary Text / Borders:** `#6B7280` (Muted Grey) untuk label teks, dan `#E5E7EB` untuk garis pembatas/border tipis.

## 3. Typography
- **Font Family:** `Inter` atau Geometric Sans-Serif.
- **Styling Rules:**
  - **Section Titles (e.g., Sales Overview):** Ukuran medium-besar (xl - 2xl), Font Medium/SemiBold.
  - **Metric Numbers (e.g., 2500):** Sangat besar (4xl), tebal (Bold).
  - **Labels:** Kecil (text-sm atau text-xs), warna abu-abu redup.

## 4. Layout & Grid System (Sesuai Referensi "Finexy")

### Sidebar (Kiri)
- *Background* putih, menempel penuh dari atas ke bawah.
- Logo di pojok kiri atas.
- Menu dibagi berdasarkan kategori (e.g., "Menu", "Products", "General") dengan teks label kecil abu-abu.
- **Item Menu:** Padding lapang. State **Aktif** menggunakan bentuk kapsul (`rounded-xl` atau `rounded-full`) dengan *background* Orange pekat dan teks putih. State pasif teks gelap/abu-abu.

### Header (Atas)
- *Background* transparan atau putih (menyatu dengan area konten).
- **Tengah:** Kotak pencarian besar berbentuk kapsul (`rounded-full`) dengan ikon kaca pembesar dan *shortcut key* (⌘K) di dalamnya. Warna latar abu-abu sangat terang (`bg-gray-100`).
- **Kanan:** Ikon lonceng/bantuan dalam lingkaran kecil, lalu profil pengguna (Avatar bulat, Nama, Role).
- Kanan ekstrem: Date picker berbentuk kapsul putih dengan ikon kalender.

### Cards & Metrics
- **Border Radius:** `16px` hingga `20px` (`rounded-2xl`).
- **Styling:** *Background* Putih (`#ffffff`), border sangat tipis (`border border-gray-100`) dan *shadow* super lembut (`shadow-sm` atau *drop-shadow* nyaris tak terlihat).
- **Metric Card Layout:**
  - Kiri atas: Judul metrik (abu-abu).
  - Kanan atas: Ikon dalam lingkaran berlatar abu-abu transparan.
  - Kiri bawah: Angka besar, bersebelahan dengan *chip* pertumbuhan (*growth pill* hijau/merah).
  - Paling bawah: Teks kecil "Last month: X".

### Tables / Recent Orders
- Judul tabel di kiri atas, kotak pencarian & filter/sortir di kanan atas.
- Header tabel (th): Teks abu-abu, tidak terlalu tebal.
- *Status Badges*: Berbentuk kapsul dengan warna pastel (bg-red-50 text-red-500, bg-green-50 text-green-500).
- Jarak antar baris lebar, *border-bottom* sangat tipis.
