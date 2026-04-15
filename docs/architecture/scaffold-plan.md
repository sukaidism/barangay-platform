# Scaffold Plan

## Current State Assessment

The project was built with good instincts (Laravel/Inertia/React, nwidart modules, Sanctum, Ziggy) but lacks the discipline layer needed for maintainability. This document maps what exists, what's broken, and what needs to be built.

### What's Working ✅
- Laravel 12 + Inertia 2 + React 18 + TypeScript base
- Sanctum cookie-based SPA auth
- Breeze auth controllers and pages
- nwidart/laravel-modules with 8 modules created
- Basic models with relationships
- Ziggy for route sharing
- Radix UI + Tailwind + shadcn-style components
- SSR configuration
- AuditLog model with polymorphic logging

### What's Broken or Missing ❌

| Area | Problem |
|---|---|
| **Permissions** | Hand-rolled `hasRole()` on User model. No granular permissions. No Policies. |
| **Authorization** | Only `role:resident` middleware on one route group. Admin/staff routes unprotected. |
| **Business logic in routes** | `routes/resident.php` has inline closures with Eloquent queries (announcements, events). |
| **No Actions** | Zero Action classes. Business logic scattered in controllers. |
| **No DTOs** | Raw Eloquent models likely passed directly to Inertia. |
| **No Form Requests** | No validation classes found. Likely inline `$request->validate()` in controllers. |
| **No Policies** | Zero Policy classes. No resource-level authorization. |
| **No Notifications** | No notification classes. No email integration. |
| **No Stripe** | Payment model exists but no payment gateway integration. |
| **No SocialAssistance** | Module doesn't exist. Required by project scope. |
| **Document types hardcoded** | `document_type` is a string on `document_requests`. Should be a FK to `document_types` table. |
| **No reference numbers** | Document requests and blotters lack auto-generated reference/case numbers. |
| **No blotter hearings** | No hearing sub-table for blotter cases. |
| **Incomplete Payment model** | No Stripe fields (`stripe_payment_intent_id`, `payment_method`, `transaction_reference`). |
| **No queue setup** | No jobs table migration. No queue driver configured. |
| **No notifications table** | Laravel's notification table migration missing. |
| **Tests** | Likely minimal. Need full test coverage plan. |

---

## Scaffold Phases

### Phase 0: Foundation Cleanup

**Goal:** Fix the base before building on it.

| Task | Details |
|---|---|
| Install `spatie/laravel-permission` | `composer require spatie/laravel-permission` |
| Install `stripe/stripe-php` | `composer require stripe/stripe-php` |
| Publish Spatie migrations | `php artisan vendor:publish --provider="Spatie\Permission\PermissionServiceProvider"` |
| Drop custom `roles` + `role_user` tables | Migration to drop old tables |
| Add `HasRoles` trait to User model | Replace custom `hasRole()` and `hasAnyRole()` |
| Create `notifications` table migration | `php artisan notifications:table` |
| Create `jobs` table migration | Already exists (`create_jobs_table`) — verify |
| Configure queue driver | Set `QUEUE_CONNECTION=database` in `.env` |
| Configure mail driver | Set Resend SMTP credentials in `.env` |
| Configure Stripe | Set `STRIPE_KEY`, `STRIPE_SECRET`, `STRIPE_WEBHOOK_SECRET` in `.env` |
| Create `RoleAndPermissionSeeder` | Full permission matrix from auth-strategy.md |
| Add `MustVerifyEmail` to User model | Uncomment the interface — email verification required |

### Phase 1: Schema Migrations

**Goal:** Get the database to match the ERD in `database-design.md`.

| Task | Details |
|---|---|
| Create `document_types` migration | New table per ERD |
| Alter `document_requests` | Add `reference_number`, `document_type_id`, `processed_by`; drop `document_type` string |
| Alter `blotters` | Add `case_number`, `respondent_name`, `recorded_by`; refine enums |
| Create `blotter_hearings` migration | New table per ERD |
| Create `assistance_programs` migration | New table per ERD |
| Create `assistance_applications` migration | New table per ERD |
| Alter `payments` | Add `transaction_reference`, `payment_method`, Stripe fields; refine enums |
| Add proper indexes | As specified in database-design.md |

### Phase 2: SocialAssistance Module

**Goal:** Create the missing module from scratch.

```bash
php artisan module:make SocialAssistance
```

Then populate with:
- Models: `AssistanceProgram`, `AssistanceApplication`
- Migrations (from Phase 1)
- Actions: Create/Update/Apply/Review/Disburse
- DTOs: `AssistanceProgramData`, `AssistanceApplicationData`
- Controllers: Admin + ResidentPortal
- Form Requests: Store/Update for programs and applications
- Policies: `AssistanceProgramPolicy`, `AssistanceApplicationPolicy`
- Notifications: Received/Approved/Rejected/Disbursed
- Routes: Web (admin + resident) + API

### Phase 3: Core Architecture Patterns

**Goal:** Establish the Action → DTO → Policy → FormRequest pattern across all modules.

For **each existing module** (Resident, Household, Official, DocumentRequest, Blotter, Payment, Announcement, Event):

| Layer | Create |
|---|---|
| **Actions** | One class per use case (Create, Update, Delete, + workflow actions) |
| **DTOs** | Data classes for Inertia transfer (list + detail variants) |
| **Form Requests** | Store and Update request classes with validation rules |
| **Policies** | Resource authorization using Spatie permissions |
| **Notifications** | Event-driven email notifications where applicable |

### Phase 4: Route Refactoring

**Goal:** Clean routes, proper middleware, eliminate inline closures.

| Task | Details |
|---|---|
| Admin route group | `/admin/*` with `auth`, `verified`, `role:admin,staff` middleware |
| Resident portal route group | `/resident/*` with `auth`, `verified`, `role:resident` middleware |
| API route group | `/api/v1/*` with Sanctum + throttle |
| Webhook route group | `/webhooks/*` with signature verification, no CSRF |
| Eliminate closures | Move all inline route closures to controllers |
| Resource routes | Use `Route::resource()` where applicable |

### Phase 5: Stripe Integration

**Goal:** Working payment flow in Stripe sandbox mode.

| Task | Details |
|---|---|
| Create `StripeService` | Adapter class in `app/Services/` |
| Payment checkout controller | Handle Checkout Session creation |
| Webhook controller | `StripeWebhookController` with signature verification |
| Payment success/cancel pages | Inertia pages for post-payment redirect |
| Wire to DocumentRequest | Auto-advance status on payment confirmation |

### Phase 6: Email/Notification Integration

**Goal:** All workflow events trigger queued email notifications.

| Task | Details |
|---|---|
| Configure Resend SMTP | `.env` configuration |
| Create notification classes | One per event (see integration-design.md) |
| Wire notifications in Actions | Dispatch from Action classes |
| In-app notification inbox | Database channel + resident portal UI |
| Test with Resend sandbox | Verify delivery in test mode |

### Phase 7: Frontend Polish

**Goal:** Typed pages, consistent layouts, proper state management.

| Task | Details |
|---|---|
| TypeScript interfaces | One per DTO matching backend shape |
| Admin layout | Sidebar navigation, breadcrumbs, role-aware menu |
| Resident portal layout | Simpler layout with resident-appropriate navigation |
| Shared components | DataTable, StatusBadge, FormField, ConfirmDialog |
| Notification bell | In-app notification dropdown |

### Phase 8: Testing

**Goal:** Feature tests for all critical paths.

| Layer | Test Type | Tool |
|---|---|---|
| Actions | Unit tests | Pest |
| Controllers (Inertia) | Feature tests | Pest + Inertia assertions |
| Controllers (API) | Feature tests | Pest |
| Policies | Unit tests | Pest |
| Stripe webhook | Feature tests | Pest (mocked Stripe) |
| Notifications | Feature tests | Pest + Notification::fake() |
| Frontend components | Component tests | Vitest |

---

## Priority Order

```
Phase 0 (Foundation)     ← Must be first. Everything depends on this.
    ↓
Phase 1 (Migrations)     ← Database matches the design.
    ↓
Phase 2 (SocialAssistance) ← New module with correct patterns from day 1.
    ↓
Phase 3 (Architecture)   ← Retrofit existing modules to correct patterns.
    ↓
Phase 4 (Routes)         ← Clean routing with proper auth.
    ↓
Phase 5 (Stripe)         ← Payment integration.
    ↓
Phase 6 (Notifications)  ← Email automation.
    ↓
Phase 7 (Frontend)       ← UI consistency and types.
    ↓
Phase 8 (Testing)        ← Quality gate.
```

Each phase is independently valuable. You can demo after Phase 4 with basic CRUD. Stripe and email add polish. Testing adds confidence.

## Files to Delete

| File/Directory | Reason |
|---|---|
| `database/migrations/2026_04_07_180950_create_roles_table.php` | Replaced by Spatie |
| `database/migrations/2026_04_07_180951_create_role_user_table.php` | Replaced by Spatie |
| `app/Models/Role.php` | Replaced by Spatie's Role model |

## New Packages Required

| Package | Purpose | Command |
|---|---|---|
| `spatie/laravel-permission` | RBAC with granular permissions | `composer require spatie/laravel-permission` |
| `stripe/stripe-php` | Stripe API SDK | `composer require stripe/stripe-php` |
| `spatie/laravel-data` (optional) | DTO framework | `composer require spatie/laravel-data` |

## Environment Variables to Add

```env
# Spatie Permission
# (no env vars needed, config-driven)

# Queue
QUEUE_CONNECTION=database

# Resend SMTP
MAIL_MAILER=smtp
MAIL_HOST=smtp.resend.com
MAIL_PORT=465
MAIL_USERNAME=resend
MAIL_PASSWORD=re_xxxxxxxxxxxxx
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@barangay.example.com
MAIL_FROM_NAME="Barangay Service Platform"

# Stripe
STRIPE_KEY=pk_test_xxxxxxxxxxxxx
STRIPE_SECRET=sk_test_xxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```
