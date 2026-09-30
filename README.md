# EVENTRA — College Event Management Platform

> **"Discover. Register. Participate."**

A college event management platform featuring student event discovery, multi-criteria filtering and search, real-time registration persistence, and a secure administrative dashboard for complete event and attendee lifecycle management.

---

## 🚀 Live Production & Repository

- **GitHub Repository**: [chauhan508/EVENTrA](https://github.com/chauhan508/EVENTrA)
- **Live Vercel Production**: [https://eventra-rho.vercel.app](https://eventra-rho.vercel.app) *(or active Vercel deployment domain)*

---

## 🎯 Platform Highlights

### Student Experience
- **Home Hub**: Hero banner with EVENTRA brand identity, tagline (*Discover. Register. Participate.*), featured event spotlight, and upcoming timeline.
- **Event Discovery**: Filter by categories (*Coding Competition, Hackathon, Workshop, Competition, Technical Session*), search dynamically by title, and sort chronologically.
- **Event Details & Registration**: Full view of event agenda, date, time slot, venue (**Ramanujan Auditorium**), and one-click registration form (Name, Email, College, Year, Phone).
- **Persistent Storage**: All registrations persist directly to a relational PostgreSQL database with automatic duplicate detection.

### Admin Experience
- **Secure Authentication**: Real JWT authentication with encrypted password verification via bcrypt.
- **Comprehensive Dashboard**: Real-time metric cards for total events, active registrations, upcoming dates, and recent attendee signups.
- **Event CRUD**: Add new events, update dates/descriptions/venues, toggle featured status, and delete events with automatic cascading registration cleanup.
- **Registration Management**: Search registrations by attendee name, email, or event title; filter by academic year and specific event.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite 5, Tailwind CSS 3, Lucide Icons, React Router v6 |
| **Backend / API** | Node.js, Express 5, Vercel Serverless Functions (`/api/index.js`) |
| **Database** | PostgreSQL (Neon Serverless Pool with SSL & connection pooling) |
| **Auth & Security** | JSON Web Tokens (JWT), Bcrypt password hashing, Parameterized SQL |
| **Deployment** | Vercel (Unified monorepo configuration with zero root path confusion) |

---

## 🏛️ Venue & Demo Events

All events take place at **Ramanujan Auditorium**:

1. **BuildVerse** — 24-hour collaborative sprint for web & mobile prototypes (Featured)
2. **CodeSprint** — Rapid-fire competitive programming contest on data structures & algorithms
3. **WebCraft Workshop** — Hands-on masterclass on React, Express APIs, and deployment
4. **TechTalk** — Interactive session on microservices, containerization, and clean architecture
5. **Algorithm Arena** — Mathematical puzzles, discrete logic, and asymptotic optimization

---

## ⚙️ Environment Variables

Create a `.env` file in the `server` directory (or configure within Vercel project settings):

| Variable Name | Purpose | Example / Default |
|---|---|---|
| `DATABASE_URL` | Neon PostgreSQL connection URI | `postgresql://user:pass@ep-xyz.neon.tech/neondb?sslmode=require` |
| `JWT_SECRET` | Secret key for JWT signing | `eventra_jwt_production_secret_2026` |
| `PORT` | Local backend port | `5000` |
| `CLIENT_URL` | Frontend origin for CORS | `http://localhost:5173` |
| `ADMIN_EMAIL` | Default seeded admin email | `admin@eventra.dev` |
| `ADMIN_PASSWORD` | Default seeded admin password | `Admin@Eventra2026!` |
| `VITE_API_URL` | Frontend API target (relative in prod) | `/api` |

---

## 💻 Local Development Setup

### 1. Install Dependencies
```bash
# Install root, serverless, and client dependencies
npm install
npm --prefix client install
```

### 2. Configure Environment
Create `server/.env`:
```env
DATABASE_URL=your_neon_postgresql_connection_string
JWT_SECRET=eventra_jwt_production_secret_2026
PORT=5000
ADMIN_EMAIL=admin@eventra.dev
ADMIN_PASSWORD=Admin@Eventra2026!
```

### 3. Run Locally
```bash
# Terminal 1: Start backend server (Port 5000)
npm run server

# Terminal 2: Start Vite frontend (Port 5173)
npm run client
```

### 4. Build for Production
```bash
npm run build
```

---

## 🔐 Default Admin Credentials

- **Portal URL**: `/admin/login`
- **Email**: `admin@eventra.dev`
- **Password**: `Admin@Eventra2026!`
*(Configurable via `ADMIN_EMAIL` and `ADMIN_PASSWORD` environment variables)*

---

## 📄 License
MIT License. Built for college technical event management.