# ticktock — Timesheet Management App

A SaaS-style timesheet management application built as a front-end technical assessment.

## 🛠 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS 4
- **Auth**: [NextAuth.js](https://next-auth.js.org/) (Credentials Provider)
- **Icons**: [Heroicons](https://heroicons.com/)
- **Date Formatting**: [date-fns](https://date-fns.org/)
- **Testing**: Jest + React Testing Library
- **Font**: [Inter](https://fonts.google.com/specimen/Inter)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd ticktock

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Login Credentials

| Field    | Value            |
|----------|------------------|
| Email    | john@example.com |
| Password | password123      |

## 📁 Project Structure

```
src/
├── app/                     # Next.js App Router pages
│   ├── api/                 # Internal API routes
│   │   ├── auth/            # NextAuth handler
│   │   └── timesheets/      # Timesheet CRUD endpoints
│   ├── dashboard/           # Dashboard + weekly detail pages
│   └── login/               # Login page
├── components/              # Reusable components
│   ├── auth/                # LoginForm
│   ├── entries/             # EntryModal
│   ├── layout/              # Navbar, Footer
│   ├── timesheets/          # Table, Filters, Pagination, StatusBadge
│   └── ui/                  # Button, Input, Select, Modal, ProgressBar
├── data/                    # Mock data (users, timesheets, entries)
├── lib/                     # Utilities (auth config, API client, helpers)
├── providers/               # SessionProvider wrapper
├── types/                   # TypeScript type definitions
└── __tests__/               # Unit tests
```

## 🏗 Architecture Decisions

### API Layer
- All client-side data access goes through **internal Next.js API routes** (`/api/*`)
- Mock data is consumed **only** by server-side API handlers — never directly in components
- API routes support filtering, sorting, and pagination

### Authentication
- NextAuth with CredentialsProvider validates against mock user data
- JWT session strategy for stateless auth
- Protected routes via middleware (`/dashboard/*`)

### State Management
- React hooks (`useState`, `useEffect`, `useCallback`) for local state
- Data fetching through typed API helpers in `lib/api.ts`

### Component Design
- Small, focused, reusable components
- Shared UI primitives: `Button`, `Input`, `Select`, `Modal`
- Clear separation: layout → page → feature → UI components

## 🧪 Running Tests

```bash
npm test
```

Tests cover:
- **StatusBadge**: Correct rendering and styling for each status
- **Pagination**: Page numbers, navigation, disabled states
- **Button**: Variants, loading state, click handling
- **Utils**: Date formatting, status colors, class merging

## 🔑 Key Features

1. **Login**: Split-layout login page with form validation and error handling
2. **Dashboard**: Weekly timesheets table with status badges, sorting, filtering, and pagination
3. **Weekly Detail**: Day-by-day view with progress bar, add/edit/delete entries
4. **Entry Modal**: Full CRUD with project/work type selectors and validation
5. **Responsive**: Works on mobile, tablet, and desktop
6. **Protected Routes**: Auth guard via NextAuth middleware

## ⏱ Time Spent

~3 hours

## 📝 Assumptions

- Mock data is stored in-memory / mongodb atlas
- A "week" is Monday–Friday (5 working days)
- 40 hours = completed, >0 but <40 = incomplete, 0 = missing
- Single user system (one mock user for demo purposes)
- Date range filter checks if a week's dates fall within the selected range
