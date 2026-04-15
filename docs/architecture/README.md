# Architecture Documentation

This directory contains the complete architectural design for the Barangay Service Integration Platform.

## Documents

| Document | Description |
|---|---|
| [Project Proposal](project-proposal.md) | Selected services, architecture concept, scope, team decisions |
| [System Architecture](system-architecture.md) | High-level system design, component diagram, data flow |
| [Database Design](database-design.md) | Full ERD with Mermaid diagrams, entity descriptions |
| [Auth Strategy](auth-strategy.md) | Auth package decision, role/permission matrix |
| [API Design](api-design.md) | REST API endpoint catalog, request/response contracts |
| [Module Structure](module-structure.md) | nwidart module organization, dependency map |
| [Integration Design](integration-design.md) | Stripe, Resend email, automated workflows |
| [Scaffold Plan](scaffold-plan.md) | What to rebuild, migration path from current state |

## Service Areas

1. Resident registration and management
2. Certificate request and issuance
3. Incident / blotter reporting
4. Social assistance program management

## Tech Stack

- **Backend:** Laravel 12, PHP 8.2+
- **Frontend:** React 18, TypeScript, Inertia.js 2
- **Auth:** Laravel Breeze + Spatie Laravel Permission
- **Database:** MySQL 8
- **Email:** Resend (SMTP)
- **Payments:** Stripe (sandbox/demo mode)
- **Modules:** nwidart/laravel-modules 13
- **UI:** Tailwind CSS, Radix UI, shadcn-style components
