'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, BarChart2, History, FileText, Bell, Upload, ChevronDown } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/', icon: LayoutGrid },
    { name: 'Analytic', href: '#', icon: BarChart2 },
    { name: 'History', href: '#', icon: History },
    { name: 'Report', href: '#', icon: FileText },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-border-main px-6 py-3 flex items-center justify-between">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center transform -skew-x-12">
          <div className="w-4 h-4 bg-white rounded-sm"></div>
        </div>
        <span className="text-xl font-bold text-text tracking-tight">Real Advertise</span>
      </div>

      {/* Navigation Links */}
      <div className="hidden md:flex items-center gap-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-text text-white shadow-md'
                  : 'text-text2 hover:bg-surface2 hover:text-text'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </Link>
          );
        })}
      </div>

      {/* Actions & Profile */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <button className="relative w-10 h-10 rounded-full border border-border-main flex items-center justify-center text-text2 hover:bg-surface2 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <button className="w-10 h-10 rounded-full border border-border-main flex items-center justify-center text-text2 hover:bg-surface2 transition-colors">
            <Upload className="w-5 h-5" />
          </button>
        </div>
        
        <div className="h-8 w-[1px] bg-border-main"></div>
        
        <button className="flex items-center gap-3 hover:bg-surface2 p-1.5 pr-3 rounded-full transition-colors border border-transparent hover:border-border-main">
          <div className="w-9 h-9 rounded-full bg-blue-100 overflow-hidden">
            <img src="https://i.pravatar.cc/150?img=11" alt="User Avatar" className="w-full h-full object-cover" />
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-sm font-bold text-text leading-tight">Kamal David</div>
          </div>
          <ChevronDown className="w-4 h-4 text-text3" />
        </button>
      </div>
    </nav>
  );
}
