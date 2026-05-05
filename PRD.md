# Product Requirements Document

## 1. Metadata

Product name: Real Advertise Command Center

Product type: Dashboard Monitoring Client untuk portfolio iklan e-commerce dan marketplace.

Repository/build source: Dashboard Monitoring Client

Document status: Draft PRD berdasarkan build saat ini

Document date: 2026-05-04

Primary audience: Product, Engineering, Operations, Account Strategist, Management

Primary stack observed:
- Next.js 16.2.4 App Router
- React 19.2.4
- Supabase Auth, SSR, and database
- Chart.js via react-chartjs-2
- OpenRouter AI integration
- Tailwind CSS 4 and custom design tokens

## 2. Executive Summary

Real Advertise Command Center adalah workspace internal untuk memantau kesehatan performa iklan lintas klien dan lintas channel. Produk ini membantu tim melihat revenue, spend, ROAS, growth, funnel TOFU/MOFU/BOFU, activity context, serta rekomendasi AI dalam satu dashboard terpadu.

Build saat ini sudah mencakup dua pengalaman utama:

1. Client Workspace
   - Portfolio overview untuk seluruh klien.
   - Detail client dengan KPI, funnel, chart, channel performance, activity log, dan AI strategy insight.
   - Navigasi cepat, search client, period selector, status health, dan alert visual.

2. Admin Console
   - Admin hub untuk portfolio health, data coverage, alert, top performers, at-risk accounts, dan AI usage.
   - Input data performa per client, period, dan channel.
   - Client management untuk identitas klien, ownership, active channels, dan target ROAS.
   - Activity log management untuk promo, event, content, dan launching.
   - AI monitoring untuk request, token, dan estimated cost.
   - System settings untuk OpenRouter key, AI model, prompt, dan channel definitions.

PRD ini merumuskan requirement produk berdasarkan perilaku dan struktur build yang ada, lalu menambahkan acceptance criteria, aturan bisnis, batasan, risiko, dan roadmap agar build bisa dilanjutkan menjadi produk operasional yang lebih siap digunakan.

## 3. Product Context

### 3.1 Latar Belakang

Tim performance marketing dan account strategist biasanya mengelola banyak klien, banyak channel, banyak format data, dan banyak konteks campaign. Tanpa dashboard terpadu, proses monitoring mudah terpecah ke spreadsheet, laporan platform, chat internal, dan catatan manual. Dampaknya:

- Klien yang bermasalah lambat terdeteksi.
- Perbandingan antar periode membutuhkan kalkulasi manual.
- Context campaign seperti promo, event, content, dan launching tidak mudah dikaitkan dengan perubahan performa.
- Data awareness, assisted conversion, dan conversion sering tercampur tanpa struktur funnel yang jelas.
- AI insight tidak terpantau penggunaan token dan biayanya.

### 3.2 Masalah Utama

Produk ini harus menjawab pertanyaan operasional berikut:

- Klien mana yang performanya paling berisiko pada periode aktif?
- Klien mana yang punya momentum growth terbaik?
- Channel mana yang menjadi penyebab utama penurunan?
- Apakah spend menghasilkan revenue dan order secara efisien?
- Apa konteks aktivitas yang mungkin memengaruhi performa?
- Apa rekomendasi tindakan yang bisa langsung diprioritaskan?
- Apakah data semua client sudah masuk untuk periode berjalan?
- Apakah konfigurasi channel, prompt AI, dan client ownership sudah benar?

### 3.3 Vision Statement

Menjadi command center operasional untuk membaca sinyal penting portfolio iklan dengan cepat, akurat, dan actionable, sehingga tim tidak perlu tenggelam dalam noise data lintas platform.

## 4. Goals and Success Metrics

### 4.1 Product Goals

G1. Mempercepat identifikasi client at-risk
- Tim dapat mengetahui daftar klien yang perlu review dalam waktu kurang dari 5 menit setelah login.

G2. Menyatukan metrik iklan lintas funnel
- Revenue, spend, reach, orders, visitors, impressions, results, ROAS, CIR, CPO, CR, dan AOV tersedia dalam satu pengalaman dashboard.

G3. Memudahkan input data periodik
- Admin dapat mengisi atau memperbarui data performa per client, period, dan channel tanpa mengedit database langsung.

G4. Memberikan insight strategis berbasis AI
- User dapat meminta ringkasan AI dalam format summary dan recommended actions untuk client tertentu.

G5. Menjaga konfigurasi operasional tetap self-service
- Admin dapat mengelola client, channel, target ROAS, prompt AI, model AI, dan activity log dari UI.

G6. Menyediakan akses berbasis role
- Admin dan client user mendapatkan pengalaman yang sesuai hak aksesnya.

### 4.2 Measurable Success Metrics

M1. Time to detect at-risk clients
- Target: kurang dari 5 menit dari login sampai user membuka detail client at-risk.

M2. Data input completion time
- Target: kurang dari 10 menit untuk input satu client dengan 7 channel pada satu periode.

M3. Data coverage visibility
- Target: admin bisa melihat persentase client yang sudah memiliki data periode aktif.

M4. AI insight adoption
- Target: minimal 60 persen detail client yang dibuka oleh account strategist menghasilkan AI insight pada periode aktif.

M5. Configuration completeness
- Target: 100 persen active clients memiliki minimal 1 channel aktif dan ownership field utama.

M6. Error rate for AI generation
- Target: kurang dari 5 persen request AI berakhir gagal karena parsing atau konfigurasi.

M7. Performance
- Target: dashboard initial render usable dalam 3 detik pada dataset MVP.

## 5. Non-goals

N1. Produk ini bukan full BI replacement seperti Looker, Metabase, atau Tableau.

N2. Build saat ini belum mencakup automatic ingestion langsung dari Shopee, TikTok, Meta, atau platform iklan lain.

N3. Produk ini belum mencakup attribution modeling kompleks atau MMM.

N4. Produk ini belum mencakup approval workflow untuk perubahan data.

N5. Produk ini belum mencakup real-time streaming dari ad platform. Istilah "live" pada UI saat ini berarti data server dinamis dari database, bukan stream real-time platform.

N6. Produk ini belum mencakup export PDF/PPT laporan client.

N7. Produk ini belum mencakup multi-tenant agency dengan isolasi organisasi penuh.

## 6. User Personas

### 6.1 Admin / Operations Manager

Tanggung jawab:
- Mengelola data performa.
- Mengelola client directory.
- Mengatur channel dan prompt AI.
- Memastikan AI dan database siap digunakan.
- Memantau client at-risk dan data coverage.

Kebutuhan:
- Input data cepat dan minim salah.
- CRUD client dan channel dari UI.
- Alert portfolio yang mudah diprioritaskan.
- Monitoring usage AI dan health system.

Primary routes:
- /admin
- /admin/data
- /admin/activity
- /admin/ai
- /admin/clients
- /admin/settings
- /admin/settings/channels

### 6.2 Account Strategist

Tanggung jawab:
- Menganalisis performa client.
- Menentukan tindakan optimasi.
- Membaca hubungan aktivitas dengan performa.
- Menggunakan AI insight sebagai draft rekomendasi.

Kebutuhan:
- Client detail yang jelas.
- Trend dan funnel mudah dipahami.
- Prioritas channel bermasalah.
- Activity context untuk menjelaskan perubahan.

Primary routes:
- /
- /client/[id]

### 6.3 Management / Leadership

Tanggung jawab:
- Melihat portfolio health.
- Mengidentifikasi account terbaik dan account berisiko.
- Mengawasi efisiensi spend dan AI usage.

Kebutuhan:
- Ringkasan portfolio yang cepat.
- At-risk queue.
- Top performers.
- Data coverage dan system readiness.

Primary routes:
- /
- /admin
- /admin/ai

### 6.4 Client User

Tanggung jawab:
- Melihat performa account miliknya.
- Membaca ringkasan KPI, funnel, channel, activity, dan AI insight.

Kebutuhan:
- Akses hanya ke client terkait.
- Detail performa mudah dibaca tanpa melihat client lain.

Primary routes:
- /client/[client_key]

## 7. Role and Permission Model

### 7.1 Current Build Behavior

Authentication:
- Login menggunakan Supabase Auth melalui email atau username.
- Jika input login tidak mengandung "@", sistem mencari email di tabel profiles berdasarkan username.
- Session dikelola melalui Supabase SSR.

Routing protection:
- User tanpa session diarahkan ke /login.
- User dengan session yang membuka /login diarahkan ke /.
- User dengan role client dan client_key diarahkan dari / ke /client/[client_key].
- Route /admin diproteksi agar hanya profile role admin yang boleh masuk.

Admin extra gate:
- Admin group layout memiliki gate lokal berbasis localStorage dengan password hardcoded "admin123".
- Gate ini bersifat tambahan di client side, bukan pengganti authorization server side.

### 7.2 Required Target Behavior

R1. Semua akses harus dikendalikan oleh Supabase Auth dan role di database.

R2. Role minimal:
- admin: akses penuh ke admin console dan semua client.
- client: akses hanya ke /client/[client_key] sesuai profile.
- strategist/manager, optional future: akses portfolio overview dan detail client sesuai assignment.

R3. Admin localStorage gate harus diganti atau dihapus setelah role-based access matang.

R4. Tabel profiles harus masuk ke schema resmi karena saat ini code bergantung pada profiles tetapi schema build belum mendefinisikannya.

R5. Row Level Security Supabase harus memastikan client user tidak bisa membaca data client lain dari browser client.

## 8. Product Scope

### 8.1 In Scope for MVP

- Login internal.
- Role-based routing admin/client.
- Portfolio overview.
- Client detail.
- Funnel analysis.
- Channel performance by stage.
- AI summary per client.
- AI usage logging.
- Admin data input manual.
- Client CRUD.
- Client channel assignment.
- Target ROAS per client-channel.
- Activity log CRUD.
- Channel definition management.
- System setting management for AI.
- Basic notifications for at-risk client.
- Mobile responsive navigation.

### 8.2 Out of Scope for MVP

- Automatic platform API integration.
- File upload import CSV/XLSX.
- Audit trail for every admin mutation.
- Approval/review workflow.
- Report export.
- Custom dashboard builder.
- Custom metric builder.
- Client-facing comment thread.
- Multi-organization tenancy.

## 9. Routes and Modules

| Route | Module | Audience | Purpose |
| --- | --- | --- | --- |
| /login | Login | All users | Authenticate into workspace |
| / | Portfolio Overview | Internal users | Monitor all client performance and health |
| /client/[id] | Client Detail | Internal and scoped client users | Deep-dive per client |
| /admin | Admin Hub | Admin | Portfolio control center and admin shortcuts |
| /admin/data | Data Input | Admin | Input/update performance data |
| /admin/activity | Activity Log Admin | Admin | Add/delete activity context |
| /admin/ai | AI Monitoring | Admin | Monitor token, request, and cost logs |
| /admin/clients | Client Management | Admin | CRUD client metadata and channel assignment |
| /admin/settings | System Settings | Admin | Configure OpenRouter key, model, and AI prompt |
| /admin/settings/channels | Channel Settings | Admin | Manage channel label, stage, and type |

## 10. Core User Journeys

### 10.1 Login Journey

1. User opens app.
2. If not authenticated, user is redirected to /login.
3. User enters email or username and password.
4. System authenticates via Supabase.
5. If login fails, system shows error.
6. If login succeeds:
   - admin/internal user enters overview or admin route.
   - client user with client_key is routed to /client/[client_key].

Acceptance criteria:
- Login supports email.
- Login supports username lookup via profiles.username.
- Invalid credentials show readable error.
- Authenticated users cannot remain on /login.
- Unauthenticated users cannot access dashboard pages.

### 10.2 Portfolio Monitoring Journey

1. User lands on Portfolio Overview.
2. User selects active period.
3. System shows portfolio KPI:
   - active clients
   - total revenue
   - blended ROAS
   - total ad spend
4. System shows clients needing review.
5. System shows top growth clients.
6. User filters/searches client table by client, industry, channel group, or PIC.
7. User sorts by status, revenue, spend, ROAS, or channel group.
8. User opens client detail.

Acceptance criteria:
- KPI responds to selected period.
- Risk list only includes clients with status rr or or.
- Top growth list shows positive growth clients sorted descending.
- Table search and filters can be combined.
- Clicking a client preserves active period query.

### 10.3 Client Detail Journey

1. User opens /client/[id].
2. System validates client exists.
3. System shows client profile, current status, and period selector.
4. System calculates funnel metrics for active period and previous period.
5. System shows priority review card if one or more channels are critical/warning.
6. System shows KPI cards:
   - total revenue
   - total spend
   - BOFU ad ROAS
   - total orders
7. User can request AI Strategy Insight.
8. System shows trend chart with selectable metrics.
9. System shows efficiency breakdown.
10. System shows funnel analysis by TOFU/MOFU/BOFU.
11. System shows channel performance grouped by funnel stage.
12. System shows activity feed for that client.

Acceptance criteria:
- Nonexistent client shows not found state.
- Period selector updates query parameter.
- Problem channel card appears only when channel status rr/or.
- Trend chart allows max 3 active metrics.
- AI insight is generated on demand and cached per session/cache key.

### 10.4 Admin Data Input Journey

1. Admin opens /admin/data.
2. Admin selects client.
3. Admin selects existing period or creates a new month period.
4. System detects whether data exists for that client-period.
5. System renders active channel rows for selected client.
6. For awareness channel, admin fills spend, reach, impressions, results.
7. For performance channel, admin fills spend, revenue, orders, results/visits.
8. Admin saves all rows.
9. System upserts period if new.
10. System upserts channel_performance using unique combination client_key, channel_key, period_key.
11. System refreshes dashboard data and shows success toast.

Acceptance criteria:
- Form is hidden until valid client and period exist.
- Period must match YYYY-MM.
- Existing rows prefill values.
- Save uses upsert behavior.
- Reset clears current draft rows.
- Success and error states appear via toast.

### 10.5 Client Management Journey

1. Admin opens /admin/clients.
2. Admin searches client directory.
3. Admin toggles grid/list view.
4. Admin adds or edits client metadata.
5. Admin assigns active channels.
6. Admin sets target ROAS per selected channel.
7. Admin saves client.
8. System upserts client.
9. System replaces client_channels for the client.
10. Admin can request deletion and confirm.

Acceptance criteria:
- Required fields: client_key and display name.
- client_key is disabled during edit.
- Active channels come from channel definitions.
- Target ROAS is optional per channel.
- Delete action uses confirmation dialog.
- Deleting a client cascades related data according to database constraints.

### 10.6 Activity Log Journey

1. Admin opens /admin/activity.
2. Admin searches by note or client.
3. Admin filters by client.
4. Admin adds activity with client, type, note, and date.
5. Admin deletes activity with confirmation.
6. Activity appears on client detail and admin feeds.

Activity types:
- p: Promo
- e: Event
- c: Content
- l: Launching

Acceptance criteria:
- Activity requires client_key, type, note, and date.
- Activity list is newest first.
- Delete is disabled for entries without database id.
- Client detail only shows activities for that client.

### 10.7 AI Insight Journey

1. User opens client detail.
2. User clicks Analyze Performance.
3. System sends client metrics to server action.
4. Server reads AI settings from system_settings.
5. System builds prompt with variables.
6. System calls OpenRouter.
7. System extracts valid JSON response.
8. System logs usage to ai_usage_logs.
9. UI shows executive summary and recommended actions.
10. User can re-analyze manually.

Acceptance criteria:
- AI output must contain status, summary, and actions.
- If API key is missing, UI receives a warning response.
- If OpenRouter fails, fallback response is shown.
- Usage logs include client_key, model_name, tokens_used, estimated_cost.
- Session cache prevents duplicate automatic re-fetches for the same client/metric state.

### 10.8 Channel Settings Journey

1. Admin opens /admin/settings/channels.
2. Admin views all channel definitions.
3. Admin adds new channel draft.
4. Admin sets:
   - channel_key
   - label
   - stage
   - type
5. Admin saves all channel definitions via upsert.
6. Admin can delete an existing channel after confirmation.

Acceptance criteria:
- Existing channel_key is read-only.
- New channel_key is editable.
- channel_key and label are required.
- Stage values: tofu, mofu, bofu.
- Type values: revenue, assist, awareness.
- Deleting a channel warns about linked performance data.

### 10.9 System Settings Journey

1. Admin opens /admin/settings.
2. System loads OpenRouter API key, AI prompt, and model ID.
3. Admin edits settings.
4. Admin saves.
5. System upserts settings by key.

Acceptance criteria:
- Loading state appears while settings load.
- Prompt displays available variables.
- Save updates openrouter_key, ai_prompt, and ai_model.
- UI warns to keep JSON format instruction in prompt.

### 10.10 AI Monitoring Journey

1. Admin opens /admin/ai.
2. System calculates total cost, total tokens, total requests, and average cost per request.
3. System displays latest AI usage logs.

Acceptance criteria:
- Empty state appears when no logs exist.
- Log table shows timestamp, client, model, tokens, cost, and action affordance.
- Stats update based on ai_usage_logs.

## 11. Functional Requirements

### 11.1 Authentication and Session

FR-AUTH-001: System must redirect unauthenticated users to /login.

FR-AUTH-002: System must authenticate users through Supabase Auth.

FR-AUTH-003: System must allow login by email.

FR-AUTH-004: System should allow login by username by resolving profiles.username to profiles.email.

FR-AUTH-005: System must redirect authenticated users away from /login.

FR-AUTH-006: System must route client role users to their assigned client detail.

FR-AUTH-007: System must prevent non-admin users from accessing /admin routes.

FR-AUTH-008: System must support logout from both client and admin shells.

### 11.2 Portfolio Overview

FR-OVR-001: System must display active client count.

FR-OVR-002: System must calculate total revenue for selected period.

FR-OVR-003: System must calculate total ad spend for selected period.

FR-OVR-004: System must calculate blended ROAS.

FR-OVR-005: System must compare selected period against previous period.

FR-OVR-006: System must classify client health based on worst channel status.

FR-OVR-007: System must show at-risk clients with rr/or status.

FR-OVR-008: System must show top growth clients with positive revenue growth.

FR-OVR-009: System must provide search by client name/key and industry.

FR-OVR-010: System must provide filters for channel group, industry, and PIC/account strategist.

FR-OVR-011: System must allow sorting by key, status, revenue, spend, ROAS, and channel group.

### 11.3 Client Detail

FR-CLT-001: System must show client profile metadata.

FR-CLT-002: System must show current status badge based on selected period.

FR-CLT-003: System must show problem channel section if critical or warning channel exists.

FR-CLT-004: System must show total revenue, total spend, BOFU ROAS, and total orders.

FR-CLT-005: System must show AI Strategy Insight component.

FR-CLT-006: System must show trend chart by period.

FR-CLT-007: System must allow selecting up to 3 active chart metrics.

FR-CLT-008: System must show efficiency breakdown for ROAS, CIR, CPO, CR, and AOV.

FR-CLT-009: System must show funnel analysis by TOFU, MOFU, and BOFU.

FR-CLT-010: System must show channel performance grouped by stage.

FR-CLT-011: System must show activity log filtered to current client.

### 11.4 Admin Hub

FR-ADM-001: System must show portfolio revenue, system efficiency, critical alert count, and token usage.

FR-ADM-002: System must show data coverage percentage for active period.

FR-ADM-003: System must show AI requests today and total AI usage.

FR-ADM-004: System must show top performers by ROAS.

FR-ADM-005: System must show at-risk accounts.

FR-ADM-006: System must provide quick actions to Data Input, AI Monitoring, and Client Management.

FR-ADM-007: System must show current client health list.

FR-ADM-008: System must show recent portfolio activity.

### 11.5 Data Input

FR-DATA-001: Admin must select client and period before data rows appear.

FR-DATA-002: Admin must be able to create a new monthly period.

FR-DATA-003: System must prefill existing channel_performance data.

FR-DATA-004: System must render metric fields based on channel type.

FR-DATA-005: Awareness channel fields must include spend, reach, impressions, and results.

FR-DATA-006: Performance/assist/revenue channel fields must include spend, revenue, orders, and visitors/results.

FR-DATA-007: System must upsert all rows by client_key, channel_key, and period_key.

FR-DATA-008: System must show success/error toast after save.

### 11.6 Client Management

FR-CLIENT-001: Admin must be able to create client.

FR-CLIENT-002: Admin must be able to edit client.

FR-CLIENT-003: Admin must be able to delete client with confirmation.

FR-CLIENT-004: Admin must assign active channels to client.

FR-CLIENT-005: Admin must set optional target ROAS per assigned channel.

FR-CLIENT-006: System must replace client_channels after saving client configuration.

FR-CLIENT-007: System must offer grid and list views.

FR-CLIENT-008: System must support client search.

### 11.7 Activity Management

FR-ACT-001: Admin must be able to create activity log entry.

FR-ACT-002: Admin must be able to delete activity log entry.

FR-ACT-003: Admin must filter activity by client.

FR-ACT-004: Admin and client detail must display activity type badges.

FR-ACT-005: Activity feed must support search.

### 11.8 AI System

FR-AI-001: System must read AI configuration from system_settings.

FR-AI-002: System must support fallback to OPENROUTER_API_KEY environment variable.

FR-AI-003: System must call OpenRouter chat completions.

FR-AI-004: System must request JSON-only output through prompt.

FR-AI-005: System must parse JSON even if model returns extra text around JSON.

FR-AI-006: System must log usage after valid AI response.

FR-AI-007: System must provide fallback response if AI request fails.

FR-AI-008: Admin must view AI usage logs.

FR-AI-009: Admin must configure model ID and prompt.

### 11.9 Channel Configuration

FR-CH-001: Admin must be able to create channel definitions.

FR-CH-002: Admin must be able to edit label, stage, and type.

FR-CH-003: Admin must be able to delete channel definition with confirmation.

FR-CH-004: Channel definitions must be used by data input, calculations, table display, and channel performance views.

FR-CH-005: System must fall back to static channel constants when database definitions are empty.

## 12. Business Rules and Calculations

### 12.1 Channel Stage

Channel stage values:
- tofu: Awareness
- mofu: Consideration
- bofu: Conversion

Stage labels:
- tofu: Tofu - Awareness
- mofu: Mofu - Consideration
- bofu: Bofu - Conversion

### 12.2 Channel Type

Channel type values:
- awareness: primary metrics are spend, reach, impressions, results.
- assist: considered non-awareness for revenue/order related calculations.
- revenue: considered non-awareness for revenue/order related calculations.

### 12.3 Totals

Total revenue:
- Sum revenue from all non-awareness channels.

Total spend:
- Sum spend from awareness and non-awareness channels.

Total orders:
- Sum orders from non-awareness channels.

Total visitors:
- Sum visitors from non-awareness channels.

Total reach:
- Sum reach from awareness channels.

Total impressions:
- Sum impressions from awareness channels.

Blended ROAS:
- total revenue / total spend
- null when spend is 0.

### 12.4 Period Growth

Growth percentage:
- (current - previous) / previous * 100
- null when previous is missing or 0.

Previous period:
- The period immediately before selected period in PERIODS sorted ascending.

### 12.5 Status Classification

Status is calculated from period-over-period growth.

Status key mapping:
- rr: Turun >20 percent / Kritis
- or: Turun 10-20 percent / Perlu Perhatian
- yy: Turun <10 percent / Waspada
- nn: Stabil or no data
- gg: Naik <20 percent / Performa Baik
- gd: Naik >20 percent / Sangat Baik

Classification logic:
- null growth: nn
- value <= -20: rr
- value <= -10: or
- value < 0: yy
- value == 0: nn
- value <= 20: gg
- value > 20: gd

Client health:
- Worst status among all active client channels.
- Worst order: rr, or, yy, nn, gg, gd.

Channel health:
- Awareness channel compares reach if available, otherwise impressions.
- Non-awareness channel compares revenue.

### 12.6 Funnel Metrics

TOFU:
- spend
- reach
- impressions
- results

MOFU:
- visitors
- orders
- revenue

BOFU:
- spend
- orders
- revenue

### 12.7 Efficiency Metrics

BOFU ROAS:
- bofu revenue / bofu spend

CIR Index:
- bofu spend / bofu revenue * 100

CPO:
- bofu spend / bofu orders

Conversion Rate:
- mofu orders / mofu visitors * 100

Average Order Value:
- (bofu revenue + mofu revenue) / (bofu orders + mofu orders)

CHK Rate as currently shown in BOFU funnel:
- bofu orders / mofu visitors * 100

### 12.8 AI Status

AI status in prompt:
- positive when ROAS >= 4.
- negative when ROAS < 3.
- neutral otherwise.

AI response schema:

```json
{
  "status": "positive",
  "summary": "1-2 kalimat analisis strategis Bahasa Indonesia.",
  "actions": ["Tindakan konkret 1", "Tindakan konkret 2"]
}
```

Allowed status values:
- positive
- negative
- neutral
- warning

## 13. Data Model Requirements

### 13.1 clients

Purpose:
- Store client identity and ownership.

Required fields:
- id
- client_key
- name
- created_at

Optional fields:
- industry
- pic_name
- brand_category
- account_strategist

Rules:
- client_key must be unique.
- client_key is the business identifier used across dashboard calculations.

### 13.2 periods

Purpose:
- Store reporting periods.

Fields:
- period_key, format YYYY-MM
- label

Rules:
- period_key is primary key.
- Periods must be sorted ascending for previous period calculation.

### 13.3 client_channels

Purpose:
- Map client to active channel definitions and target ROAS.

Fields:
- client_key
- channel_key
- target_roas

Rules:
- Unique combination client_key and channel_key.
- Delete client cascades related rows.

### 13.4 channel_performance

Purpose:
- Store performance metrics per client, channel, and period.

Fields:
- client_key
- channel_key
- period_key
- spend
- revenue
- reach
- impressions
- results
- visitors
- orders

Rules:
- Unique combination client_key, channel_key, period_key.
- Used by overview, client detail, funnel, status, chart, and admin hub.

### 13.5 activity_logs

Purpose:
- Store campaign context for client performance.

Fields:
- client_key
- log_date
- log_type
- note
- created_at

Rules:
- log_type must be one of p, e, c, l.
- Activity should be shown newest first.

### 13.6 ai_usage_logs

Purpose:
- Store AI request usage.

Fields:
- client_key
- model_name
- usage_date
- tokens_used
- estimated_cost

Rules:
- Insert after successful AI response parsing.
- Used by admin AI Monitoring.

### 13.7 channels

Purpose:
- Store dynamic channel definitions.

Fields:
- channel_key
- label
- stage
- type
- created_at

Rules:
- stage must be tofu, mofu, or bofu.
- type must be revenue, assist, or awareness.
- channel_key is primary key.

### 13.8 system_settings

Purpose:
- Store configurable AI and system settings.

Fields:
- key
- value
- description
- updated_at

Expected keys:
- openrouter_key
- ai_model
- ai_prompt

### 13.9 profiles

Purpose:
- Store auth user profile, role, username, and client assignment.

Current build dependency:
- src/app/actions/auth.ts queries profiles.username and profiles.email.
- src/proxy.ts queries profiles.role and profiles.client_key.

Gap:
- profiles table is not included in supabase_schema.sql and must be added before production.

Minimum required fields:
- id uuid primary key referencing auth.users(id)
- email text unique
- username text unique
- role text with values admin/client
- client_key text nullable referencing clients(client_key)
- created_at timestamp
- updated_at timestamp

## 14. UX Requirements

### 14.1 General UX Principles

UX-001: Dashboard must prioritize dense, scannable operational information over marketing-style layout.

UX-002: KPI cards must show metric, value, caption, and trend where relevant.

UX-003: Tables must support horizontal scrolling on smaller screens.

UX-004: Empty states must explain what is missing and how to recover.

UX-005: Error states must be actionable.

UX-006: Admin destructive actions must require confirmation.

UX-007: User should not need to understand database structure to input or update performance data.

### 14.2 Navigation

UX-008: Desktop must use persistent left navigation.

UX-009: Mobile must use drawer navigation.

UX-010: Topbar must show current area, breadcrumbs, and key actions.

UX-011: Client workspace must provide global search with keyboard support.

UX-012: Period selector must remain available in portfolio and client detail context.

### 14.3 Visual Status

UX-013: Critical and warning states must be visually distinct.

UX-014: Status dot and badge colors must remain consistent across sidebar, table, and detail views.

UX-015: Data coverage, AI status, and DB status should be visible in admin context.

### 14.4 Forms

UX-016: Required fields must be clear.

UX-017: Numeric inputs must use tabular formatting where values are dense.

UX-018: Save buttons must show loading state.

UX-019: Success/error feedback must use toast.

UX-020: Long modal forms must be scrollable.

## 15. Non-functional Requirements

### 15.1 Performance

NFR-PERF-001: Initial dashboard load should be usable within 3 seconds for MVP dataset.

NFR-PERF-002: Client search should filter instantly for MVP dataset.

NFR-PERF-003: AI request should show loading state immediately.

NFR-PERF-004: Chart interactions should not block page interactions.

NFR-PERF-005: Root layout currently uses revalidate = 0; production should evaluate caching strategy as dataset grows.

### 15.2 Reliability

NFR-REL-001: Missing data must not crash dashboard calculations.

NFR-REL-002: AI failure must return fallback insight instead of breaking client detail page.

NFR-REL-003: Supabase mutation errors must be shown to admin.

NFR-REL-004: Deleting config should warn about downstream impact.

### 15.3 Security

NFR-SEC-001: API keys must not be exposed to browser.

NFR-SEC-002: OpenRouter key should be stored securely and masked in UI.

NFR-SEC-003: Role-based access must be server-enforced.

NFR-SEC-004: Client role users must not be able to read other client data through Supabase client calls.

NFR-SEC-005: The hardcoded admin123 localStorage gate must not be considered production security.

NFR-SEC-006: Supabase RLS policies must be defined for all tables.

NFR-SEC-007: Admin mutations should be audited in a future audit table.

### 15.4 Accessibility

NFR-A11Y-001: Buttons and icon-only controls must have accessible labels.

NFR-A11Y-002: Keyboard navigation must work for search overlay.

NFR-A11Y-003: Status should not rely on color alone; labels must accompany color.

NFR-A11Y-004: Form fields must have labels or aria-labels.

### 15.5 Maintainability

NFR-MAINT-001: Metric calculations should remain centralized in utility/logic modules.

NFR-MAINT-002: Channel definitions should come from database, with static constants only as fallback.

NFR-MAINT-003: UI components should reuse shared foundation components.

NFR-MAINT-004: Schema should match runtime code dependencies.

## 16. AI Requirements

### 16.1 Prompt Variables

Supported variables:
- {clientName}
- {spend}
- {revenue}
- {roas}
- {growth}
- {status}

### 16.2 AI Output Contract

AI must return JSON only.

Minimum fields:
- status
- summary
- actions

Rules:
- summary should be in Bahasa Indonesia.
- summary should be 1-2 strategic sentences.
- actions should contain concrete recommended actions.
- UI must tolerate extra text by extracting JSON substring.

### 16.3 AI Logging

On successful parse:
- Insert client_key.
- Insert model_name.
- Insert total tokens.
- Estimate cost.

Current cost formula:
- tokens_used * 0.0000001

Future requirement:
- Cost formula should be configurable by model pricing or stored actual provider usage when available.

### 16.4 AI Cache

Current cache key:
- clientName + roas + revenue + growth

Cache layers:
- in-memory object
- sessionStorage

Requirement:
- Re-analyze must bypass cache.

## 17. Admin Notifications

Current behavior:
- Admin header checks DB status by querying clients count.
- Admin header checks AI readiness by reading system_settings.openrouter_key.
- Notifications are generated for clients with rr/or status in latest period.
- Read state stored in localStorage.
- Notification click opens client detail.

Requirements:
- Notification list must show critical and warning alerts.
- Mark all as read must persist in browser localStorage.
- Future production should persist notification read state per user.

## 18. Release Criteria

### 18.1 MVP Release Criteria

RC-001: User can login and logout.

RC-002: Admin can access admin console and non-admin cannot.

RC-003: Client role can access assigned client detail.

RC-004: Portfolio overview loads from Supabase.

RC-005: Client detail loads metrics, chart, funnel, channels, and activity.

RC-006: Admin can input/update performance data.

RC-007: Admin can manage clients and channels.

RC-008: Admin can manage activity logs.

RC-009: AI insight can generate or fail gracefully.

RC-010: AI usage logs are visible.

RC-011: Basic mobile layout works.

RC-012: Production schema includes profiles table and RLS policies.

### 18.2 Production Readiness Criteria

PRC-001: No hardcoded admin password remains as an access control layer.

PRC-002: All browser-side Supabase operations are protected by RLS.

PRC-003: Environment variables are configured in deployment.

PRC-004: OpenRouter key placeholder is replaced.

PRC-005: AI prompt default returns stable JSON.

PRC-006: Admin mutation errors are tracked.

PRC-007: Large dataset performance is tested.

PRC-008: Data deletion behavior is documented.

## 19. Known Gaps and Risks

### 19.1 Schema Gap: profiles

Risk:
- Login by username, role redirect, and admin protection rely on profiles, but current schema file does not define it.

Impact:
- Auth and role routing can fail in fresh database setup.

Recommendation:
- Add profiles table, constraints, trigger from auth.users if needed, and RLS policies.

### 19.2 Admin Gate Uses Hardcoded Password

Risk:
- admin123 and localStorage gate are client-side and not production-safe.

Impact:
- False sense of security; admin access should depend on server-side role checks.

Recommendation:
- Remove local admin gate or replace with proper role verification.

### 19.3 AI API Key Placeholder Mismatch

Risk:
- Schema seeds openrouter_key as "your_key_here", while AI action checks "your_openrouter_key_here".

Impact:
- Placeholder key may be treated as real and cause OpenRouter request failure.

Recommendation:
- Normalize placeholder values and validation logic.

### 19.4 Brand Naming Inconsistency

Risk:
- Login and admin mention Real Advertise, while client sidebar brand says Joytivism.

Impact:
- User confusion and reduced product polish.

Recommendation:
- Decide final product/brand naming and align all UI.

### 19.5 Client-side Mutations

Risk:
- Admin pages use browser Supabase client for mutation.

Impact:
- Security depends heavily on RLS correctness.

Recommendation:
- Use server actions for privileged admin mutations or enforce strict RLS.

### 19.6 Data Model Ambiguity: visitors vs results

Risk:
- Data input labels "Results / Visits" stores into visitors for performance channel.

Impact:
- Conversion and CHK calculations can be semantically inconsistent.

Recommendation:
- Separate visitors and results fields clearly in UI or define a per-channel metric mapping.

### 19.7 Dataset Scaling

Risk:
- getDashboardData loads all clients, all performance rows, all activity logs, all AI logs at root layout.

Impact:
- Performance may degrade as historical data grows.

Recommendation:
- Add server-side filters by period, pagination, and route-level data fetching.

### 19.8 Deleting Channel Definitions

Risk:
- Removing channel definitions can orphan or hide performance rows that still reference the channel_key.

Impact:
- Historical metrics may become unreadable.

Recommendation:
- Prevent deletion when linked data exists, or implement soft-delete.

### 19.9 AI JSON Robustness

Risk:
- Model may return invalid JSON, missing fields, or actions not as array.

Impact:
- AI insight can fail or show incomplete data.

Recommendation:
- Validate AI response schema before storing and rendering.

## 20. Future Roadmap

### Phase 1: Hardening MVP

- Add profiles schema and RLS.
- Remove hardcoded admin gate.
- Normalize AI key placeholder validation.
- Add server-side admin mutations.
- Add validation for all admin forms.
- Add basic tests for calculations.
- Add schema migration documentation.

### Phase 2: Operational Depth

- CSV/XLSX import for channel performance.
- Bulk upload with validation preview.
- Audit log for admin mutations.
- Soft delete for clients and channels.
- Client assignment by strategist.
- Advanced alert thresholds per client/channel.
- Target ROAS comparison in client detail.

### Phase 3: Reporting and Automation

- Scheduled AI summaries.
- Weekly/monthly client report export.
- Slack/WhatsApp/email alerts for critical clients.
- Platform API ingestion.
- Data freshness dashboard.
- Custom report templates.

### Phase 4: Advanced Intelligence

- Budget recommendation engine.
- Anomaly detection by channel.
- Forecasting revenue/spend.
- Attribution notes and campaign impact tagging.
- AI chat over client performance history.

## 21. Open Questions

Q1. Apakah final brand produk adalah Real Advertise Command Center, Joytivism, atau nama lain?

Q2. Apakah client user boleh melihat AI insight, atau hanya internal user?

Q3. Apakah period adalah bulanan saja, atau akan ada daily/weekly reporting?

Q4. Apakah data input akan tetap manual, atau target berikutnya adalah CSV/API import?

Q5. Apakah target ROAS harus memengaruhi status health selain period-over-period growth?

Q6. Apakah awareness spend harus masuk ke blended ROAS denominator seperti build saat ini?

Q7. Apakah CPAS dan assisted channels harus dihitung sebagai revenue penuh atau terpisah?

Q8. Apakah activity log perlu mengukur impact terhadap metric tertentu?

Q9. Apakah AI usage cost harus memakai estimated formula atau actual billing dari provider?

Q10. Apakah admin deletion harus benar-benar hard delete atau soft delete?

## 22. Source Map Observed in Current Build

Primary app routes:
- src/app/login/page.tsx
- src/app/(client)/page.tsx
- src/app/(client)/client/[id]/page.tsx
- src/app/(admin)/admin/page.tsx
- src/app/(admin)/admin/data/page.tsx
- src/app/(admin)/admin/activity/page.tsx
- src/app/(admin)/admin/ai/page.tsx
- src/app/(admin)/admin/clients/page.tsx
- src/app/(admin)/admin/settings/page.tsx
- src/app/(admin)/admin/settings/channels/page.tsx

Data and calculations:
- src/lib/fetch.ts
- src/lib/data.ts
- src/lib/utils.ts
- src/lib/logic/calculations.ts
- src/data/constants.ts
- supabase_schema.sql

Auth and access:
- src/app/actions/auth.ts
- src/proxy.ts
- src/lib/supabase/server.ts
- src/lib/supabase/client.ts

AI:
- src/app/actions/ai.ts
- src/components/AISummary.tsx
- src/app/(admin)/admin/ai/page.tsx
- src/app/(admin)/admin/settings/page.tsx

Core components:
- src/components/dashboard/ClientTable.tsx
- src/components/dashboard/StatusBanners.tsx
- src/components/dashboard/ChannelPerformance.tsx
- src/components/dashboard/FunnelAnalysis.tsx
- src/components/dashboard/ActivityLog.tsx
- src/components/TrendChart.tsx
- src/components/DataProvider.tsx

Layout and navigation:
- src/components/layout/AppShell.tsx
- src/components/layout/NavRail.tsx
- src/components/layout/MobileNavDrawer.tsx
- src/components/layout/TopBar.tsx
- src/components/Header.tsx
- src/components/AdminHeader.tsx
- src/components/Sidebar.tsx
- src/components/AdminSidebar.tsx

## 23. Appendix: Glossary

ROAS:
- Return on ad spend, calculated as revenue divided by spend.

CIR:
- Cost income ratio, calculated as spend divided by revenue.

CPO:
- Cost per order, calculated as spend divided by order count.

CR:
- Conversion rate, calculated as orders divided by visitors.

AOV:
- Average order value, calculated as revenue divided by orders.

TOFU:
- Top of funnel, awareness layer.

MOFU:
- Middle of funnel, consideration layer.

BOFU:
- Bottom of funnel, conversion layer.

At-risk:
- Client or channel with critical/warning performance status.

Period:
- Reporting month in YYYY-MM format.

Channel definition:
- Mapping between channel_key, display label, funnel stage, and metric type.
