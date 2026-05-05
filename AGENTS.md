# Real Advertise UI v2 Rebuild

## Product Context

Real Advertise Command Center is an operational dashboard for monitoring client advertising performance, admin activity, AI-assisted actions, channel settings, and client-level funnel health.

The rebuild should keep the product feeling like a working command center: fast to scan, practical, calm, and suitable for repeated daily use by operators and admins.

## UI v2 Direction

- Clean operational dashboard.
- Soft neutral background.
- Borderless cards where possible.
- Large radius on major surfaces.
- Soft, subtle shadows.
- Compact client header.
- Collapsible sidebar.
- Dense but readable layouts for tables, metrics, activity, settings, and AI workflows.
- Reusable React components should carry the visual language rather than one-off page styling.

Use `docs/real-advertise-ui-v2-reference.html` as the static design reference for visual direction only.

## Hard Rules

- Preserve auth.
- Preserve Supabase logic.
- Preserve calculation logic.
- Preserve AI actions.
- Preserve all existing routes.
- Do not change business logic while rebuilding UI.
- Do not change Supabase/auth/AI/calculation code unless explicitly requested.
- Do not copy static HTML directly into Next.js pages.
- Convert the design reference into reusable React components.
- Prefer existing project patterns before adding new abstractions.
- Keep route files focused on composition and data flow.
- Keep UI-only changes separate from logic changes whenever possible.

## Routes To Preserve

- `/login`
- `/`
- `/client/[id]`
- `/admin`
- `/admin/data`
- `/admin/activity`
- `/admin/ai`
- `/admin/clients`
- `/admin/settings`
- `/admin/settings/channels`

## Protected Areas

Do not alter these areas during the UI v2 rebuild unless the user explicitly asks for logic changes:

- `src/app/actions/auth.ts`
- `src/app/actions/ai.ts`
- `src/lib/supabase.ts`
- `src/lib/supabase/`
- `src/lib/logic/calculations.ts`
- Data fetching, auth guards, Supabase queries, AI prompts/actions, and calculation formulas.

## Implementation Guidance

- Build from the static reference by identifying repeated UI patterns first: shell, sidebar, top/client header, cards, metric rows, tables, status indicators, forms, dialogs, and activity items.
- Implement those patterns as reusable components under `src/components/` before applying them broadly to routes.
- Keep the app router structure and route paths intact.
- Maintain existing data contracts and props while replacing presentation.
- Prefer compact operational controls over marketing-style sections.
- Validate responsive behavior for dashboard, admin, and client views.
- Avoid nested cards and heavy borders; use spacing, surface color, radius, and shadow for separation.

## Next.js Project Notes

Before making framework-sensitive changes, inspect the local project files and current Next.js version. If needed, read the relevant local docs under `node_modules/next/dist/docs/` instead of assuming older Next.js conventions.
