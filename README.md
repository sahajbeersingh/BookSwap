# BookSwap 📚

A peer-to-peer book marketplace where readers can list, discover, and trade books with a trusted community.

## Features

- **Browse & Discover** — Explore listings with full book details and pricing
- **List Books** — Sell or trade books from your personal collection
- **Smart Search** — Find books by title, author, or ISBN
- **Wishlist** — Save books you're looking for
- **Collection Tracker** — Manage the books you own
- **Secure Auth** — Profile management powered by Supabase

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React, Vite, Tailwind CSS, React Router, Zustand |
| Backend | Node.js, Express, Supabase |
| Tooling | pnpm, ESLint, Prettier |

## Project Structure

```
bookswap/
├── frontend/   # React application (Vite)
└── backend/    # Express API server
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm — `npm install -g pnpm`
- A [Supabase](https://supabase.com) project with the required tables (see [Database Setup](#database-setup))

### 1. Clone & Install

```bash
git clone https://github.com/your-org/bookswap.git
cd bookswap

pnpm install
pnpm --dir backend install
pnpm --dir frontend install
```

### 2. Configure Environment Variables

**`backend/.env`**
```env
PORT=5000
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

**`frontend/.env`**
```env
VITE_API_BASE_URL=http://localhost:5000
```

### 3. Run the App

Start the backend (runs on port 5000):
```bash
pnpm --dir backend dev
```

Start the frontend (runs on http://localhost:5173):
```bash
pnpm --dir frontend dev
```

The frontend proxies API requests to the backend automatically.

## Database Setup

Your Supabase project must have the following tables:

| Table | Description |
|-------|-------------|
| `books` | Book catalog with title, author, ISBN, etc. |
| `listings` | Active sell/trade listings |
| `profiles` | User profile data |
| `wishlist` | Per-user wishlisted books |
| `collection` | Per-user owned books |

## API Reference

Base URL: `http://localhost:5000`

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/signup` | Register a new user |
| `POST` | `/api/auth/login` | Log in an existing user |
| `GET` | `/api/auth/me` | Get the current user |

### Books
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/books` | List all books |
| `POST` | `/api/books` | Add a new book |
| `GET` | `/api/books/search/title` | Search books by title |

### Listings
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/listing` | Get all listings |
| `POST` | `/api/listing` | Create a new listing |
| `GET` | `/api/listing/:id` | Get a listing by ID |

### Wishlist
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/wishlist` | Get the current user's wishlist |
| `POST` | `/api/wishlist` | Add a book to the wishlist |
| `DELETE` | `/api/wishlist/:bookId` | Remove a book from the wishlist |

### Collection
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/collection` | Get the current user's collection |
| `POST` | `/api/collection` | Add a book to the collection |
| `PUT` | `/api/collection/:id` | Update a collection entry |

## Scripts

```bash
# Frontend
pnpm --dir frontend dev       # Start dev server
pnpm --dir frontend build     # Production build
pnpm --dir frontend lint      # Run ESLint

# Backend
pnpm --dir backend dev        # Start dev server (with hot reload)
pnpm --dir backend start      # Start production server
```

## Known Limitations

- Listings currently use a temporary `seller_id` field — user-to-listing ownership via auth is not yet fully wired up.

## Contributing

Pull requests are welcome! Please ensure linting passes before submitting:

```bash
pnpm --dir frontend lint
```

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/your-feature`)
3. Commit your changes
4. Open a pull request
