# NexStream

A modern, resilient, and highly available video streaming interface built with Next.js (Frontend) and Go (Backend). NexStream employs an intelligent fallback mechanism to fetch data from multiple independent endpoints, ensuring maximum uptime without relying on a single point of failure.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Go Version](https://img.shields.io/badge/Go-1.21+-00ADD8?logo=go)](https://golang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-000000?logo=next.js)](https://nextjs.org/)

## Architecture Overview

NexStream uses a decoupled architecture tailored for deployment flexibility (e.g., Vercel for Frontend and Railway/Render for the Go Backend, proxied behind Cloudflare).

- **Frontend (Next.js):** Handles UI rendering, search interactions, video playback via native iframe embedding, and a simulated real-time chat interface.
- **Backend (Go):** Acts as a highly concurrent proxy and fallback engine. It queries multiple public Invidious API instances simultaneously or sequentially. If all upstream endpoints fail, it gracefully falls back to local mock data to prevent application downtime.

## Directory Structure

```text
nexstream/
├── frontend/          # Next.js 14 Application (React, TailwindCSS)
│   ├── app/           # App router files (page.tsx, layout.tsx, etc.)
│   ├── next.config.js # Proxy configuration to route /api to the Go backend
│   └── package.json
└── backend/           # Go Serverless/Microservice API
    ├── main.go        # Fallback logic and HTTP server
    └── go.mod
```

## Features

- **Smart API Fallback:** The Go backend tests multiple data sources on every request.
- **Zero API Key Requirement:** Utilizes reverse-engineered public APIs (Invidious).
- **Responsive UI:** Dark-mode tailored interface mimicking premium streaming platforms.
- **Simulated Live Chat:** Built-in React state loop to simulate real-time chat interactions for demonstration purposes.

## Local Development Setup

### 1. Running the Backend (Go)

Navigate to the backend directory and run the Go server. It will start on port 8080.

```bash
cd backend
go run main.go
```

### 2. Running the Frontend (Next.js)

Open a new terminal, navigate to the frontend directory, install dependencies, and start the development server.

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:3000`. The `next.config.js` is configured to proxy all `/api/*` requests to `http://127.0.0.1:8080`.

## Production Deployment Strategy (Vercel + Cloudflare)

To deploy this decoupled architecture:

1. **Backend:** Deploy the `backend` directory to a Go-supported platform like Railway, Render, or Fly.io. Ensure the server binds to `0.0.0.0` and the port provided by the environment variable.
2. **Frontend:** Deploy the `frontend` directory to Vercel. 
3. **Environment Variables:** Update the rewrite rules in Vercel or `next.config.js` to point `/api/:path*` to your production backend URL.
4. **Cloudflare:** Point your custom domain to Vercel's nameservers via Cloudflare to leverage Edge caching, DNS masking, and DDoS protection.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---
Made by XySpace