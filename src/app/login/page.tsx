'use client';

import React, { useState } from 'react';
import { login } from '@/app/actions/auth';
import { Hexagon, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await login(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-bg relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[120px]" />

      <div className="w-full max-w-[420px] px-6 relative z-10 animate-fade-in">
        {/* Logo Area */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center shadow-2xl shadow-accent/20 mb-6">
            <Hexagon className="w-8 h-8 text-white fill-white" />
          </div>
          <h1 className="text-2xl font-bold text-text tracking-tight">Real Advertise</h1>
          <p className="text-sm text-text3 font-medium mt-1">Command Center Access</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-[32px] p-8 border border-white shadow-2xl shadow-text/5">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-text mb-1.5">Welcome Back</h2>
            <p className="text-sm text-text3 font-medium">Please enter your credentials to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-rr-bg border border-rr-border text-rr text-xs font-bold animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="type-overline ml-1">Email Address</label>
              <input
                name="email"
                type="email"
                required
                placeholder="name@company.com"
                className="w-full h-13 px-5 rounded-2xl bg-surface2 border border-border-main text-sm font-medium focus:outline-none focus:ring-4 focus:ring-accent/5 focus:border-accent/40 transition-all placeholder:text-text4"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <label className="type-overline">Password</label>
                <button type="button" className="text-[10px] font-bold text-accent hover:underline">Forgot?</button>
              </div>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  className="w-full h-13 px-5 rounded-2xl bg-surface2 border border-border-main text-sm font-medium focus:outline-none focus:ring-4 focus:ring-accent/5 focus:border-accent/40 transition-all placeholder:text-text4"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-text4 hover:text-text3 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-text hover:bg-accent text-white rounded-2xl font-bold text-sm transition-all shadow-xl shadow-text/10 hover:shadow-accent/20 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed group mt-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Log In
                  <Hexagon className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center mt-10 text-[11px] text-text4 font-medium uppercase tracking-[0.2em]">
          Powered by Joytivism
        </p>
      </div>
    </div>
  );
}
