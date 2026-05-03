'use client';

import React, { useState } from 'react';
import { login } from '@/app/actions/auth';
import {
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  PanelTop,
  ShieldCheck,
  Sparkles,
  Workflow,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import InputField from '@/components/ui/InputField';
import Badge from '@/components/ui/Badge';

const PREVIEW_ITEMS = [
  { label: 'Portfolio', value: '5 active', tone: 'success' as const },
  { label: 'AI logs', value: 'Ready', tone: 'info' as const },
  { label: 'Risk alerts', value: '2 attention', tone: 'warning' as const },
];

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const result = await login(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-bg px-4 py-8 md:px-6">
      <div className="pointer-events-none absolute left-0 top-0 h-[360px] w-[360px] -translate-x-1/3 -translate-y-1/3 rounded-full bg-accent/8 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-[320px] w-[320px] translate-x-1/3 translate-y-1/3 rounded-full bg-text/4 blur-3xl" />

      <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-6xl items-stretch gap-6 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
        <Card className="flex flex-col justify-between p-8 md:p-10 lg:p-12">
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge tone="accent" style="soft" className="w-fit">
                Monitoring Client
              </Badge>
              <div>
                <h1 className="text-display mb-3">Welcome back</h1>
                <p className="max-w-sm text-body">
                  Masuk ke workspace Real Advertise untuk memantau performa klien, AI insight, dan operasi portofolio.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error ? (
                <div className="flex items-start gap-3 rounded-2xl border border-rr-border bg-rr-bg/70 p-4 text-sm font-medium text-rr-text">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              ) : null}

              <InputField
                name="email"
                type="text"
                required
                label="Email / Username"
                placeholder="admin@realadvertise.id"
                icon={Mail}
                hint="Gunakan akun yang memiliki akses ke dashboard monitoring."
              />

              <InputField
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                label="Password"
                placeholder="••••••••••••"
                icon={Lock}
                trailing={(
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="rounded-lg p-1 text-text4 transition-colors hover:text-text2"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                )}
              />

              <div className="flex items-center justify-between gap-3 text-xs text-text3">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="h-4 w-4 rounded border-border-main text-accent focus:ring-accent/20" />
                  Keep me signed in
                </label>
                <button type="button" className="font-medium text-accent transition-colors hover:text-accent-hover">
                  Forgot password?
                </button>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={loading}
                trailingIcon={ArrowRight}
              >
                Sign in
              </Button>
            </form>
          </div>

          <div className="mt-10 flex items-center gap-3 rounded-[22px] border border-border-main bg-surface2 p-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-accent shadow-sm">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-text">Secure internal access</div>
              <div className="text-xs text-text3">Credentials are verified before the dashboard session is created.</div>
            </div>
          </div>
        </Card>

        <Card tone="muted" className="relative overflow-hidden border-white/70 p-8 md:p-10 lg:p-12">
          <div className="absolute right-0 top-0 h-48 w-48 translate-x-1/4 -translate-y-1/4 rounded-full bg-accent/8 blur-3xl" />
          <div className="relative flex h-full flex-col justify-between gap-10">
            <div className="space-y-5">
              <Badge tone="neutral" style="soft" className="w-fit">
                Product preview
              </Badge>
              <div className="max-w-xl space-y-3">
                <h2 className="text-h1">
                  Satu command surface untuk <span className="text-accent">monitoring channel</span>, insight AI, dan prioritas klien.
                </h2>
                <p className="text-body">
                  Desain sistem baru ini dirapikan untuk kerja harian: kartu yang modular, notifikasi yang jelas, dan ringkasan yang cepat dipindai.
                </p>
              </div>
            </div>

            <div className="grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
              <Card className="p-0">
                <div className="flex items-center justify-between border-b border-border-main px-6 py-5">
                  <div>
                    <div className="ds-eyebrow">Dashboard snapshot</div>
                    <div className="mt-1 text-h4">Portfolio signals</div>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent-light text-accent">
                    <PanelTop className="h-5 w-5" />
                  </div>
                </div>
                <div className="grid gap-4 p-6 md:grid-cols-3">
                  {PREVIEW_ITEMS.map((item) => (
                    <div key={item.label} className="rounded-[22px] border border-border-main bg-surface2 p-4">
                      <div className="text-micro">{item.label}</div>
                      <div className="mt-2 text-lg font-semibold text-text">{item.value}</div>
                      <Badge tone={item.tone} style="soft" className="mt-4 w-fit">
                        Live
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>

              <div className="space-y-5">
                <Card className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-text shadow-sm">
                      <Workflow className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-h4">Operational clarity</div>
                      <p className="mt-2 text-body">Filter, compare, and inspect client performance without jumping across multiple views.</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-light text-accent shadow-sm">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-h4">AI strategy layer</div>
                      <p className="mt-2 text-body">Insight cards dan rekomendasi tindakan disusun supaya cepat dipakai oleh tim operasional.</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
