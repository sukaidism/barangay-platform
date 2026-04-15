# Project Proposal
## Barangay Service Integration Platform

**Course:** Systems Integration and Architecture (SIA)
**Date:** April 16, 2026

---

## 1. Selected Service Areas

This project integrates four barangay service areas into a single platform:

| # | Service Area | Description |
|---|---|---|
| 1 | **Resident Registration and Management** | Digital registration, profile verification workflow, and household grouping for barangay residents |
| 2 | **Certificate Request and Issuance** | Online submission, processing, payment, and release of barangay certificates (clearance, indigency, residency, etc.) |
| 3 | **Incident / Blotter Reporting** | Digital filing, tracking, and resolution of barangay incident complaints including hearing scheduling |
| 4 | **Social Assistance Program Management** | Administration of assistance programs (financial, medical, educational) and processing of resident applications |

These four areas were chosen because they represent the highest-frequency services in a typical barangay and have clear integration touchpoints between them — a resident's verified profile is a prerequisite for certificate requests, blotter filings, and assistance applications.

---

## 2. Architecture Concept

### Architecture Pattern: SPA Monolith

The platform is a **Single-Page Application (SPA) Monolith** — a single Laravel application that:
- Serves the React SPA via the **Inertia.js** protocol (no separate frontend deployment)
- Exposes a **REST API** (`/api/v1/`) for external system integration
- Receives **webhook callbacks** from Stripe for payment events

This pattern was chosen over a decoupled SPA + separate API backend because:
1. The team size and timeline favor a single deployable unit
2. Inertia eliminates the need to build and maintain a separate API layer for the SPA itself
3. The project still exposes a proper REST API for external/integration purposes, satisfying the API requirement

### System Components

| Component | Technology | Role |
|---|---|---|
| Backend Framework | Laravel 12 (PHP 8.2+) | Application server, business logic, API |
| Frontend Framework | React 18 + TypeScript | SPA user interface |
| SPA Bridge | Inertia.js 2 | Connects Laravel controllers to React pages |
| UI Layer | Tailwind CSS + Radix UI | Component styling and accessibility |
| Authentication | Laravel Breeze + Sanctum | Session-based SPA auth, CSRF protection |
| Authorization | Spatie Laravel Permission | Role-based access control with granular permissions |
| Database | MySQL 8 | Primary data store |
| Email Notifications | Resend (SMTP) | Transactional email delivery |
| Payment Gateway | Stripe (Sandbox) | Simulated payment processing |
| Module System | nwidart/laravel-modules | Feature isolation per service area |
| Route Sharing | Ziggy | Shared named routes between PHP and TypeScript |

### User Roles

| Role | Description |
|---|---|
| **Admin** | Full system access. Manages all modules, users, roles, and system configuration. |
| **Staff** | Day-to-day operations. Processes requests, reviews applications, manages blotters. |
| **Resident** | Self-service portal. Registers profile, submits requests, files complaints, applies for assistance. |

### Integration Points

The platform satisfies all three automation integration categories from the project spec:

| Category | Implementation |
|---|---|
| **Notification Service** | Queued email notifications via Resend SMTP triggered on 16+ workflow events (request approved, payment confirmed, blotter resolved, etc.) |
| **External API Consumption** | Stripe PHP SDK for payment checkout session creation and webhook signature verification |
| **Automated Workflow** | Full certificate request lifecycle: submission → staff review → payment via Stripe → auto-status transition → release notification |
| **Online Payment** | Stripe Checkout (sandbox) for certificate fees and assistance-related payments |

---

## 3. Scope Summary

### In Scope
- Resident registration with staff verification workflow
- Household management linked to resident profiles
- Barangay official records
- Certificate request submission, approval, payment (Stripe), and release
- Incident/blotter filing, investigation, hearing scheduling, and resolution
- Social assistance program creation and application management
- Polymorphic payment system supporting multiple payable types
- Email notifications for all workflow state changes (Resend SMTP)
- Barangay announcements and community events
- Audit logging for all mutations
- REST API for external system integration
- Admin, staff, and resident-facing UI portals

### Out of Scope
- SMS notifications (email only)
- Real-time updates / WebSockets
- Multi-barangay / multi-tenant support
- Production Stripe (sandbox only)
- Mobile application

---

## 4. Document Index

| Document | Description |
|---|---|
| [system-architecture.md](system-architecture.md) | Architecture diagram, component map, data flow, scalability/security analysis |
| [database-design.md](database-design.md) | Full ERD, entity descriptions, status flow diagrams, index strategy |
| [auth-strategy.md](auth-strategy.md) | Auth package decision rationale, role and permission matrix |
| [api-design.md](api-design.md) | Endpoint catalog, HTTP status codes, rate limiting, response format |
| [module-structure.md](module-structure.md) | Module layout, dependency rules, action catalog per module |
| [integration-design.md](integration-design.md) | Stripe, Resend, automated workflow design |
| [scaffold-plan.md](scaffold-plan.md) | 8-phase implementation roadmap |
