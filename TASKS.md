# Barangay Platform Task File

## Project Context
- **Project:** Barangay Service Integration Platform
- **Stack:** Laravel + Inertia.js + React + TypeScript + MySQL
- **Goal:** Build a web platform for barangay operations, resident services, document requests, payments, announcements, and reporting.

## Current Objective
Deliver a clean **MVP** first, then expand into automation and integrations.

---

## Phase 1 — Foundation Setup
- [ ] Configure `.env` for database, mail, queue, and storage
- [ ] Set up authentication flow (login, logout, profile)
- [ ] Add role-based access control for:
  - [ ] Admin
  - [ ] Barangay Staff
  - [ ] Resident
- [ ] Update `users` table and user model fields as needed
- [ ] Create dashboard layout and navigation shell

## Phase 2 — Core Barangay Data
- [ ] Create **Residents** module
  - [ ] resident profile fields
  - [ ] CRUD pages
  - [ ] search and filters
- [ ] Create **Households** module
  - [ ] household head
  - [ ] members mapping
  - [ ] address and purok/sitio support
- [ ] Create **Officials & Staff** module
  - [ ] positions
  - [ ] terms
  - [ ] contact details

## Phase 3 — Service Requests
- [ ] Create **Document Request** module
  - [ ] Barangay Clearance
  - [ ] Certificate of Residency
  - [ ] Business Clearance
  - [ ] Indigency Certificate
- [ ] Add request workflow statuses:
  - [ ] Pending
  - [ ] Under Review
  - [ ] Approved
  - [ ] Released
  - [ ] Rejected
- [ ] Add printable document templates
- [ ] Add request history per resident

## Phase 4 — Payments & Notifications
- [ ] Add payment recording for service fees
- [ ] Support official receipt/reference tracking
- [ ] Build notification system for request updates
  - [ ] in-app notifications
  - [ ] email notifications
  - [ ] optional SMS-ready structure

## Phase 5 — Community Features
- [ ] Create **Announcements** module
- [ ] Create **Complaints / Blotter** module
- [ ] Create **Events / Schedules** module
- [ ] Add downloadable public forms/resources

## Phase 6 — Reports & Audit
- [ ] Build resident summary reports
- [ ] Build service request reports
- [ ] Build payment collection reports
- [ ] Add activity/audit logs for admin actions

---

## Suggested Database Tables
- [ ] `users`
- [ ] `roles`
- [ ] `residents`
- [ ] `households`
- [ ] `officials`
- [ ] `document_requests`
- [ ] `document_types`
- [ ] `payments`
- [ ] `announcements`
- [ ] `complaints`
- [ ] `events`
- [ ] `notifications`
- [ ] `audit_logs`

## Suggested Build Order
1. Authentication and roles
2. Residents and households
3. Document requests
4. Payment tracking
5. Notifications
6. Reports and audit logs

## Immediate Next Tasks
- [ ] Finalize database schema for MVP modules
- [ ] Create migrations for roles, residents, and households
- [ ] Seed sample users and barangay data
- [ ] Build admin dashboard UI
- [ ] Start the Residents CRUD flow

## Notes for AI Assistants
When working on this project:
- Prioritize **MVP features** first
- Keep backend logic in Laravel controllers/services
- Keep frontend pages in `resources/js/Pages`
- Prefer reusable components in `resources/js/Components`
- Use migrations and seeders for all core entities
- Keep code modular and easy to demo for an SIA/capstone project
