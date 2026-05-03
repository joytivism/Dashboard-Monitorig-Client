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

## 2. Color Tokens

### 2.1 Backgrounds & Surfaces

| Token CSS | Tailwind Class | Hex | Kegunaan |
|---|---|---|---|
| `--bg` | `bg-bg` | `#F2F4F7` | App background (body) |
| `--surface` | `bg-surface` | `#ffffff` | Cards, sidebar, header |
| `--surface2` | `bg-surface2` | `#F7F9FC` | Hover state, input background |
| `--surface3` | `bg-surface3` | `#EEF1F6` | Avatar background, subtle fills |

### 2.2 Text

| Token CSS | Tailwind Class | Hex | Kegunaan |
|---|---|---|---|
| `--text` | `text-text` | `#0A0A0B` | Judul, angka metrik, teks utama |
| `--text2` | `text-text2` | `#374151` | Teks sekunder, nav items (inactive) |
| `--text3` | `text-text3` | `#6B7280` | Label, deskripsi, placeholder |
| `--text4` | `text-text4` | `#9CA3AF` | Teks muted, header tabel, ikon kecil |

### 2.3 Borders

| Token CSS | Tailwind Class | Hex | Kegunaan |
|---|---|---|---|
| `--border` | `border-border-main` | `#E5E7EB` | Border card default, divider |
| `--border2` | `border-border-alt` | `#D1D5DB` | Border lebih tebal, input focus |

### 2.4 Accent (Brand)

| Token CSS | Tailwind | Hex | Kegunaan |
|---|---|---|---|
| `--accent` | `bg-accent`, `text-accent` | `#ff6301` | Nav active, tombol utama, link |
| `--accent-hover` | `bg-accent-hover` | `#e55700` | Hover state untuk accent |
| `--accent-light` | `bg-accent-light` | `#FFF4EE` | Background ringan accent |
| `--accent-mid` | `bg-accent-mid` | `#FFD9C0` | Mid-tone accent |

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

**Tailwind classes per status** (contoh `rr`):
```
bg-rr-bg  text-rr-text  border-rr-border   ← background set
bg-rr                                       ← dot / icon fill color
text-rr                                     ← icon stroke color
```

### 2.6 Funnel Colors

| Token | Tailwind | Hex | Stage |
|---|---|---|---|
| `--tofu` | `text-tofu` | `#00a1a6` | ToFu (Awareness) |
| `--mofu` | `text-mofu` | `#ff6301` | MoFu (Consideration) |
| `--bofu` | `text-bofu` | `#0A0A0B` | BoFu (Conversion) |

---

## 3. Typography

**Font Stack:** `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`

| Role | Size | Weight | Tailwind |
|---|---|---|---|
| Page title (H1) | `24px` | 700 | `text-2xl font-bold text-text tracking-tight` |
| Section heading | `14px` | 700 | `text-sm font-bold text-text` |
| Card label / metric title | `12px` | 600 | `text-xs font-semibold text-text3 tracking-wider` |
| Metric number (big) | `30px` | 700 | `text-3xl font-bold text-text tracking-tight` |
| Body / table row | `14px` | 500 | `text-sm font-medium text-text` |
| Caption / sub | `12px` | 400 | `text-xs text-text3` |
| Micro label | `10px` | 700 | `text-[10px] font-bold tracking-wider` |
| Section group label (sidebar) | `9px` | 900 | `text-[9px] font-black text-text4 tracking-[0.12em]` |

---

## 4. Spacing, Sizing & Radius

### Border Radius

| Token | Value | Tailwind | Kegunaan |
|---|---|---|---|
| `--radius` | `12px` | `rounded-xl` | Input, tombol, nav item |
| `--radius-lg` | `16px` | `rounded-2xl` | Card, modal, panel |
| `--radius-xl` | `20px` | — | Pill khusus |
| `--radius-2xl` | `24px` | `rounded-3xl` | Elemen very rounded |

### Layout Dimensions

| Elemen | Value |
|---|---|
| Sidebar width | `w-[248px]` |
| Header height (client) | `h-[68px]` |
| Admin Topbar height | `h-[60px]` |
| Client main padding | `p-6 lg:p-8` |
| Admin main padding | `px-6 py-7`, `max-w-7xl mx-auto` |
| Card inner padding | `p-5` atau `p-6` |
| Table first cell | `py-3.5 pl-6` |

---

## 5. Shadows

| Konteks | Nilai | Tailwind |
|---|---|---|
| Card default | Tailwind default | `shadow-sm` |
| Card hover | Tailwind default | `shadow-md` |
| Sidebar | `2px 0 16px -4px rgba(0,0,0,0.06)` | inline style |
| Modal | Tailwind default | `shadow-2xl` |
| Login gate | `0 20px 60px -12px rgba(0,0,0,0.1)` | inline style |

---

## 6. Animations

| Class | Efek | Durasi |
|---|---|---|
| `.animate-fade-in` | `translateY(6px)→0`, `opacity 0→1` | `0.35s ease` |
| `.animate-slide-in` | `translateX(-10px)→0`, `opacity 0→1` | `0.3s ease` |
| `.animate-spin` | Rotate 360° | `0.8s linear` |
| `.animate-pulse-soft` | Opacity 1→0.6→1 | `2s ease-in-out` |

**Transition standar:**
```
transition-all duration-200   ← nav items, tombol
transition-colors             ← ikon, teks color change
transition-shadow             ← card hover
```

---

## 7. Layout Architecture

### 7.1 Client Shell

```
<body class="flex min-h-screen bg-bg">
  <Sidebar />              ← fixed, w-248px, z-40
  <div class="flex-1 ml-[248px] flex flex-col min-h-screen">
    <Header />             ← sticky, h-68px, z-30, frosted glass
    <main class="flex-1 p-6 lg:p-8">
      {children}
    </main>
  </div>
</body>
```

### 7.2 Admin Shell *(tanpa Sidebar & Header global)*

```
<body class="flex min-h-screen bg-bg">
  <div class="flex-1 flex flex-col min-h-screen bg-bg">
    <AdminTopbar />        ← sticky, h-60px, z-50, inline nav
    <main class="flex-1 px-6 py-7 max-w-7xl mx-auto w-full">
      {children}
    </main>
  </div>
</body>
```

> Admin **tidak menggunakan** `<Sidebar>` atau `<Header>` global.

---

## 8. Component Patterns

### 8.1 Card

```tsx
// Standard card
<div className="bg-white rounded-2xl border border-border-main shadow-sm hover:shadow-md transition-shadow">
  ...
</div>

// Shorthand utility class
<div className="card">...</div>
```

**Metric Card anatomy:**
```
┌────────────────────────────────┐
│ Label (xs, text3)    [icon]    │  icon: w-8 h-8 rounded-full bg-surface3
│                                │
│ 3xl Bold Number    [↑ 12.3%]  │  growth pill: bg-gg-bg text-gg-text
│ xs "vs last: Rp 0"            │
└────────────────────────────────┘
```

**Growth Pill:**
```tsx
<div className={`flex items-center gap-0.5 text-[11px] font-bold px-2 py-0.5 rounded-full ${
  isUp ? 'bg-gg-bg text-gg-text' : 'bg-rr-bg text-rr-text'
}`}>
  {isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
  {Math.abs(growth).toFixed(1)}%
</div>
```

### 8.2 Status Badges & Chips

```tsx
// Badge (rounded-full, 11px)
<span className="badge badge-gg">Performa Baik</span>

// Chip (rounded-md, 10px)
<span className="chip chip-rr">Kritis</span>

// Badge dengan dot inline (tabel):
<span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${STATUS_BG[wc]}`}>
  <span className="w-1.5 h-1.5 rounded-full" style={{ background: dotColor }} />
  {LM[wc]}
</span>
```

### 8.3 Status Dot (standalone)

```tsx
// Via CSS class
<span className="dot dot-gg" />

// Via inline style (warna dinamis dari JS)
<span className="w-2 h-2 rounded-full shrink-0" style={{ background: STATUS_DOT[wc] }} />
```

### 8.4 Nav Item (Sidebar)

```tsx
// Active
className="bg-accent text-white shadow-sm rounded-xl px-3 py-2.5 text-sm font-semibold"

// Inactive
className="text-text2 hover:bg-surface2 hover:text-text rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200"
```

**Client avatar di nav:**
```tsx
<div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black ${
  isActive ? 'bg-white/20 text-white' : 'bg-surface3 text-text2'
}`}>
  {cl.key.slice(0, 2).toUpperCase()}
</div>
```

### 8.5 Buttons

| Variant | Classes |
|---|---|
| Primary | `bg-accent text-white rounded-xl font-bold text-sm px-5 h-11 hover:bg-accent/90 transition-all` |
| Dark / Submit | `bg-text text-white rounded-xl font-bold text-sm h-12 hover:bg-accent transition-all` |
| Ghost | `text-text2 hover:bg-surface2 hover:text-text rounded-xl px-3.5 py-2 text-xs font-semibold transition-all` |
| Danger Ghost | `text-text3 hover:bg-red-50 hover:text-red-600 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all` |
| Icon | `w-8 h-8 rounded-lg flex items-center justify-center hover:bg-surface2 text-text3 transition-all` |

### 8.6 Inputs

```tsx
// Standard
<input className="w-full h-11 px-4 rounded-xl border border-border-main bg-surface2 text-sm font-semibold text-text focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all" />

// Error state
<input className="border-red-300 bg-red-50 text-red-600" />

// Search pill
<input className="pl-9 pr-4 h-9 bg-surface2 border border-border-main rounded-xl text-xs font-medium focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/10 transition-all" />
```

### 8.7 Table

```tsx
// Header
<tr className="border-b border-border-main bg-surface2/50">
  <th className="py-3 text-[10px] font-black text-text4 tracking-wider pl-6">Col</th>
</tr>

// Body rows with divider
<tbody className="divide-y divide-surface2">
  <tr className="cursor-pointer hover:bg-surface2/70 transition-all duration-150 group">
    <td className="py-3.5 pl-6">...</td>
  </tr>
</tbody>
```

### 8.8 Avatar / Initials

```tsx
// Large (table, client list) — dengan hover flip
<div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center text-accent text-xs font-black group-hover:bg-accent group-hover:text-white transition-all duration-200">
  {cl.key.slice(0, 2).toUpperCase()}
</div>

// Medium (alert banner)
<div className="w-7 h-7 rounded-lg bg-rr/10 flex items-center justify-center text-rr text-[10px] font-black">
  {cl.key.slice(0, 2).toUpperCase()}
</div>

// Small (sidebar nav)
<div className="w-6 h-6 rounded-lg ... text-[10px] font-black">...</div>
```

### 8.9 Modal

```tsx
// Overlay
<div className="fixed inset-0 z-[200] flex items-start justify-center pt-[14vh]">
  <div className="absolute inset-0 bg-black/25 backdrop-blur-sm" />
  // Panel
  <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-border-main overflow-hidden animate-fade-in">
    // Header row
    <div className="flex items-center justify-between p-5 border-b border-border-main">
      <h3 className="text-base font-bold text-text">Title</h3>
      <button className="w-8 h-8 rounded-lg hover:bg-surface2 flex items-center justify-center text-text3">
        <X className="w-4 h-4" />
      </button>
    </div>
    // Body
    <form className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">...</form>
  </div>
</div>
```

### 8.10 Toast

```tsx
<div className={`fixed top-24 right-8 z-[10000] flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-lg border text-sm font-semibold ${
  type === 'success' ? 'bg-white border-green-200 text-green-700' : 'bg-white border-red-200 text-red-600'
}`}>
  <Icon className="w-4 h-4" />
  {text}
</div>
```

### 8.11 Module Card (Admin Hub)

```tsx
<Link className="group relative bg-white rounded-2xl p-6 border border-border-main shadow-sm hover:shadow-lg hover:border-transparent transition-all duration-300 overflow-hidden">
  {/* Hover gradient overlay */}
  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"
    style={{ background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)' }} />
  {/* Icon + badge */}
  {/* Title + desc */}
  {/* CTA with animated arrow */}
  <div className="relative flex items-center gap-1.5 text-sm font-semibold text-accent">
    CTA Label
    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
  </div>
</Link>
```

### 8.12 Timeline (Activity Log)

```tsx
<div className="flex items-start gap-3 px-5 py-3.5">
  <div className="flex flex-col items-center shrink-0 mt-1">
    <div className="w-2 h-2 rounded-full bg-gg" />
    {!isLast && <div className="w-px flex-1 bg-border-main mt-1 min-h-[20px]" />}
  </div>
  <div className="flex-1 min-w-0">
    <div className="flex items-center gap-2 flex-wrap">
      <span className="chip chip-gg">Promo</span>
      <span className="text-xs font-bold text-accent">ClientName</span>
    </div>
    <p className="text-sm text-text mt-1 line-clamp-1">Note...</p>
  </div>
  <span className="text-[10px] text-text3 font-mono shrink-0">2026-03-15</span>
</div>
```

### 8.13 Filter Tag Buttons

```tsx
// Active (dark)
<button className="px-3 h-8 rounded-full text-xs font-bold bg-text text-white">Semua</button>
// Active (accent)
<button className="px-3 h-8 rounded-full text-xs font-bold bg-accent text-white">Tag</button>
// Inactive
<button className="px-3 h-8 rounded-full text-xs font-bold bg-surface2 text-text3 hover:bg-gray-200 transition-all">Tag</button>
```

---

## 9. Frosted Glass Effect

Digunakan pada Header (client) dan AdminTopbar:

```css
background: rgba(255,255,255,0.95);
backdrop-filter: blur(12px);
-webkit-backdrop-filter: blur(12px);
border-bottom: 1px solid rgba(229,231,235,0.6);
```

---

## 10. Admin Topbar — Anatomy

```
[Logo + Divider + Breadcrumb] ── [Hub | Input | Activity | Klien] ── [Dashboard link | Logout]
           Left                           Center                              Right
```

- Nav tab **active**: `bg-accent text-white shadow-sm rounded-xl px-3.5 py-2 text-xs font-semibold`
- Breadcrumb: `text-xs text-text3` → `ChevronRight` → `font-semibold text-text`

---

## 11. Status System — Semantics

```
rr  → ROAS turun ≤ -20%      → Kritis
or  → ROAS turun -10~-20%    → Perlu Perhatian
yy  → ROAS turun 0~-10%      → Waspada
nn  → Tidak ada data          → Netral
gg  → ROAS naik ≤ +20%       → Performa Baik
gd  → ROAS naik > +20%       → Sangat Baik
```

Severity order (worst → best):
```ts
export const ORD = ['rr', 'or', 'yy', 'nn', 'gg', 'gd'];
```

---

## 12. Utility Classes Quick Reference

```
.card              → bg-white rounded-2xl border border-border-main shadow-sm
.nav-active        → bg-accent text-white shadow-sm
.no-scrollbar      → hide scrollbar sepenuhnya
.dot               → w-2 h-2 rounded-full shrink-0 inline-block
.badge             → pill badge (rounded-full, 11px, font-semibold)
.chip              → smaller badge (rounded-md, 10px, font-bold)
.vt-ok             → value tag hijau (ROAS tercapai)
.vt-lo             → value tag merah (ROAS below target)
.animate-fade-in   → page/section mount animation
.animate-slide-in  → panel slide animation
.animate-spin      → loading spinner
.animate-pulse-soft → skeleton / loading pulse
```

---

## 13. Do's & Don'ts

**✅ Do:**
- Gunakan token warna (Tailwind class / CSS var) — jangan hardcode hex di komponen
- `rounded-2xl` untuk card, `rounded-xl` untuk input dan tombol
- `transition-all duration-200` untuk semua elemen interaktif
- `animate-fade-in` pada page/section yang baru mount
- Status selalu tampilkan dengan pasangan **dot + badge/chip**
- Avatar inisial: `.slice(0, 2).toUpperCase()` dari `cl.key`

**❌ Don't:**
- Jangan gunakan warna status di luar sistem `rr/or/yy/nn/gg/gd`
- Jangan tambahkan Sidebar/Header global di admin route
- Jangan skip `border border-border-main` pada card
- Jangan gunakan `text-black`, `text-gray-*` — pakai `text-text`, `text-text2`, dst.
- Jangan hardcode sidebar width — selalu `ml-[248px]` di layout wrapper
