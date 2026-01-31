# MediStore API Server

Express + Prisma + PostgreSQL API for MediStore application.

## Features

- 🔐 Authentication with Better Auth
- 💊 Medicine management
- 📦 Categories
- ⭐ Reviews
- 🛒 Orders (schema ready)
- 👥 User management

## Local Development

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

### Setup

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env` and fill in your environment variables:

```bash
cp .env.example .env
```

3. Run Prisma migrations:

```bash
npx prisma migrate dev
```

4. (Optional) Seed the database:

```bash
npx prisma db seed
```

5. Start development server:

```bash
npm run dev
```

Server will run at `http://localhost:5000`

## Deployment to Vercel

### Prerequisites

- Vercel account
- PostgreSQL database (e.g., Neon, Supabase, Railway)

### Steps

1. Install Vercel CLI:

```bash
npm install -g vercel
```

2. Login to Vercel:

```bash
vercel login
```

3. Set environment variables in Vercel:

```bash
vercel env add DATABASE_URL
vercel env add BETTER_AUTH_SECRET
vercel env add BETTER_AUTH_URL
vercel env add TRUSTED_ORIGIN
```

Or set them in Vercel Dashboard under Project Settings > Environment Variables.

4. Deploy:

```bash
vercel --prod
```

### Important Notes

- Make sure your `DATABASE_URL` includes `?sslmode=require` for production databases
- The `vercel-build` script automatically runs Prisma migrations
- Prisma client is generated during build
- Binary targets are configured for Vercel's serverless environment

## API Endpoints

### Authentication

- `POST /api/auth/sign-up/email` - Sign up
- `POST /api/auth/sign-in/email` - Sign in
- `POST /api/auth/sign-out` - Sign out
- `GET /api/auth/session` - Get session

### Medicines

- `GET /api/medicines` - Get all medicines
- `POST /api/medicines` - Create medicine (seller/admin)
- `PUT /api/medicines/:id` - Update medicine (seller/admin)
- `DELETE /api/medicines/:id` - Delete medicine (seller/admin)

### Categories

- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category
- `POST /api/categories` - Create category (admin)
- `PUT /api/categories/:id` - Update category (admin)
- `DELETE /api/categories/:id` - Delete category (admin)

### Reviews

- `GET /api/reviews` - Get all reviews
- `GET /api/reviews/medicine/:medicineId` - Get reviews for medicine
- `GET /api/reviews/:id` - Get review
- `POST /api/reviews` - Create review (authenticated)
- `PUT /api/reviews/:id` - Update review (author/admin)
- `DELETE /api/reviews/:id` - Delete review (author/admin)

### Health

- `GET /health` - Health check

## Database Management

### View data

```bash
npx prisma studio
```

### Create migration

```bash
npx prisma migrate dev --name migration_name
```

### Deploy migrations (production)

```bash
npx prisma migrate deploy
```

### Reset database (development only)

```bash
npx prisma migrate reset
```

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run vercel-build` - Build script for Vercel (auto-runs migrations)

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Auth**: Better Auth
- **Email**: Resend (optional)
- **Deployment**: Vercel Serverless Functions

## Project Structure

```
server/
├── api/              # Vercel serverless functions
│   └── index.ts
├── prisma/           # Database schema and migrations
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
├── src/
│   ├── index.ts      # Main Express app
│   ├── lib/          # Utilities (auth, prisma client)
│   ├── middleware/   # Auth middleware
│   └── routes/       # API routes
├── vercel.json       # Vercel configuration
└── package.json
```

## Environment Variables

| Variable             | Description                  | Required |
| -------------------- | ---------------------------- | -------- |
| `DATABASE_URL`       | PostgreSQL connection string | Yes      |
| `BETTER_AUTH_SECRET` | Secret key for auth          | Yes      |
| `BETTER_AUTH_URL`    | Auth callback URL            | Yes      |
| `TRUSTED_ORIGIN`     | CORS allowed origin          | Yes      |
| `RESEND_API_KEY`     | Resend API key for emails    | No       |

## Support

For issues or questions, please create an issue in the repository.
