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
    <div className="min-h-screen w-full flex bg-white font-sans overflow-hidden">
      
      {/* ── LEFT SIDE: LOGIN FORM ── */}
      <div className="w-full lg:w-[45%] flex flex-col items-center justify-center p-8 lg:p-20 relative animate-fade-in">
        
        {/* Logo (Top Left Mobile) */}
        <div className="absolute top-8 left-8 flex items-center gap-2 lg:hidden">
           <Hexagon className="w-6 h-6 text-accent fill-accent/10" />
           <span className="font-black text-text text-sm tracking-tighter">REAL ADVERTISE</span>
        </div>

        <div className="w-full max-w-[400px]">
          {/* Header */}
          <div className="mb-10 text-center lg:text-left flex flex-col items-center lg:items-start">
            <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-6 shadow-sm border border-accent/20">
               <Hexagon className="w-8 h-8 text-accent fill-accent" />
            </div>
            <h1 className="text-3xl font-black text-text tracking-tight mb-2">Login to your account!</h1>
            <p className="text-sm text-text3 font-medium">Enter your credentials to access the command center.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-rr-bg/10 border border-rr-border/20 text-rr text-xs font-bold animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            {/* Identifier Input */}
            <div className="space-y-2">
              <label className="type-overline ml-1 text-text2">Username or Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text4 group-focus-within:text-accent transition-colors" />
                <input
                  name="email"
                  type="text"
                  required
                  placeholder="eg. admin_joy"
                  className="w-full h-13 pl-11 pr-5 rounded-2xl bg-surface2 border border-border-main text-sm font-medium focus:outline-none focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all placeholder:text-text4"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <label className="type-overline text-text2">Password</label>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text4 group-focus-within:text-accent transition-colors" />
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  className="w-full h-13 pl-11 pr-12 rounded-2xl bg-surface2 border border-border-main text-sm font-medium focus:outline-none focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all placeholder:text-text4"
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

            <div className="flex items-center justify-between px-1">
               <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded border-border-main text-accent focus:ring-accent/20" />
                  <span className="text-xs font-semibold text-text3 group-hover:text-text transition-colors">Remember me</span>
               </label>
               <button type="button" className="text-xs font-bold text-accent hover:underline">Forgot Password?</button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-13 bg-accent hover:bg-accent-hover text-white rounded-2xl font-black text-sm transition-all shadow-lg shadow-accent/20 flex items-center justify-center gap-3 disabled:opacity-70 mt-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "LOGIN"
              )}
            </button>
          </form>

          {/* Social Login */}
          <div className="mt-10">
             <div className="relative flex items-center justify-center mb-8">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border-main"></div></div>
                <span className="relative px-4 bg-white text-[10px] font-bold text-text4 uppercase tracking-widest">Or login with</span>
             </div>
             
             <div className="grid grid-cols-3 gap-4">
                {[Compass, Share2, Smartphone].map((Icon, i) => (
                   <button key={i} type="button" className="flex items-center justify-center h-12 rounded-2xl border border-border-main hover:bg-surface2 hover:border-text4 transition-all group">
                      <Icon className="w-5 h-5 text-text2 group-hover:scale-110 transition-transform" />
                   </button>
                ))}
             </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT SIDE: VISUAL SECTION ── */}
      <div className="hidden lg:flex flex-1 p-10 items-center justify-center">
        <div className="w-full h-full bg-accent/5 rounded-[48px] border border-accent/10 relative overflow-hidden flex flex-col items-center justify-center">
          
          {/* Background Patterns */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(2,132,199,0.08)_0%,transparent_70%)]" />
          <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />

          {/* Content */}
          <div className="relative z-10 text-center px-20">
             <h2 className="text-4xl font-black text-text tracking-tighter mb-4 leading-tight">
                Monitor Better <br />
                <span className="text-accent">Everywhere</span>
             </h2>
             <p className="text-base text-text3 font-medium max-w-sm mx-auto mb-20 leading-relaxed">
                Comprehensive data monitoring for all your digital marketing channels in one unified platform.
             </p>

             {/* Orbit Animation */}
             <div className="relative w-80 h-80 mx-auto">
                {/* Center Logo */}
                <div className="absolute inset-0 flex items-center justify-center z-20">
                   <div className="w-24 h-24 rounded-3xl bg-accent shadow-2xl shadow-accent/40 flex items-center justify-center animate-bounce-slow">
                      <Hexagon className="w-12 h-12 text-white fill-white" />
                   </div>
                </div>

                {/* Orbit Rings */}
                <div className="absolute inset-0 border border-accent/10 rounded-full animate-spin-slow"></div>
                <div className="absolute inset-[-40px] border border-accent/5 rounded-full animate-reverse-spin"></div>

                {/* Orbit Icons */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-xl bg-white shadow-xl border border-border-main flex items-center justify-center animate-orbit-1">
                   <Compass className="w-6 h-6 text-[#4285F4]" />
                </div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-12 h-12 rounded-xl bg-white shadow-xl border border-border-main flex items-center justify-center animate-orbit-2">
                   <Share2 className="w-6 h-6 text-[#1877F2]" />
                </div>
                <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-xl bg-white shadow-xl border border-border-main flex items-center justify-center animate-orbit-3">
                   <Globe className="w-6 h-6 text-[#00a1a6]" />
                </div>
                <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-xl bg-white shadow-xl border border-border-main flex items-center justify-center animate-orbit-4">
                   <BarChart2 className="w-6 h-6 text-[#ff6301]" />
                </div>
             </div>
          </div>

          {/* Footer Desc */}
          <div className="absolute bottom-12 text-center">
             <p className="text-xs font-bold text-text3 max-w-xs mx-auto opacity-60 italic">
                Compatible with Google Ads, Meta, TikTok, and most web analytics for a smooth monitoring experience.
             </p>
             {/* Pagination Dots */}
             <div className="flex items-center justify-center gap-2 mt-6">
                <div className="w-8 h-1.5 rounded-full bg-accent"></div>
                <div className="w-2 h-1.5 rounded-full bg-accent/20"></div>
                <div className="w-2 h-1.5 rounded-full bg-accent/20"></div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
