# API Design

## Overview

The platform exposes two API surfaces:

1. **Inertia Routes** — Primary interface for the SPA. Returns Inertia page responses. Uses session-based Sanctum auth.
2. **REST API** (`/api/v1/`) — External integration surface. Returns JSON. Uses token-based Sanctum auth (API tokens) or session auth.
3. **Webhook Endpoints** — Receives callbacks from external services (Stripe).

## Base URLs

| Surface | Base URL | Auth |
|---|---|---|
| Inertia (SPA) | `http://localhost:8000` | Sanctum session (cookie) |
| REST API | `http://localhost:8000/api/v1` | Sanctum token / session |
| Webhooks | `http://localhost:8000/webhooks` | Signature verification |

## Authentication

### SPA (Inertia) Auth Flow
1. `GET /sanctum/csrf-cookie` — obtain CSRF token
2. `POST /login` — authenticate with email/password
3. All subsequent requests include session cookie automatically

### API Token Auth
```
Authorization: Bearer {token}
```
Tokens issued via admin panel for external integrations.

---

## Endpoint Catalog

### Auth Endpoints (Breeze — Inertia)

| Method | URI | Controller | Description |
|---|---|---|---|
| GET | `/login` | `AuthenticatedSessionController@create` | Login page |
| POST | `/login` | `AuthenticatedSessionController@store` | Authenticate |
| POST | `/logout` | `AuthenticatedSessionController@destroy` | Logout |
| GET | `/register` | `RegisteredUserController@create` | Registration page |
| POST | `/register` | `RegisteredUserController@store` | Create account |
| GET | `/forgot-password` | `PasswordResetLinkController@create` | Forgot password page |
| POST | `/forgot-password` | `PasswordResetLinkController@store` | Send reset link |
| GET | `/reset-password/{token}` | `NewPasswordController@create` | Reset password page |
| POST | `/reset-password` | `NewPasswordController@store` | Reset password |
| GET | `/verify-email` | `EmailVerificationPromptController` | Verification notice |
| GET | `/verify-email/{id}/{hash}` | `VerifyEmailController` | Verify email |
| POST | `/email/verification-notification` | `EmailVerificationNotificationController@store` | Resend verification |

### Admin / Staff Endpoints (Inertia)

#### Dashboard
| Method | URI | Permission | Description |
|---|---|---|---|
| GET | `/dashboard` | `dashboard.admin` | Admin/Staff dashboard with stats |

#### Residents
| Method | URI | Permission | Description |
|---|---|---|---|
| GET | `/admin/residents` | `residents.view-any` | List all residents (paginated) |
| GET | `/admin/residents/create` | `residents.create` | Create resident form |
| POST | `/admin/residents` | `residents.create` | Store new resident |
| GET | `/admin/residents/{resident}` | `residents.view` | View resident detail |
| GET | `/admin/residents/{resident}/edit` | `residents.update` | Edit resident form |
| PUT | `/admin/residents/{resident}` | `residents.update` | Update resident |
| DELETE | `/admin/residents/{resident}` | `residents.delete` | Soft-delete resident |
| POST | `/admin/residents/{resident}/verify` | `residents.verify` | Verify resident profile |
| POST | `/admin/residents/{resident}/reject` | `residents.verify` | Reject verification |

#### Households
| Method | URI | Permission | Description |
|---|---|---|---|
| GET | `/admin/households` | `households.view-any` | List households |
| POST | `/admin/households` | `households.create` | Create household |
| GET | `/admin/households/{household}` | `households.view` | View household |
| PUT | `/admin/households/{household}` | `households.update` | Update household |
| DELETE | `/admin/households/{household}` | `households.delete` | Delete household |

#### Document Requests
| Method | URI | Permission | Description |
|---|---|---|---|
| GET | `/admin/document-requests` | `document-requests.view-any` | List all requests |
| GET | `/admin/document-requests/{request}` | `document-requests.view` | View request detail |
| POST | `/admin/document-requests/{request}/approve` | `document-requests.approve` | Approve request |
| POST | `/admin/document-requests/{request}/reject` | `document-requests.reject` | Reject request |
| POST | `/admin/document-requests/{request}/release` | `document-requests.release` | Mark as released |

#### Blotters
| Method | URI | Permission | Description |
|---|---|---|---|
| GET | `/admin/blotters` | `blotters.view-any` | List all blotters |
| GET | `/admin/blotters/create` | `blotters.create` | File blotter form |
| POST | `/admin/blotters` | `blotters.create` | Store blotter |
| GET | `/admin/blotters/{blotter}` | `blotters.view` | View blotter detail |
| PUT | `/admin/blotters/{blotter}` | `blotters.update` | Update blotter |
| POST | `/admin/blotters/{blotter}/resolve` | `blotters.resolve` | Resolve case |
| POST | `/admin/blotters/{blotter}/hearings` | `blotters.schedule-hearing` | Schedule hearing |

#### Social Assistance Programs
| Method | URI | Permission | Description |
|---|---|---|---|
| GET | `/admin/assistance-programs` | `assistance-programs.view-any` | List programs |
| GET | `/admin/assistance-programs/create` | `assistance-programs.create` | Create program form |
| POST | `/admin/assistance-programs` | `assistance-programs.create` | Store program |
| GET | `/admin/assistance-programs/{program}` | `assistance-programs.view-any` | View program |
| PUT | `/admin/assistance-programs/{program}` | `assistance-programs.update` | Update program |
| DELETE | `/admin/assistance-programs/{program}` | `assistance-programs.delete` | Delete program |

#### Assistance Applications (Admin View)
| Method | URI | Permission | Description |
|---|---|---|---|
| GET | `/admin/assistance-applications` | `assistance-applications.view-any` | List all applications |
| GET | `/admin/assistance-applications/{app}` | `assistance-applications.view` | View detail |
| POST | `/admin/assistance-applications/{app}/approve` | `assistance-applications.approve` | Approve |
| POST | `/admin/assistance-applications/{app}/reject` | `assistance-applications.reject` | Reject |
| POST | `/admin/assistance-applications/{app}/disburse` | `assistance-applications.disburse` | Mark disbursed |

#### Payments
| Method | URI | Permission | Description |
|---|---|---|---|
| GET | `/admin/payments` | `payments.view-any` | List all payments |
| GET | `/admin/payments/{payment}` | `payments.view` | View payment detail |
| POST | `/admin/payments/{payment}/refund` | `payments.refund` | Refund payment |

#### Officials, Announcements, Events
| Method | URI | Permission | Description |
|---|---|---|---|
| Resource CRUD | `/admin/officials` | `officials.manage` | Standard resource routes |
| Resource CRUD | `/admin/announcements` | `announcements.manage` | Standard resource routes |
| Resource CRUD | `/admin/events` | `events.manage` | Standard resource routes |

#### System
| Method | URI | Permission | Description |
|---|---|---|---|
| GET | `/admin/audit-logs` | `audit-logs.view` | View audit trail |
| GET | `/admin/users` | `users.manage` | Manage user accounts |

### Resident Portal Endpoints (Inertia)

| Method | URI | Permission | Description |
|---|---|---|---|
| GET | `/resident/dashboard` | `dashboard.resident` | Resident home |
| GET | `/resident/profile` | Authenticated | View/complete profile |
| POST | `/resident/profile` | Authenticated | Save profile draft |
| POST | `/resident/profile/submit` | Authenticated | Submit for verification |
| GET | `/resident/document-requests` | `document-requests.view` | My requests |
| GET | `/resident/document-requests/create` | `document-requests.create` | New request form |
| POST | `/resident/document-requests` | `document-requests.create` | Submit request |
| GET | `/resident/document-requests/{req}` | `document-requests.view` | View my request |
| DELETE | `/resident/document-requests/{req}` | `document-requests.cancel` | Cancel pending request |
| GET | `/resident/blotters` | `blotters.view` | My blotter cases |
| GET | `/resident/blotters/create` | `blotters.create` | File complaint form |
| POST | `/resident/blotters` | `blotters.create` | Submit complaint |
| GET | `/resident/blotters/{blotter}` | `blotters.view` | View my case |
| GET | `/resident/assistance-programs` | `assistance-programs.view-any` | Browse open programs |
| GET | `/resident/assistance-programs/{prog}` | `assistance-programs.view-any` | View program details |
| POST | `/resident/assistance-applications` | `assistance-applications.create` | Apply to program |
| GET | `/resident/assistance-applications` | `assistance-applications.view` | My applications |
| GET | `/resident/announcements` | Authenticated | Browse announcements |
| GET | `/resident/events` | Authenticated | Browse events |

### Payment Endpoints (Inertia + Stripe)

| Method | URI | Auth | Description |
|---|---|---|---|
| POST | `/payments/checkout` | Authenticated | Create Stripe Checkout Session |
| GET | `/payments/success` | Authenticated | Post-payment success page |
| GET | `/payments/cancel` | Authenticated | Payment cancelled page |

### Webhook Endpoints

| Method | URI | Auth | Description |
|---|---|---|---|
| POST | `/webhooks/stripe` | Stripe signature | Handle Stripe webhook events |

### REST API (External Integration)

All REST API endpoints return JSON and require API token authentication.

| Method | URI | Description |
|---|---|---|
| GET | `/api/v1/residents` | List residents (paginated) |
| GET | `/api/v1/residents/{id}` | Get resident detail |
| GET | `/api/v1/document-requests` | List document requests |
| GET | `/api/v1/document-requests/{id}` | Get request detail |
| GET | `/api/v1/blotters` | List blotter records |
| GET | `/api/v1/blotters/{id}` | Get blotter detail |
| GET | `/api/v1/assistance-programs` | List programs |
| GET | `/api/v1/payments/{id}` | Get payment status |
| GET | `/api/v1/statistics/dashboard` | Dashboard statistics |

---

## Standard Response Format (REST API)

### Success (single resource)
```json
{
  "data": {
    "id": 1,
    "type": "document_request",
    "attributes": { ... }
  }
}
```

### Success (collection)
```json
{
  "data": [ ... ],
  "meta": {
    "current_page": 1,
    "per_page": 15,
    "total": 42,
    "last_page": 3
  },
  "links": {
    "first": "...",
    "last": "...",
    "prev": null,
    "next": "..."
  }
}
```

### Error
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "field": ["Error message"]
  }
}
```

## HTTP Status Codes

| Code | Usage |
|---|---|
| 200 | Successful GET, PUT |
| 201 | Successful POST (resource created) |
| 204 | Successful DELETE |
| 302 | Inertia redirect after mutation |
| 400 | Bad request / validation failed (API) |
| 401 | Unauthenticated |
| 403 | Unauthorized (permission denied) |
| 404 | Resource not found |
| 422 | Validation error (Inertia / API) |
| 429 | Rate limited |
| 500 | Server error |

## Rate Limiting

| Route Group | Limit |
|---|---|
| Auth routes | 5 requests/minute (login), 3/minute (password reset) |
| API routes | 60 requests/minute per token |
| Webhooks | No limit (signature-verified) |
| Inertia routes | 120 requests/minute per session |
