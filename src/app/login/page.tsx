'use client';

import React, { useState } from 'react';
import { login } from '@/app/actions/auth';
import {
  AlertCircle,
  ArrowRight,
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

const PREVIEW_ITEMS = [
  {
    icon: Workflow,
    title: 'Unified monitoring',
    description: 'Semua klien, periode, dan sinyal prioritas dibaca dari satu workspace yang sama.',
  },
  {
    icon: Sparkles,
    title: 'AI recommendation layer',
    description: 'Insight otomatis disusun dalam format yang cepat dipakai tim operasional.',
  },
  {
    icon: ShieldCheck,
    title: 'Internal-only access',
    description: 'Halaman ini sengaja tenang dan ringkas supaya user langsung masuk ke workflow utama.',
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
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(255,106,26,0.12),_transparent_24%),linear-gradient(180deg,_#f8f7f4_0%,_#f1efea_100%)] px-4 py-6 md:px-6 md:py-8">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(17,17,16,0.95) 1px, transparent 1px), linear-gradient(90deg, rgba(17,17,16,0.95) 1px, transparent 1px)',
          backgroundSize: '42px 42px',
        }}
      />
      <div className="pointer-events-none absolute left-0 top-0 h-[360px] w-[360px] -translate-x-1/3 -translate-y-1/3 rounded-full bg-accent/12 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-[420px] w-[420px] translate-x-1/4 translate-y-1/4 rounded-full bg-text/6 blur-3xl" />

      <div className="relative mx-auto flex min-h-[calc(100vh-3rem)] max-w-7xl items-center">
        <div className="grid w-full gap-6 xl:grid-cols-[minmax(0,430px)_minmax(0,1fr)]">
          <Card className="overflow-hidden border-white/80 bg-white/92 p-0 backdrop-blur">
            <div className="flex items-center justify-between gap-4 border-b border-border-main px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-text text-white shadow-sm">
                  <Hexagon className="h-5 w-5 fill-white" />
                </div>
                <div>
                  <div className="text-sm font-semibold tracking-[-0.02em] text-text">Real Advertise</div>
                  <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-text4">Monitoring Client</div>
                </div>
              </div>
              <Badge tone="neutral" style="soft" className="hidden sm:inline-flex">
                Secure session
              </Badge>
            </div>

            <div className="space-y-7 p-6 md:p-8 lg:p-9">
              <div className="space-y-4">
                <Badge tone="accent" style="soft" className="w-fit">
                  Internal dashboard access
                </Badge>
                <div className="space-y-3">
                  <h1 className="text-display max-w-sm">Masuk ke command center.</h1>
                  <p className="max-w-md text-body">
                    Workspace ini dipakai untuk memantau performa klien, membaca sinyal prioritas, dan menjalankan layer insight AI harian.
                  </p>
                </div>
              </div>

              <Card tone="muted" className="space-y-6 border-white/80 bg-[rgba(255,255,255,0.55)] p-5 md:p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="ds-eyebrow">Sign in</div>
                    <h2 className="mt-1 text-h4">Use your workspace credential</h2>
                  </div>
                  <div className="rounded-full border border-border-main bg-white px-3 py-1 text-[11px] font-medium text-text3">
                    Auth
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

              <div className="rounded-[22px] border border-border-main bg-surface2/85 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-accent shadow-sm">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-text">Secure internal access</div>
                    <div className="mt-1 text-xs leading-relaxed text-text3">
                      Credentials diverifikasi sebelum sesi dashboard dibuat. Fokusnya tetap ke akses cepat, bukan dekorasi berlebih.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="relative hidden overflow-hidden border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.92)_0%,rgba(248,247,244,0.96)_100%)] p-7 backdrop-blur xl:block">
            <div className="absolute right-0 top-0 h-56 w-56 translate-x-1/4 -translate-y-1/4 rounded-full bg-accent/10 blur-3xl" />
            <div className="relative space-y-6">
              <div className="flex items-start justify-between gap-6">
                <div className="max-w-3xl space-y-3">
                  <Badge tone="neutral" style="soft" className="w-fit">
                    Product snapshot
                  </Badge>
                  <h2 className="max-w-3xl text-[clamp(2.3rem,3vw,4rem)] font-semibold tracking-[-0.05em] text-text leading-[1.02]">
                    Workspace yang tenang untuk <span className="text-accent">membaca sinyal penting</span>, bukan tenggelam di noise.
                  </h2>
                  <p className="max-w-2xl text-[15px] leading-relaxed text-text2">
                    Login view ini sekarang lebih dekat ke bahasa visual dashboard utama: panel modular, hierarchy jelas, dan informasi penting yang langsung terbaca.
                  </p>
                </div>
                <div className="shrink-0 rounded-[24px] border border-border-main bg-white px-5 py-4 shadow-sm">
                  <div className="text-micro">Session state</div>
                  <div className="mt-2 text-base font-semibold text-text">Ready for internal sign-in</div>
                </div>
              </div>

              <div className="grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
                <Card className="p-0 overflow-hidden">
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

                  <div className="grid gap-4 p-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                    <div className="rounded-[24px] border border-border-main bg-surface2 p-5">
                      <div className="mb-4 flex items-start justify-between gap-3">
                        <div>
                          <div className="text-micro">Focus queue</div>
                          <div className="mt-2 text-h4">Today priorities</div>
                        </div>
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-accent shadow-sm">
                          <TrendingUp className="h-4 w-4" />
                        </div>
                      </div>
                      <div className="rounded-[18px] border border-border-main bg-white p-4">
                        <div className="text-sm font-semibold text-text">2 client accounts need review</div>
                        <div className="mt-2 text-xs leading-relaxed text-text3">
                          Risk signal disusun sebagai queue prioritas agar account yang butuh tindakan langsung terlihat.
                        </div>
                      </div>
                    </div>

                    <div className="rounded-[24px] border border-white/10 bg-text p-5 text-white">
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <div>
                          <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/55">Security</div>
                          <div className="mt-2 text-h4 text-white">Internal access layer</div>
                        </div>
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/12 bg-white/10">
                          <ShieldCheck className="h-5 w-5" />
                        </div>
                      </div>
                      <div className="space-y-3 text-sm text-white/75">
                        <div className="rounded-[18px] border border-white/10 bg-white/5 p-4">
                          Access point dirancang ringkas agar user langsung masuk ke workflow utama tanpa UI yang terasa acak.
                        </div>
                        <div className="rounded-[18px] border border-white/10 bg-white/5 p-4">
                          Panel, border, dan emphasis sekarang konsisten dengan dashboard utama sehingga halaman login tidak terasa seperti halaman terpisah.
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                <div className="grid gap-4">
                  {PREVIEW_ITEMS.map((item) => (
                    <Card key={item.title} className="border-white/70 bg-white/90 p-5">
                      <div className="flex items-start gap-4">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-surface2 text-text shadow-sm">
                          <item.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-text">{item.title}</div>
                          <p className="mt-2 text-sm leading-relaxed text-text3">{item.description}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
