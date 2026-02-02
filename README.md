<p align="center">
  <img src="https://i.ibb.co.com/XrChwBtH/logo-zenvin.jpg" alt="Zenvira Logo" width="200"/>
</p>

<h1 align="center">Zenvira</h1>

<p align="center">
  <strong>A Modern Full-Stack Pharmaceutical E-Commerce Platform</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#documentation">Documentation</a> •
  <a href="#contributing">Contributing</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.1.6-black?style=for-the-badge&logo=next.js" alt="Next.js"/>
  <img src="https://img.shields.io/badge/React-19.2.3-61DAFB?style=for-the-badge&logo=react" alt="React"/>
  <img src="https://img.shields.io/badge/Express-5.2.1-000000?style=for-the-badge&logo=express" alt="Express"/>
  <img src="https://img.shields.io/badge/Prisma-7.3.0-2D3748?style=for-the-badge&logo=prisma" alt="Prisma"/>
  <img src="https://img.shields.io/badge/PostgreSQL-15+-336791?style=for-the-badge&logo=postgresql" alt="PostgreSQL"/>
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript"/>
</p>

---

## Overview

**Zenvira** is a comprehensive, production-ready pharmaceutical e-commerce platform that connects customers with verified medication sellers. Built with modern technologies and best practices, it provides a seamless shopping experience with robust seller management, order processing, and administrative controls.

### Why Zenvira?

- **Multi-vendor Marketplace**: Support for multiple sellers with individual dashboards
- **Role-based Access Control**: Customer, Seller, and Admin roles with specific permissions
- **Real-time Stock Management**: Automatic inventory tracking and prevention of overselling
- **Secure Authentication**: Email verification, password reset, and session management
- **Production Ready**: Optimized for deployment on Vercel with serverless architecture

---

## Features

### For Customers

- Browse and search medicines with advanced filtering
- Add products to cart and wishlist
- Place orders with multiple payment options
- Track order status in real-time
- Write and read product reviews
- Email-based account verification

### For Sellers

- Apply to become a verified seller
- Manage product listings (CRUD operations)
- View and process orders
- Access sales analytics and statistics
- Track customer reviews

### For Administrators

- Review and approve seller applications
- Manage all users, products, and orders
- Platform-wide analytics dashboard
- Category management
- Full access control

---

## Tech Stack

### Frontend (zenvira-client)

| Technology  | Version | Purpose                              |
| ----------- | ------- | ------------------------------------ |
| Next.js     | 16.1.6  | React meta-framework with App Router |
| React       | 19.2.3  | UI library                           |
| TypeScript  | 5.x     | Type safety                          |
| TailwindCSS | 4.x     | Utility-first CSS                    |
| shadcn/ui   | 3.8.0   | Component library                    |
| Radix UI    | 1.4.3   | Accessible UI primitives             |
| Better Auth | 1.4.18  | Authentication client                |

### Backend (server)

| Technology  | Version | Purpose               |
| ----------- | ------- | --------------------- |
| Express.js  | 5.2.1   | Web framework         |
| Prisma      | 7.3.0   | ORM with PostgreSQL   |
| PostgreSQL  | 15+     | Primary database      |
| Better Auth | 1.4.18  | Authentication server |
| Nodemailer  | 7.0.13  | Email services        |
| bcrypt      | 6.0.0   | Password hashing      |

---

## Project Structure

```
Zenvira/
├── zenvira-client/          # Next.js frontend application
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   ├── components/      # Reusable React components
│   │   ├── context/         # React Context providers
│   │   ├── lib/             # Utilities and configurations
│   │   └── data/            # Static data
│   └── public/              # Static assets
│
├── server/                  # Express.js backend API
│   ├── src/
│   │   ├── routes/          # API route handlers
│   │   ├── middleware/      # Authentication middleware
│   │   └── lib/             # Prisma client and auth config
│   ├── prisma/              # Database schema and migrations
│   └── api/                 # Vercel serverless functions
│
├── docs/                    # Documentation
└── README.md                # This file
```

---

## Getting Started

### Prerequisites

- **Node.js** >= 20.0.0
- **npm** or **yarn** or **pnpm**
- **PostgreSQL** >= 15
- **Git**

### Environment Setup

#### 1. Clone the Repository

```bash
git clone https://github.com/abnahid/Zenvira.git
cd Zenvira
```

#### 2. Backend Setup (Server)

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

Configure your `.env` file:

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

```bash
# Run database migrations
npm run db:migrate

# Seed database (optional)
npx prisma db seed

# Start development server
npm run dev
```

The API server will be running at `http://localhost:5000`

#### 3. Frontend Setup (Client)

```bash
# Navigate to client directory (from root)
cd zenvira-client

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
```

Configure your `.env.local` file:

```env
NEXT_PUBLIC_API_BASE_URL="http://localhost:5000"
```

```bash
# Start development server
npm run dev
```

The client will be running at `http://localhost:3000`

---

## API Documentation

### Base URL

- **Development**: `http://localhost:5000/api`
- **Production**: `https://your-domain.vercel.app/api`

### Authentication Endpoints

| Method | Endpoint                  | Description         |
| ------ | ------------------------- | ------------------- |
| POST   | `/api/auth/sign-up/email` | Register new user   |
| POST   | `/api/auth/sign-in/email` | Login user          |
| POST   | `/api/auth/sign-out`      | Logout user         |
| GET    | `/api/auth/session`       | Get current session |

### Medicine Endpoints

| Method | Endpoint               | Description                      |
| ------ | ---------------------- | -------------------------------- |
| GET    | `/api/medicines`       | Get all medicines (with filters) |
| GET    | `/api/medicines/:slug` | Get medicine by slug             |
| POST   | `/api/medicines`       | Create medicine (seller/admin)   |
| PUT    | `/api/medicines/:id`   | Update medicine                  |
| DELETE | `/api/medicines/:id`   | Delete medicine                  |

### Order Endpoints

| Method | Endpoint                 | Description         |
| ------ | ------------------------ | ------------------- |
| GET    | `/api/orders`            | Get user's orders   |
| POST   | `/api/orders`            | Create new order    |
| PUT    | `/api/orders/:id/status` | Update order status |
| DELETE | `/api/orders/:id`        | Cancel order        |

For complete API documentation, see [docs/api-contract.md](docs/api-contract.md)

---

## Deployment

### Deploying to Vercel

#### Backend

```bash
cd server
vercel --prod
```

Required environment variables in Vercel:

- `DATABASE_URL` (with `?sslmode=require`)
- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_URL`
- `TRUSTED_ORIGIN`
- `SMTP_USER`
- `SMTP_PASS`

#### Frontend

```bash
cd zenvira-client
vercel --prod
```

Required environment variables:

- `NEXT_PUBLIC_API_BASE_URL`

---

## Database Schema

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│    User     │────<│   Order     │────<│  OrderItem  │
└─────────────┘     └─────────────┘     └─────────────┘
      │                                        │
      │ 1:N                                    │ N:1
      ▼                                        ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Review    │     │  Category   │────<│  Medicine   │
└─────────────┘     └─────────────┘     └─────────────┘
      │                                        │
      └────────────────────────────────────────┘
                         N:1
```

---

## Scripts

### Server Scripts

| Script               | Description                              |
| -------------------- | ---------------------------------------- |
| `npm run dev`        | Start development server with hot reload |
| `npm run build`      | Build for production                     |
| `npm start`          | Start production server                  |
| `npm run db:migrate` | Run database migrations                  |
| `npm run db:push`    | Push schema changes                      |
| `npm run db:studio`  | Open Prisma Studio                       |

### Client Scripts

| Script          | Description              |
| --------------- | ------------------------ |
| `npm run dev`   | Start development server |
| `npm run build` | Build for production     |
| `npm start`     | Start production server  |
| `npm run lint`  | Run ESLint               |

---

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## Security

For security vulnerabilities, please see our [Security Policy](SECURITY.md).

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Author

<p align="center">
  <img src="https://avatars.githubusercontent.com/abnahid" alt="abnahid" width="100" style="border-radius: 50%"/>
</p>

<p align="center">
  <strong>Abdul Jabbar Al Nahid</strong><br/>
  Student of Level-6<br/>
  <a href="https://abnahid.com">abnahid.com</a>
</p>

<p align="center">
  <a href="https://github.com/abnahid">
    <img src="https://img.shields.io/badge/GitHub-abnahid-181717?style=for-the-badge&logo=github" alt="GitHub"/>
  </a>
  <a href="https://linkedin.com/in/ajnahid">
    <img src="https://img.shields.io/badge/LinkedIn-abnahid-0A66C2?style=for-the-badge&logo=linkedin" alt="LinkedIn"/>
  </a>
  <a href="https://abnahid.com">
    <img src="https://img.shields.io/badge/Website-abnahid.com-FF5722?style=for-the-badge&logo=google-chrome&logoColor=white" alt="Website"/>
  </a>
</p>

---

## Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Better Auth](https://better-auth.com/) - Authentication library
- [Vercel](https://vercel.com/) - Deployment platform

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/abnahid">abnahid</a>
</p>

<p align="center">
  <a href="#zenvira">Back to top ↑</a>
</p>
