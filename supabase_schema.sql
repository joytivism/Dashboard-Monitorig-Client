-- ==========================================
-- REAL ADVERTISE DATABASE SCHEMA (SUPABASE)
-- ==========================================

-- 1. Tabel Klien (Clients)
CREATE TABLE clients (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  client_key VARCHAR(255) UNIQUE NOT NULL, -- contoh: 'clientA', 'klien_b'
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabel Periode (Untuk mencatat bulan aktif)
CREATE TABLE periods (
  period_key VARCHAR(7) PRIMARY KEY, -- format: '2026-02', '2026-03'
  label VARCHAR(50) NOT NULL -- contoh: 'Feb 2026'
);

-- 3. Tabel Detail Target & Saluran Klien (Client Channels & Targets)
-- Menggantikan cl.chs dan cl.troas di constants.ts
CREATE TABLE client_channels (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  client_key VARCHAR(255) REFERENCES clients(client_key) ON DELETE CASCADE,
  channel_key VARCHAR(50) NOT NULL, -- contoh: 'fb_tofu', 'sp_bofu'
  target_roas NUMERIC(10, 2), -- Target ROAS jika ada (misal: 6.50)
  UNIQUE(client_key, channel_key)
);

-- 4. Tabel Performa Channel (Channel Performance)
-- Menggantikan struktur object DATA di constants.ts
CREATE TABLE channel_performance (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  client_key VARCHAR(255) REFERENCES clients(client_key) ON DELETE CASCADE,
  channel_key VARCHAR(50) NOT NULL,
  period_key VARCHAR(7) REFERENCES periods(period_key) ON DELETE CASCADE,
  
  -- Metrik (Tergantung tahap TOFU/MOFU/BOFU)
  spend NUMERIC(15, 2) DEFAULT 0,
  revenue NUMERIC(15, 2) DEFAULT 0,
  reach INTEGER DEFAULT 0,
  impressions INTEGER DEFAULT 0,
  results INTEGER DEFAULT 0,
  visitors INTEGER DEFAULT 0,
  orders INTEGER DEFAULT 0,
  
  UNIQUE(client_key, channel_key, period_key)
);

-- 5. Tabel Log Aktivitas (Activity Logs)
-- Menggantikan ACTIVITY di constants.ts
CREATE TABLE activity_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  client_key VARCHAR(255) REFERENCES clients(client_key) ON DELETE CASCADE,
  log_date DATE NOT NULL,
  log_type VARCHAR(10) NOT NULL, -- 'p' (promo), 'e' (event), 'c' (content), 'l' (launching)
  note TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- CONTOH INSERT DATA AWAL (SEEDING)
-- ==========================================

-- Insert Periode
INSERT INTO periods (period_key, label) VALUES 
('2026-02', 'Feb 2026'),
('2026-03', 'Mar 2026');

-- Insert Klien
INSERT INTO clients (client_key, name) VALUES 
('klien_a', 'Klien Alpha'),
('klien_b', 'Klien Beta');

-- Insert Client Channels (beserta target)
INSERT INTO client_channels (client_key, channel_key, target_roas) VALUES 
('klien_a', 'fb_tofu', NULL),
('klien_a', 'fb_mofu', NULL),
('klien_a', 'sp_bofu', 6.50),
('klien_a', 'tt_bofu', 4.00);

-- Insert Performa (Contoh klien_a, sp_bofu, Mar 2026)
INSERT INTO channel_performance (client_key, channel_key, period_key, spend, revenue, orders)
VALUES ('klien_a', 'sp_bofu', '2026-03', 40000000, 310000000, 2050);

-- Insert Log Aktivitas
INSERT INTO activity_logs (client_key, log_date, log_type, note)
VALUES ('klien_a', '2026-03-05', 'p', 'Promo Gajian Live');
