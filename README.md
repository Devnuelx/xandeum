# Xandeum pNode Analytics Dashboard

Production-grade analytics dashboard for tracking Xandeum pNodes with hybrid live/mock data strategy.

## Features

- **Live RPC Integration**: Fetches real pNode data from `https://rpc.xandeum.network` using `getClusterNodes`
- **Professional Fallback**: Automatically uses derived mock data when RPC is unavailable
- **Real-time Updates**: Dashboard refreshes every 10 seconds
- **Premium UI**: Dark mode with glassmorphism effects and smooth animations

## Architecture

### Backend
- `/api/nodes` - API route with hybrid data strategy
- `pnode-service.ts` - RPC fetching and mock generation
- `types.ts` - Normalized data schema

### Frontend
- MetricsGrid - Network health overview
- NodesTable - Detailed node inventory

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000)

## Data Strategy

The dashboard uses a hybrid approach:

1. **Primary**: Live data from Xandeum pRPC (`getClusterNodes`)
2. **Fallback**: Professional mock data when RPC is unavailable

All derived metrics (STOINC, performance scores) are clearly documented as simulated.

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- CSS Modules (Vanilla CSS)
- No external UI libraries
