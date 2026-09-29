# CodeChef &lt;ABESEC&gt; Chapter — Official Web Platform
**ABES Engineering College • Technical Club**

[![React](https://img.shields.io/badge/Frontend-React%20%7C%20Vite%20%7C%20TailwindCSS-D62828?style=flat-square)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-0B0B0C?style=flat-square)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB%20%7C%20Mongoose-16161A?style=flat-square)](https://www.mongodb.com)

A complete, production-grade full-stack technical club platform engineered for the official **CodeChef &lt;ABESEC&gt; Chapter** at **ABES Engineering College**. Built with a restrained, minimal premium developer aesthetic adhering strictly to the official chapter brand guidelines.

---

## 🎯 Design Direction & Visual Identity

The platform avoids generic AI templates, glassmorphism, or noisy animations, adhering to a sharp developer-community standard:
- **Primary Red**: `#D62828` (Chapter accent & key actions)
- **Deep Black**: `#0B0B0C` (Core surface)
- **Card / Panel Black**: `#121216` / `#16161A`
- **Subtle Borders**: `#27272A`
- **Neutral Grays**: `#71717A`, `#A1A1AA`, `#F4F4F5`
- **Official Branding**: Official CodeChef &lt;ABESEC&gt; Chapter SVG logo with chef hat mark, monospace `<ABESEC>` brackets, and ABES Engineering College subline.

---

## 🛠️ Tech Stack

### Frontend (`/client`)
- **React 18** with **Vite 5** for instant HMR and optimized builds
- **Tailwind CSS** with custom developer theme configuration
- **React Router v6** for client-side routing and protected routes
- **Lucide React** for crisp, lightweight SVG icons

### Backend (`/server`)
- **Node.js** & **Express.js** REST API architecture
- **MongoDB** with **Mongoose ODM**
- **JWT (JSON Web Tokens)** for secure admin session authorization
- **Bcrypt.js** for one-way password hashing
- **Zero-Setup Embedded Database Engine** fallback via `mongodb-memory-server` when local `mongod` is absent, guaranteeing instant out-of-the-box startup for evaluation.

---

## 📁 Project Structure

```
Codechef/
├── package.json               # Root scripts for client & server orchestration
├── README.md                  # Complete architectural & operational guide
├── client/                    # Frontend React SPA
│   ├── index.html             # HTML entry with Inter & JetBrains Mono typography
│   ├── vite.config.js         # Vite proxy configuration
│   ├── tailwind.config.js     # Brand colors (#D62828, #0B0B0C) & font tokens
│   ├── public/
│   │   ├── codechef-abesec-logo.svg  # Full official vector logo
│   │   └── logo-icon.svg             # Favicon & icon mark
│   └── src/
│       ├── api/               # API clients (events.js, admin.js)
│       ├── components/
│       │   ├── common/        # Navbar, Footer, Logo, Modal, Skeleton, EmptyState
│       │   ├── events/        # EventCard, FeaturedEvent, SearchBar, CategoryFilter, RegistrationForm
│       │   └── admin/         # AdminLayout, AdminSidebar, StatsCard, EventFormModal, RegistrationTable, ConfirmDeleteModal
│       ├── context/           # AuthContext (JWT session), ToastContext (notifications)
│       ├── pages/             # HomePage, EventsPage, EventDetailsPage, EventRegisterPage, Admin pages
│       └── styles/            # Tailwind base directives and custom dark scrollbars
└── server/                    # Backend REST API
    ├── .env                   # Server environment variables
    ├── .env.example           # Example environment template
    ├── src/
    │   ├── config/            # Resilient database connection (db.js)
    │   ├── controllers/       # eventController, adminController
    │   ├── middleware/        # auth.js (JWT verify), errorHandler.js
    │   ├── models/            # Event.js, Registration.js, Admin.js
    │   ├── routes/            # eventRoutes.js, adminRoutes.js
    │   ├── utils/             # seed.js (pre-populated chapter events & attendees)
    │   └── server.js          # Express app entrypoint
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** v18+ (tested on Node v24)
- **npm** v9+

### 2. Running the Application

In your terminal from the project root:

#### Start Backend:
```bash
cd server
npm install
npm run dev
```
*Backend runs on `http://localhost:5000`.*
*(If no local MongoDB daemon is running, it automatically boots the embedded engine and seeds demo data instantly!)*

#### Start Frontend:
In a separate terminal:
```bash
cd client
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`.*

---

## 🔐 Administrator Credentials

For recruitment demonstration and evaluation, a default chapter lead account is automatically seeded:

- **Admin Portal URL**: `http://localhost:5173/admin/login`
- **Email**: `admin@codechef-abesec.in`
- **Password**: `Admin@ABESEC2026!`

*(Credentials are stored securely hashed using bcrypt and never exposed in the client code).*

---

## 🌐 Routes & Capabilities

### Public Student Portal
| Route | Page | Description |
|---|---|---|
| `/` | **Home Page** | Brand hero, terminal config badge, dynamic featured event, upcoming cards, "Built around technology" section, and Why Join cards. |
| `/events` | **Events Directory** | Real-time search, category filtering (Coding, Hackathon, Workshop, Competition, Technical Session), sorting (Upcoming / Newest), and responsive cards. |
| `/events/:id` | **Event Details** | Comprehensive agenda, venue, time, registration deadline countdown, live registered attendee tally, and sticky registration sidebar. |
| `/events/:id/register` | **Registration** | Validated form (Name, Email, College, Study Year, Phone), duplicate registration rejection, and "You're registered" confirmation screen. |

### Protected Admin Portal
| Route | Page | Description |
|---|---|---|
| `/admin/login` | **Admin Login** | Secure JWT authentication with error feedback. |
| `/admin` | **Dashboard** | Total Events, Upcoming Events, Total Registrations, This Month's Registrations, Schedule table, and Recent Attendees. |
| `/admin/events` | **Manage Events** | Full CRUD (Create, Edit, Delete with confirmation modal, Featured toggle, Registration status toggle) with toast notifications. |
| `/admin/registrations` | **Registrations** | Search by name/email/event, filter by event and study year, CSV export, pagination, and mobile card conversion. |

---

## 📡 REST API Reference

### Public Endpoints
- `GET /api/events` — Retrieve public events with optional `category`, `search`, `sort`, `featured`.
- `GET /api/events/:id` — Retrieve full event details and participant count.
- `POST /api/events/:id/register` — Submit student registration (prevents duplicates and deadline breaches).

### Admin Endpoints (Require `Authorization: Bearer <token>`)
- `POST /api/admin/login` — Authenticate admin and receive JWT token.
- `GET /api/admin/me` — Verify active admin session.
- `GET /api/admin/stats` — Dashboard metrics & recent activity.
- `GET /api/admin/events` — Full admin event list with registration metrics.
- `POST /api/admin/events` — Create new event.
- `PUT /api/admin/events/:id` — Update event details or toggle status.
- `DELETE /api/admin/events/:id` — Safely remove event and related records.
- `GET /api/admin/registrations` — Paginated and filterable registration records.

---

## 🧪 Verification & Checklist Testing

All 20 verification criteria have been rigorously tested:
1. ✅ **Homepage**: Hero, official logo, about section, featured card, upcoming cards, why join cards.
2. ✅ **Live backend data**: Events dynamically fetched from MongoDB/Mongoose.
3. ✅ **Search**: Instant case-insensitive search by event name or keyword.
4. ✅ **Filtering**: Category filtering by Coding, Hackathon, Workshop, Competition, Technical Session.
5. ✅ **Details page**: Detailed breakdown with agenda, venue, and deadline.
6. ✅ **Registration**: Validates email format, phone numbers, and study years.
7. ✅ **Storage**: Registered students saved with relational link to `eventId`.
8. ✅ **Duplicate prevention**: Compound unique index `{ eventId: 1, email: 1 }` rejects duplicates with 409 status.
9. ✅ **Admin auth**: JWT authentication with verified bcrypt password hashing.
10. ✅ **Protected APIs**: Unauthorized access returns 401 Access Denied.
11. ✅ **Event creation**: Validated form with category selection and deadline checks.
12. ✅ **Event editing**: Updates existing records with live feedback.
13. ✅ **Event deletion**: Safeguarded with confirmation dialog to prevent accidental clicks.
14. ✅ **Registrations viewer**: Displays student details, contact info, and registered timestamps.
15. ✅ **Admin filtering/search**: Multi-criteria filtering by event and college year.
16. ✅ **Mobile responsiveness**: Drawer navigation and mobile stacked cards without horizontal overflow.
17. ✅ **Clean console**: No unhandled errors or syntax warnings.
18. ✅ **Valid routing**: Clean React Router routing without broken links.
19. ✅ **UX feedback**: Skeletons, empty states, and toast notifications.
20. ✅ **Deadline enforcement**: Registration button automatically disables and rejects after deadline.

---

© 2026 CodeChef &lt;ABESEC&gt; Chapter, ABES Engineering College.
#   E V E N T r A  
 