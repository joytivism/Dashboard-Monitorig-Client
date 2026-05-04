'use client';

import { login } from '@/app/actions/auth';
import React, { useState, useTransition } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  Globe2,
  Hexagon,
  Lock,
  Mail,
  Monitor,
  Share2,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

const SNAPSHOT_ITEMS = [
  {
    value: '10+',
    label: 'Channel map',
    description: 'Monitoring lintas platform tetap terbaca dari satu workspace.',
  },
  {
    value: 'Live',
    label: 'Signal sync',
    description: 'Alert, spend, dan anomaly masuk tanpa perlu pindah context.',
  },
  {
    value: 'AI',
    label: 'Priority layer',
    description: 'Insight otomatis diringkas supaya tim langsung tahu apa yang penting.',
  },
];

const FEATURE_ITEMS = [
  {
    icon: Activity,
    title: 'Unified monitoring',
    description: 'ROAS, spend, dan alert prioritas dibaca dalam satu command center.',
  },
  {
    icon: Sparkles,
    title: 'Recommendation layer',
    description: 'Insight harian disusun dalam format yang cepat dipakai operasional.',
  },
  {
    icon: ShieldCheck,
    title: 'Internal-only access',
    description: 'Login dirancang tenang, cepat, dan fokus ke workflow utama tim.',
  },
];

const ORBIT_ITEMS = [
  { icon: Monitor, className: 'left-1/2 top-8 -translate-x-1/2' },
  { icon: Globe2, className: 'right-8 top-1/2 -translate-y-1/2' },
  { icon: Share2, className: 'bottom-8 left-1/2 -translate-x-1/2' },
  { icon: Sparkles, className: 'left-8 top-1/2 -translate-y-1/2' },
];

type AuthFieldProps = {
  autoComplete?: string;
  disabled?: boolean;
  hint?: string;
  icon: LucideIcon;
  id: string;
  label: string;
  name: string;
  placeholder: string;
  trailing?: React.ReactNode;
  type: string;
};

function AuthField({
  autoComplete,
  disabled,
  hint,
  icon: Icon,
  id,
  label,
  name,
  placeholder,
  trailing,
  type,
}: AuthFieldProps) {
  return (
    <div className="space-y-2.5">
      <label htmlFor={id} className="text-[0.72rem] font-semibold uppercase text-text4">
        {label}
      </label>
      <div className="group flex h-12 min-w-0 items-center rounded-[var(--radius-md)] border border-border-main bg-surface2 px-3.5 shadow-[var(--shadow-card)] transition-all duration-200 focus-within:border-accent focus-within:bg-white focus-within:shadow-[var(--focus-ring)] sm:h-14 sm:px-4">
        <Icon className="h-[18px] w-[18px] shrink-0 text-text4 transition-colors duration-200 group-focus-within:text-accent" />
        <input
          id={id}
          name={name}
          type={type}
          autoComplete={autoComplete}
          required
          disabled={disabled}
          placeholder={placeholder}
          className="h-full min-w-0 flex-1 border-none bg-transparent px-3 text-sm font-semibold text-text outline-none placeholder:truncate placeholder:text-text4 disabled:cursor-not-allowed disabled:opacity-70 sm:text-[1rem]"
        />
        {trailing ? <div className="ml-2 shrink-0">{trailing}</div> : null}
      </div>
      {hint ? <p className="text-sm leading-6 text-text3">{hint}</p> : null}
    </div>
  );
}

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = await login(formData);

      if (result?.error) {
        setError(result.error);
      }
    });
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-bg px-4 py-4 md:px-6 md:py-8">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)',
          backgroundSize: '46px 46px',
        }}
      />
      <div className="relative mx-auto flex min-h-[calc(100vh-2rem)] w-full min-w-0 max-w-[1400px] items-start xl:items-center">
        <div className="grid w-full min-w-0 max-w-full overflow-hidden rounded-[24px] border border-border-main bg-white shadow-[var(--shadow-card)] sm:rounded-[28px] xl:grid-cols-[minmax(360px,420px)_minmax(0,1fr)]">
          <section className="relative min-w-0 max-w-full overflow-hidden border-border-main bg-white px-5 py-6 sm:px-7 sm:py-8 md:px-9 md:py-9 xl:border-r">
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-[22px] bg-text text-white shadow-[0_18px_36px_rgba(0,0,0,0.14)]">
                    <Hexagon className="h-5 w-5 fill-white" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[1.05rem] font-bold text-text">Real Advertise</div>
                    <div className="mt-1 text-[0.72rem] font-semibold uppercase text-text4">
                      Monitoring Client
                    </div>
                  </div>
                </div>
                <div className="hidden rounded-full border border-border-main bg-white px-4 py-2 text-[0.74rem] font-semibold text-text3 sm:block">
                  Secure session
                </div>
              </div>

              <div className="mt-8 space-y-4 sm:mt-10">
                <div className="inline-flex w-fit items-center rounded-full border border-accent/20 bg-accent-light px-4 py-2 text-[0.76rem] font-semibold text-accent">
                  Internal dashboard access
                </div>
                <div className="min-w-0 space-y-3">
                  <h1 className="max-w-[20rem] text-4xl font-bold leading-tight text-text sm:max-w-sm sm:text-5xl xl:text-6xl">
                    Masuk ke command center.
                  </h1>
                  <p className="max-w-[19rem] text-sm leading-7 text-text3 sm:max-w-md sm:text-[1rem] sm:leading-8">
                    Akses workspace internal untuk membaca performa klien, anomali spend, dan rekomendasi AI tanpa noise yang tidak perlu.
                  </p>
                </div>
              </div>

              <div className="mt-8 w-full max-w-[20rem] rounded-[var(--radius-lg)] border border-border-main bg-white p-5 shadow-[var(--shadow-card)] sm:max-w-full sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="text-[0.78rem] font-semibold uppercase text-text4">Sign in</div>
                    <h2 className="mt-3 max-w-[17rem] text-2xl font-bold leading-tight text-text sm:max-w-sm">
                      Use your workspace credential
                    </h2>
                  </div>
                  <div className="hidden rounded-full border border-border-main bg-white px-3 py-1.5 text-[0.72rem] font-semibold text-text3 sm:block">
                    Auth
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                  {error ? (
                    <div className="flex items-start gap-3 rounded-[22px] border border-rr-border bg-rr-bg px-4 py-3.5 text-sm font-medium text-rr-text animate-[shake_0.35s_ease-in-out]">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  ) : null}

                  <AuthField
                    id="email"
                    name="email"
                    type="text"
                    icon={Mail}
                    disabled={isPending}
                    autoComplete="username"
                    label="Email / Username"
                    placeholder="admin atau admin@realadvertise.id"
                    hint="Gunakan akun internal yang sudah punya akses ke workspace ini."
                  />

                  <AuthField
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    icon={Lock}
                    disabled={isPending}
                    autoComplete="current-password"
                    label="Password"
                    placeholder="Masukkan password"
                    trailing={(
                      <button
                        type="button"
                        onClick={() => setShowPassword((value) => !value)}
                        className="flex h-9 w-9 items-center justify-center rounded-full text-text4 transition-colors duration-200 hover:bg-white hover:text-text"
                        aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    )}
                  />

                  <div className="flex flex-col gap-3 text-sm text-text3 sm:flex-row sm:items-center sm:justify-between">
                    <label className="flex items-center gap-3 font-medium">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-border-main text-accent focus:ring-accent/20"
                      />
                      Keep me signed in
                    </label>
                    <button type="button" className="font-semibold text-accent transition-colors duration-200 hover:text-accent-hover">
                      Forgot password?
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={isPending}
                    className="flex h-12 w-full items-center justify-center gap-3 rounded-[var(--radius-md)] bg-text px-5 text-sm font-bold text-white shadow-[var(--shadow-card)] transition-colors duration-200 hover:bg-text2 disabled:cursor-not-allowed disabled:bg-text/45 disabled:shadow-none sm:h-14 sm:text-[1rem]"
                  >
                    <span>{isPending ? 'Signing in...' : 'Sign in'}</span>
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/18">
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </button>
                </form>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-[var(--radius-md)] border border-border-main bg-surface2/70 px-4 py-4">
                  <div className="text-[0.72rem] font-semibold uppercase text-text4">Session</div>
                  <div className="mt-2 text-[1.05rem] font-bold text-text">Scoped</div>
                </div>
                <div className="rounded-[var(--radius-md)] border border-border-main bg-surface2/70 px-4 py-4">
                  <div className="text-[0.72rem] font-semibold uppercase text-text4">Access</div>
                  <div className="mt-2 text-[1.05rem] font-bold text-text">Internal</div>
                </div>
                <div className="rounded-[var(--radius-md)] border border-border-main bg-surface2/70 px-4 py-4">
                  <div className="text-[0.72rem] font-semibold uppercase text-text4">Signal</div>
                  <div className="mt-2 text-[1.05rem] font-bold text-text">AI-ready</div>
                </div>
              </div>
            </div>
          </section>

          <section className="relative hidden min-w-0 overflow-hidden bg-surface2 px-8 py-8 md:px-10 md:py-10 xl:block">
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.4]"
              style={{
                backgroundImage:
                  'radial-gradient(rgba(0,0,0,0.07) 1px, transparent 1px)',
                backgroundSize: '18px 18px',
              }}
            />
            <div className="relative">
              <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                <div className="max-w-3xl">
                  <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent-light px-4 py-2 text-[0.76rem] font-semibold text-accent">
                    <span className="h-2 w-2 rounded-full bg-accent" />
                    Next-gen monitoring
                  </div>
                  <h2 className="mt-6 max-w-4xl text-5xl font-bold leading-tight text-text 2xl:text-6xl">
                    Workspace untuk membaca <span className="text-accent">sinyal penting</span>, bukan tenggelam di noise.
                  </h2>
                  <p className="mt-6 max-w-2xl text-[1.08rem] leading-8 text-text3">
                    Satu dashboard pusat untuk memantau ROAS, spend, performa lintas channel, dan layer insight AI dengan hierarchy yang lebih jelas sejak layar login.
                  </p>
                </div>

                <div className="w-full max-w-[320px] rounded-[28px] border border-border-main bg-white/92 p-5 shadow-[0_18px_42px_rgba(0,0,0,0.08)]">
                  <div className="text-[0.78rem] font-semibold uppercase text-text4">Session state</div>
                  <div className="mt-4 text-[1.65rem] font-bold leading-tight text-text">
                    Ready for internal sign-in
                  </div>
                  <p className="mt-3 text-sm leading-6 text-text3">
                    Login layer dibuat lebih dekat dengan visual command center utama, jadi transisinya terasa natural.
                  </p>
                </div>
              </div>

              <div className="mt-10 grid gap-5 2xl:grid-cols-[minmax(0,1.15fr)_320px]">
                <div className="rounded-[32px] border border-border-main bg-white/78 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.06)] backdrop-blur">
                  <div className="rounded-[28px] border border-border-main bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(245,245,243,0.9)_100%)] p-5 sm:p-7">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="text-[0.78rem] font-semibold uppercase text-text4">Monitoring snapshot</div>
                        <div className="mt-2 text-[1.5rem] font-bold leading-tight text-text">
                          Unified advertising intelligence
                        </div>
                      </div>
                      <div className="inline-flex items-center gap-2 rounded-full border border-gd-border/70 bg-gd-bg px-4 py-2 text-[0.78rem] font-semibold text-gd-text">
                        <span className="h-2.5 w-2.5 rounded-full bg-gd animate-[pulse-soft_2.6s_ease-in-out_infinite]" />
                        Live sync
                      </div>
                    </div>

                    <div className="relative mt-8 flex min-h-[340px] items-center justify-center overflow-hidden rounded-[30px] border border-border-main bg-[radial-gradient(circle_at_center,rgba(255,99,1,0.08),transparent_38%),linear-gradient(180deg,rgba(255,255,255,0.88)_0%,rgba(245,245,243,0.94)_100%)]">
                      <div className="absolute h-[14rem] w-[14rem] rounded-full border border-black/6" />
                      <div className="absolute h-[20rem] w-[20rem] rounded-full border border-black/6" />
                      <div className="absolute h-[26rem] w-[26rem] rounded-full border border-black/4" />

                      {ORBIT_ITEMS.map((item) => (
                        <div
                          key={item.className}
                          className={`absolute ${item.className} flex h-14 w-14 items-center justify-center rounded-full border border-border-main bg-white shadow-[0_14px_34px_rgba(0,0,0,0.1)] animate-[orbit-float_7s_ease-in-out_infinite]`}
                        >
                          <item.icon className="h-5 w-5 text-accent" />
                        </div>
                      ))}

                      <div className="relative flex h-28 w-28 items-center justify-center rounded-[30px] bg-accent shadow-[0_24px_54px_rgba(255,99,1,0.32)]">
                        <div className="flex items-end gap-2">
                          <span className="block h-5 w-1 rounded-full bg-white" />
                          <span className="block h-8 w-1 rounded-full bg-white" />
                          <span className="block h-11 w-1 rounded-full bg-white" />
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-3 lg:grid-cols-3">
                      {SNAPSHOT_ITEMS.map((item) => (
                        <div key={item.label} className="rounded-[24px] border border-border-main bg-white/88 p-4">
                          <div className="text-[0.78rem] font-semibold uppercase text-text4">
                            {item.label}
                          </div>
                          <div className="mt-3 text-[1.75rem] font-bold leading-none text-text">
                            {item.value}
                          </div>
                          <p className="mt-3 text-sm leading-6 text-text3">{item.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid gap-4">
                  {FEATURE_ITEMS.map((item) => (
                    <div
                      key={item.title}
                      className="rounded-[28px] border border-border-main bg-white/88 p-5 shadow-[0_18px_40px_rgba(0,0,0,0.06)] backdrop-blur"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] bg-surface2 text-text">
                          <item.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="text-[1.1rem] font-bold text-text">{item.title}</div>
                          <p className="mt-2 text-[0.96rem] leading-7 text-text3">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
