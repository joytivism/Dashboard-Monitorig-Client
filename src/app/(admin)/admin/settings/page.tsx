'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Bot, Cpu, Key, LayoutGrid, MessageSquare, RotateCcw, Save, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import PageIntro from '@/components/layout/PageIntro';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import InputField from '@/components/ui/InputField';
import LoadingState from '@/components/ui/LoadingState';
import SectionHeader from '@/components/ui/SectionHeader';
import StateFrame from '@/components/ui/StateFrame';
import Toast from '@/components/ui/Toast';
import useTimedToast from '@/components/ui/useTimedToast';
import { supabase } from '@/lib/supabase';

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Gagal memproses pengaturan.';
}

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast, setToast, showToast } = useTimedToast();

  const [apiKey, setApiKey] = useState('');
  const [prompt, setPrompt] = useState('');
  const [currentModel, setCurrentModel] = useState('');

  useEffect(() => {
    let active = true;

    async function loadSettings() {
      try {
        const { data, error } = await supabase.from('system_settings').select('*');
        if (error) throw error;
        if (!active || !data) return;

        setApiKey(data.find((item) => item.key === 'openrouter_key')?.value || '');
        setPrompt(data.find((item) => item.key === 'ai_prompt')?.value || '');
        setCurrentModel(data.find((item) => item.key === 'ai_model')?.value || 'Not set');
      } catch (error) {
        if (active) {
          setToast({ type: 'error', text: getErrorMessage(error) });
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadSettings();

    return () => {
      active = false;
    };
  }, [setToast]);

  async function handleSave() {
    setSaving(true);

    try {
      const updates = [
        { key: 'openrouter_key', value: apiKey },
        { key: 'ai_prompt', value: prompt },
        { key: 'ai_model', value: currentModel },
      ];

      for (const update of updates) {
        await supabase.from('system_settings').upsert(update, { onConflict: 'key' });
      }

      showToast('success', 'Pengaturan berhasil diperbarui!');
      router.refresh();
    } catch (error) {
      showToast('error', getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl pb-20">
        <LoadingState
          title="Memuat pengaturan"
          description="Konfigurasi AI dan API sedang diambil dari sistem."
          className="min-h-[320px]"
        />
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 pb-20 animate-fade-in">
      <Toast toast={toast} />

      <PageIntro
        eyebrow="Admin Console"
        title="Pengaturan Sistem"
        description="Konfigurasi integrasi AI, model aktif, dan prompt strategi dashboard dari satu panel yang lebih konsisten."
        meta={(
          <>
            <Badge tone="neutral" style="soft">AI configuration</Badge>
            <Badge tone="accent" style="soft">{currentModel || 'Model belum diset'}</Badge>
          </>
        )}
        actions={(
          <Button variant="primary" size="lg" leadingIcon={Save} onClick={handleSave} loading={saving}>
            Simpan perubahan
          </Button>
        )}
      />

      <Link
        href="/admin/settings/channels"
        className="flex items-center justify-between gap-4 rounded-[var(--radius-lg)] border border-border-main bg-white px-6 py-5 shadow-[var(--shadow-card)] transition-colors hover:border-border-alt hover:bg-surface2/35"
      >
        <div className="flex min-w-0 items-center gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-md)] border border-border-main bg-surface2 text-text2">
            <LayoutGrid className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-text">Manajemen Definisi Channel</div>
            <div className="text-sm text-text3">Kelola stage funnel dan type setiap channel dari halaman konfigurasi khusus.</div>
          </div>
        </div>
        <Badge tone="neutral" style="soft">Open</Badge>
      </Link>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="grid gap-5">
          <Card className="space-y-5">
            <SectionHeader
              eyebrow="API configuration"
              title="OpenRouter access"
              description="Masukkan API key yang dipakai dashboard untuk memanggil layanan model AI."
              icon={Key}
            />
            <InputField
              label="OpenRouter API Key"
              type="password"
              value={apiKey}
              onChange={(event) => setApiKey(event.target.value)}
              placeholder="sk-or-v1-..."
              inputClassName="font-mono"
            />
          </Card>

          <Card className="space-y-5">
            <SectionHeader
              eyebrow="Model management"
              title="Model AI aktif"
              description="Tentukan model OpenRouter yang dipakai untuk analisis AI pada dashboard."
              icon={Bot}
              action={
                <button onClick={() => setCurrentModel('')} className="btn-icon h-9 w-9" aria-label="Reset model">
                  <RotateCcw className="h-4 w-4" />
                </button>
              }
            />
            <InputField
              label="Model ID"
              type="text"
              value={currentModel}
              onChange={(event) => setCurrentModel(event.target.value)}
              placeholder="google/gemini-pro-1.5..."
              icon={Cpu}
              inputClassName="font-mono"
            />
          </Card>
        </div>

        <Card className="space-y-5">
          <SectionHeader
            eyebrow="AI strategy prompt"
            title="Prompt konfigurasi"
            description="Prompt ini dipakai untuk membentuk ringkasan strategi dan rekomendasi tindakan AI."
            icon={MessageSquare}
            action={<Sparkles className="h-4 w-4 text-gd-text" />}
          />

          <div className="rounded-[var(--radius-md)] border border-border-main bg-surface2/70 p-4">
            <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-text3">Available variables</div>
            <div className="flex flex-wrap gap-2">
              {['{clientName}', '{spend}', '{revenue}', '{roas}', '{growth}', '{status}'].map((tag) => (
                <code key={tag} className="rounded-full border border-accent/15 bg-white px-2.5 py-1 text-[11px] font-semibold text-accent">
                  {tag}
                </code>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-semibold uppercase tracking-[0.12em] text-text3">Prompt</label>
            <textarea
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              rows={12}
              className="min-h-[280px] w-full rounded-[var(--radius-md)] border border-border-main bg-white px-4 py-3 text-sm font-medium leading-6 text-text outline-none transition-colors placeholder:text-text4 focus:border-accent focus:shadow-[var(--focus-ring)]"
              placeholder="Tulis prompt analisis di sini..."
            />
          </div>

          <StateFrame
            title="Pastikan format output tetap konsisten"
            description="Pastikan instruksi format JSON tetap ada di dalam prompt agar analisis AI dapat diproses oleh sistem."
            tone="danger"
            align="left"
            size="sm"
          />
        </Card>
      </div>
    </div>
  );
}
