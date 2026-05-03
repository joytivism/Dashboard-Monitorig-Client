import React from 'react';
import {
  Bell,
  Calendar,
  Layers3,
  Mail,
  Palette,
  Search,
  Sparkles,
  SquareStack,
  Workflow,
} from 'lucide-react';
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

const principles = [
  {
    icon: Workflow,
    title: 'Operational clarity',
    description: 'Dashboard harus cepat dipindai. Hierarchy, label, dan kartu diprioritaskan untuk workflow harian tim.',
  },
  {
    icon: SquareStack,
    title: 'Modular surfaces',
    description: 'Semua blok UI dibangun sebagai panel yang konsisten sehingga page baru tidak perlu styling ad-hoc.',
  },
  {
    icon: Palette,
    title: 'Neutral emphasis',
    description: 'Basis netral dipakai untuk menjaga keterbacaan, sedangkan oranye hanya muncul untuk fokus, CTA, dan signal penting.',
  },
];

export default function DesignSystemPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-7 pb-20 animate-fade-in">
      <PageIntro
        eyebrow="Internal Preview"
        title="Design system showcase"
        description="Ruang audit untuk fondasi visual, primitive reusable, dan pattern layout yang dipakai di seluruh dashboard monitoring."
        meta={(
          <>
            <Badge tone="accent" style="soft">Light mode</Badge>
            <Badge tone="neutral" style="soft">Tailwind v4 tokens</Badge>
            <Badge tone="success" style="soft">Reusable primitives</Badge>
          </>
        )}
        actions={(
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="secondary" leadingIcon={Layers3}>Surface patterns</Button>
            <Button variant="tonal" leadingIcon={Sparkles}>Component states</Button>
          </div>
        )}
      />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
        <Card className="space-y-6">
          <div className="flex items-start justify-between gap-5">
            <div>
              <div className="ds-eyebrow">Foundation</div>
              <h2 className="mt-1 text-h4">Color, type, and layout rhythm</h2>
              <p className="mt-2 max-w-2xl text-body">
                Pondasi ini mengarahkan seluruh app ke panel netral, border halus, radius besar, dan hierarchy yang bersih untuk dashboard operasional.
              </p>
            </div>
            <div className="rounded-[22px] border border-border-main bg-surface2 px-4 py-3 text-right">
              <div className="text-micro">Current system</div>
              <div className="mt-1 text-sm font-semibold text-text">v1 rollout</div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {toneSamples.map((sample) => (
              <div key={sample.name} className="rounded-[24px] border border-border-main bg-white p-3">
                <div className={`h-20 rounded-[18px] border border-border-main/50 ${sample.className}`} />
                <div className="mt-3 text-sm font-semibold text-text">{sample.name}</div>
              </div>
            ))}
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-[24px] border border-border-main bg-surface2 p-5">
              <div className="text-micro">Typography</div>
              <div className="mt-2 text-h2">Inter</div>
              <div className="mt-2 text-body">Display, heading, label, dan body disusun untuk scan cepat dan density dashboard.</div>
            </div>
            <div className="rounded-[24px] border border-border-main bg-surface2 p-5">
              <div className="text-micro">Radius</div>
              <div className="mt-2 text-h2">12-28</div>
              <div className="mt-2 text-body">Range radius dikunci agar nav rail, form, panel, dan card terasa satu keluarga visual.</div>
            </div>
            <div className="rounded-[24px] border border-border-main bg-surface2 p-5">
              <div className="text-micro">Depth</div>
              <div className="mt-2 text-h2">2 layers</div>
              <div className="mt-2 text-body">Card shadow ringan untuk struktur utama dan shadow popover untuk modal atau panel interaktif.</div>
            </div>
          </div>
        </Card>

        <Card className="space-y-6">
          <div>
            <div className="ds-eyebrow">Principles</div>
            <h2 className="mt-1 text-h4">How the UI should behave</h2>
          </div>

          <div className="space-y-3">
            {principles.map((principle) => (
              <div key={principle.title} className="rounded-[24px] border border-border-main bg-surface2 p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-text shadow-sm">
                    <principle.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-text">{principle.title}</div>
                    <p className="mt-2 text-sm leading-relaxed text-text3">{principle.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,0.94fr)_minmax(0,1.06fr)]">
        <Card className="space-y-5">
          <div>
            <div className="ds-eyebrow">Controls</div>
            <h2 className="mt-1 text-h4">Buttons, fields, and feedback</h2>
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

        <Card className="space-y-5">
          <div className="flex items-start justify-between gap-5">
            <div>
              <div className="ds-eyebrow">Metric surfaces</div>
              <h2 className="mt-1 text-h4">Data display samples</h2>
            </div>
            <Badge tone="neutral" style="soft">Reusable on client and admin</Badge>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <MetricCard title="Revenue" value="Rp 1.2M" icon={Sparkles} trend={12.4} caption="Compared to previous period" tone="accent" />
            <MetricCard title="ROAS" value="4.82x" icon={Palette} trend={4.5} caption="Blended portfolio average" />
            <MetricCard title="Alerts" value="2" icon={Bell} trend={-10.2} caption="Critical clients needing review" tone="danger" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <Card className="space-y-5">
          <div>
            <div className="ds-eyebrow">Surface patterns</div>
            <h2 className="mt-1 text-h4">Cards, empty states, and status blocks</h2>
          </div>

          <div className="grid gap-3">
            <div className="rounded-[24px] border border-border-main bg-white p-5">
              <div className="text-sm font-semibold text-text">Default card</div>
              <p className="mt-2 text-sm text-text3">Dipakai untuk tabel, panel insight, shell section, dan summary block utama.</p>
            </div>
            <div className="rounded-[24px] border border-gg-border bg-gg-bg/65 p-5">
              <div className="text-sm font-semibold text-gg-text">Success panel</div>
              <p className="mt-2 text-sm text-gg-text/85">Cocok untuk peluang pertumbuhan, status sehat, atau operasi yang berjalan normal.</p>
            </div>
            <div className="rounded-[24px] border border-rr-border bg-rr-bg/65 p-5">
              <div className="text-sm font-semibold text-rr-text">Danger panel</div>
              <p className="mt-2 text-sm text-rr-text/85">Dipakai untuk alert prioritas, kegagalan request, atau pressure area pada account tertentu.</p>
            </div>
          </div>
        </Card>

        <Card className="space-y-5">
          <div>
            <div className="ds-eyebrow">Navigation patterns</div>
            <h2 className="mt-1 text-h4">Rail, breadcrumb, and system pills</h2>
          </div>

          <div className="grid gap-3">
            <div className="rounded-[24px] border border-border-main bg-surface2 p-5">
              <div className="text-micro">Active nav item</div>
              <div className="mt-3 rounded-2xl border border-border-main bg-white px-4 py-3 text-sm font-medium text-text shadow-sm">
                Portfolio Overview
              </div>
            </div>
            <div className="rounded-[24px] border border-border-main bg-surface2 p-5">
              <div className="text-micro">Breadcrumb pattern</div>
              <div className="mt-3 text-sm text-text3">Admin Console / Design System / Controls</div>
            </div>
            <div className="rounded-[24px] border border-border-main bg-surface2 p-5">
              <div className="text-micro">System pills</div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge tone="neutral" style="soft">DB: online</Badge>
                <Badge tone="info" style="soft">AI: ready</Badge>
                <Badge tone="warning" style="soft">2 alerts</Badge>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
