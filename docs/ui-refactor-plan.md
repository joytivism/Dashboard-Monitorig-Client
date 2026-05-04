# UI Refactor Plan

## Status

Dokumen ini dibuat sebagai handoff agar refactor UI dashboard bisa dilanjutkan di chat/thread Codex baru tanpa kehilangan konteks.

Cara membaca dokumen ini:

- Bagian 1 sampai 10 adalah audit awal/historis sebelum Phase 2 sampai Phase 4D selesai.
- Bagian audit historis dipertahankan sebagai konteks keputusan, bukan daftar issue aktif.
- Status terkini ada di bagian `Current Status` paling bawah.

Dokumen desain utama:

- docs/design.md

Reference dashboard:

- docs/references/dashboard-reference.png

## Catatan Penting

Audit awal pernah mencatat potensi konflik antara `docs/design.md` dan palette final di plan ini. Catatan konflik itu sudah tidak current: `docs/design.md` sekarang sudah disinkronkan ke palette final orange/tosca/red/black/white pada cleanup Phase 4D.

Palette final yang harus dipakai adalah:

- Orange: #ff6301
- Tosca: #00a1a6
- Red: #e50000
- Black: #000000
- White: #ffffff

Jika ada style lama seperti navy, blue, emerald, slate, atau warm beige yang muncul di bagian audit historis, baca itu sebagai temuan lama. Untuk pekerjaan berikutnya, `docs/design.md` dan dokumen ini sudah mengarah ke palette final yang sama.

## 1. Struktur Dashboard pada Audit Awal (Historis)

Bagian ini adalah snapshot audit awal sebelum Phase 2 sampai Phase 4D. Jangan dibaca sebagai status current.

Root app memuat data global di src/app/layout.tsx lalu membagikannya lewat DataProvider.

Area client memakai shell bersama:

- AppShell
- Sidebar
- Header

Route utama client:

- overview /
- detail /client/[id]

Area admin punya gate login lokal di:

- src/app/(admin)/layout.tsx

Shell admin saat ini:

- AppShell
- AdminSidebar
- AdminHeader

Halaman yang sudah membentuk pola dashboard yang cukup konsisten:

- admin hub
- client overview
- client detail
- client management
- activity log

Pada audit awal, halaman yang masih berdiri sendiri dan belum ikut pola shared shell/page template:

- data input
- AI monitoring
- settings
- channel settings

Pada audit awal, `NavRail` disembunyikan di mobile pada:

- src/components/layout/NavRail.tsx

Saat audit awal, belum ada pengganti navigasi mobile yang setara. Item ini sudah selesai pada Phase 4C.

## 2. Existing Reusable Components pada Audit Awal (Historis)

Fondasi layout yang sudah layak dijadikan standar:

- AppShell
- NavRail
- TopBar
- PageIntro

Primitive UI yang sudah reusable:

- Card
- Badge
- Button
- MetricCard
- InputField
- SelectField

Widget domain yang sudah reusable:

- ClientTable
- StatusBanners
- ActivityLog
- ChannelPerformance
- FunnelAnalysis
- TrendChart
- AISummary

Pada audit awal, komponen yang sebaiknya diangkat jadi shared component karena masih duplikat:

- Toast
- ModalFrame
- SectionHeader
- shell untuk filter + table/list
- EmptyState
- LoadingState
- ErrorState

## 3. UI Inconsistencies pada Audit Awal (Historis)

Bagian ini adalah temuan historis dari audit awal. Banyak item di bawah sudah diselesaikan pada Phase 2 sampai Phase 4D.

Pada audit awal, fondasi visual belum sepenuhnya match dengan `docs/design.md`.

Style yang harus dicari dan diselaraskan:

- warna lama yang tidak sesuai palette final
- sidebar yang terlalu boxed/heavy
- top bar dengan efek terlalu dekoratif
- hero/page intro dengan glow dekoratif
- card yang terlalu berat
- spacing yang belum konsisten
- halaman yang belum memakai shared shell/template

Visual source of truth menampilkan dashboard yang:

- tenang
- netral
- compact
- border tipis
- minim dekorasi
- fokus ke informasi

Pada audit awal, shell masih terlalu card-heavy di beberapa bagian:

- sidebar boxed di NavRail
- top bar berkaca + breadcrumb di TopBar
- hero dengan glow dekoratif di PageIntro

Pada audit awal, belum ada halaman yang fully match referensi. Yang paling dekat baru struktur reuse-nya, bukan visual finalnya.

Pada audit awal, halaman paling tidak konsisten dengan sistem shared:

- data
- AI
- settings
- channel settings

Pada audit awal, ada route rusak:

- /admin/design-system

Saat audit awal, route ini direferensikan di:

- AdminSidebar
- AdminHeader
- admin hub

Namun file halamannya tidak ada. Referensi broken ini sudah dihapus pada cleanup Phase 4D.

Pada audit awal, ada komponen legacy yang tidak masuk arsitektur:

- Navbar.tsx
- Sparkline

Keduanya sudah dihapus pada cleanup Phase 4D karena tidak memiliki usage.

## 4. Recommended Component Plan (Historis)

Rencana ini adalah rekomendasi awal dan sudah dieksekusi bertahap pada Phase 2 sampai Phase 4D.

Mulai dari fondasi, bukan dari halaman per halaman.

Prioritas awal:

1. Selaraskan token warna
2. Selaraskan border
3. Selaraskan radius
4. Selaraskan spacing
5. Selaraskan typography
6. Selaraskan shell global

Satukan pola frame menjadi 1 sistem:

- PlatformSidebar
- PlatformTopbar
- PageHeader
- SectionCard
- StatCard
- TableShell
- Modal
- Toast
- EmptyState
- LoadingState
- ErrorState

Jadikan halaman berikut sebagai baseline template:

- client overview
- admin hub

Alasannya: dua halaman ini sudah paling dekat ke struktur dashboard yang reusable.

Setelah fondasi jadi, baru migrasikan halaman outlier ke template yang sama:

- data input
- AI monitoring
- settings
- channel settings

Rapikan juga item broken atau legacy:

- route /admin/design-system
- mobile navigation
- duplikasi Toast
- duplikasi ModalFrame
- Navbar.tsx
- Sparkline

## 5. Files Inspected

File/folder yang sudah disebut dalam audit:

- src/app/layout.tsx
- src/app/(admin)/layout.tsx
- src/components/layout/NavRail.tsx
- src/app/globals.css
- AppShell.tsx
- NavRail.tsx
- TopBar.tsx
- PageIntro.tsx
- Card.tsx
- Badge.tsx
- Button.tsx
- MetricCard.tsx
- InputField.tsx
- SelectField.tsx
- Header.tsx
- Sidebar.tsx
- AdminHeader.tsx
- AdminSidebar.tsx
- src/components/dashboard/*
- AISummary.tsx
- TrendChart.tsx

## 6. Files That Should Be Changed in Phase 2 (Historis)

Fondasi visual:

- src/app/globals.css
- AppShell.tsx
- NavRail.tsx
- TopBar.tsx
- PageIntro.tsx

Primitive UI:

- Card.tsx
- Badge.tsx
- Button.tsx
- MetricCard.tsx
- InputField.tsx
- SelectField.tsx

Wrapper navigasi:

- Header.tsx
- Sidebar.tsx
- AdminHeader.tsx
- AdminSidebar.tsx

Halaman utama yang perlu disejajarkan ke template final:

- client overview
- client detail
- admin hub
- client management
- activity log

Halaman paling prioritas untuk dibersihkan setelah fondasi:

- data input
- AI monitoring
- settings
- channel settings

Widget domain yang perlu dicek setelah fondasi:

- src/components/dashboard/*
- AISummary.tsx
- TrendChart.tsx

## 7. Design Decisions dari docs/design.md

Desain final harus mengikuti arah berikut:

- clean SaaS dashboard
- professional
- calm
- structured
- easy to scan
- data-focused
- minimal
- not noisy

Palette final:

- Orange #ff6301 untuk accent, active state, highlight, chart utama, notification indicator
- Tosca #00a1a6 untuk live, sync, healthy, info, success, chart secondary
- Red #e50000 hanya untuk error, danger, critical, failed, validation error
- Black #000000 untuk primary text, heading, icon, primary CTA
- White #ffffff untuk page/card/panel background

UI harus mostly neutral:

- white/neutral background dominan
- black untuk contrast
- orange hanya accent
- tosca hanya status/info/success
- red hanya error/danger

Style dashboard:

- sidebar fixed kiri di desktop
- sidebar width 240px sampai 260px
- sidebar background soft neutral gray
- nav item compact 36px sampai 40px
- card border tipis
- radius 12px sampai 16px
- shadow none atau sangat subtle
- page padding 24px sampai 32px
- section gap 32px
- typography compact
- dashboard tidak memakai hero marketing besar

## 8. Rencana Phase 2 (Historis, Completed)

Phase 2 awalnya difokuskan ke shared UI foundation dan sudah selesai.

Tugas Phase 2 yang sudah diselesaikan:

1. Pastikan src/app/globals.css memakai token warna final dari docs/design.md
2. Hilangkan atau kurangi style lama yang tidak sesuai palette final
3. Refactor AppShell agar menjadi shell dashboard utama
4. Refactor NavRail/Sidebar agar clean, compact, dan mirip reference
5. Refactor TopBar/Header agar minimal dan tidak terlalu dekoratif
6. Refactor PageIntro agar tidak terlalu hero/landing-page-like
7. Standardisasi Card, Badge, Button, MetricCard, InputField, SelectField
8. Pastikan semua komponen pakai spacing dan radius konsisten
9. Logic, data fetching, auth, routes, API calls, dan validation tetap tidak diubah
10. Dokumen ini kemudian diupdate dengan changed files dan follow-up historis

## 9. Risks atau Things to Preserve (Historis)

Jangan ubah:

- routes
- API calls
- authentication
- data fetching
- validation
- app logic
- business logic
- existing data flow
- DataProvider behavior
- admin login gate behavior
- client detail route behavior
- existing table/filter functionality

Risiko historis dari audit awal:

- Mengubah shell bisa berdampak ke banyak halaman
- Mengubah globals.css bisa mengubah semua tampilan
- Menghapus komponen legacy harus dicek dulu apakah benar tidak dipakai; `Navbar.tsx` dan `Sparkline.tsx` kemudian terbukti unused dan sudah dihapus
- Route `/admin/design-system` harus diputuskan; keputusan akhirnya adalah hapus semua referensi broken
- Pada audit awal, mobile navigation belum setara jika `NavRail` disembunyikan; fallback mobile navigation sudah selesai pada Phase 4C
- Jangan overuse orange/tosca/red
- Jangan membuat dashboard menjadi landing page

## 10. Validation Checklist Phase 2 (Historis)

Checklist awal sebelum Phase 2 dianggap selesai:

- layout mengikuti reference dashboard
- sidebar clean dan compact
- active navigation state jelas
- main content aligned
- card memakai border, radius, dan spacing konsisten
- typography hierarchy jelas
- warna mostly neutral
- orange hanya sebagai accent
- tosca hanya untuk info, live, atau success
- red hanya untuk error atau danger
- dashboard sections mudah discan
- responsive aman
- tidak ada dekorasi berlebihan
- app logic tetap aman
- route tidak berubah
- API call tidak berubah
- auth tidak berubah
- data fetching tidak berubah
- validation tidak berubah

## 11. Phase 2 Completion Update

Phase 2 selesai pada thread ini dengan fokus hanya ke shared dashboard UI foundation.

Status: **completed / selesai**.

Scope yang diselesaikan:

- standardisasi token warna, border, radius, spacing, dan surface di `src/app/globals.css`
- refactor AppShell agar frame dashboard lebih ringan, rapat, dan konsisten
- refactor NavRail + Sidebar/AdminSidebar agar lebih clean, compact, dan dekat ke reference
- refactor TopBar + Header/AdminHeader agar minim dekorasi dan lebih neutral
- refactor PageIntro agar tidak lagi terasa seperti hero marketing
- standardisasi Card, Badge, Button, MetricCard, InputField, dan SelectField
- pertahankan routes, API calls, auth, data fetching, validation, dan app logic

Changed files untuk Phase 2:

- src/app/globals.css
- src/components/layout/AppShell.tsx
- src/components/layout/NavRail.tsx
- src/components/layout/TopBar.tsx
- src/components/layout/PageIntro.tsx
- src/components/ui/Card.tsx
- src/components/ui/Badge.tsx
- src/components/ui/Button.tsx
- src/components/ui/MetricCard.tsx
- src/components/ui/InputField.tsx
- src/components/ui/SelectField.tsx
- src/components/Sidebar.tsx
- src/components/Header.tsx
- src/components/AdminSidebar.tsx
- src/components/AdminHeader.tsx

Catatan hasil:

- accent utama sekarang memakai orange `#ff6301`
- info/live/success disatukan ke tosca `#00a1a6`
- error/danger disatukan ke red `#e50000`
- primary text dan CTA utama memakai black `#000000`
- background/card utama memakai white `#ffffff` dengan neutral border tipis
- shell, nav, topbar, dan primitives sekarang lebih flat, compact, dan tidak dekoratif

Validation snapshot setelah Phase 2:

- layout foundation sudah jauh lebih dekat ke reference dashboard
- sidebar sudah lebih clean, compact, dan active state lebih jelas
- card, badge, button, input, select, dan metric card sudah memakai token yang konsisten
- orange tidak lagi dipakai sebagai fill dominan selain accent/warning/highlight
- tosca tidak lagi bercampur dengan biru/emerald untuk info dan success di shared foundation
- red dibatasi ke error, danger, dan critical state pada shared foundation
- route tidak berubah
- API call tidak berubah
- auth tidak berubah
- data fetching tidak berubah
- validation tidak berubah
- app logic tidak berubah

Known gap historis yang sengaja ditinggalkan setelah Phase 2:

- beberapa halaman dan widget saat itu masih punya local styling lama di luar shared foundation; halaman utama diselesaikan pada Phase 3 dan outlier admin diselesaikan pada Phase 4A
- mobile navigation saat itu belum setara penuh karena `NavRail` tetap hidden di mobile; fallback mobile navigation diselesaikan pada Phase 4C
- route `/admin/design-system` saat itu belum dibereskan; referensi broken sudah dihapus pada cleanup Phase 4D

## 12. Phase 3 Completion Update

Phase 3 pada thread ini difokuskan hanya ke halaman dashboard utama yang menjadi baseline visual sistem.

Status: **completed / selesai**.

Scope yang diselesaikan:

- terapkan foundation Phase 2 ke client overview `/`
- terapkan foundation Phase 2 ke client detail `/client/[id]`
- terapkan foundation Phase 2 ke admin hub `/admin`
- terapkan foundation Phase 2 ke client management `/admin/clients`
- terapkan foundation Phase 2 ke activity log `/admin/activity`
- selaraskan widget yang dipakai langsung oleh halaman-halaman di atas agar ikut memakai surface, border, spacing, dan hierarchy final
- angkat pola lokal yang duplikat menjadi shared component:
  - `SectionHeader`
  - `Toast`
  - `ModalFrame`
- pertahankan routes, API calls, auth, data fetching, validation, dan app logic

Changed files untuk Phase 3:

- `src/app/(client)/page.tsx`
- `src/app/(client)/client/[id]/page.tsx`
- `src/app/(admin)/admin/page.tsx`
- `src/app/(admin)/admin/clients/page.tsx`
- `src/app/(admin)/admin/activity/page.tsx`
- `src/components/dashboard/StatusBanners.tsx`
- `src/components/dashboard/ClientTable.tsx`
- `src/components/dashboard/ActivityLog.tsx`
- `src/components/dashboard/ChannelPerformance.tsx`
- `src/components/dashboard/FunnelAnalysis.tsx`
- `src/components/AISummary.tsx`
- `src/components/TrendChart.tsx`
- `src/components/ui/SectionHeader.tsx`
- `src/components/ui/Toast.tsx`
- `src/components/ui/ModalFrame.tsx`

Catatan hasil:

- layout halaman baseline sekarang lebih konsisten memakai `PageIntro`, section header yang seragam, card tipis, dan hierarchy yang lebih mudah discan
- warna legacy yang paling menonjol di widget utama sudah diganti ke palette final
- orange dipakai terutama untuk accent dan highlight penting, bukan sebagai fill dominan
- tosca dipakai untuk success/info/live signal dan secondary chart line
- red dibatasi ke warning kritis, delete flow, dan state error
- chart, list, table, dan feed activity dibuat lebih netral dan compact agar lebih dekat ke visual reference

Validation snapshot setelah Phase 3:

- layout mengikuti reference dashboard dengan arah lebih clean, tenang, dan data-focused
- sidebar dan topbar tetap memakai shell foundation Phase 2
- main content pada lima halaman target sekarang lebih aligned dan section gap lebih konsisten
- card, table, feed, dan metric sections memakai border tipis, radius konsisten, dan surface netral
- typography hierarchy lebih jelas lewat `PageIntro`, `SectionHeader`, `MetricCard`, dan table/list heading
- orange hanya dipakai untuk accent atau highlight penting
- tosca dipakai untuk info/live/success
- red dipakai untuk error/danger/delete/critical attention
- responsive aman untuk struktur halaman target
- tidak ada perubahan route
- tidak ada perubahan API call
- tidak ada perubahan auth
- tidak ada perubahan data fetching
- tidak ada perubahan validation
- tidak ada perubahan app logic

## 13. Phase 4A Completion Update

Phase 4A pada thread ini difokuskan hanya ke empat halaman admin outlier, tanpa menyentuh mobile navigation, route decision, atau cleanup legacy lain.

Status: **completed / selesai**.

Scope yang diselesaikan:

- migrasikan `/admin/data` ke template dashboard yang sama dengan Phase 3
- migrasikan `/admin/ai` ke template dashboard yang sama dengan Phase 3
- migrasikan `/admin/settings` ke template dashboard yang sama dengan Phase 3
- migrasikan `/admin/settings/channels` ke template dashboard yang sama dengan Phase 3
- ganti toast lokal di halaman-halaman target ke shared `Toast`
- pakai `PageIntro`, `SectionHeader`, `Card`, `Badge`, `Button`, `InputField`, `SelectField`, dan `MetricCard` bila relevan
- rapikan warna legacy, hierarchy, border, radius, spacing, dan table/form density
- pertahankan routes, API calls, auth, data fetching, validation, dan app logic

Changed files untuk Phase 4A:

- `src/app/(admin)/admin/data/page.tsx`
- `src/app/(admin)/admin/ai/page.tsx`
- `src/app/(admin)/admin/settings/page.tsx`
- `src/app/(admin)/admin/settings/channels/page.tsx`

Catatan hasil:

- keempat halaman outlier sekarang ikut frame visual admin dashboard yang sama dengan baseline Phase 3
- header halaman sekarang konsisten memakai `PageIntro` dan meta/action area yang lebih rapi
- card, form, dan table sekarang memakai surface netral, border tipis, radius konsisten, dan spacing yang lebih compact
- orange dipakai untuk accent/focus, tosca untuk success/info, dan red hanya untuk error/danger
- halaman AI sekarang memakai metric summary yang lebih konsisten dengan halaman dashboard lain
- halaman settings dan channel settings tidak lagi terasa seperti tool terpisah di luar sistem dashboard
- halaman data input tetap mempertahankan flow 2 langkah, tetapi visual dan density-nya sekarang selaras dengan shared UI foundation

Validation snapshot setelah Phase 4A:

- empat halaman outlier sudah jauh lebih dekat ke reference dashboard
- layout lebih clean, calm, compact, dan data-focused
- card, table, form, dan action bar mengikuti token visual final
- warna mostly neutral
- orange hanya dipakai sebagai accent/highlight
- tosca dipakai untuk success/info/live
- red dipakai untuk error/danger
- responsive aman untuk halaman target
- tidak ada perubahan route
- tidak ada perubahan API call
- tidak ada perubahan auth
- tidak ada perubahan data fetching
- tidak ada perubahan validation
- tidak ada perubahan app logic

## 14. Phase 4B Completion Update

Phase 4B pada thread ini difokuskan hanya ke standardisasi shared UI states dan repeated shells, tanpa menyentuh mobile navigation, route decision, audit legacy final, API layer, auth, atau app logic.

Status: **completed / selesai**.

Scope yang diselesaikan:

- tambahkan shared `TableShell` untuk pola section header + filter/toolbar + table/list/feed body + footer
- tambahkan shared `StateFrame` sebagai fondasi compact state/card pattern untuk info, warning, dan danger blocks
- tambahkan shared `EmptyState`
- tambahkan shared `LoadingState`
- tambahkan shared `ErrorState`
- migrasikan shell berulang di area berikut:
  - `ClientTable`
  - admin hub notes/empty slots
  - `/admin/clients`
  - `/admin/activity`
  - `/admin/ai`
  - `/admin/settings/channels`
- seragamkan repeated state/card pattern di area admin yang sebelumnya masih inline:
  - delete confirmation warning blocks
  - settings prompt warning block
  - data input upsert note
  - route-level admin loading/error states
  - shared widget empty/loading/error states yang masih lokal
- pertahankan route, API calls, authentication, data fetching, validation, dan app logic

Changed files untuk Phase 4B:

- `src/components/ui/StateFrame.tsx`
- `src/components/ui/EmptyState.tsx`
- `src/components/ui/LoadingState.tsx`
- `src/components/ui/ErrorState.tsx`
- `src/components/ui/TableShell.tsx`
- `src/components/dashboard/ClientTable.tsx`
- `src/components/dashboard/StatusBanners.tsx`
- `src/components/dashboard/ActivityLog.tsx`
- `src/components/AISummary.tsx`
- `src/app/(admin)/admin/page.tsx`
- `src/app/(admin)/admin/clients/page.tsx`
- `src/app/(admin)/admin/activity/page.tsx`
- `src/app/(admin)/admin/ai/page.tsx`
- `src/app/(admin)/admin/data/page.tsx`
- `src/app/(admin)/admin/settings/page.tsx`
- `src/app/(admin)/admin/settings/channels/page.tsx`
- `src/app/(admin)/admin/loading.tsx`
- `src/app/(admin)/admin/error.tsx`

Catatan hasil:

- shell filter/table/feed sekarang memakai hierarchy yang sama: header ringkas, toolbar compact, body data-first, dan footer tipis bila diperlukan
- empty/loading/error state sekarang punya bahasa visual yang sama di admin route dan shared dashboard widgets
- repeated warning/info card pattern tidak lagi di-hardcode per halaman; sekarang ikut frame state yang sama
- orange tetap dipakai sebagai accent/focus
- tosca dipakai untuk success/info/live
- red dipakai hanya untuk error/danger
- card tetap putih, border tipis, spacing compact, dan dekorasi minim sesuai reference

Validation snapshot setelah Phase 4B:

- visual state antar halaman admin sekarang lebih konsisten
- shell data collection tidak lagi terasa dibuat per halaman
- empty state memakai border ringan dan copy yang konsisten
- loading state tidak lagi berupa placeholder acak atau card khusus per halaman
- error state admin tidak lagi memakai styling hero merah yang terlalu berat
- repeated warning/info blocks sekarang mengikuti pattern netral yang sama
- responsive tetap aman pada halaman target
- tidak ada perubahan route
- tidak ada perubahan API call
- tidak ada perubahan auth
- tidak ada perubahan data fetching
- tidak ada perubahan validation
- tidak ada perubahan app logic
- scoped `eslint` lulus untuk semua file yang disentuh Phase 4B

## 15. Phase 4C Completion Update

Phase 4C pada thread ini difokuskan hanya ke fallback navigasi mobile untuk shell dashboard/client dan admin, sesuai scope prompt thread ini. Route decision `/admin/design-system`, audit legacy, dan final cleanup tidak disentuh di fase ini.

Status: **completed / selesai**.

Scope yang diselesaikan:

- tambahkan drawer navigasi mobile shared untuk layout yang sebelumnya hanya mengandalkan `NavRail` desktop
- tambahkan state shell shared di `AppShell` agar topbar bisa membuka/menutup drawer mobile tanpa mengubah app logic
- pertahankan daftar nav item dan destination yang sama antara desktop dan mobile
- tambahkan trigger menu mobile di `Header` dan `AdminHeader`
- sesuaikan `TopBar` agar konten mobile bisa stack / wrap dan tidak memaksa horizontal scrolling
- pastikan desktop `NavRail` tetap dipakai pada breakpoint besar tanpa mengubah perilaku existing desktop nav

Changed files untuk Phase 4C:

- `src/components/layout/AppShell.tsx`
- `src/components/layout/TopBar.tsx`
- `src/components/layout/NavRail.tsx`
- `src/components/layout/MobileNavDrawer.tsx`
- `src/components/Sidebar.tsx`
- `src/components/AdminSidebar.tsx`
- `src/components/Header.tsx`
- `src/components/AdminHeader.tsx`

Catatan hasil:

- mobile sekarang punya tombol menu yang selalu terlihat di topbar client dan admin
- saat dibuka, navigasi tampil sebagai drawer kiri dengan section, item, active state, brand block, dan footer action yang sama seperti desktop
- topbar mobile sekarang lebih aman untuk layar sempit karena title/breadcrumb/action area tidak lagi dipaksa dalam satu baris kaku
- desktop sidebar tetap fixed di kiri pada `lg` ke atas; tidak ada perubahan pada struktur nav desktop

Validation snapshot setelah Phase 4C:

- mobile users tetap bisa pindah halaman saat `NavRail` desktop disembunyikan
- route destinations tidak berubah
- nav items tidak berubah
- desktop navigation tetap preserved
- layout mobile lebih dekat ke guideline: content stack vertikal, sidebar berubah jadi drawer, dan action penting tetap terlihat
- scoped `eslint` lulus untuk semua file navigasi/shell yang disentuh Phase 4C
- tidak ada perubahan API call
- tidak ada perubahan authentication
- tidak ada perubahan data fetching
- tidak ada perubahan validation
- tidak ada perubahan app logic

Catatan historis tentang remaining cleanup setelah Phase 4C:

- route `/admin/design-system` saat itu masih belum diputuskan; sekarang referensinya sudah dihapus
- komponen legacy `Navbar.tsx` dan `Sparkline` saat itu belum diaudit final; sekarang keduanya sudah diaudit dan dihapus
- final sweep route/widget non-prioritas saat itu masih tersisa; cleanup Phase 4D berikutnya sudah menutup item tersebut

## 16. Phase 4D Audit Findings (Historis, Completed)

Status: **completed / selesai** sebagai audit.

Phase 4D pada thread tersebut adalah audit only. Tidak ada perubahan route, tidak ada penghapusan file, dan tidak ada edit kode aplikasi pada fase audit ini. Temuan di bawah dipertahankan sebagai konteks historis, bukan daftar issue aktif.

Semua item cleanup yang muncul dari audit Phase 4D sudah ditindaklanjuti pada section 17, 18, dan 19. Tidak ada item cleanup Phase 4D yang masih terbuka.

### 16.1 Referensi `/admin/design-system`

Pada audit Phase 4D, route `/admin/design-system` masih direferensikan di:

- `src/components/AdminSidebar.tsx`
- `src/components/AdminHeader.tsx`
- `src/app/(admin)/admin/page.tsx`

Temuan historis:

- file route `src/app/(admin)/admin/design-system/page.tsx` tidak ada
- route tersebut benar-benar broken, bukan hanya hidden atau conditionally rendered

Rekomendasi audit saat itu:

- **hapus referensi nav/quick action**, bukan restore route dan bukan postpone

Alasan audit:

- restore route berarti menambah scope baru karena harus membuat halaman internal baru
- postpone mempertahankan broken navigation di admin area
- menghapus referensi adalah perubahan paling kecil, paling aman, dan sesuai catatan plan bahwa route ini memang sudah terdokumentasi sebagai broken

Tindak lanjut:

- referensi `/admin/design-system` sudah dihapus pada cleanup setelah audit

### 16.2 Status komponen legacy

`Navbar.tsx`

- file ada di `src/components/Navbar.tsx` saat audit dilakukan
- tidak ditemukan import atau pemakaian di `src/app` maupun `src/components`
- isinya memakai nav item placeholder seperti `href: '#'`
- isinya juga masih membawa styling legacy seperti `bg-blue-500`, `bg-blue-100`, dan `bg-red-500`

Status audit:

- komponen legacy
- terlihat **unused**

Tindak lanjut:

- `src/components/Navbar.tsx` sudah dihapus karena tidak memiliki usage

`Sparkline`

- file ada di `src/components/ui/Sparkline.tsx` saat audit dilakukan
- tidak ditemukan import atau pemakaian di mana pun
- API komponen berbasis `color` prop raw string dan tidak terikat ke token warna final

Status audit:

- komponen legacy
- **unused**

Tindak lanjut:

- `src/components/ui/Sparkline.tsx` sudah dihapus karena tidak memiliki usage

### 16.3 Duplicated `Toast` dan `ModalFrame`

Temuan historis:

- tidak ditemukan file `Toast` atau `ModalFrame` lokal lain di luar shared component
- shared component yang sudah ada:
  - `src/components/ui/Toast.tsx`
  - `src/components/ui/ModalFrame.tsx`
- duplikasi saat itu bukan di level file komponen, tetapi di level pola penggunaan

Pada audit, pola state + auto-dismiss `Toast` masih diulang di:

- `src/app/(admin)/admin/data/page.tsx`
- `src/app/(admin)/admin/clients/page.tsx`
- `src/app/(admin)/admin/activity/page.tsx`
- `src/app/(admin)/admin/settings/page.tsx`
- `src/app/(admin)/admin/settings/channels/page.tsx`

Pada audit, pola `ModalFrame` yang masih berulang adalah:

- modal form dengan footer tombol aksi yang sangat mirip
- modal delete confirmation dengan warning block + dua tombol konfirmasi yang sangat mirip

Tindak lanjut:

- lifecycle toast berulang sudah diekstrak ke shared `useTimedToast`
- delete confirmation berulang sudah diekstrak ke shared `ConfirmDialog`
- `ModalFrame` tetap dipertahankan sebagai primitive

### 16.4 Unused UI components

Berdasarkan audit usage saat itu:

- `src/components/ui/Sparkline.tsx` -> **0 usage** saat audit dilakukan, lalu dihapus pada cleanup
- `src/components/Navbar.tsx` -> **0 usage** saat audit dilakukan, lalu dihapus pada cleanup

Komponen shared lain yang diperiksa masih terpakai, termasuk:

- `Toast`
- `ModalFrame`
- `SectionHeader`
- `EmptyState`
- `LoadingState`
- `ErrorState`
- `TableShell`
- `StateFrame`

### 16.5 Legacy color/style usage

Temuan historis legacy color/style yang paling menonjol saat audit:

1. `src/components/Navbar.tsx`
   - memakai `bg-blue-500`, `bg-blue-100`, `bg-red-500`
   - bukan bagian dari palette final

2. `src/data/constants.ts`
   - `STAGE_COLOR` masih memakai biru `#2563EB` dan hijau `#059669`
   - `TC` masih memakai kombinasi biru/hijau/merah/ungu lama

3. `src/lib/data.ts`
   - `STATUS_DOT` masih memakai palet lama:
     - `#DC2626`
     - `#EA580C`
     - `#D97706`
     - `#9CA3AF`
     - `#059669`
     - `#0284C7`

4. `src/app/login/page.tsx`
   - masih memakai banyak raw hex dan visual language lama/warm-beige
   - contoh: `#f5f1ea`, `#ff6a1a`, `#ecf2ff`, `#1d7f53`, `#1d9f66`
   - secara visual masih berdiri di luar sistem netral dashboard yang dipakai area client/admin

5. `src/components/ui/Button.tsx`
   - hover color masih hardcoded `#1f1f1f`, `#c90000`
   - tidak kritis, tetapi masih raw value di luar token sistem

6. `src/app/(admin)/admin/error.tsx`
   - primary hover color masih hardcoded `#1f1f1f`

Catatan update:

- catatan lama bahwa `docs/design.md` masih memuat palette lama navy/blue/emerald/slate sudah tidak current
- `docs/design.md` sudah disinkronkan ke palette final orange/tosca/red/black/white pada cleanup setelah audit
- sisa mention warna lama di dokumen ini hanya konteks audit historis

### 16.6 File yang Direkomendasikan Audit untuk Cleanup (Historis)

Semua target berikut adalah rekomendasi audit historis dan sudah ditindaklanjuti pada cleanup berikutnya.

Prioritas tinggi:

- `src/components/AdminSidebar.tsx`
- `src/components/AdminHeader.tsx`
- `src/app/(admin)/admin/page.tsx`

Tujuan historis:

- hapus referensi `/admin/design-system`

Status:

- selesai; referensi broken sudah dihapus

Prioritas menengah:

- `src/app/(admin)/admin/data/page.tsx`
- `src/app/(admin)/admin/clients/page.tsx`
- `src/app/(admin)/admin/activity/page.tsx`
- `src/app/(admin)/admin/settings/page.tsx`
- `src/app/(admin)/admin/settings/channels/page.tsx`
- `src/components/ui/Toast.tsx`

Tujuan historis:

- gabungkan pola penggunaan toast ke utility bersama

Status:

- selesai; shared `useTimedToast` sudah ditambahkan

Prioritas menengah:

- `src/app/(admin)/admin/clients/page.tsx`
- `src/app/(admin)/admin/activity/page.tsx`
- `src/components/ui/ModalFrame.tsx`

Tujuan historis:

- ekstrak `ConfirmDialog` dari pola delete modal yang berulang

Status:

- selesai; shared `ConfirmDialog` sudah ditambahkan

Prioritas menengah:

- `src/data/constants.ts`
- `src/lib/data.ts`
- `src/app/login/page.tsx`
- `src/components/ui/Button.tsx`
- `src/app/(admin)/admin/error.tsx`

Tujuan historis:

- bersihkan warna raw/legacy dan selaraskan ke token final

Status:

- selesai sesuai catatan cleanup Phase 4D

Prioritas dokumentasi:

- `docs/design.md`
- `docs/ui-refactor-plan.md`

Tujuan historis:

- sinkronkan sumber kebenaran palette agar tidak terjadi konflik brief lagi

Status:

- selesai; `docs/design.md` sudah sinkron ke palette final

### 16.7 Ringkasan Keputusan Audit

1. Referensi `/admin/design-system`
   - ada di `AdminSidebar`, `AdminHeader`, dan admin hub saat audit
   - file route tidak ada
   - keputusan tindak lanjut: hapus referensi
   - status akhir: selesai

2. Komponen legacy yang tampak unused
   - `src/components/Navbar.tsx` saat audit dilakukan
   - `src/components/ui/Sparkline.tsx` saat audit dilakukan
   - status akhir: keduanya sudah dihapus

3. Duplikasi yang digabung
   - lifecycle `Toast` per halaman
   - varian confirm/delete dialog berbasis `ModalFrame`
   - status akhir: `useTimedToast` dan `ConfirmDialog` sudah menjadi shared UI utilities

4. Sinkronisasi palette
   - catatan audit lama tentang konflik `docs/design.md` sudah tidak current
   - status akhir: `docs/design.md` sudah sinkron ke palette final

## 17. Cleanup Update: Broken Route Reference Removed (Completed)

Status: **completed / selesai**.

Tindak lanjut pertama dari audit Phase 4D sudah dikerjakan pada thread tersebut.

Scope yang diselesaikan:

- hapus referensi `/admin/design-system` dari admin navigation
- hapus referensi `/admin/design-system` dari quick action admin hub
- tidak membuat route baru
- tidak mengubah route aktif lain
- tidak mengubah data fetching, auth, validation, atau app logic

Changed files:

- `src/components/AdminSidebar.tsx`
- `src/components/AdminHeader.tsx`
- `src/app/(admin)/admin/page.tsx`

Catatan hasil:

- admin sidebar tidak lagi menampilkan destination yang broken
- admin header tidak lagi menganggap `/admin/design-system` sebagai bagian dari daftar nav internal
- admin hub tidak lagi menawarkan quick action menuju route yang tidak ada

Validation snapshot:

- referensi `/admin/design-system` sudah dihapus dari semua titik yang ditemukan di audit
- desktop navigation lain tetap preserved
- mobile drawer admin ikut bersih karena bersumber dari daftar nav yang sama
- tidak ada perubahan API call
- tidak ada perubahan authentication
- tidak ada perubahan data fetching
- tidak ada perubahan validation
- tidak ada perubahan app logic

Catatan status:

- remaining cleanup yang masih ada setelah langkah ini sudah diselesaikan pada section 18 dan 19

## 18. Cleanup Update: Unused Legacy Components Removed (Completed)

Status: **completed / selesai**.

Tindak lanjut berikutnya dari audit Phase 4D juga sudah dikerjakan pada thread tersebut.

Scope yang diselesaikan:

- hapus `src/components/Navbar.tsx` karena tidak punya usage dan masih membawa placeholder navigation serta warna legacy
- hapus `src/components/ui/Sparkline.tsx` karena tidak punya usage dan tidak terikat ke token visual final
- tidak mengubah route aktif
- tidak mengubah data fetching, auth, validation, atau app logic

Changed files:

- `src/components/Navbar.tsx`
- `src/components/ui/Sparkline.tsx`

Catatan hasil:

- dua file legacy yang orphan sudah tidak membebani codebase
- tidak ada import yang perlu dipindahkan karena keduanya memang tidak dipakai
- cleanup ini mengurangi risiko kebingungan antara komponen shared aktif vs komponen sisa desain lama

Validation snapshot:

- pencarian usage untuk `Navbar` dan `Sparkline` kosong sebelum file dihapus
- cleanup tidak memerlukan perubahan file runtime lain
- tidak ada perubahan route aktif
- tidak ada perubahan API call
- tidak ada perubahan authentication
- tidak ada perubahan data fetching
- tidak ada perubahan validation
- tidak ada perubahan app logic

Catatan status:

- remaining cleanup yang masih ada setelah langkah ini sudah diselesaikan pada section 19

## 19. Cleanup Update: Shared Toast, Confirm Dialog, and Palette Sync Completed (Completed)

Status: **completed / selesai**.

Cleanup sisa Phase 4D pada thread tersebut sudah dituntaskan di level shared UI, halaman admin, dan dokumentasi visual.

Scope yang diselesaikan:

- ekstrak lifecycle toast berulang ke shared hook `useTimedToast`
- ekstrak delete confirmation berulang ke shared `ConfirmDialog`
- ganti `confirm()` native di channel settings dengan modal confirm yang konsisten
- rapikan warna legacy di shared button, status/constants, admin error state, dan login page
- sinkronkan `docs/design.md` ke palette final orange/tosca/red/black/white
- tidak mengubah route aktif
- tidak mengubah API call, authentication, data fetching, validation, atau app logic

Changed files:

- `src/components/ui/useTimedToast.ts`
- `src/components/ui/ConfirmDialog.tsx`
- `src/app/(admin)/admin/data/page.tsx`
- `src/app/(admin)/admin/settings/page.tsx`
- `src/app/(admin)/admin/activity/page.tsx`
- `src/app/(admin)/admin/clients/page.tsx`
- `src/app/(admin)/admin/settings/channels/page.tsx`
- `src/components/ui/Button.tsx`
- `src/app/(admin)/admin/error.tsx`
- `src/data/constants.ts`
- `src/lib/data.ts`
- `src/app/login/page.tsx`
- `docs/design.md`

Catatan hasil:

- lima halaman admin sekarang memakai timing toast yang sama tanpa `useEffect` auto-dismiss yang diulang per file
- delete flow untuk clients, activity, dan channel settings sekarang memakai shell modal yang seragam
- `ModalFrame` tetap dipertahankan sebagai primitive, tetapi confirm/delete variant sudah tidak diduplikasi
- mapping warna legacy biru/hijau/ungu lama di constants sudah diganti ke palette final
- login page tetap mempertahankan struktur dan auth flow yang sama, tetapi surface, accent, error, dan info color sekarang mengikuti token final
- `docs/design.md` tidak lagi bertentangan dengan implementasi palette yang dipakai aplikasi

Validation snapshot:

- referensi `useTimedToast` sudah menggantikan auto-dismiss toast lokal di halaman admin yang diaudit
- `ConfirmDialog` sekarang dipakai oleh clients, activity, dan channel settings
- pencarian warna legacy utama yang diaudit tidak lagi menemukan usage di `src`; sisa mention hanya ada di bagian audit historis dokumen ini
- tidak ada perubahan route aktif
- tidak ada perubahan API call
- tidak ada perubahan authentication
- tidak ada perubahan data fetching
- tidak ada perubahan validation
- tidak ada perubahan app logic

Catatan status:

- tidak ada item cleanup Phase 4D yang masih terbuka dari daftar audit awal
- peningkatan lanjutan bila dibutuhkan nanti bersifat opsional, misalnya `ToastProvider` global lintas halaman atau penyetelan ulang semantics warna status/chart jika tim ingin pembedaan visual yang lebih granular

## 20. Post-Refactor Stability Hardening (Completed)

Status: **completed / selesai**.

Setelah cleanup UI Phase 4D selesai, thread tersebut juga melanjutkan hardening repo di level lint, typecheck, dan build agar status implementasi lebih aman untuk diteruskan.

Scope yang diselesaikan:

- rapikan typing longgar di `src/app/actions/ai.ts` agar lolos lint tanpa `any`
- rapikan typing widget dashboard di `ChannelPerformance` dan `TrendChart` agar lolos `tsc --noEmit`
- hilangkan warning lint di helper Supabase cookie session
- ganti file convention `src/middleware.ts` menjadi `src/proxy.ts` sesuai Next.js 16
- hilangkan dependency build ke `next/font/google` agar build tidak lagi bergantung koneksi ke Google Fonts
- pertahankan route, API call, auth, data fetching, validation, dan app logic

Changed files:

- `src/app/actions/ai.ts`
- `src/lib/supabase/middleware.ts`
- `src/components/dashboard/ChannelPerformance.tsx`
- `src/components/TrendChart.tsx`
- `src/app/layout.tsx`
- `src/app/globals.css`
- `src/proxy.ts`

Catatan hasil:

- lint repo penuh sekarang bersih
- typecheck TypeScript sekarang bersih
- build production dengan `next build --webpack` lulus
- warning deprecated file convention `middleware` sudah tidak relevan karena entrypoint sekarang memakai `proxy.ts`
- build tidak lagi gagal karena fetch font Inter dari Google Fonts

Validation snapshot:

- `npm run lint -- .` lulus
- `npx tsc --noEmit` lulus
- `npx next build --webpack` lulus
- `npm run build` default Turbopack di sandbox ini masih bisa panic karena keterbatasan environment lokal Codex saat mencoba membuat process/port untuk pipeline CSS, jadi ini dicatat sebagai kendala environment, bukan error aplikasi

Remaining technical debt setelah hardening ini:

- tidak ada error lint global yang tersisa
- tidak ada error typecheck global yang tersisa
- build tervalidasi lewat webpack
- bila ingin zero-noise di semua environment, tahap lanjutan yang opsional adalah investigasi panic Turbopack spesifik sandbox, tetapi itu bukan blocker codebase saat ini

## 21. Phase 5 Completion Update (Completed)

Status: **completed / selesai untuk implementasi responsive polish dan static validation**.

Phase 5 melanjutkan dokumen ini dengan visual QA berbasis `docs/design.md`, referensi `docs/references/dashboard-reference.png`, dan audit kode untuk halaman dashboard/admin yang protected auth. Karena environment lokal tanpa sesi Supabase valid selalu redirect ke `/login`, browser screenshot langsung hanya tervalidasi untuk login page; halaman protected dashboard/admin tetap diperiksa lewat struktur komponen, CSS, dan route/page code tanpa mengubah auth flow.

Scope yang diselesaikan:

- rapikan responsive spacing shared surface untuk card, page intro, table shell, state frame, modal, dan confirm dialog
- rapikan hierarchy typography agar tidak memakai negative tracking dan tidak bergantung `clamp()` viewport scaling
- tambahkan `min-w-0` pada button, input, select, badge, top bar, dan field wrapper agar teks/form tidak memaksa overflow mobile
- selaraskan login page ke visual system final: white card, black primary CTA, orange accent terbatas, tosca untuk info/success, red untuk error
- hilangkan decorative gradient orb di login agar lebih sesuai dengan arahan light, structured, data-first
- perbaiki mobile login overflow sehingga card, input, dan button tidak terpotong pada viewport sempit
- rapikan responsive action area pada overview dashboard, client detail, dan admin hub agar control period/action tidak memakai minimum width yang memecah layout mobile
- pastikan destructive action di activity log tetap terlihat pada perangkat touch, bukan hanya hover desktop
- perbarui copy admin hub yang masih mengarah ke preview design-system lama tanpa menambah route atau fitur baru
- pertahankan route, API call, authentication, data fetching, validation, dan app logic

Changed files Phase 5:

- `src/app/globals.css`
- `src/app/login/page.tsx`
- `src/app/(client)/page.tsx`
- `src/app/(client)/client/[id]/page.tsx`
- `src/app/(admin)/admin/page.tsx`
- `src/app/(admin)/admin/activity/page.tsx`
- `src/components/layout/PageIntro.tsx`
- `src/components/layout/TopBar.tsx`
- `src/components/Sidebar.tsx`
- `src/components/AdminSidebar.tsx`
- `src/components/ui/Badge.tsx`
- `src/components/ui/Button.tsx`
- `src/components/ui/Card.tsx`
- `src/components/ui/ConfirmDialog.tsx`
- `src/components/ui/InputField.tsx`
- `src/components/ui/ModalFrame.tsx`
- `src/components/ui/SelectField.tsx`
- `src/components/ui/StateFrame.tsx`
- `src/components/ui/TableShell.tsx`
- `docs/ui-refactor-plan.md`

Validation snapshot:

- `npm run lint -- .` lulus
- `npx tsc --noEmit` lulus
- `npx next build --webpack` lulus
- `npm run build` default Turbopack di sandbox ini masih panic karena keterbatasan environment lokal Codex saat pipeline CSS mencoba operasi process/port; build webpack sudah menjadi validasi produksi yang lulus
- Chrome headless screenshot login mobile dan desktop sudah dipakai untuk memastikan layout login tidak overflow
- halaman protected dashboard/admin perlu screenshot authenticated pass pada environment yang memiliki sesi login/test credential

## Current Status

- Cleanup Phase 4 sudah selesai.
- Shared dashboard foundation sudah selesai.
- Main dashboard pages sudah diperbarui.
- Outlier admin pages sudah diperbarui.
- Shared states dan repeated shells sudah distandardisasi.
- Mobile navigation fallback sudah diimplementasikan.
- Broken `/admin/design-system` references sudah dihapus.
- Legacy unused `Navbar.tsx` dan `Sparkline.tsx` sudah dihapus.
- `useTimedToast` dan `ConfirmDialog` sekarang menjadi shared UI utilities.
- `docs/design.md` sudah sinkron ke final brand palette.
- Tidak ada item cleanup Phase 4D yang masih terbuka.
- Phase 5 responsive polish sudah selesai untuk shared dashboard/admin UI dan login page.
- Lint, typecheck, dan build webpack sudah lulus setelah Phase 5.

## Remaining Final QA Tasks

Tidak ada cleanup Phase 4D yang masih terbuka. Sisa pekerjaan berikut adalah QA final manual, bukan fase refactor baru:

- lakukan authenticated browser pass untuk main overview dashboard, client detail page, admin hub, client management, activity log, `/admin/data`, `/admin/ai`, `/admin/settings`, dan `/admin/settings/channels`
- ambil screenshot desktop, tablet, dan mobile setelah sesi auth tersedia
- cek ulang perilaku sidebar desktop dan mobile navigation drawer pada halaman protected
- cek ulang card spacing, typography hierarchy, button, badge, form/input, table/list, dan empty/loading/error state di data nyata
- bandingkan hasil akhir dengan `docs/references/dashboard-reference.png` dan checklist `docs/design.md`
- jalankan ulang lint, typecheck, dan build di environment non-sandbox bila ingin memverifikasi default Turbopack build tanpa limitasi Codex lokal
