# ScholMent Hub

ScholMent Hub is a web platform that connects young Africans with verified scholarships, dedicated mentors, and end-to-end application support. It was built to solve a real problem: capable students missing out on life-changing opportunities simply because they lack access to accurate information, guidance, and mentorship during the application process.

## Live Demo

- **Live app:** [https://scholment-hub.vercel.app/ ]
- **SRS Document:** (https://docs.google.com/document/d/1s3VqRGA-Ykhl6qv0FYL16BCe65b_t-m1td86o36vHV0/edit?usp=sharing)

## Features

ScholMent Hub supports four user roles, each with their own dashboard and permissions:

- **Student** — register, search and view scholarship opportunities, request mentorship, submit essays tied to specific opportunities, and view mentor feedback.
- **Mentor** — accept or decline mentorship requests, review submitted essays, and provide feedback.
- **Organization** — submit new opportunities for review, which go live only after administrator approval.
- **Administrator** — approve or reject submitted opportunities, withdraw live opportunities, and manage user accounts (activate/deactivate).

All actions are protected by role-based access control — each API route verifies the logged-in user's role before allowing an action.

## Tech Stack

- **Framework:** Next.js 14 (App Router), TypeScript
- **Styling:** Tailwind CSS
- **Authentication:** NextAuth.js (credentials-based, with hashed passwords via bcrypt)
- **Database:** PostgreSQL, hosted on Neon
- **ORM:** Prisma
- **Deployment:** Vercel

## Getting Started (Local Setup)

Follow these steps exactly to run the project on your own machine.

### 1. Prerequisites

- [Node.js](https://nodejs.org/) installed (v18 or later recommended)
- A free [Neon](https://neon.tech) account (for the database)
- Git installed

### 2. Clone the repository

```powershell
git clone https://github.com/chukwukapeace01/scholment-hub.git
cd scholment-hub
```

### 3. Install dependencies

```powershell
npm install --legacy-peer-deps
```

### 4. Set up your database

1. Create a free project at [neon.tech](https://neon.tech)
2. Copy the connection string it gives you

### 5. Create your environment variables

In the project root, create a file named `.env` and add:

```
DATABASE_URL="your-neon-connection-string-here"
NEXTAUTH_SECRET="any-random-string-here"
NEXTAUTH_URL="http://localhost:3000"
```

To generate a random secret, run:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 6. Push the database schema

```powershell
npx prisma@5.22.0 db push
npx prisma@5.22.0 generate
```

### 7. Run the app

```powershell
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 8. Try it out

Register a new account and pick any role (Student, Mentor, Organization, or Administrator) from the dropdown to explore that role's dashboard.

## Project Structure

```
app/
  api/            → backend routes (auth, opportunities, mentorship, essays, admin)
  admin/          → admin-only pages
  opportunities/  → opportunity listing, detail, and submission pages
  mentors/        → mentor browsing and requests
  my-mentorships/ → student's essay submission and feedback view
  essays/         → mentor's essay review page
  dashboard/      → role-based landing page after login
lib/
  auth.ts         → NextAuth configuration
  prisma.ts       → Prisma client instance
prisma/
  schema.prisma   → database models
```

## Author

Peace Chukwuka
