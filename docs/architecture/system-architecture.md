# System Architecture

## Architecture Type

**SPA Monolith** — a single Laravel application serving a React single-page application via Inertia.js. No separate frontend deployment. No separate API server. The browser talks to one Laravel instance that returns Inertia page responses (JSON) instead of Blade HTML.

```
┌─────────────────────────────────────────────────────────┐
│                    Browser (Client)                      │
│  React 18 SPA — TypeScript — Inertia.js Client          │
│  Tailwind CSS — Radix UI — shadcn-style components      │
└──────────────────────────┬──────────────────────────────┘
                           │ Inertia Protocol (XHR w/ session cookies)
                           │ + REST API (for external/webhook)
┌──────────────────────────▼──────────────────────────────┐
│                    Laravel 12 (PHP 8.2+)                 │
│  ┌────────────┐ ┌────────────┐ ┌──────────────────────┐ │
│  │  Inertia   │ │  REST API  │ │  Webhook Endpoints   │ │
│  │  Routes    │ │  Routes    │ │  (Stripe callbacks)  │ │
│  └─────┬──────┘ └─────┬──────┘ └──────────┬───────────┘ │
│        │              │                    │             │
│  ┌─────▼──────────────▼────────────────────▼───────────┐ │
│  │              Middleware Pipeline                      │ │
│  │  Sanctum Auth │ CORS │ Spatie Permission │ Throttle  │ │
│  └─────────────────────┬───────────────────────────────┘ │
│                        │                                 │
│  ┌─────────────────────▼───────────────────────────────┐ │
│  │            Controllers (thin orchestration)          │ │
│  │  Authorize → Validate → Delegate → Return Response   │ │
│  └─────────────────────┬───────────────────────────────┘ │
│                        │                                 │
│  ┌─────────────────────▼───────────────────────────────┐ │
│  │           Actions (business logic)                   │ │
│  │  Single-responsibility classes in app/Actions/       │ │
│  └────┬────────────────┬───────────────────┬───────────┘ │
│       │                │                   │             │
│  ┌────▼────┐  ┌────────▼────────┐  ┌──────▼──────────┐  │
│  │ Eloquent│  │  Notifications  │  │  External APIs  │  │
│  │ Models  │  │  (Resend SMTP)  │  │  (Stripe SDK)   │  │
│  └────┬────┘  └────────┬────────┘  └──────┬──────────┘  │
│       │                │                   │             │
└───────┼────────────────┼───────────────────┼─────────────┘
        │                │                   │
   ┌────▼────┐    ┌──────▼──────┐     ┌──────▼──────┐
   │  MySQL  │    │   Resend    │     │   Stripe    │
   │  8.x    │    │   (SMTP)    │     │  (Sandbox)  │
   └─────────┘    └─────────────┘     └─────────────┘
```

## Component Diagram

```mermaid
graph TB
    subgraph Client["Browser — React SPA"]
        Pages["Inertia Pages<br/>(TypeScript)"]
        Components["Shared UI Components<br/>(Radix + shadcn)"]
        Ziggy["Ziggy Route Helper"]
    end

    subgraph Server["Laravel 12 — SPA Monolith"]
        subgraph Routing["Route Layer"]
            WebRoutes["Inertia Web Routes"]
            APIRoutes["REST API Routes<br/>/api/v1/*"]
            WebhookRoutes["Webhook Routes<br/>/webhooks/stripe"]
        end

        subgraph Middleware["Middleware"]
            Auth["Sanctum Auth"]
            Permission["Spatie Permission"]
            Throttle["Rate Limiting"]
        end

        subgraph Controllers["Controller Layer"]
            InertiaCtrl["Inertia Controllers<br/>(thin)"]
            APICtrl["API Controllers<br/>(JSON responses)"]
            WebhookCtrl["Webhook Controllers"]
        end

        subgraph Business["Business Layer"]
            Actions["Action Classes<br/>app/Actions/"]
            DTOs["Data Objects/DTOs<br/>app/Data/"]
            Policies["Policies<br/>app/Policies/"]
        end

        subgraph Domain["Domain Layer (Modules)"]
            Resident["Resident Module"]
            DocumentRequest["DocumentRequest Module"]
            Blotter["Blotter Module"]
            SocialAssistance["SocialAssistance Module"]
            Payment["Payment Module"]
            Household["Household Module"]
            Official["Official Module"]
            Announcement["Announcement Module"]
            Event["Event Module"]
        end

        subgraph Infrastructure["Infrastructure"]
            Notifications["Notification Service<br/>(Laravel Notifications)"]
            Queue["Queue Worker<br/>(database driver)"]
            StripeService["Stripe Service<br/>(cashier or raw SDK)"]
            AuditService["Audit Logger"]
        end
    end

    subgraph External["External Services"]
        MySQL["MySQL 8"]
        Resend["Resend SMTP"]
        Stripe["Stripe API<br/>(Sandbox)"]
    end

    Pages --> WebRoutes
    Ziggy --> WebRoutes
    WebRoutes --> Auth --> Permission --> InertiaCtrl
    APIRoutes --> Auth --> APICtrl
    WebhookRoutes --> WebhookCtrl

    InertiaCtrl --> Actions
    APICtrl --> Actions
    WebhookCtrl --> Actions

    Actions --> DTOs
    Actions --> Policies
    Actions --> Domain
    Actions --> Notifications
    Actions --> StripeService
    Actions --> AuditService

    Domain --> MySQL
    Notifications --> Queue --> Resend
    StripeService --> Stripe
    WebhookCtrl --> Stripe
```

## Data Flow: Certificate Request Lifecycle

This demonstrates the complete automated workflow integration (project requirement §4.3):

```mermaid
sequenceDiagram
    participant R as Resident (Browser)
    participant I as Inertia
    participant C as Controller
    participant A as Action
    participant DB as MySQL
    participant Q as Queue Worker
    participant S as Stripe
    participant E as Resend (Email)

    R->>I: Submit certificate request form
    I->>C: POST /resident/document-requests
    C->>A: CreateDocumentRequestAction
    A->>DB: Insert document_request (status: pending)
    A->>DB: Insert audit_log
    A-->>C: DocumentRequestData DTO
    C-->>I: Redirect to request detail page
    I-->>R: Show "Request submitted" status

    Note over C,A: Staff reviews in admin panel
    C->>A: ApproveDocumentRequestAction
    A->>DB: Update status → ready_for_payment
    A->>Q: Dispatch DocumentRequestApprovedNotification
    Q->>E: Send email "Your request is approved. Pay online."
    E-->>R: Email received

    R->>I: Click "Pay Now" → Stripe Checkout
    I->>C: POST /payments/checkout
    C->>A: CreateStripeCheckoutAction
    A->>S: Create Checkout Session
    S-->>A: Checkout URL
    A->>DB: Insert payment (status: processing)
    A-->>C: Redirect URL
    C-->>R: Redirect to Stripe Checkout

    R->>S: Complete payment on Stripe
    S->>C: POST /webhooks/stripe (checkout.session.completed)
    C->>A: HandleStripeWebhookAction
    A->>DB: Update payment (status: completed)
    A->>DB: Update document_request (status: ready_for_release)
    A->>Q: Dispatch PaymentConfirmedNotification
    Q->>E: Send email "Payment confirmed. Visit barangay to claim."

    Note over C,A: Staff releases document
    C->>A: ReleaseDocumentRequestAction
    A->>DB: Update status → released, set released_at
    A->>Q: Dispatch DocumentReleasedNotification
    Q->>E: Send email "Your certificate has been released."
```

## Module Dependency Map

```mermaid
graph LR
    subgraph Core["Core (app/)"]
        User
        AuditLog
        Auth["Auth/Permission"]
    end

    subgraph Modules["Feature Modules"]
        Res["Resident"]
        HH["Household"]
        Off["Official"]
        Doc["DocumentRequest"]
        Blot["Blotter"]
        SA["SocialAssistance"]
        Pay["Payment"]
        Ann["Announcement"]
        Evt["Event"]
    end

    User --> Res
    Res --> HH
    Res --> Off
    Res --> Doc
    Res --> Blot
    Res --> SA
    Res --> Pay
    Doc --> Pay
    SA --> Pay
    User --> Ann
    User --> Evt
    Auth --> User
```

**Dependency rules:**
- Core depends on nothing
- `Resident` depends on Core (User)
- `Household` depends on Resident
- `Official` depends on Resident
- `DocumentRequest` depends on Resident
- `Blotter` depends on Resident
- `SocialAssistance` depends on Resident
- `Payment` depends on Resident (polymorphic — does NOT directly depend on DocumentRequest or SocialAssistance)
- `Announcement` depends on Core (User)
- `Event` depends on Core (User)

No circular dependencies. Payment uses polymorphic relations to stay decoupled.

## Scalability Considerations

| Concern | Strategy |
|---|---|
| **Database load** | Eager loading enforced via Actions; indexes on all filtered columns; paginate all list endpoints |
| **Email throughput** | Queued notifications via database driver (upgradeable to Redis); Resend handles delivery |
| **Payment processing** | Async via Stripe webhooks — no blocking requests; idempotent webhook handler |
| **Module growth** | nwidart/laravel-modules enables adding new service areas without touching core |
| **Horizontal scaling** | Stateless PHP (session in DB/Redis) — can scale to multiple app servers behind a load balancer |
| **API rate limiting** | Laravel's built-in throttle middleware on all API routes |

## Security Considerations

| Concern | Mitigation |
|---|---|
| **Authentication** | Sanctum session-based auth; CSRF protection; HTTP-only cookies |
| **Authorization** | Spatie Permission for RBAC + Laravel Policies for resource-level checks |
| **Input validation** | Form Requests on every write endpoint; no inline validation |
| **SQL injection** | Eloquent parameterized queries; no raw DB::statement with user input |
| **XSS** | React's JSX auto-escaping; Inertia's server-driven rendering |
| **CSRF** | Laravel's CSRF middleware on all non-API routes; Sanctum CSRF cookie flow |
| **Mass assignment** | Explicit `$fillable` on all models |
| **Stripe webhooks** | Signature verification on all webhook endpoints |
| **Data exposure** | DTOs map model data — internal fields never leak to frontend |
| **Rate limiting** | Throttle middleware on auth routes and API endpoints |
| **Audit trail** | All mutations logged with user, IP, before/after values |

## Limitations

| Limitation | Explanation |
|---|---|
| **Single server** | Current design assumes single-server deployment. Horizontal scaling requires session/cache migration to Redis. |
| **No real-time** | No WebSocket support. Residents must refresh or use polling for status updates. Can be added later with Laravel Reverb. |
| **No SMS** | Only email notifications via Resend. No SMS channel. |
| **Stripe sandbox** | Payment integration is demo/test mode only. Production Stripe requires additional PCI compliance review. |
| **No offline support** | SPA requires internet connectivity. Offline-first would require significant PWA work. |
| **Single-barangay** | Current design is single-tenant (one barangay). Multi-barangay would require tenant scoping. |
