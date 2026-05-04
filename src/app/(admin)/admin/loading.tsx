import React from 'react';
import Card from '@/components/ui/Card';
import LoadingState from '@/components/ui/LoadingState';

export default function AdminLoading() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-7 animate-fade-in">
      <LoadingState
        title="Menyiapkan admin workspace"
        description="Dashboard admin sedang memuat shell, summary, dan modul operasional."
        className="min-h-[180px]"
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-8 space-y-4">
          <div className="ds-skeleton h-5 w-36" />
          <div className="ds-skeleton h-12 w-full" />
          <div className="grid gap-3 md:grid-cols-2">
            <div className="ds-skeleton h-28" />
            <div className="ds-skeleton h-28" />
          </div>
        </Card>

        <div className="grid gap-6 lg:col-span-4">
          <Card className="space-y-4">
            <div className="ds-skeleton h-5 w-28" />
            <div className="ds-skeleton h-28" />
          </Card>
          <Card className="space-y-4">
            <div className="ds-skeleton h-5 w-32" />
            <div className="ds-skeleton h-28" />
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:col-span-12 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <Card key={item} className="space-y-3">
              <div className="ds-skeleton h-5 w-24" />
              <div className="ds-skeleton h-16 w-full" />
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
