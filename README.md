# SPOrchestrator

> **Accenture SPO Orchestrator** — AI-powered multi-agent platform for procurement and supplier operations. Provides a unified chat interface to interact with specialized AI agents (BidIQ, Supplier Intel, Contract Manager, Spend Analyzer).

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Design System & Theming](#design-system--theming)
- [Internationalization](#internationalization)
- [Authentication](#authentication)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Routing](#routing)
- [Testing](#testing)
- [Code Quality](#code-quality)

---

## Overview

SPOrchestrator is a Next.js 16 enterprise application built with App Router. It exposes a dashboard of AI agents, each dedicated to a procurement domain. Users authenticate via Supabase, select an agent, and interact through a real-time chat interface with session history, an execution log panel, and context-aware suggestions.

**Current agents:**
| Agent | Domain | Status |
|---|---|---|
| BidIQ | Bid management & analysis | Active |
| Supplier Intel | Supplier intelligence | Coming soon |
| Contract Manager | Contract lifecycle | Coming soon |
| Spend Analyzer | Spend analytics | Coming soon |

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript 5.9 (strict) |
| **Styling** | Tailwind CSS 4.2 + CSS Custom Properties |
| **UI Components** | Radix UI primitives + custom design system |
| **Auth** | Supabase SSR (`@supabase/ssr`) |
| **Forms** | React Hook Form 7 + Zod 4 |
| **Data Fetching** | TanStack Query 5 |
| **Animations** | Framer Motion 12 |
| **Notifications** | Sonner |
| **i18n** | next-intl 4 (ES / EN) |
| **Theming** | next-themes (dark / light) |
| **Testing** | Jest 30 + React Testing Library |
| **Linting** | ESLint 9 (flat config) + Prettier 3.5 |
| **Package Manager** | pnpm |
| **Compiler** | SWC |

---

## Architecture

The project follows **Hexagonal Architecture** (Ports & Adapters / Clean Architecture). The principle is that the domain and application layers have zero knowledge of frameworks, UI, or external services — they communicate only through defined interfaces (ports).

```
┌─────────────────────────────────────────────┐
│              UI / Delivery Layer             │
│   Next.js pages · React components · layouts│
│   Server Actions · App Router               │
└───────────────────┬─────────────────────────┘
                    │ calls
┌───────────────────▼─────────────────────────┐
│            Application Layer                │
│   Use Cases (SendMessageUseCase, etc.)      │
│   Orchestrate domain entities via ports     │
└───────────────────┬─────────────────────────┘
                    │ calls (interface)
┌───────────────────▼─────────────────────────┐
│              Domain Layer                   │
│   Entities (ChatMessage, ChatSession)       │
│   Ports / Interfaces (IChatRepository)      │
│   Pure TypeScript — no framework deps       │
└───────────────────▲─────────────────────────┘
                    │ implements
┌───────────────────┴─────────────────────────┐
│           Infrastructure Layer              │
│   Adapters (MockChatRepository)             │
│   Supabase clients, HTTP, external APIs     │
└─────────────────────────────────────────────┘
```

### Layer Responsibilities

| Layer | Location | Responsibility |
|---|---|---|
| **Domain** | `src/views/<feature>/domain/` | Entities, value objects, port interfaces |
| **Application** | `src/views/<feature>/application/use-cases/` | Business workflows — no framework code |
| **Infrastructure** | `src/views/<feature>/infrastructure/adapters/` | Concrete implementations (DB, API, mocks) |
| **Delivery** | `src/views/<feature>/components/`, `app/` | React components, pages, Server Actions |

### Dependency Rule

Dependencies flow **inward only**:

```
Delivery → Application → Domain ← Infrastructure
```

Infrastructure depends on domain interfaces, never the other way around. Swapping an adapter (mock → real API) requires no changes to domain or application code.

---

## Project Structure

```
accenture-SPOrchetrator/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout (ThemeProvider, IntlProvider)
│   ├── page.tsx                  # → redirects to /login
│   ├── login/page.tsx
│   ├── forgot-password/page.tsx
│   ├── reset-password/page.tsx
│   ├── home/
│   │   ├── layout.tsx
│   │   ├── page.tsx              # Dashboard
│   │   └── agents/page.tsx       # Agent listing
│   ├── agent-view/
│   │   ├── layout.tsx
│   │   └── page.tsx              # Agent chat interface
│   └── globals.css               # Design tokens (CSS variables)
│
├── src/
│   ├── views/                    # Feature modules (Hexagonal Architecture)
│   │   ├── agent-view/           # AI chat feature
│   │   │   ├── domain/
│   │   │   │   ├── entities/     # ChatMessage.ts, ChatSession.ts
│   │   │   │   └── ports/        # IChatRepository.ts
│   │   │   ├── application/
│   │   │   │   └── use-cases/    # SendMessageUseCase.ts, GetRecentSessionsUseCase.ts
│   │   │   ├── infrastructure/
│   │   │   │   └── adapters/     # MockChatRepository.ts
│   │   │   ├── actions/          # Next.js Server Actions
│   │   │   ├── components/       # React UI components
│   │   │   └── layout/           # Page wrappers
│   │   ├── auth/                 # Login, forgot/reset password
│   │   │   ├── components/       # LoginForm, ForgotPasswordForm, ResetPasswordForm
│   │   │   └── layout/           # Page-level components
│   │   └── home/                 # Dashboard & agent listing
│   │       ├── components/       # AgentCard, HomeSidebar, HomeViewShell
│   │       └── layout/           # HomeLayout, DashboardPage, AgentsPage
│   │
│   ├── shared/
│   │   ├── ui/                   # Reusable component library
│   │   │   ├── Avatar.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── ChatInput.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Topbar.tsx
│   │   │   ├── SidebarNavItem.tsx
│   │   │   ├── SuggestionChip.tsx
│   │   │   └── index.ts          # Barrel export
│   │   └── lib/
│   │       ├── supabase/
│   │       │   ├── client.ts     # Browser Supabase client (mock fallback)
│   │       │   └── server.ts     # Server Supabase client (cookie-based)
│   │       ├── http/
│   │       │   └── HttpError.ts
│   │       └── utils.ts          # cn() = tailwind-merge + clsx
│   │
│   ├── i18n/request.ts           # next-intl config
│   └── messages/
│       ├── en.json               # English translations
│       └── es.json               # Spanish translations
│
├── proxy.ts                      # Auth middleware (route protection)
├── next.config.ts
├── tailwind.config.*
├── tsconfig.json                 # Paths: @/* → src/*, @app/* → app/*
├── jest.config.ts
├── eslint.config.mjs
└── .prettierrc.json
```

---

## Design System & Theming

The design system is defined entirely via CSS custom properties in `app/globals.css`. Components consume these tokens via Tailwind CSS utilities — **no hardcoded color values in component code**.

### Dark / Light Mode

Theming uses `next-themes`. The default theme is **dark**. The toggle applies the `dark` class to `<html>`, which activates the dark-mode variable set.

```tsx
// app/layout.tsx
<ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
```

### Token Reference

| Category | CSS Variable | Example Value |
|---|---|---|
| **Background** | `--bg-base` | Base page background |
| | `--bg-surface` | Card/panel background |
| | `--bg-elevated` | Dropdown, modal backgrounds |
| | `--bg-glass` | Glassmorphism overlays |
| | `--bg-topbar` | Navigation bar |
| **Accent** | `--accent` | `#a100ff` (Accenture purple) |
| | `--accent-dim` | Muted accent for secondary |
| | `--accent-glow` | Glow/shadow effects |
| **Text** | `--text-primary` | Main body text |
| | `--text-secondary` | Labels, captions |
| | `--text-muted` | Placeholder, disabled |
| | `--text-on-accent` | Text on purple backgrounds |
| **Border** | `--border-subtle` | Dividers |
| | `--border-default` | Input borders |
| | `--border-focus` | Focus ring |
| | `--border-glass` | Glassmorphism borders |
| **Status** | `--status-success` | Green |
| | `--status-warning` | Yellow |
| | `--status-error` | Red |
| | `--status-info` | Blue |
| **Radius** | `--radius-badge` → `--radius-full` | 4px → 9999px |
| **Spacing** | `--spacing-4` → `--spacing-64` | 4px → 64px |
| **Font size** | `--font-size-3xs` → `--font-size-xl` | 9px → 15px |

### Using Tokens in Components

```tsx
// Correct — token-based
<div className="bg-[var(--bg-surface)] border border-[var(--border-default)]">

// Also valid via cn() utility
import { cn } from '@/shared/lib/utils'
<div className={cn('rounded-[var(--radius-md)]', isActive && 'border-[var(--accent)]')}>
```

---

## Internationalization

The app supports **Spanish (default)** and **English** via `next-intl`.

- Translation files: `src/messages/en.json`, `src/messages/es.json`
- Configuration: `src/i18n/request.ts`
- Locale switching utility: `src/shared/lib/setLocale.ts`

```tsx
import { useTranslations } from 'next-intl'

export function LoginForm() {
  const t = useTranslations('auth.login')
  return <button>{t('submit')}</button>
}
```

---

## Authentication

Authentication is handled by **Supabase** with SSR cookie-based sessions.

### Flow

```
/login → LoginForm
  → supabase.auth.signInWithPassword()
  → on success → redirect /home
  → on error   → display inline error

/forgot-password → request reset email
/reset-password  → set new password via token
```

### Route Protection

`proxy.ts` (Next.js middleware) intercepts every request:

| Route pattern | Behavior |
|---|---|
| `/login`, `/forgot-password`, `/reset-password` | Public — no auth required |
| `/home/*`, `/agent-view/*` | Protected — requires active Supabase session |
| Authenticated user hits `/login` | Redirects to `/agent-view` |

### Mock Mode (Development without Supabase)

If `NEXT_PUBLIC_SUPABASE_URL` is not set, the Supabase clients return a mock user so the app remains navigable without a real backend.

```ts
// src/shared/lib/supabase/client.ts
// Falls back to mock when env vars are missing
```

---

## Getting Started

### Prerequisites

- **Node.js** 20+
- **pnpm** 9+

```bash
# Install pnpm if not present
npm install -g pnpm
```

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd accenture-SPOrchetrator

# Install dependencies
pnpm install
```

### Environment Setup

Copy the example file and fill in your values:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
NEXT_PUBLIC_API_URL=http://localhost:3001
```

> **Running without Supabase?** Leave `NEXT_PUBLIC_SUPABASE_URL` empty. The app activates mock mode and allows navigation without a real auth backend.

### Development Server

```bash
pnpm dev
```

App runs at **http://localhost:3000**

### Production Build

```bash
pnpm build
pnpm start
```

### Login Credentials (Development)

With a real Supabase instance, create a user from the Supabase dashboard or via the Auth API. In mock mode, any navigation is permitted directly without credentials.

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | No* | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | No* | Supabase anonymous public key |
| `NEXT_PUBLIC_API_URL` | No | Backend API base URL (default: `http://localhost:3001`) |

*If omitted, the app runs in mock/development mode with no auth enforcement.

---

## Routing

| Path | Component | Auth |
|---|---|---|
| `/` | Redirects to `/login` | Public |
| `/login` | `LoginPage` | Public |
| `/forgot-password` | `ForgotPasswordPage` | Public |
| `/reset-password` | `ResetPasswordPage` | Public |
| `/home` | `DashboardPage` | Protected |
| `/home/agents` | `AgentsPage` | Protected |
| `/agent-view` | `AgentViewPage` | Protected |

---

## Testing

```bash
# Run all tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage report
pnpm test:cov
```

Tests use **Jest 30** with **React Testing Library**. Module aliases (`@/*`) are resolved via `jest.config.ts` module name mapping.

---

## Code Quality

```bash
# Lint
pnpm lint

# Lint with auto-fix
pnpm lint:fix

# Format
pnpm format

# Check formatting without writing
pnpm format:check
```

**ESLint:** Flat config (`eslint.config.mjs`) with `eslint-config-next` and Prettier integration.

**Prettier:** Config at `.prettierrc.json`, enforced via ESLint plugin.

**TypeScript:** Strict mode enabled. Path aliases configured in `tsconfig.json`:
- `@/*` → `src/*`
- `@app/*` → `app/*`

---

## Contributing

1. Branch from `main` using the convention `feature/<scope>` or `fix/<scope>`
2. Follow the hexagonal architecture layers — new features go under `src/views/<feature-name>/`
3. Add translations to both `en.json` and `es.json` for any user-facing copy
4. All new components must use design system tokens — no hardcoded colors or spacing
5. Run `pnpm lint && pnpm test` before opening a PR
