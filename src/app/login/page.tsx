'use client';

import React, { useState } from 'react';
import { login } from '@/app/actions/auth';
import { 
  Hexagon, Loader2, AlertCircle, Eye, EyeOff, 
  Mail, Lock, Compass, Share2, Smartphone, Globe, BarChart2
} from 'lucide-react';

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
    <div className="min-h-screen w-full flex items-center justify-center bg-bg font-sans overflow-hidden p-6 relative">
      
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="w-full max-w-5xl flex bg-white rounded-3xl border border-border-main shadow-2xl overflow-hidden relative z-10 animate-fade-in" style={{ boxShadow: '0 20px 60px -12px rgba(0,0,0,0.1)' }}>
        
        {/* ── LEFT SIDE: LOGIN FORM ── */}
        <div className="w-full lg:w-[45%] p-10 lg:p-16 flex flex-col justify-center bg-white border-r border-border-main">
          
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-8">
               <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-white shadow-lg shadow-accent/20">
                  <Hexagon className="w-6 h-6 fill-white" />
               </div>
               <span className="text-sm font-black text-text tracking-tighter">REAL ADVERTISE</span>
            </div>
            <h1 className="text-3xl font-bold text-text tracking-tight mb-2">Welcome Back!</h1>
            <p className="text-sm text-text3 font-medium">Please enter your credentials to login.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-rr-bg border border-rr-border text-rr-text text-xs font-bold animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            {/* Identifier Input */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-text3 uppercase tracking-wider block ml-1">Email / Username</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text4 group-focus-within:text-accent transition-colors" />
                <input
                  name="email"
                  type="text"
                  required
                  placeholder="admin@realadvertise.id"
                  className="w-full h-12 pl-11 pr-5 rounded-xl border border-border-main bg-surface2 text-sm font-semibold text-text focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/5 transition-all"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <label className="text-[10px] font-bold text-text3 uppercase tracking-wider block ml-1">Password</label>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text4 group-focus-within:text-accent transition-colors" />
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  className="w-full h-12 pl-11 pr-12 rounded-xl border border-border-main bg-surface2 text-sm font-semibold text-text focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/5 transition-all"
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

            <div className="flex items-center justify-between px-1 pt-1">
               <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded-md border-border-main text-accent focus:ring-accent/20 transition-all" />
                  <span className="text-xs font-semibold text-text3 group-hover:text-text transition-colors">Keep me signed in</span>
               </label>
               <button type="button" className="text-xs font-bold text-accent hover:text-accent-hover transition-colors">Forgot Password?</button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-accent hover:bg-accent-hover text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-accent/20 flex items-center justify-center gap-2 disabled:opacity-70 mt-4"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  SIGN IN
                  <div className="w-5 h-5 rounded-lg bg-white/20 flex items-center justify-center ml-2">
                    <Hexagon className="w-3 h-3 fill-white" />
                  </div>
                </>
              )}
            </button>
          </form>

          {/* Social Login Section */}
          <div className="mt-12">
             <div className="relative flex items-center justify-center mb-6">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border-main"></div></div>
                <span className="relative px-4 bg-white text-[10px] font-black text-text4 uppercase tracking-[0.12em]">Social Sign In</span>
             </div>
             
             <div className="grid grid-cols-3 gap-3">
                {[Compass, Share2, Smartphone].map((Icon, i) => (
                   <button key={i} type="button" className="flex items-center justify-center h-11 rounded-xl border border-border-main hover:bg-surface2 hover:border-accent/30 transition-all group">
                      <Icon className="w-4 h-4 text-text3 group-hover:text-accent transition-colors" />
                   </button>
                ))}
             </div>
          </div>
        </div>

        {/* ── RIGHT SIDE: VISUAL SECTION ── */}
        <div className="hidden lg:flex flex-1 p-12 bg-surface2 relative overflow-hidden flex-col items-center justify-center text-center">
          
          {/* Subtle Grid Pattern */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
            style={{ backgroundImage: 'radial-gradient(#0A0A0B 0.5px, transparent 0.5px)', backgroundSize: '16px 16px' }} />
          
          <div className="relative z-10 max-w-sm">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-[10px] font-black uppercase tracking-widest mb-6">
                <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                Next-Gen Monitoring
             </div>
             <h2 className="text-4xl font-bold text-text tracking-tighter mb-6 leading-[1.1]">
                Unified <span className="text-accent">Advertising</span> Intelligence
             </h2>
             <p className="text-sm text-text3 font-medium leading-relaxed mb-16">
                Satu dashboard pusat untuk memantau ROAS, spend, dan performa AI di semua channel pemasaran Anda.
             </p>

             {/* Animated Illustration Mockup */}
             <div className="relative w-full aspect-square max-w-[320px] mx-auto">
                {/* Orbit Rings */}
                <div className="absolute inset-0 border border-border-main rounded-full" />
                <div className="absolute inset-8 border border-border-main rounded-full opacity-50" />
                
                {/* Center Core */}
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-20 h-20 rounded-[2rem] bg-accent shadow-2xl shadow-accent/40 flex items-center justify-center animate-bounce-slow relative z-20">
                      <BarChart2 className="w-10 h-10 text-white" />
                   </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-2xl bg-white shadow-xl border border-border-main flex items-center justify-center animate-orbit-1">
                   <Smartphone className="w-6 h-6 text-accent" />
                </div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-12 h-12 rounded-2xl bg-white shadow-xl border border-border-main flex items-center justify-center animate-orbit-2">
                   <Share2 className="w-6 h-6 text-accent" />
                </div>
                <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-2xl bg-white shadow-xl border border-border-main flex items-center justify-center animate-orbit-3">
                   <Compass className="w-6 h-6 text-accent" />
                </div>
                <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-2xl bg-white shadow-xl border border-border-main flex items-center justify-center animate-orbit-4">
                   <Globe className="w-6 h-6 text-accent" />
                </div>
             </div>
          </div>

          {/* Feature List Footer */}
          <div className="absolute bottom-12 flex items-center justify-center gap-8">
             <div className="flex flex-col items-center gap-1">
                <span className="text-xs font-bold text-text tracking-tight">10+ Channels</span>
                <span className="text-[10px] font-medium text-text3">Integration</span>
             </div>
             <div className="w-px h-6 bg-border-main" />
             <div className="flex flex-col items-center gap-1">
                <span className="text-xs font-bold text-text tracking-tight">Real-time</span>
                <span className="text-[10px] font-medium text-text3">AI Logging</span>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
