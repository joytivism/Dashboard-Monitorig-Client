'use client';

import React, { useState } from 'react';
import { login } from '@/app/actions/auth';
import { Hexagon, Loader2, AlertCircle, Eye, EyeOff, ShieldCheck, Sparkles } from 'lucide-react';

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
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0F172A] relative overflow-hidden font-sans">
      
      {/* ── Dynamic Animated Background ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#0284C7]/20 rounded-full blur-[120px] animate-pulse-soft" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#0284C7]/10 rounded-full blur-[120px] animate-pulse-soft" style={{ animationDelay: '1s' }} />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-white/5 rounded-full blur-[100px] animate-pulse-soft" style={{ animationDelay: '2s' }} />
        
        {/* Decorative Grid */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <div className="w-full max-w-[440px] px-6 relative z-10">
        
        {/* ── Logo Area ── */}
        <div className="flex flex-col items-center mb-10 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-accent to-blue-400 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative w-16 h-16 rounded-2xl bg-[#1E293B] border border-white/10 flex items-center justify-center shadow-2xl shrink-0">
              <Hexagon className="w-9 h-9 text-white fill-white/10 group-hover:scale-110 transition-transform duration-500" />
            </div>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tighter mt-6">REAL ADVERTISE</h1>
          <div className="flex items-center gap-2 mt-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <p className="type-overline !text-text4 tracking-[0.3em]">Command Center</p>
          </div>
        </div>

        {/* ── Main Login Card ── */}
        <div className="relative group animate-fade-in" style={{ animationDelay: '0.2s' }}>
          {/* Card Glow Effect */}
          <div className="absolute -inset-0.5 bg-gradient-to-b from-white/10 to-transparent rounded-[36px] blur-[1px] opacity-100"></div>
          
          <div className="relative bg-[#1E293B]/60 backdrop-blur-3xl rounded-[32px] p-10 border border-white/10 shadow-2xl shadow-black/50 overflow-hidden">
            
            {/* Header Text */}
            <div className="mb-10 text-center sm:text-left">
              <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Intelligence Access</h2>
              <p className="text-sm text-text4 font-medium opacity-70">Enter your credentials to enter the hub.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-rr-bg/10 border border-rr-border/20 text-rr text-xs font-bold animate-shake">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              {/* Username Input */}
              <div className="space-y-2.5">
                <label className="type-overline !text-text4 ml-1 flex items-center gap-2">
                  <ShieldCheck className="w-3 h-3 text-accent" />
                  Authorized Identifier
                </label>
                <div className="relative group/input">
                  <input
                    name="email"
                    type="text"
                    required
                    placeholder="Username or Email"
                    className="w-full h-14 px-6 rounded-2xl bg-white/5 border border-white/10 text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/40 transition-all placeholder:text-text4/30"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between px-1">
                  <label className="type-overline !text-text4 flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-accent" />
                    Security Key
                  </label>
                  <button type="button" className="text-[10px] font-bold text-accent/60 hover:text-accent transition-colors">Recover Access?</button>
                </div>
                <div className="relative group/input">
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    className="w-full h-14 px-6 rounded-2xl bg-white/5 border border-white/10 text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/40 transition-all placeholder:text-text4/30"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 p-1 text-text4/50 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-accent hover:bg-accent-hover text-white rounded-2xl font-black text-sm transition-all shadow-xl shadow-accent/20 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed group mt-4 overflow-hidden relative"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span className="relative z-10">AUTHENTICATE ACCESS</span>
                    <Sparkles className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:rotate-12 transition-all duration-300 relative z-10" />
                    {/* Hover Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shine" />
                  </>
                )}
              </button>
            </form>

            {/* AI Badge Overlay */}
            <div className="mt-10 pt-6 border-t border-white/5 flex items-center justify-center">
               <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                  <div className="w-1.5 h-1.5 rounded-full bg-gg animate-pulse" />
                  <span className="text-[10px] font-bold text-text4 uppercase tracking-widest opacity-60">System Ready: Secure Node</span>
               </div>
            </div>
          </div>
        </div>

        {/* ── Final Footer ── */}
        <div className="text-center mt-10 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <p className="text-[10px] text-text4/40 font-bold uppercase tracking-[0.4em]">
            © 2026 Joytivism Network · Global HQ
          </p>
        </div>
      </div>
    </div>
  );
}
