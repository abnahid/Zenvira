# Zenvira Server

The backend API for Zenvira - a pharmaceutical e-commerce platform built with Express.js, Prisma, and PostgreSQL.

## Tech Stack

- **Express.js** 5.2.1 - Web framework
- **Prisma** 7.3.0 - ORM
- **PostgreSQL** 15+ - Database
- **TypeScript** 5.x - Type safety
- **Better Auth** - Authentication
- **Nodemailer** - Email services
- **bcrypt** - Password hashing

## Features

- RESTful API architecture
- Role-based access control (Customer, Seller, Admin)
- Email verification & password reset
- Product management with stock control
- Order processing with transactions
- Review and rating system
- Seller application workflow
- Platform analytics

## Getting Started

### Prerequisites

- Node.js >= 20.0.0
- PostgreSQL >= 15
- npm or yarn or pnpm

### Installation

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

### Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/zenvira?schema=public"

# Authentication
BETTER_AUTH_SECRET="your-secret-key-min-32-characters"
BETTER_AUTH_URL="http://localhost:5000"

# CORS
TRUSTED_ORIGIN="http://localhost:3000"

# Email (Gmail SMTP)
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
SMTP_FROM_EMAIL="noreply@zenvira.com"
```

### Database Setup

```bash
# Run migrations
npm run db:migrate

# (Optional) Open Prisma Studio
npm run db:studio
```

### Development

```bash
npm run dev
```

Server runs at [http://localhost:5000](http://localhost:5000)

### Production Build

```bash
npm run build
npm start
```

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/sign-up/email` | Register |
| POST | `/api/auth/sign-in/email` | Login |
| POST | `/api/auth/sign-out` | Logout |
| GET | `/api/auth/session` | Get session |

### Medicines
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/medicines` | List medicines |
| GET | `/api/medicines/:slug` | Get medicine |
| POST | `/api/medicines` | Create (seller/admin) |
| PUT | `/api/medicines/:id` | Update |
| DELETE | `/api/medicines/:id` | Delete |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/orders` | List orders |
| POST | `/api/orders` | Create order |
| PUT | `/api/orders/:id/status` | Update status |
| DELETE | `/api/orders/:id` | Cancel order |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/user` | List users (admin) |
| GET | `/api/user/me` | Get profile |
| PUT | `/api/user/me` | Update profile |
| POST | `/api/user/seller/apply` | Apply as seller |

### Categories
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | List categories |
| POST | `/api/categories` | Create (admin) |
| PUT | `/api/categories/:id` | Update (admin) |
| DELETE | `/api/categories/:id` | Delete (admin) |

### Reviews
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reviews/medicine/:id` | Get reviews |
| POST | `/api/reviews` | Create review |
| PUT | `/api/reviews/:id` | Update review |
| DELETE | `/api/reviews/:id` | Delete review |

### Stats
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/stats/seller` | Seller stats |
| GET | `/api/stats/admin` | Admin stats |

## Project Structure

```
src/
├── index.ts              # Express app entry
├── lib/
│   ├── auth.ts          # Better Auth config
│   └── prisma.ts        # Prisma client
├── middleware/
│   └── auth.middleware.ts # Auth middleware
└── routes/
    ├── medicine.routes.ts
    ├── user.routes.ts
    ├── order.routes.ts
    ├── category.routes.ts
    ├── review.routes.ts
    └── stats.routes.ts

prisma/
├── schema.prisma        # Database schema
├── migrations/          # Migration files
└── seed.ts             # Database seeder

api/
└── index.ts            # Vercel serverless
```

## Database Models

- **User** - Customers, sellers, admins
- **Medicine** - Products with stock
- **Category** - Product categories
- **Order** - Customer orders
- **OrderItem** - Order line items
- **Review** - Product reviews
- **SellerApplication** - Seller requests
- **Session** - Auth sessions
- **Account** - OAuth accounts
- **Verification** - Email tokens

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Build for production |
| `npm start` | Production server |
| `npm run db:migrate` | Run migrations |
| `npm run db:push` | Push schema |
| `npm run db:studio` | Open Prisma Studio |

## Deployment

### Vercel (Recommended)

```bash
vercel --prod
```

Required environment variables:
- `DATABASE_URL` (with `?sslmode=require`)
- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_URL`
- `TRUSTED_ORIGIN`
- `SMTP_USER`
- `SMTP_PASS`

## Author

**Abdul Jabbar Al Nahid** - [abnahid.com](https://abnahid.com)

## License

MIT License - see [LICENSE](../LICENSE)
