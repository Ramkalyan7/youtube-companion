YouTube Companion Dashboard
This is a Next.js project bootstrapped with create-next-app.

Manage your YouTube videos with ease by updating metadata, managing comments, and keeping notes, all integrated with YouTube Data API and a backend database.

Getting Started
First, run the development server:

bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
Open http://localhost:3000 with your browser to see the app.

You can start editing the page by modifying app/page.tsx. The page auto-updates as you edit the file.

API Endpoints
Notes API
Method	Endpoint	Purpose	Request Body / Query Parameters
GET	/api/notes	Fetch notes of a video	Query: videoId (string, required)
POST	/api/notes	Add note for a video	JSON: { videoId: string, content: string }
Events API
Method	Endpoint	Purpose	Request Body
POST	/api/events	Log user actions & events	JSON: { eventType: string, videoId?: string, commentId?: string, userId?: string, timestamp: string, details?: object }
Database Schema (PostgreSQL + Prisma)
Note Table
Field	Type	Description
id	Int (PK)	Primary key, auto-increment
videoId	String	YouTube video ID
content	Text	Note content
createdAt	DateTime	Auto-created timestamp
updatedAt	DateTime	Auto-updated timestamp
EventLog Table
Field	Type	Description
id	Int (PK)	Primary key, auto-increment
eventType	String	Event type (e.g., comment_added)
videoId	String?	Related YouTube video ID (optional)
commentId	String?	Related comment ID (optional)
userId	String?	User associated with event (optional)
timestamp	DateTime	Event occurrence time
details	JSON?	Additional event data
Learn More
To learn more about Next.js, take a look at the following resources:

Next.js Documentation - learn about Next.js features and APIs.

Learn Next.js - an interactive Next.js tutorial.

YouTube Data API - official YouTube API documentation.

Deploy on Vercel
The easiest way to deploy your Next.js app is to use the Vercel Platform.

See the Next.js deployment documentation for more details.

Environment Variables
DATABASE_URL — PostgreSQL connection string for Prisma

YouTube OAuth credentials if applicable
