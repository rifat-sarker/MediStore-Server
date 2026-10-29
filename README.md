# 🏥 MediStore Server — Enterprise REST API & Pharmacy Backend Engine

[![Node.js](https://img.shields.io/badge/Node.js-20.x-green?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.21-lightgrey?style=for-the-badge&logo=express)](https://expressjs.com/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-7.8-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?style=for-the-badge&logo=postgresql)](https://neon.tech/)
[![Redis](https://img.shields.io/badge/Upstash_Redis-Serverless-DC382D?style=for-the-badge&logo=redis)](https://upstash.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Serverless-white?style=for-the-badge&logo=vercel)](https://medistore-server-chi.vercel.app)

> **MediStore Server** is a scalable, modular RESTful API engine powering the MediStore healthcare and e-pharmacy platform. Built with TypeScript, Express, Prisma ORM, Neon PostgreSQL, Upstash Serverless Redis, and SSLCommerz payment gateway.

🌐 **Production API URL:** [https://medistore-server-chi.vercel.app](https://medistore-server-chi.vercel.app)  
🖥️ **Frontend Repository:** [MediStore-Client](https://github.com/rifat-sarker/MediStore-Client)

---

## ⚡ Key Highlights & Architecture

- **Clean Modular Architecture:** Every feature has independent Routes, Controllers, Services, Interfaces, and Zod Validation schemas.
- **Serverless-Optimized Redis:** Powered by `@upstash/redis` (REST over HTTPS Port 443) for zero-timeout catalog caching, rate-limiting, and OTP handling across ephemeral serverless containers.
- **High-Performance Database:** Neon Serverless PostgreSQL with Prisma connection pooler.
- **Resilient Email Dispatch:** Direct Google SMTP on Port 465 (SSL) for 100% reliable 6-digit OTP delivery for registration and password resets.
- **SSLCommerz Payment Gateway:** Complete payment lifecycle with dynamic origin callback handling (`success`, `fail`, `cancel`).
- **Media Asset Storage:** Cloudinary integration with `multer-storage-cloudinary` for prescription and medicine image uploads.

---

## 🛠️ Tech Stack

- **Runtime:** Node.js & Bun
- **Framework:** Express.js
- **Database ORM:** Prisma ORM with `@prisma/adapter-pg`
- **Database:** PostgreSQL (Neon Serverless)
- **Caching & OTP Store:** Upstash Redis (HTTP REST API)
- **Validation:** Zod
- **Authentication:** JWT (JSON Web Tokens) with HttpOnly refresh cookies & bcrypt password hashing
- **Mailing:** Nodemailer (Google SMTP Port 465 SSL)
- **Payment Processing:** SSLCommerz LTS SDK
- **Deployment:** Vercel Serverless Functions

---

## 📡 API Reference Overview

Base URL: `https://medistore-server-chi.vercel.app/api/v1`

### 🔑 Authentication (`/auth`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/auth/register` | Initiate registration and dispatch 6-digit OTP | Public |
| `POST` | `/auth/verify-otp` | Verify OTP, create account & return auth tokens | Public |
| `POST` | `/auth/resend-otp` | Resend new OTP to email | Public |
| `POST` | `/auth/login` | Authenticate with credentials | Public |
| `POST` | `/auth/google` | Google OAuth one-click authentication | Public |
| `POST` | `/auth/refresh-token`| Renew access token | Public |
| `POST` | `/auth/forgot-password`| Send password reset OTP | Public |
| `POST` | `/auth/reset-password` | Set new password with OTP | Public |

### 💊 Medicines & Inventory (`/medicines`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/medicines` | Get all medicines (Cached with Redis, pagination & search) | Public |
| `GET` | `/medicines/:id` | Get medicine details by ID | Public |
| `POST` | `/medicines` | Create new medicine | Admin |
| `PATCH` | `/medicines/:id` | Update medicine information / stock | Admin |
| `DELETE`| `/medicines/:id` | Remove medicine | Admin |

### 📦 Orders & Payments (`/orders`, `/payment`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/orders` | Place new order & initiate SSLCommerz payment | Customer |
| `GET` | `/orders/my-orders` | Get user order history | Customer |
| `GET` | `/orders/get-orders` | Get all orders with filtering | Admin / Rider |
| `PATCH`| `/orders/:id/status` | Update dispatch status (`PROCESSING`, `SHIPPED`, etc.) | Admin / Rider |
| `POST` | `/payment/success` | SSLCommerz success IPN & redirect handler | Public |
| `POST` | `/payment/fail` | SSLCommerz failure IPN & redirect handler | Public |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** >= 18.0.0 or **Bun**
- **PostgreSQL** database (e.g. [Neon](https://neon.tech))
- **Upstash Redis** database ([Upstash](https://upstash.com))

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/rifat-sarker/MediStore-Server.git
   cd MediStore-Server
   ```

2. **Install dependencies:**
   ```bash
   bun install
   # or
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root folder:
   ```env
   NODE_ENV="development"
   PORT="5001"
   DATABASE_URL="postgresql://user:password@host/neondb?sslmode=require"

   BCRYPT_SALT_ROUNDS="10"
   JWT_ACCESS_SECRET="your_jwt_access_secret"
   JWT_ACCESS_EXPIRES_IN="2d"
   JWT_REFRESH_SECRET="your_jwt_refresh_secret"
   JWT_REFRESH_EXPIRES_IN="7d"

   CLOUDINARRY_CLOUD_NAME="your_cloud_name"
   CLOUDINARRY_API_KEY="your_api_key"
   CLOUDINARRY_API_SECRET="your_api_secret"

   # SMTP Configuration (Google App Password)
   SMTP_HOST="smtp.gmail.com"
   SMTP_PORT="465"
   SMTP_EMAIL="your_email@gmail.com"
   SMTP_PASS="your_16_digit_app_password"

   # SSLCommerz Sandbox
   SSL_STORE_ID="your_store_id"
   SSL_STORE_PASSWD="your_store_passwd"
   SSL_IS_LIVE="false"

   # Upstash Serverless Redis
   UPSTASH_REDIS_REST_URL="https://your-upstash-redis.upstash.io"
   UPSTASH_REDIS_REST_TOKEN="your_upstash_token"

   # Frontend URLs
   FRONTEND_URL="https://medistore.rifatsarker.com"
   BACKEND_URL="https://medistore-server-chi.vercel.app"
   ```

4. **Generate Prisma Client:**
   ```bash
   bun run postinstall
   # or npx prisma generate
   ```

5. **Run the server:**
   ```bash
   bun run dev
   # or npm run dev
   ```

---

## 📁 Project Structure

```
src/
├── app/
│   ├── config/           # Environment and third-party configs (Multer, Cloudinary, etc.)
│   ├── errors/           # Custom error handler classes (AppError, ZodError)
│   ├── middlewares/      # Auth, Request Validation, Global Error, Not Found
│   ├── modules/          # Business logic domains
│   │   ├── auth/         # Registration, OTP, Login, OAuth, Passwords
│   │   ├── medicine/     # Medicines catalog & Redis cache invalidation
│   │   ├── order/        # Transactions & Order placement
│   │   ├── payment/      # SSLCommerz IPN & callback controllers
│   │   ├── category/     # Medicine classifications
│   │   ├── user/         # Profile management
│   │   └── rider/        # Delivery assignment
│   ├── routes/           # Central API Router
│   └── utils/            # Prisma, Redis client, Email sender, Helpers
├── scripts/              # Seed scripts (Admin, dummy data)
├── app.ts                # Express application bootstrap & middleware pipeline
└── server.ts             # Server entry point & Serverless export
```

---

## 👨‍💻 Author

**Rifat Sarker**
- **Portfolio:** [rifatsarker.com](https://www.rifatsarker.com)
- **GitHub:** [@rifat-sarker](https://github.com/rifat-sarker)
- **LinkedIn:** [linkedin.com/in/rifatswd](https://linkedin.com/in/rifatswd)
- **Email:** [rifatswd@gmail.com](mailto:rifatswd@gmail.com)

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).
