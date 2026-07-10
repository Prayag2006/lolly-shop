# Lolly Shop Web Application

A modern, responsive e-commerce web application for NZ's favorite candy store, built using React, Vite, Express, and MongoDB.

## Getting Started

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed (v20+ recommended).

### 2. Environment Setup
Create a `.env` file in the root directory (based on `.env.example` or copy the existing configuration) containing:
* `PORT` (default: 5000)
* `MONGODB_URI` (your MongoDB Atlas connection string)
* API credentials for Firebase, SMTP, Stripe, and NZ Post.

### 3. Installation
Install dependencies in the root directory:
```bash
npm install
```

### 4. Running the Application (Local Development)
To run both the **Frontend** (Vite on port 5173) and the **Backend API Server** (Express on port 5000) concurrently, run:
```bash
npm run dev
```
> [!IMPORTANT]
> **Do not run `npx vite` or `vite` directly.** Always use `npm run dev` in the root folder. Running only the frontend will cause "Server connection error" during interactions like login or checkout since the backend API server will be offline.

---

## Production Deployment

This project is pre-configured for serverless deployment on **Netlify** or **Vercel**:

### 1. Vercel Deployment
The application includes a [vercel.json](file:///c:/Projects/Lolly%20shop/vercel.json) file that maps all backend requests to the serverless entry point at `api/index.js`.
* Link your repository to Vercel.
* Add your environment variables (e.g. `MONGODB_URI`) in the **Vercel Dashboard** under `Project Settings > Environment Variables`.

### 2. Netlify Deployment
The application includes a [netlify.toml](file:///c:/Projects/Lolly%20shop/netlify.toml) file that routes backend API calls to `netlify/functions/api.js`.
* Link your repository to Netlify.
* Add your environment variables in the **Netlify Dashboard** under `Site Configuration > Environment Variables`.

