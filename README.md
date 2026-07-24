# CoReCo Assignment - MERN Scaffold

This repository contains a minimal MERN stack scaffold with separate `client/` and `server/` folders.

## Structure

- `client/` - React app built with Vite
- `server/` - Node.js + Express API server

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a server env file:
   ```bash
   copy server\.env.example server\.env
   ```
   Then update `MONGODB_URI` with your MongoDB connection string.

3. Start the client and server together:
   ```bash
   npm run dev
   ```

4. Open the client at `http://localhost:5173`.
   The server will run at `http://localhost:4000`.

## Seed Data

To populate example seed data in MongoDB:

```bash
npm run seed:server
```
