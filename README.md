# UPM DRRM-H — Incident Reporting System

[![Next.js](https://img.shields.io/badge/Next.js-15-000000?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-2.0-3ECF8E?logo=supabase)](https://supabase.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-38BDF8?logo=tailwindcss)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## **Web Dashboard for the UP Manila Disaster Risk Reduction and Management in Health Incident Reporting System**

---

## About

This is the **admin web dashboard** for the UPM DRRM-H Incident Reporting System — a platform designed to manage, monitor, and analyze incident reports submitted by field teams across the UP Manila campus during drills, emergencies, and other DRRM-H-related events.

The system works alongside a companion Flutter mobile app used by field personnel to submit real-time reports. Data flows from the mobile app into Supabase, and this dashboard gives administrators a centralized view of all incidents, headcounts, drill statuses, and post-event summaries.

### What it does

- **Dashboard** — Live stats on events, reports, and affected personnel
- **Events** — Track drills and incidents from start to resolution
- **Reports** — View and search submitted field reports with headcount breakdowns
- **Activity Logs** — Full audit trail of all system actions
- **Users** — Manage field team accounts and access levels
- **Calendar** — Visual timeline of events per month
- **News** — Post announcements and advisories
- **Settings** — Configure scenarios, locations, buildings, roles, and more

### System Context

The IRS is part of a broader DRRM-H platform consisting of:

| Component          | Description                    |
| ------------------ | ------------------------------ |
| **This repo**      | Admin web dashboard (Next.js)  |
| Flutter mobile app | Field team incident submission |
| Supabase           | Shared backend and database    |

---

## Tech Stack

| Category               | Technology                   |
| ---------------------- | ---------------------------- |
| **Framework**          | Next.js 15 (App Router)      |
| **Language**           | TypeScript                   |
| **Styling**            | Tailwind CSS v4              |
| **Database & Auth**    | Supabase                     |
| **State Management**   | Zustand                      |
| **Data Fetching**      | TanStack Query (React Query) |
| **Forms & Validation** | React Hook Form + Zod        |
| **Charts**             | Recharts                     |
| **Notifications**      | React Hot Toast              |
| **Icons**              | Lucide React                 |

---

## Setting It Up

### Prerequisites

- Node.js v18 or higher
- A Supabase project with the IRS schema set up

### Installation

1; **Clone the repository**

```bash
git clone https://github.com/your-org/upm-drrm-irs.git
cd upm-drrm-irs
```

2; **Install dependencies**

```bash
npm install
```

3; **Set up environment variables**

```bash
cp .env.local.example .env.local
```

Then fill in your Supabase credentials in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://yourproject.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

4; **Start the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```bash
src/
├── app/                    # Next.js App Router pages
│   ├── (admin)/            # Protected admin routes
│   │   ├── page.tsx        # Dashboard
│   │   ├── events/         # Events management
│   │   ├── reports/        # Incident reports
│   │   ├── users/          # User management
│   │   ├── activity-logs/  # Audit logs
│   │   ├── calendar/       # Event calendar
│   │   ├── news/           # Announcements
│   │   └── settings/       # System configuration
│   └── (auth)/             # Auth pages (signin)
├── components/
│   ├── auth/               # Auth components and protected route
│   ├── layout/             # Sidebar, header, backdrop
│   ├── ui/                 # Base UI components
│   ├── settings/           # Reusable settings table/form
│   ├── users/              # User form
│   └── news/               # News form
├── hooks/                  # React Query data hooks
├── lib/                    # Supabase client, utils, schemas, logger
├── store/                  # Zustand stores (auth, sidebar, theme)
└── types/                  # TypeScript database types
```

---

## Roles & Access

| Role            | Access                                                        |
| --------------- | ------------------------------------------------------------- |
| **Admin**       | Full web dashboard access — all data, charts, user management |
| **Field Users** | Mobile app only — submit reports per assigned team role       |

Field team roles include: Proprietor, Security, Search & Rescue, Medical, Fire Marshal. Each role sees only their own submitted data through the mobile app.

---

## System Architecture Diagram

```mermaid
---
config:
  layout: dagre
  look: handDrawn
  theme: default
---
graph LR
  %% Users
  admin[<b>Admin</b>]
  fieldUser[<b>Field User</b>]

  %% Platform
  subgraph IRS[<b>IRS Platform</b>]
    webApp[<b>Web Dashboard</b><br/>Next.js 15 — admin monitoring and management]
    mobileApp[<b>Flutter Mobile App</b><br/>Field team incident submission]
  end

  %% External
  supabase[(<i><small>external_system</small></i><br/>Supabase<br/>PostgreSQL + Auth + Realtime)]
  email[<i><small>external_system</small></i><br/>Email Service<br/>SMTP]
  officeServer[<i><small>external_system</small></i><br/>Office Server]

  %% Flow
  admin -->|HTTPS| webApp
  fieldUser -->|Mobile| mobileApp

  webApp -->|Read/Write| supabase
  mobileApp -->|Submit Reports| supabase

  webApp -->|Notifications| email
  webApp -->|Deployment| officeServer
```

## Use-Case Diagram

```mermaid
---
config:
  layout: elk
  look: handDrawn
  theme: default
---
flowchart LR
 subgraph AUTH["Authentication"]
        UC1["Log In"]
        UC2["Log Out"]
  end
 subgraph EVENTS["Event Management"]
        UC3["View All Events"]
        UC4["View Event Details"]
        UC5["Search Events"]
  end
 subgraph REPORTS["Report Management"]
        UC6["View All Reports"]
        UC7["Search Reports"]
        UC8["View Report Details"]
        UC9["Submit Incident Report"]
  end
 subgraph USERS["User Management"]
        UC10["View All Users"]
        UC11["Create User"]
        UC12["Edit User"]
        UC13["Toggle User Status"]
        UC14["Search Users"]
  end
 subgraph LOGS["Activity Logs"]
        UC15["View Activity Logs"]
        UC16["Search Activity Logs"]
  end
 subgraph NEWS["News Management"]
        UC17["View All News"]
        UC18["Create News"]
        UC19["Edit News"]
  end
 subgraph CAL["Calendar"]
        UC20["View Event Calendar"]
        UC21["Browse Events by Month"]
  end
 subgraph SETTINGS["Settings Management"]
        UC22["Manage Event Scenarios"]
        UC23["Manage Event Actions"]
        UC24["Manage Locations"]
        UC25["Manage User Types"]
        UC26["Manage Colleges & Units"]
        UC27["Manage Buildings & Zones"]
        UC28["Manage Observee Areas"]
        UC29["Manage Observee Roles"]
        UC30["Manage Remarks"]
  end
 subgraph SETTINGSCRUD["Settings CRUD (applies to each)"]
        UC31["View All"]
        UC32["Create"]
        UC33["Edit"]
        UC34["Delete"]
  end
    UC3 -- includes --> UC4 & UC5
    UC6 -- includes --> UC7 & UC8
    UC10 -- includes --> UC14
    UC10 -- extends --> UC11 & UC12 & UC13
    UC15 -- includes --> UC16
    UC17 -- extends --> UC18 & UC19
    UC20 -- includes --> UC21
    SETTINGS -- extends --> SETTINGSCRUD
    Admin(["Admin"]) --- AUTH & EVENTS & REPORTS & USERS & LOGS & NEWS & CAL & SETTINGS
    FieldUser(["Field User"]) --- UC9
```

## Entity Relationship Diagram

```mermaid
---
config:
  layout: elk
  look: handDrawn
  theme: default
---
erDiagram
  users {
    uuid id PK
    uuid authid FK
    string username
    string firstname
    string middlename
    string lastname
    string suffix
    string email
    string cluster
    string office
    string bldgname
    string encoder_position
    int usertype
    string zone
    boolean isActive
    timestamp created_at
  }

  events {
    uuid event_id PK
    string eventname
    string eventdescription
    string category
    string location
    string status
    boolean eventstarted
    string incidentcommander
    string liasonofficer
    string safetysecurityofficer
    string publicinformationofficer
    timestamp timestampstart
    timestamp timestampend
    timestamp created_at
  }

  reports {
    uuid id PK
    uuid event_id FK
    uuid encoder_id FK
    string encoder_position
    string cluster
    string office
    string bldg_name
    string exactlocation
    string event_type
    string hazard_type
    int students
    int facultymembers
    int adminmembers
    int repsmembers
    int ramembers
    int philcarestaff
    int securitypersonnel
    int constructionworkers
    int tenants
    int healthworkers
    int nonacademicstaff
    int guests
    int nummissingpersons
    int numcasualties
    string namesofmissingpersons
    string identityandconditionofcasualties
    string damageassessment
    timestamp created_at
    timestamp last_modified
  }

  activity_logs {
    uuid id PK
    string action
    string module
    string docID
    string docName
    string initiatedBy
    string initiatedByEmail
    string initiatedByDisplay
    json data
    string status
    timestamp datecreated
  }

  news {
    uuid id PK
    string title
    string content
    string author
    string category
    boolean is_active
    string image_url
    string source_url
    timestamp published_at
    timestamp created_at
    timestamp updated_at
  }

  buildings_zones {
    uuid id PK
    uuid collegeID FK
    string buildingName
    boolean isActive
    timestamp created_at
  }

  colleges_units {
    uuid id PK
    string collegeName
    boolean isActive
    timestamp created_at
  }

  locations {
    uuid id PK
    string locationName
    boolean isActive
    timestamp created_at
  }

  event_scenarios {
    uuid id PK
    string scenarioName
    string description
    boolean isActive
    timestamp created_at
  }

  event_actions {
    uuid id PK
    string actionName
    string description
    boolean isActive
    timestamp created_at
  }

  observee_areas {
    uuid id PK
    string areaName
    boolean isActive
    timestamp created_at
  }

  observee_roles {
    uuid id PK
    string roleName
    boolean isActive
    timestamp created_at
  }

  remarks {
    uuid id PK
    string remarkName
    boolean isActive
    timestamp created_at
  }

  user_types {
    uuid id PK
    string typeName
    boolean isActive
    timestamp created_at
  }

  events ||--o{ reports : "has many"
  users ||--o{ reports : "submits"
  colleges_units ||--o{ buildings_zones : "has many"
```

## Flowchart Diagram

```mermaid
---
config:
  layout: dagre
  look: handDrawn
  theme: default
---
flowchart TD
  A([Field User opens mobile app]) --> B[Selects active event]
  B --> C[Fills in incident report form]
  C --> D{Form valid?}
  D -- No --> C
  D -- Yes --> E[Submits report]
  E --> F[(Supabase — reports table)]
  F --> G[Real-time subscription triggers]
  G --> H[Web dashboard updates]
  H --> I[Admin views reports page]
  I --> J{Action needed?}
  J -- View details --> K[Admin opens event details]
  J -- Export/review --> L[Admin reviews headcount and casualties]
  J -- No action --> M([End])
  K --> M
  L --> M
```

---

## Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
npm run lint:fix   # Auto-fix ESLint issues
```

---

## Developer

**Bryan Mangapit** — Lead Developer
**Sharah Tuando** — Frontend Design Specialist
[bruhhhyannnn.framer.website](https://bruhhhyannnn.framer.website) · [GitHub](https://github.com/bruhhhyannnn) · [LinkedIn](https://linkedin.com/in/bryanmangapit)

---

## License

MIT © 2026 Bryan Jesus Mangapit · UP Manila DRRM-H
