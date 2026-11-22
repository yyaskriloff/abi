# Another Bright Idea

## Organizational Vision & Purpose

*Bringing families, volunteers, and established Jewish organizations
together so that support is easier to find, easier to coordinate, and
available when it matters most.*

> **No family should have to navigate a child's hospitalization alone or
> figure out, organization by organization, where help can be found.**

This document describes the purpose and intended impact of the
organization. It is an expression of the vision discussed so far, not a
technical plan or a finalized list of services.

------------------------------------------------------------------------

## The Need

When a child is hospitalized, a family can suddenly find itself dealing
with far more than medical care. Parents may need someone trustworthy to
sit with their child while they step away, meals, transportation,
practical information, emotional support, a place to connect for
Shabbos, or simply another person who understands what they are
experiencing.

Across Jewish communities, many organizations already provide meaningful
services to families in these situations. Volunteers, schools, community
groups, and specialist organizations often step forward with help. But
families may not know what is available, which organization to contact,
or how to coordinate different kinds of assistance. Organizations may
also be working alongside one another without a simple way to see needs,
share opportunities, or coordinate their efforts.

## The Purpose

The organization aims to create a shared support network that connects
the existing organizations and community resources serving Jewish
families with children in hospitals. Its role is to make support more
visible and coordinated---not to replace the organizations already doing
the work, take over their volunteer programs, or duplicate their
services.

The central focus is the family. A parent should have a straightforward
way to find help and information without needing to understand the
landscape of local organizations. At the same time, participating
organizations should be able to retain their own identity,
relationships, volunteer processes, and responsibility for the people
they bring into the network.

## How the Network Is Intended to Work

### Organizations as Trusted Gateways

Participation is closed and organization-led. Platform administrators
establish participating organizations and the hospitals represented in
the network. Organizations then have autonomy to invite or approve the
parents and volunteers they know and work with. This is especially
important because the network serves families with children and depends
on trust, appropriate vetting, and established community relationships.

A family is associated with the hospital where the child is receiving
care, rather than being placed exclusively under the organization that
first invited them. Once a participating organization has verified and
introduced a family, the family can be reached by the other
participating organizations serving that same hospital. This creates
multiple trusted entry points while giving the family access to a
broader circle of support.

### Organizations Working Together

Organizations can identify the hospitals where they operate and make
their services and activities available to the appropriate community.
They can coordinate with one another around shared needs, avoid
unnecessary duplication, and help ensure that a family's request reaches
an organization equipped to respond. Each organization remains
responsible for its own volunteers and the services it provides.

### Families at the Center

Families are not expected to know which organization is responsible for
each kind of help. The network is intended to give parents a common
place to find relevant support, communicate needs, learn what is
happening at their hospital, and connect with available community
resources.

## The Kinds of Support the Network Can Bring Together

### Practical Help and Volunteer Coordination

-   **Child companionship and supervision:** Parents can indicate times
    when they need a trusted person to stay with their child while they
    step away. Eligible organizations can notify their own volunteers
    and coordinate coverage.
-   **Transportation:** Organizations can announce that a van or ride
    service will be available and invite families who need a ride to
    respond.
-   **Food and essential items:** Organizations can let families know
    when they are visiting a hospital and ask whether meals, clothing,
    or other necessities are needed.
-   **Family requests:** Parents can ask for help, allowing relevant
    organizations to respond. Support can also flow in the other
    direction: organizations can publish offers, opportunities, or
    available resources for families to take up.

### Shabbos, Holidays, and Jewish Community Life

The network can help organizations coordinate Shabbos and holiday
support at a hospital. This may include sharing what arrangements are
being made, helping families request meals, communicating available
hospitality or community resources, and making it easier for families to
participate in Jewish communal life while remaining close to their
child.

### Information, Events, and Professional Support

-   **Hospital-specific information:** Helpful directions and practical
    guidance, including information about kosher food options, nearby
    minyanim and shuls, parking, accommodations, laundry, and other
    useful local resources.
-   **Events and activities:** Organizations can share hospital-specific
    events, children's activities, parent gatherings, and holiday
    programs, with a way for families to learn about them and
    participate.
-   **Professional and specialist support:** Where participating
    organizations provide it, families may be connected with social
    workers or other appropriate support people familiar with the
    hospital and the needs of families there.

## A Community Among Families

A hospital stay can be isolating. Families facing similar circumstances
may benefit from meeting one another, exchanging practical advice,
offering encouragement, and discovering that they are not alone. The
network can make room for family-to-family connection in two settings: a
community shared by families at the same hospital, and support groups
created or sponsored by an individual organization.

Families may introduce themselves, ask questions, share recommendations,
arrange to meet, or offer practical help to one another. Participation
and the amount of personal information shared should remain a choice for
each family, with sensitivity to the privacy of children and parents.

## What the Organization Aims to Accomplish

-   **Make help easier to find.** Give families a clear place to
    discover the support and resources already available to them.
-   **Connect existing efforts.** Help organizations collaborate across
    institutional boundaries without requiring them to merge or change
    their own missions.
-   **Reduce the burden on parents.** Make it less necessary for
    families to identify, contact, and coordinate with multiple
    organizations on their own.
-   **Put available help to better use.** Make needs, offers, volunteer
    opportunities, and community activities easier to communicate and
    coordinate.
-   **Strengthen the hospital community.** Create opportunities for
    families to support one another and feel connected during a
    difficult period.
-   **Preserve trust and responsibility.** Keep organizations in control
    of their own volunteers and the people they bring into the network,
    while maintaining a closed, trusted environment.

## Guiding Principles

-   **Family-centered:** The needs and experience of parents and
    children guide the work.
-   **Collaborative:** Organizations are partners in a shared effort,
    not competitors for control.
-   **Trusted:** Access is through participating organizations and their
    established vetting relationships.
-   **Respectful of independence:** Each organization retains its own
    identity, volunteer relationships, and responsibilities.
-   **Practical:** The goal is to make real help, useful information,
    and meaningful connection easier to access.
-   **Sensitive to privacy:** Children and families deserve discretion,
    choice, and appropriate boundaries.

## The Broader Vision

The vision is a stronger, more connected network of care around families
whose children are in the hospital. By bringing existing organizations,
volunteers, families, and community resources into closer coordination,
the organization hopes to make support feel less fragmented and more
dependable. A parent should be able to focus as much as possible on
their child, knowing that there is a connected community working to make
practical help, information, and human support easier to reach.

This is not about replacing the people and organizations already serving
families. It is about helping them work together so that the combined
strength of the community can be there for every family that needs it.

------------------------------------------------------------------------

## Development

pnpm workspace organized as `apps/*` and `packages/*`, sharing tRPC types:

| Package | Path | Role |
| --- | --- | --- |
| `@abi/trpc` | `packages/trpc/` | Hono + tRPC server; exports `AppRouter` |
| `@abi/shared` | `packages/shared/` | Shared hooks and tRPC/React Query helpers |
| `@abi/auth-native` | `packages/auth-native/` | Expo WorkOS AuthKit PKCE helpers |
| `@abi/ui` | `packages/ui/` | Web UI primitives (Tailwind + shadcn) |
| `@abi/ui-native` | `packages/ui-native/` | Mobile UI foundation (NativeWind) |
| `@abi/admin` | `apps/admin/` | Vite + React platform admin SPA |
| `@abi/org` | `apps/org/` | Vite + React organization SPA |
| `@abi/mobile` | `apps/mobile/` | Expo user app |
| `@abi/volunteer` | `apps/volunteer/` | Expo volunteer app |

### Setup

```bash
pnpm install
```

### Run locally

```bash
# API only (http://localhost:3001)
pnpm dev:trpc

# Admin SPA (http://localhost:5173) — needs the API running
pnpm dev:admin

# Org SPA (http://localhost:5174)
pnpm dev:org

# Expo user app
pnpm dev:mobile

# Expo volunteer app
pnpm dev:volunteer
```

Copy env examples if needed:

- `packages/trpc/.env.example` → `packages/trpc/.env` (`WORKOS_API_KEY`, `WORKOS_CLIENT_ID`)
- `apps/admin/.env.example` → `apps/admin/.env` (`VITE_API_URL`, `VITE_WORKOS_CLIENT_ID`)
- `apps/org/.env.example` → `apps/org/.env` (`VITE_API_URL`, `VITE_WORKOS_CLIENT_ID`)
- `apps/mobile/.env.example` → `apps/mobile/.env` (`EXPO_PUBLIC_API_URL`, `EXPO_PUBLIC_WORKOS_CLIENT_ID`)
- `apps/volunteer/.env.example` → `apps/volunteer/.env` (`EXPO_PUBLIC_API_URL`, `EXPO_PUBLIC_WORKOS_CLIENT_ID`)

On a physical device, set the API URL to your machine’s LAN IP instead of
`localhost`.

Clients import shared types:

```ts
import type { AppRouter } from "@abi/trpc";
```

### WorkOS AuthKit

One WorkOS Staging environment (**A Bright Idea**), four AuthKit applications
(shared user base). Sign-in is invite-only — clients expose Sign in, not public
Sign up.

| Client | AuthKit app | Client ID | Local redirect / initiate login |
| --- | --- | --- | --- |
| Admin SPA | `admin` (default) | `client_01M7JP147HH5966QTXRYV1TQ4P` | `http://localhost:5173` / `/login` |
| Org SPA | `org` | `client_01M82ENCWDCY4CVBN7T18T6NG3` | `http://localhost:5174` / `/login` |
| Mobile (user) | `user` | `client_01M82ENFNBEAGD4P6EYKH6B6HB` | `abi-user://callback` |
| Volunteer | `volunteer` | `client_01M82ENG7YYXH377AAS92NTZ7Z` | `abi-volunteer://callback` |

Server (`@abi/trpc`) verifies Bearer access tokens with `WORKOS_API_KEY` + the
default Staging `WORKOS_CLIENT_ID` (JWKS). Copy the API key from the WorkOS
Dashboard → Applications → admin → API keys into `packages/trpc/.env`.

Protected smoke check: after signing in, each client calls `trpc.me`.

### Railway

Infrastructure lives in [`.railway/railway.ts`](.railway/railway.ts):

| Service | What it deploys |
| --- | --- |
| `trpc` | `@abi/trpc` (Hono + tRPC) |
| `admin` | Vite static build (`apps/admin/dist`) |

Mobile apps are Expo and are not deployed on Railway (use EAS when you ship).

```bash
railway config plan
railway config apply   # only after reviewing the plan
railway domain --service trpc
railway domain --service admin
```

`admin` builds with `VITE_API_URL=https://${{trpc.RAILWAY_PUBLIC_DOMAIN}}`, so generate the `trpc` domain before (or right after) the first admin deploy.

Development environment URLs (current):

- API: https://api-development-d94668f5.up.railway.app
- Admin: https://admin-development-ec80c4e1.up.railway.app

GitHub auto-deploys will only succeed after the monorepo (`pnpm-lock.yaml`, `apps/`, `packages/`) is pushed to `main`. Until then, deploy from local with `railway up --service trpc` / `railway up --service admin`.
