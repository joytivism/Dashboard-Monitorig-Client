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
      <label htmlFor={id} className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-[#7f7a73]">
        {label}
      </label>
      <div className="group flex h-[60px] items-center rounded-[22px] border border-[#d9dee9] bg-[#ecf2ff] px-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] transition-all duration-200 focus-within:border-[#ff6a1a] focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(255,106,26,0.12)]">
        <Icon className="h-[18px] w-[18px] shrink-0 text-[#8c96a8] transition-colors duration-200 group-focus-within:text-[#ff6a1a]" />
        <input
          id={id}
          name={name}
          type={type}
          autoComplete={autoComplete}
          required
          disabled={disabled}
          placeholder={placeholder}
          className="h-full w-full border-none bg-transparent px-3 text-[1rem] font-semibold tracking-[-0.02em] text-[#141413] outline-none placeholder:text-[#9ea7b4] disabled:cursor-not-allowed disabled:opacity-70"
        />
        {trailing ? <div className="ml-2 shrink-0">{trailing}</div> : null}
      </div>
      {hint ? <p className="text-sm leading-6 text-[#77716a]">{hint}</p> : null}
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
    <main className="relative min-h-screen overflow-hidden bg-[#f5f1ea] px-4 py-5 md:px-6 md:py-8">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(17,17,16,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(17,17,16,0.06) 1px, transparent 1px)',
          backgroundSize: '46px 46px',
        }}
      />
      <div className="pointer-events-none absolute left-0 top-0 h-[28rem] w-[28rem] -translate-x-1/3 -translate-y-1/3 rounded-full bg-[rgba(255,106,26,0.16)] blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-[32rem] w-[32rem] translate-x-1/3 translate-y-1/3 rounded-full bg-[rgba(17,17,16,0.08)] blur-3xl" />

      <div className="relative mx-auto flex min-h-[calc(100vh-2.5rem)] max-w-[1540px] items-center">
        <div className="grid w-full overflow-hidden rounded-[34px] border border-white/70 bg-[rgba(255,255,255,0.74)] shadow-[0_40px_120px_rgba(17,17,16,0.12)] backdrop-blur xl:grid-cols-[440px_minmax(0,1fr)]">
          <section className="relative border-b border-[rgba(17,17,16,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.92)_0%,rgba(251,249,245,0.96)_100%)] px-7 py-8 md:px-10 md:py-10 xl:border-b-0 xl:border-r xl:border-r-[rgba(17,17,16,0.08)]">
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-[22px] bg-[#111110] text-white shadow-[0_18px_36px_rgba(17,17,16,0.16)]">
                    <Hexagon className="h-5 w-5 fill-white" />
                  </div>
                  <div>
                    <div className="text-[1.05rem] font-bold tracking-[-0.04em] text-[#111110]">Real Advertise</div>
                    <div className="mt-1 text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[#8d877f]">
                      Monitoring Client
                    </div>
                  </div>
                </div>
                <div className="hidden rounded-full border border-[rgba(17,17,16,0.08)] bg-white/90 px-4 py-2 text-[0.74rem] font-semibold tracking-[0.08em] text-[#69645d] sm:block">
                  Secure session
                </div>
              </div>

              <div className="mt-10 space-y-4">
                <div className="inline-flex w-fit items-center rounded-full border border-[rgba(255,106,26,0.2)] bg-[rgba(255,106,26,0.08)] px-4 py-2 text-[0.76rem] font-semibold tracking-[0.08em] text-[#ff6a1a]">
                  Internal dashboard access
                </div>
                <div className="space-y-3">
                  <h1 className="max-w-sm text-[clamp(3rem,5vw,4.75rem)] font-bold leading-[0.96] tracking-[-0.075em] text-[#111110]">
                    Masuk ke command center.
                  </h1>
                  <p className="max-w-md text-[1rem] leading-8 tracking-[-0.02em] text-[#5f5a53]">
                    Akses workspace internal untuk membaca performa klien, anomali spend, dan rekomendasi AI tanpa noise yang tidak perlu.
                  </p>
                </div>
              </div>

              <div className="mt-8 rounded-[30px] border border-[rgba(17,17,16,0.08)] bg-[rgba(250,247,241,0.92)] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-[0.78rem] font-semibold uppercase tracking-[0.28em] text-[#8d877f]">Sign in</div>
                    <h2 className="mt-3 text-[1.9rem] font-bold leading-none tracking-[-0.06em] text-[#111110]">
                      Use your workspace credential
                    </h2>
                  </div>
                  <div className="rounded-full border border-[rgba(17,17,16,0.08)] bg-white px-3 py-1.5 text-[0.72rem] font-semibold tracking-[0.08em] text-[#74706a]">
                    Auth
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                  {error ? (
                    <div className="flex items-start gap-3 rounded-[22px] border border-[#f0c8c8] bg-[#fff3f3] px-4 py-3.5 text-sm font-medium text-[#9c3838] animate-[shake_0.35s_ease-in-out]">
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
                        className="flex h-9 w-9 items-center justify-center rounded-full text-[#8c96a8] transition-colors duration-200 hover:bg-white hover:text-[#111110]"
                        aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    )}
                  />

                  <div className="flex flex-col gap-3 text-sm text-[#6d675f] sm:flex-row sm:items-center sm:justify-between">
                    <label className="flex items-center gap-3 font-medium">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-[rgba(17,17,16,0.2)] text-[#ff6a1a] focus:ring-[#ff6a1a]/20"
                      />
                      Keep me signed in
                    </label>
                    <button type="button" className="font-semibold text-[#ff6a1a] transition-colors duration-200 hover:text-[#dc5912]">
                      Forgot password?
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={isPending}
                    className="flex h-[60px] w-full items-center justify-center gap-3 rounded-full bg-[#ff6a1a] px-6 text-[1rem] font-bold tracking-[-0.02em] text-white shadow-[0_24px_44px_rgba(255,106,26,0.34)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#f15f12] disabled:translate-y-0 disabled:cursor-not-allowed disabled:bg-[#ffb489] disabled:shadow-none"
                  >
                    <span>{isPending ? 'Signing in...' : 'Sign in'}</span>
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/18">
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </button>
                </form>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-[22px] border border-[rgba(17,17,16,0.08)] bg-white/80 px-4 py-4">
                  <div className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[#8d877f]">Session</div>
                  <div className="mt-2 text-[1.05rem] font-bold tracking-[-0.04em] text-[#111110]">Scoped</div>
                </div>
                <div className="rounded-[22px] border border-[rgba(17,17,16,0.08)] bg-white/80 px-4 py-4">
                  <div className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[#8d877f]">Access</div>
                  <div className="mt-2 text-[1.05rem] font-bold tracking-[-0.04em] text-[#111110]">Internal</div>
                </div>
                <div className="rounded-[22px] border border-[rgba(17,17,16,0.08)] bg-white/80 px-4 py-4">
                  <div className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[#8d877f]">Signal</div>
                  <div className="mt-2 text-[1.05rem] font-bold tracking-[-0.04em] text-[#111110]">AI-ready</div>
                </div>
              </div>
            </div>
          </section>

          <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_right,rgba(255,106,26,0.12),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.9)_0%,rgba(246,243,236,0.96)_100%)] px-7 py-8 md:px-10 md:py-10">
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.4]"
              style={{
                backgroundImage:
                  'radial-gradient(rgba(17,17,16,0.08) 1px, transparent 1px)',
                backgroundSize: '18px 18px',
              }}
            />
            <div className="relative">
              <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                <div className="max-w-3xl">
                  <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(255,106,26,0.18)] bg-[rgba(255,106,26,0.08)] px-4 py-2 text-[0.76rem] font-semibold tracking-[0.12em] text-[#ff6a1a]">
                    <span className="h-2 w-2 rounded-full bg-[#ff6a1a]" />
                    Next-gen monitoring
                  </div>
                  <h2 className="mt-6 max-w-4xl text-[clamp(3rem,5vw,5.7rem)] font-bold leading-[0.92] tracking-[-0.085em] text-[#111110]">
                    Workspace untuk membaca <span className="text-[#ff6a1a]">sinyal penting</span>, bukan tenggelam di noise.
                  </h2>
                  <p className="mt-6 max-w-2xl text-[1.08rem] leading-8 tracking-[-0.02em] text-[#666057]">
                    Satu dashboard pusat untuk memantau ROAS, spend, performa lintas channel, dan layer insight AI dengan hierarchy yang lebih jelas sejak layar login.
                  </p>
                </div>

                <div className="w-full max-w-[320px] rounded-[28px] border border-[rgba(17,17,16,0.08)] bg-white/92 p-5 shadow-[0_18px_42px_rgba(17,17,16,0.08)]">
                  <div className="text-[0.78rem] font-semibold uppercase tracking-[0.24em] text-[#8d877f]">Session state</div>
                  <div className="mt-4 text-[1.9rem] font-bold leading-none tracking-[-0.06em] text-[#111110]">
                    Ready for internal sign-in
                  </div>
                  <p className="mt-3 text-sm leading-6 text-[#6d675f]">
                    Login layer dibuat lebih dekat dengan visual command center utama, jadi transisinya terasa natural.
                  </p>
                </div>
              </div>

              <div className="mt-10 grid gap-5 2xl:grid-cols-[minmax(0,1.15fr)_320px]">
                <div className="rounded-[32px] border border-[rgba(17,17,16,0.08)] bg-white/78 p-5 shadow-[0_20px_50px_rgba(17,17,16,0.06)] backdrop-blur">
                  <div className="rounded-[28px] border border-[rgba(17,17,16,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(246,242,235,0.9)_100%)] p-5 sm:p-7">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="text-[0.78rem] font-semibold uppercase tracking-[0.24em] text-[#8d877f]">Monitoring snapshot</div>
                        <div className="mt-2 text-[1.7rem] font-bold leading-none tracking-[-0.05em] text-[#111110]">
                          Unified advertising intelligence
                        </div>
                      </div>
                      <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(27,143,90,0.18)] bg-[rgba(27,143,90,0.09)] px-4 py-2 text-[0.78rem] font-semibold text-[#1d7f53]">
                        <span className="h-2.5 w-2.5 rounded-full bg-[#1d9f66] animate-[pulse-soft_2.6s_ease-in-out_infinite]" />
                        Live sync
                      </div>
                    </div>

                    <div className="relative mt-8 flex min-h-[340px] items-center justify-center overflow-hidden rounded-[30px] border border-[rgba(17,17,16,0.06)] bg-[radial-gradient(circle_at_center,rgba(255,106,26,0.08),transparent_38%),linear-gradient(180deg,rgba(255,255,255,0.84)_0%,rgba(248,245,239,0.92)_100%)]">
                      <div className="absolute h-[14rem] w-[14rem] rounded-full border border-[rgba(17,17,16,0.06)]" />
                      <div className="absolute h-[20rem] w-[20rem] rounded-full border border-[rgba(17,17,16,0.06)]" />
                      <div className="absolute h-[26rem] w-[26rem] rounded-full border border-[rgba(17,17,16,0.04)]" />

                      {ORBIT_ITEMS.map((item) => (
                        <div
                          key={item.className}
                          className={`absolute ${item.className} flex h-14 w-14 items-center justify-center rounded-full border border-[rgba(17,17,16,0.08)] bg-white shadow-[0_14px_34px_rgba(17,17,16,0.1)] animate-[orbit-float_7s_ease-in-out_infinite]`}
                        >
                          <item.icon className="h-5 w-5 text-[#ff6a1a]" />
                        </div>
                      ))}

                      <div className="relative flex h-28 w-28 items-center justify-center rounded-[30px] bg-[#ff6a1a] shadow-[0_24px_54px_rgba(255,106,26,0.36)]">
                        <div className="flex items-end gap-2">
                          <span className="block h-5 w-1 rounded-full bg-white" />
                          <span className="block h-8 w-1 rounded-full bg-white" />
                          <span className="block h-11 w-1 rounded-full bg-white" />
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-3 lg:grid-cols-3">
                      {SNAPSHOT_ITEMS.map((item) => (
                        <div key={item.label} className="rounded-[24px] border border-[rgba(17,17,16,0.08)] bg-white/88 p-4">
                          <div className="text-[0.78rem] font-semibold uppercase tracking-[0.22em] text-[#8d877f]">
                            {item.label}
                          </div>
                          <div className="mt-3 text-[2rem] font-bold leading-none tracking-[-0.06em] text-[#111110]">
                            {item.value}
                          </div>
                          <p className="mt-3 text-sm leading-6 text-[#6e695f]">{item.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid gap-4">
                  {FEATURE_ITEMS.map((item) => (
                    <div
                      key={item.title}
                      className="rounded-[28px] border border-[rgba(17,17,16,0.08)] bg-white/88 p-5 shadow-[0_18px_40px_rgba(17,17,16,0.06)] backdrop-blur"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] bg-[#f4efe7] text-[#111110]">
                          <item.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="text-[1.1rem] font-bold tracking-[-0.04em] text-[#111110]">{item.title}</div>
                          <p className="mt-2 text-[0.96rem] leading-7 tracking-[-0.01em] text-[#6c665f]">
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
