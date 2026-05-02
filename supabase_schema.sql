-- ==========================================
-- REAL ADVERTISE DATABASE SCHEMA (SUPABASE)
-- Robust Version: Safe to run multiple times
-- ==========================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tabel Klien (Clients)
CREATE TABLE IF NOT EXISTS clients (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  client_key VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  industry VARCHAR(255),
  pic_name VARCHAR(255),
  brand_category VARCHAR(255),
  account_strategist VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabel Periode
CREATE TABLE IF NOT EXISTS periods (
  period_key VARCHAR(7) PRIMARY KEY, -- format: '2026-02'
  label VARCHAR(50) NOT NULL
);

-- 3. Tabel Detail Target & Saluran Klien
CREATE TABLE IF NOT EXISTS client_channels (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  client_key VARCHAR(255) REFERENCES clients(client_key) ON DELETE CASCADE,
  channel_key VARCHAR(50) NOT NULL,
  target_roas NUMERIC(10, 2),
  UNIQUE(client_key, channel_key)
);

-- 4. Tabel Performa Channel
CREATE TABLE IF NOT EXISTS channel_performance (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  client_key VARCHAR(255) REFERENCES clients(client_key) ON DELETE CASCADE,
  channel_key VARCHAR(50) NOT NULL,
  period_key VARCHAR(7) REFERENCES periods(period_key) ON DELETE CASCADE,
  
  spend NUMERIC(15, 2) DEFAULT 0,
  revenue NUMERIC(15, 2) DEFAULT 0,
  reach INTEGER DEFAULT 0,
  impressions INTEGER DEFAULT 0,
  results INTEGER DEFAULT 0,
  visitors INTEGER DEFAULT 0,
  orders INTEGER DEFAULT 0,
  
  UNIQUE(client_key, channel_key, period_key)
);

-- 5. Tabel Log Aktivitas
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  client_key VARCHAR(255) REFERENCES clients(client_key) ON DELETE CASCADE,
  log_date DATE NOT NULL,
  log_type VARCHAR(10) NOT NULL, -- 'p', 'e', 'c', 'l'
  note TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Tabel Log Penggunaan AI (DIBUTUHKAN OLEH FRONTEND)
CREATE TABLE IF NOT EXISTS ai_usage_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  client_key VARCHAR(255) REFERENCES clients(client_key) ON DELETE CASCADE,
  model_name VARCHAR(255),
  usage_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  tokens_used INTEGER DEFAULT 0,
  estimated_cost NUMERIC(15, 7) DEFAULT 0
);

-- 7. Tabel Pengaturan Sistem (DIBUTUHKAN OLEH SERVER ACTIONS)
CREATE TABLE IF NOT EXISTS system_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  key VARCHAR(255) UNIQUE NOT NULL,
  value TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- MAINTENANCE / PATCHING (Jika tabel sudah ada tapi kolom kurang)
-- ==========================================
ALTER TABLE system_settings ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE ai_usage_logs ADD COLUMN IF NOT EXISTS estimated_cost NUMERIC(15, 7) DEFAULT 0;

-- ==========================================
-- SEED DATA (SAFE INSERTS)
-- ==========================================

-- Insert Periode
INSERT INTO periods (period_key, label) VALUES 
('2026-02', 'Feb 2026'),
('2026-03', 'Mar 2026')
ON CONFLICT (period_key) DO NOTHING;

-- Insert Settings Default
INSERT INTO system_settings (key, value, description) VALUES 
('openrouter_key', 'your_key_here', 'API Key untuk OpenRouter'),
('ai_model', 'nvidia/nemotron-3-super-120b-a12b:free', 'Model AI default'),
('ai_prompt', 'Analisis data iklan klien "{clientName}":\n- Spend: {spend}, Revenue: {revenue}, ROAS: {roas}x, Trend: {growth}%\n\nBerikan jawaban dalam format JSON saja:\n{\n  "status": "positive/negative/neutral",\n  "summary": "1-2 kalimat analisis strategis Bahasa Indonesia.",\n  "actions": ["Tindakan konkret 1", "Tindakan konkret 2"]\n}\n\nPENTING: Hanya keluarkan objek JSON. Tanpa kata pembuka, tanpa markdown.', 'Prompt utama untuk generate analisis AI')
ON CONFLICT (key) DO NOTHING;
