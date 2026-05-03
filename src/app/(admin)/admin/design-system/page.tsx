import React from 'react';
import { Bell, Calendar, Mail, Palette, Search, Sparkles } from 'lucide-react';
import PageIntro from '@/components/layout/PageIntro';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import InputField from '@/components/ui/InputField';
import MetricCard from '@/components/ui/MetricCard';
import SelectField from '@/components/ui/SelectField';

const toneSamples = [
  { name: 'Canvas', className: 'bg-bg' },
  { name: 'Panel', className: 'bg-white' },
  { name: 'Muted', className: 'bg-surface2' },
  { name: 'Subtle', className: 'bg-surface3' },
  { name: 'Accent', className: 'bg-accent' },
  { name: 'Success', className: 'bg-gg' },
  { name: 'Warning', className: 'bg-yy' },
  { name: 'Danger', className: 'bg-rr' },
];

export default function DesignSystemPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-7 pb-20 animate-fade-in">
      <PageIntro
        eyebrow="Internal Preview"
        title="Design system showcase"
        description="Foundation dan komponen reusable untuk dashboard monitoring. Halaman ini dipakai sebagai referensi implementasi dan QA visual."
        meta={(
          <>
            <Badge tone="accent" style="soft">Light mode</Badge>
            <Badge tone="neutral" style="soft">Tailwind v4 tokens</Badge>
            <Badge tone="success" style="soft">Reusable primitives</Badge>
          </>
        )}
      />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <Card className="space-y-5">
          <div>
            <div className="ds-eyebrow">Foundations</div>
            <h2 className="mt-1 text-h4">Color and surfaces</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {toneSamples.map((sample) => (
              <div key={sample.name} className="rounded-[22px] border border-border-main p-3">
                <div className={`h-16 rounded-2xl border border-border-main/50 ${sample.className}`} />
                <div className="mt-3 text-sm font-semibold text-text">{sample.name}</div>
              </div>
            ))}
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-[22px] border border-border-main bg-surface2 p-4">
              <div className="text-micro">Typography</div>
              <div className="mt-2 text-h2">Aa</div>
              <div className="mt-1 text-body">Inter dengan hierarki yang lebih tenang dan ritme dashboard.</div>
            </div>
            <div className="rounded-[22px] border border-border-main bg-surface2 p-4">
              <div className="text-micro">Radius</div>
              <div className="mt-2 text-h2">12-28</div>
              <div className="mt-1 text-body">Dipakai konsisten untuk card, input, nav item, dan panel overlay.</div>
            </div>
            <div className="rounded-[22px] border border-border-main bg-surface2 p-4">
              <div className="text-micro">Shadows</div>
              <div className="mt-2 text-h2">2 levels</div>
              <div className="mt-1 text-body">Card shadow ringan dan popover shadow lebih dalam untuk layer interaktif.</div>
            </div>
          </div>
        </Card>

        <Card className="space-y-5">
          <div>
            <div className="ds-eyebrow">Controls</div>
            <h2 className="mt-1 text-h4">Buttons, inputs, badges</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="primary" leadingIcon={Sparkles}>Primary</Button>
            <Button variant="secondary" trailingIcon={Bell}>Secondary</Button>
            <Button variant="tonal" leadingIcon={Palette}>Tonal</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
          </div>
          <div className="grid gap-4">
            <InputField label="Search" placeholder="Cari sesuatu..." icon={Search} />
            <InputField label="Email" placeholder="admin@realadvertise.id" icon={Mail} />
            <SelectField
              label="Period"
              icon={Calendar}
              options={[
                { label: 'March 2026', value: '2026-03' },
                { label: 'April 2026', value: '2026-04' },
              ]}
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <Badge tone="neutral" style="soft">Neutral</Badge>
            <Badge tone="accent" style="soft">Accent</Badge>
            <Badge tone="success" style="soft">Success</Badge>
            <Badge tone="warning" style="soft">Warning</Badge>
            <Badge tone="danger" style="soft">Danger</Badge>
            <Badge tone="info" style="soft">Info</Badge>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <MetricCard title="Revenue" value="Rp 1.2M" icon={Sparkles} trend={12.4} caption="Compared to previous period" tone="accent" />
        <MetricCard title="ROAS" value="4.82x" icon={Palette} trend={4.5} caption="Blended portfolio average" />
        <MetricCard title="Alerts" value="2" icon={Bell} trend={-10.2} caption="Critical clients needing review" tone="danger" />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <Card className="space-y-4">
          <div>
            <div className="ds-eyebrow">Surfaces</div>
            <h2 className="mt-1 text-h4">Cards and feedback</h2>
          </div>
          <div className="grid gap-3">
            <div className="rounded-[22px] border border-border-main bg-white p-4">
              <div className="text-sm font-semibold text-text">Default card</div>
              <p className="mt-1 text-sm text-text3">Dipakai untuk data block utama dan list row container.</p>
            </div>
            <div className="rounded-[22px] border border-gg-border bg-gg-bg/60 p-4">
              <div className="text-sm font-semibold text-gg-text">Success panel</div>
              <p className="mt-1 text-sm text-gg-text/85">Status baik, update berhasil, atau trend positif.</p>
            </div>
            <div className="rounded-[22px] border border-rr-border bg-rr-bg/60 p-4">
              <div className="text-sm font-semibold text-rr-text">Danger panel</div>
              <p className="mt-1 text-sm text-rr-text/85">Alert kritis, error state, dan performance drop.</p>
            </div>
          </div>
        </Card>

        <Card className="space-y-4">
          <div>
            <div className="ds-eyebrow">Navigation</div>
            <h2 className="mt-1 text-h4">Rail, pills, breadcrumbs</h2>
          </div>
          <div className="grid gap-3">
            <div className="rounded-[22px] border border-border-main bg-surface2 p-4">
              <div className="text-micro">Active nav item</div>
              <div className="mt-3 rounded-2xl border border-border-main bg-white px-4 py-3 text-sm font-medium text-text shadow-sm">
                Portfolio Overview
              </div>
            </div>
            <div className="rounded-[22px] border border-border-main bg-surface2 p-4">
              <div className="text-micro">Breadcrumb</div>
              <div className="mt-3 text-sm text-text3">Admin Console / Design System</div>
            </div>
            <div className="rounded-[22px] border border-border-main bg-surface2 p-4">
              <div className="text-micro">System pill</div>
              <div className="mt-3 flex gap-2">
                <Badge tone="neutral" style="soft">DB: online</Badge>
                <Badge tone="info" style="soft">AI: ready</Badge>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
