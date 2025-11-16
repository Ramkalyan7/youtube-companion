# YouTube Companion Dashboard

A **Next.js** project to manage your YouTube videos with ease. Update metadata, manage comments, keep notes, and more — all seamlessly integrated with the **YouTube Data API** and a backend database.

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
# or
yarn
# or
pnpm install
# or
bun install
```

### 2. Run the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

---

## 🗄️ Database Setup (PostgreSQL + Prisma)

### 1. Install & Start PostgreSQL

Make sure you have **PostgreSQL** installed and running on your machine.  
You can download it from [https://www.postgresql.org/download/](https://www.postgresql.org/download/).

Create a new database for the project (example: `youtube_companion`).

```bash
# Example (using psql)
createdb youtube_companion
```

### 2. Configure your `.env`

Set your environment variables in a `.env` file at the project root:

```
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/youtube_companion"
# Add your YouTube OAuth credentials as needed
```

### 3. Run Prisma migrations

Install Prisma CLI if you haven't already:

```bash
npm install -g prisma
```

Push or migrate your schema:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

---

## 📖 API Endpoints

### Notes API

| Method | Endpoint      | Purpose                | Request Body / Query Parameters              |
|--------|--------------|------------------------|----------------------------------------------|
| GET    | `/api/notes` | Fetch notes of a video | Query: `videoId` (string, **required**)      |
| POST   | `/api/notes` | Add note for a video   | JSON: `{ videoId: string, content: string }` |

### Events API

| Method | Endpoint       | Purpose                  | Request Body                                                                                     |
|--------|---------------|--------------------------|--------------------------------------------------------------------------------------------------|
| POST   | `/api/events` | Log user actions/events  | JSON: `{ eventType: string, videoId?: string, commentId?: string, userId?: string, timestamp: string, details?: object }` |

---

## 🗄️ Database Schema (PostgreSQL + Prisma)

### Note Table

| Field     | Type        | Description                   |
|-----------|-------------|-------------------------------|
| id        | Int (PK)    | Primary key, auto-increment   |
| videoId   | String      | YouTube video ID              |
| content   | Text        | Note content                  |
| createdAt | DateTime    | Auto-created timestamp        |
| updatedAt | DateTime    | Auto-updated timestamp        |

### EventLog Table

| Field     | Type        | Description                                   |
|-----------|-------------|-----------------------------------------------|
| id        | Int (PK)    | Primary key, auto-increment                   |
| eventType | String      | Event type (e.g., `comment_added`)            |
| videoId   | String?     | Related YouTube video ID (optional)           |
| commentId | String?     | Related comment ID (optional)                 |
| userId    | String?     | User associated with event (optional)         |
| timestamp | DateTime    | Event occurrence time                         |
| details   | JSON?       | Additional event data                         |

---

## ⚙️ Environment Variables

- `DATABASE_URL` — PostgreSQL connection string for Prisma
- YouTube OAuth credentials (if applicable)
