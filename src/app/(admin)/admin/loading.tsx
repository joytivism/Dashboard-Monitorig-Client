import React from 'react';

export default function AdminLoading() {
  return (
    <div className="w-full space-y-8 animate-pulse max-w-7xl mx-auto px-6 py-7">
      {/* Header Skeleton */}
      <div className="h-32 bg-white rounded-2xl border border-border-main shadow-sm" />
      
      {/* Bento Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 h-96 bg-white rounded-2xl border border-border-main shadow-sm" />
        <div className="lg:col-span-4 space-y-8">
          <div className="h-44 bg-text/5 rounded-2xl border border-border-main" />
          <div className="h-44 bg-white rounded-2xl border border-border-main shadow-sm" />
        </div>
        
        {/* Quick Actions Skeleton */}
        <div className="lg:col-span-12 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-24 bg-white rounded-2xl border border-border-main shadow-sm" />
          ))}
        </div>
      </div>
    </div>
  );
}
