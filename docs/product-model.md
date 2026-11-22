# Product & Domain Model

Working notes from product conversations. Complements the vision in
[README.md](../README.md). Not a finalized API or schema.

## What the product is

ABI is a **broker** between organizations and the people they serve.

Interactions are **not** framed as user ↔ org in isolation. They are
**partitioned by hospital / area**: each hospital (or area) gets a
**network**. When someone needs help, the request goes to that hospital’s
network and is routed to organizations that operate there, filtered by
the **services** those orgs provide.

## Core entities

| Entity | Role |
| --- | --- |
| **Hospital / area** | A place that owns a network. Users and orgs are associated with one or more of these. |
| **Organization** | Provides services within hospital networks. Onboarded by platform admins. |
| **User** (family / service seeker) | Person who needs services. Onboarded by an org; assigned to a hospital/area. |
| **Volunteer** | Can receive / fulfill certain types of requests. Separate from org staff, but linked to both an **org** and an **area**. |
| **Org user** | Staff of an organization (operates the org client). |
| **Admin** | Platform administrator (operates the admin client). |

## Onboarding & vetting (closed network)

Signups are **not public**.

- **Organizations** are onboarded by **platform admins**.
- **Users** and **volunteers** are onboarded by **organizations**.
- Orgs assign people to an **area / hospital** when bringing them in.

This keeps trust and vetting with the orgs that already know the
families and volunteers.

## Marketplace directions

Two complementary flows:

### 1. Requests (user → network → orgs / volunteers)

A user posts a need to their hospital network. Matching orgs (by area +
service type) see it. **Default fulfillment is first-come**; a user may
also be allowed to choose among responders later (not a v1 focus).

**Volunteers** can fulfill **certain types** of requests (not all). They
remain linked to an org and an area even though they are a distinct role.

### 2. Offers (org → users)

An org can broadcast an offer to everyone in the network (filters TBD),
and a user can **claim** it.

Example: transportation — a user can request a ride, **or** an org can
post that a bus leaves from the hospital at a given time and users claim
seats / join.

**Offers are org-only** for now (volunteers do not post offers). Claim
behavior for offers can stay first-come for early versions.

## Clients (surfaces)

Four product surfaces map to audiences:

| Client | Audience |
| --- | --- |
| **Admin** | Platform admins |
| **Org** | Organization staff |
| **User** (`apps/mobile`) | Families / people seeking or claiming support |
| **Volunteer** | Volunteers fulfilling eligible requests |

## Auth decisions (WorkOS)

- **One WorkOS environment** per stage (Staging / Production), shared user
  base across clients.
- **Four AuthKit Applications** — one per client surface (not one per
  user type). Applications differ by redirects, sessions, and client IDs.
- **User types / roles** live in **our** data model (and optionally WorkOS
  roles later). The backend resolves what someone may do after identity
  is proven.
- **Invite-only** auth UX: Sign in, not public Sign up.

See the Development / WorkOS section in [README.md](../README.md) for
local Client IDs and env setup.

## Explicitly deferred

- Exact claim / selection UX when multiple orgs respond
- Offer filter taxonomy
- Full domain schema (hospitals, memberships, services, request states)
- Role gating that blocks the “wrong” client for a given user type
