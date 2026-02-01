# Zenvira Client

The frontend application for Zenvira - a modern pharmaceutical e-commerce platform built with Next.js 16 and React 19.

## Tech Stack

- **Next.js** 16.1.6 - React meta-framework with App Router
- **React** 19.2.3 - UI library
- **TypeScript** 5.x - Type safety
- **TailwindCSS** 4.x - Utility-first CSS
- **shadcn/ui** - Component library
- **Radix UI** - Accessible UI primitives
- **Better Auth** - Authentication client

## Features

- Server-side rendering with Next.js App Router
- Role-based dashboards (Customer, Seller, Admin)
- Shopping cart with localStorage persistence
- Wishlist functionality
- Product search and filtering
- Order management
- Email verification flow
- Responsive design

## Getting Started

### Prerequisites

- Node.js >= 20.0.0
- npm or yarn or pnpm

### Installation

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
```

### Environment Variables

```env
NEXT_PUBLIC_API_BASE_URL="http://localhost:5000"
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── (auth)/         # Authentication pages
│   ├── dashboard/      # Dashboard pages
│   ├── shops/          # Product pages
│   └── ...
├── components/          # React components
│   ├── auth/           # Auth components
│   ├── dashboard/      # Dashboard components
│   ├── home/           # Homepage sections
│   ├── shop/           # Shop components
│   └── ui/             # shadcn/ui components
├── context/            # React Context providers
│   ├── AuthContext.tsx
│   ├── CartContext.tsx
│   ├── WishlistContext.tsx
│   └── ToastContext.tsx
├── lib/                # Utilities
│   ├── auth-client.ts  # Better Auth client
│   └── utils.ts        # Helper functions
└── data/               # Static data
```

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

## Deployment

### Vercel (Recommended)

```bash
vercel --prod
```

Set `NEXT_PUBLIC_API_BASE_URL` in Vercel environment variables.

## Author

**Abdul Jabbar Al Nahid** - [abnahid.com](https://abnahid.com)

## License

MIT License - see [LICENSE](../LICENSE)
