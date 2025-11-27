# Astarus AI Platform

Astarus AI is a marketing site for a memory-augmented AI platform. The project is built with Vite, React, TypeScript, Tailwind CSS, and shadcn/ui components.

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
VITE_API_BASE_URL=https://your-api-url-here.com
VITE_API_MODEL=mistral
```

**Note:** If environment variables are not set, the application will use default values. Make sure to set these for production deployments.

### Development

```bash
npm run dev
```

The development server runs at `http://localhost:5000` by default (configured in `vite.config.ts`).

## Available Scripts

- `npm run dev` – start a local development server with hot reloading
- `npm run build` – create an optimized production build in `dist`
- `npm run preview` – preview the production build locally

## Project Structure

- `src/App.tsx` wires the shared layout, routing, and global styles
- `src/pages/` contains top-level routes such as `Index`, `Technology`, and `Team`
- `src/components/` provides UI sections and reusable elements
- `src/assets/` includes imagery used throughout the site
- `public/` is served statically by Vite at the project root

## Deployment

The project outputs static assets once built. Deploy the contents of the `dist` directory to any static hosting platform (Netlify, Vercel, GitHub Pages, etc.).

## Contributing

1. Create a feature branch.
2. Make your changes with accompanying tests or documentation updates when appropriate.
3. Open a pull request summarizing the changes.
