'use client';

import React, { useState } from 'react';
import { login } from '@/app/actions/auth';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Hexagon,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Workflow,
} from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import InputField from '@/components/ui/InputField';

const KPI_ITEMS = [
  { label: 'Portfolio health', value: '92%', tone: 'success' as const },
  { label: 'AI status', value: 'Ready', tone: 'info' as const },
  { label: 'Priority alerts', value: '2', tone: 'warning' as const },
];

const SIGNAL_ITEMS = [
  {
    icon: Workflow,
    title: 'Unified monitoring',
    description: 'Semua klien, periode, dan health signal dibaca dari satu workspace yang sama.',
  },
  {
    icon: Sparkles,
    title: 'AI recommendation layer',
    description: 'Insight otomatis disusun dalam format yang cepat dipakai tim operasional.',
  },
  {
    icon: ShieldCheck,
    title: 'Internal-only access',
    description: 'Area ini dirancang untuk workflow internal Real Advertise dan tim operasional.',
  },
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
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(255,106,26,0.12),_transparent_26%),linear-gradient(180deg,_#f8f7f4_0%,_#f2f1ec_100%)] px-4 py-6 md:px-6 md:py-8">
      <div className="pointer-events-none absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(rgba(17,17,16,0.9) 1px, transparent 1px), linear-gradient(90deg, rgba(17,17,16,0.9) 1px, transparent 1px)', backgroundSize: '36px 36px' }} />
      <div className="pointer-events-none absolute left-0 top-0 h-[360px] w-[360px] -translate-x-1/3 -translate-y-1/3 rounded-full bg-accent/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-[420px] w-[420px] translate-x-1/3 translate-y-1/3 rounded-full bg-text/6 blur-3xl" />

      <div className="relative mx-auto grid min-h-[calc(100vh-3rem)] w-full max-w-7xl gap-6 xl:grid-cols-[minmax(0,460px)_minmax(0,1fr)]">
        <div className="flex min-h-full flex-col gap-5">
          <div className="flex items-center gap-3 rounded-[26px] border border-white/80 bg-white/80 px-5 py-4 shadow-[var(--shadow-card)] backdrop-blur">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-text text-white shadow-sm">
              <Hexagon className="h-5 w-5 fill-white" />
            </div>
            <div>
              <div className="text-sm font-semibold tracking-[-0.02em] text-text">Real Advertise</div>
              <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-text4">Monitoring Client</div>
            </div>
          </div>

          <Card className="flex flex-1 flex-col justify-between border-white/80 bg-white/90 p-6 backdrop-blur md:p-8 lg:p-10">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge tone="accent" style="soft" className="w-fit">
                  Internal dashboard access
                </Badge>
                <div className="space-y-3">
                  <h1 className="text-display max-w-md">Masuk ke command center.</h1>
                  <p className="max-w-md text-body">
                    Workspace ini dipakai untuk memantau performa klien, memeriksa sinyal prioritas, dan menjalankan layer insight AI harian.
                  </p>
                </div>
              </div>

              <Card tone="muted" className="space-y-5 border-white/80 p-5 md:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="ds-eyebrow">Sign in</div>
                    <h2 className="mt-1 text-h4">Use your workspace credential</h2>
                  </div>
                  <div className="hidden rounded-full border border-border-main bg-white px-3 py-1 text-[11px] font-medium text-text3 sm:inline-flex">
                    Secure session
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {error ? (
                    <div className="flex items-start gap-3 rounded-[20px] border border-rr-border bg-rr-bg/80 p-4 text-sm font-medium text-rr-text">
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
                    hint="Gunakan akun internal yang memiliki akses ke workspace ini."
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

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <label className="flex items-center gap-2 text-xs font-medium text-text3">
                      <input type="checkbox" className="h-4 w-4 rounded border-border-main text-accent focus:ring-accent/20" />
                      Keep me signed in
                    </label>
                    <button type="button" className="text-left text-xs font-medium text-accent transition-colors hover:text-accent-hover">
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
                    className="shadow-[0_18px_40px_rgba(17,17,16,0.12)]"
                  >
                    Sign in
                  </Button>
                </form>
              </Card>
            </div>

            <div className="mt-8 grid gap-3 md:grid-cols-3">
              {SIGNAL_ITEMS.map((item) => (
                <div key={item.title} className="rounded-[22px] border border-border-main bg-surface2/80 p-4">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-text shadow-sm">
                    <item.icon className="h-[18px] w-[18px]" />
                  </div>
                  <div className="text-sm font-semibold text-text">{item.title}</div>
                  <p className="mt-1 text-xs leading-relaxed text-text3">{item.description}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card className="relative hidden overflow-hidden border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.9)_0%,rgba(248,247,244,0.94)_100%)] p-6 backdrop-blur lg:block xl:p-8">
          <div className="absolute right-0 top-0 h-56 w-56 translate-x-1/4 -translate-y-1/4 rounded-full bg-accent/10 blur-3xl" />
          <div className="relative flex h-full flex-col gap-6">
            <div className="flex items-start justify-between gap-6">
              <div className="max-w-2xl space-y-3">
                <Badge tone="neutral" style="soft" className="w-fit">
                  Product snapshot
                </Badge>
                <h2 className="text-h1 max-w-2xl">
                  Workspace yang tenang untuk <span className="text-accent">membaca sinyal penting</span>, bukan tenggelam di noise.
                </h2>
                <p className="max-w-xl text-body">
                  Login view ini sekarang menyiapkan konteks yang sama dengan dashboard utama: modular, mudah dipindai, dan fokus pada informasi prioritas.
                </p>
              </div>
              <div className="rounded-[24px] border border-border-main bg-white px-4 py-3 shadow-sm">
                <div className="text-micro">Session state</div>
                <div className="mt-1 text-sm font-semibold text-text">Ready for internal sign-in</div>
              </div>
            </div>

            <div className="grid flex-1 gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
              <Card className="flex flex-col overflow-hidden p-0">
                <div className="flex items-center justify-between border-b border-border-main px-6 py-5">
                  <div>
                    <div className="ds-eyebrow">Portfolio snapshot</div>
                    <div className="mt-1 text-h4">Operations overview</div>
                  </div>
                  <div className="flex items-center gap-2 rounded-full border border-border-main bg-surface2 px-3 py-1">
                    <span className="dot dot-gg" />
                    <span className="text-[11px] font-medium text-text3">Live sync</span>
                  </div>
                </div>

                <div className="grid gap-4 border-b border-border-main p-6 md:grid-cols-3">
                  {KPI_ITEMS.map((item) => (
                    <div key={item.label} className="rounded-[22px] border border-border-main bg-surface2 p-4">
                      <div className="text-micro">{item.label}</div>
                      <div className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-text">{item.value}</div>
                      <Badge tone={item.tone} style="soft" className="mt-3 w-fit">
                        Active
                      </Badge>
                    </div>
                  ))}
                </div>

                <div className="grid flex-1 gap-4 p-6 lg:grid-cols-2">
                  <div className="rounded-[24px] border border-border-main bg-white p-5">
                    <div className="mb-4 flex items-start justify-between gap-4">
                      <div>
                        <div className="ds-eyebrow">Focus queue</div>
                        <div className="mt-1 text-h4">Today priorities</div>
                      </div>
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent-light text-accent">
                        <TrendingUp className="h-[18px] w-[18px]" />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="rounded-[18px] border border-border-main bg-surface2 p-4">
                        <div className="text-sm font-semibold text-text">2 client accounts need review</div>
                        <div className="mt-1 text-xs text-text3">Risk signal disusun sebagai queue prioritas, bukan tersebar di banyak widget.</div>
                      </div>
                      <div className="rounded-[18px] border border-border-main bg-surface2 p-4">
                        <div className="text-sm font-semibold text-text">AI summary ready for new period</div>
                        <div className="mt-1 text-xs text-text3">Insight layer tersedia langsung setelah data periode terbaru terbaca.</div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[24px] border border-border-main bg-text p-5 text-white">
                    <div className="mb-5 flex items-center justify-between gap-3">
                      <div>
                        <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/55">Security</div>
                        <div className="mt-1 text-xl font-semibold tracking-[-0.03em]">Internal access layer</div>
                      </div>
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/10">
                        <ShieldCheck className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="space-y-3 text-sm text-white/75">
                      <div className="flex items-start gap-3 rounded-[18px] border border-white/10 bg-white/5 p-4">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-white" />
                        <span>Access point dirancang ringkas agar user langsung fokus masuk ke workspace, bukan terdistraksi visual tambahan.</span>
                      </div>
                      <div className="flex items-start gap-3 rounded-[18px] border border-white/10 bg-white/5 p-4">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-white" />
                        <span>Bahasa visual login sekarang sejalan dengan dashboard utama: border halus, panel modular, dan hierarchy yang lebih tegas.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
