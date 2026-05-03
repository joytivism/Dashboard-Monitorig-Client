# Design System — Real Advertise Command Center

> Derived from the live implementation. Semua token, class, dan pola di sini **100% sesuai** dengan kode yang berjalan di produksi.

---

## 1. Filosofi Desain

| Prinsip | Penerapan |
|---|---|
| **Clean Light Mode** | Background abu-abu terang, kartu putih — kontras tinggi |
| **Finexy Aesthetic** | Proporsi lapang, card-based layout, border tipis |
| **Data-first** | Angka besar, label kecil abu-abu, status selalu terlihat |
| **Micro-interaction** | Hover effect, transition 200ms, fade-in on mount |
| **Semantic Color** | Tiap status punya set warna sendiri (bg + text + border) |

---

## 2. Color Tokens (Premium Slate Palette)

### 2.1 Backgrounds & Surfaces

| Token CSS | Tailwind Class | Hex | Kegunaan |
|---|---|---|---|
| `--bg` | `bg-bg` | `#F2F4F7` | App background (body) |
| `--surface` | `bg-surface` | `#ffffff` | Cards, sidebar, header |
| `--surface2` | `bg-surface2` | `#F7F9FC` | Hover state, input background |
| `--surface3` | `bg-surface3` | `#EEF1F6` | Avatar background, subtle fills |

### 2.2 Text (Slate Tinted)

| Token CSS | Tailwind Class | Hex | Kegunaan |
|---|---|---|---|
| `--text` | `text-text` | `#0F172A` | Judul, angka metrik, teks utama |
| `--text2` | `text-text2` | `#475569` | Teks sekunder, nav items (inactive) |
| `--text3` | `text-text3` | `#94A3B8` | Label, deskripsi, placeholder |
| `--text4` | `text-text4` | `#CBD5E1` | Teks muted, header tabel, ikon kecil |

### 2.3 Borders

| Token CSS | Tailwind Class | Hex | Kegunaan |
|---|---|---|---|
| `--border` | `border-border-main` | `#E2E8F0` | Border card default, divider |
| `--border2` | `border-border-alt` | `#CBD5E1` | Border lebih tebal, input focus |

### 2.4 Accent (Blue Brand)

| Token CSS | Tailwind | Hex | Kegunaan |
|---|---|---|---|
| `--accent` | `bg-accent`, `text-accent` | `#0284C7` | Nav active, tombol utama, link |
| `--accent-hover` | `bg-accent-hover` | `#0369A1` | Hover state untuk accent |
| `--accent-light` | `bg-accent-light` | `#F0F9FF` | Background ringan accent |
| `--accent-mid` | `bg-accent-mid` | `#BAE6FD` | Mid-tone accent |

### 2.5 Status Colors

Tiap status punya **4 token**: `color`, `bg`, `border`, `text`.

| Kode | Label | Color | BG | Border | Text |
|---|---|---|---|---|---|
| `rr` | Kritis | `#DC2626` | `#FEF2F2` | `#FECACA` | `#991B1B` |
| `or` | Perlu Perhatian | `#EA580C` | `#FFF7ED` | `#FED7AA` | `#9A3412` |
| `yy` | Waspada | `#D97706` | `#FFFBEB` | `#FDE68A` | `#92400E` |
| `nn` | Tidak Ada Data | `#6B7280` | `#F9FAFB` | `#E5E7EB` | `#374151` |
| `gg` | Performa Baik | `#059669` | `#ECFDF5` | `#A7F3D0` | `#065F46` |
| `gd` | Sangat Baik | `#0284C7` | `#EFF6FF` | `#BAE6FD` | `#1E40AF` |

---

## 3. Typography (Inter Design System)

**Font Stack:** `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
**Base Settings:** `line-height: 1.5`, `font-feature-settings: "cv02", "cv03", "cv04", "cv11", "ss01", "tnum"`

### 3.1 Type Scales

| Token / Role | Size | Weight | Tracking | Utility Class |
|---|---|---|---|---|
| **Display xl** | `60px` | 700 | `-0.02em` | — |
| **Display md** | `36px` | 700 | `-0.02em` | — |
| **Display xs** | `24px` | 700 | `-0.02em` | — |
| **Text xl** | `20px` | 500 | `default` | — |
| **Text md** | `16px` | 500 | `default` | — |
| **Text sm** | `14px` | 500 | `default` | `text-sm` (Body) |
| **Text xs** | `12px` | 500 | `default` | `text-xs` (Subtext) |
| **Overline** | `11px` | 700 | `0.15em` | `.type-overline` |

### 3.2 Special Utilities

- **`.type-overline`**: Digunakan untuk label navigasi, status sistem, dan header section kecil. (Uppercase, Bold, Wide Spacing).
- **`.tabular-nums`**: Wajib digunakan untuk semua angka di tabel, nilai ROAS, dan persentase agar lebar karakter angka konsisten (monospaced numbers).

---

## 4. Spacing, Sizing & Radius

### Border Radius

| Token | Value | Tailwind | Kegunaan |
|---|---|---|---|
| `--radius` | `12px` | `rounded-xl` | Input, tombol, nav item |
| `--radius-lg` | `16px` | `rounded-2xl` | Card, modal, panel |

### Layout Dimensions

| Elemen | Value |
|---|---|
| Sidebar width | `w-[248px]` |
| Header height (client) | `h-[68px]` |
| Admin Topbar height | `h-[60px]` |
| Client main padding | `p-6 lg:p-8` |
| Admin main padding | `px-6 py-7`, `max-w-7xl mx-auto` |

---

## 5. Component Patterns (Updated)

### 5.1 Card & Metrics

```tsx
// Metric Card Title
<div className="type-overline">{title}</div>

// Metric Number (Numerical data)
<div className="text-3xl font-bold text-text tabular-nums">{value}</div>
```

### 5.2 Status Badges & Chips

```tsx
// Badge (rounded-full, 11px)
<span className="badge badge-gg">Performa Baik</span>

// Chip (rounded-md, 10px)
<span className="chip chip-rr">Kritis</span>
```

### 5.3 Table Architecture

```tsx
// Header (Using type-overline)
<th className="py-3 type-overline">Revenue</th>

// Body cell (Using tabular-nums for data)
<td className="py-3.5 tabular-nums text-sm font-medium text-text">{fRp(val)}</td>
```

---

## 6. Animations

| Class | Efek | Durasi |
|---|---|---|
| `.animate-fade-in` | `translateY(6px)→0`, `opacity 0→1` | `0.35s ease` |
| `.animate-slide-in` | `translateX(-10px)→0`, `opacity 0→1` | `0.3s ease` |

---

## 7. Do's & Don'ts

**✅ Do:**
- Gunakan `.type-overline` untuk semua label kategori yang bersifat uppercase.
- Gunakan `.tabular-nums` pada semua angka yang ditampilkan berjejer secara vertikal (tabel/list).
- Gunakan token warna Slate (`text-text`, `text-text2`, dst.) untuk menjaga nuansa premium.
- Gunakan `line-height: 1.5` untuk teks panjang agar lebih enak dibaca.

**❌ Don't:**
- Jangan gunakan class `.overline` (bawaan Tailwind) karena akan memicu garis di atas teks.
- Jangan gunakan font-weight di bawah 400 untuk teks body (Inter terlihat paling bagus di 400-500).
- Jangan gunakan warna hitam pekat (`#000000`) atau abu-abu murni (`#888888`), selalu gunakan Slate palette.
