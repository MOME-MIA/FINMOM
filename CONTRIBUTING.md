# Contributing to Momentum OS

First off, thanks for taking the time to contribute! Momentum OS relies on absolute quality, highly secure architecture, and aesthetic precision.

## Development Workflow
1. Fork the repo and branch off from `DEV`.
2. Ensure you have Node `20.x` or higher installed.
3. Install dependencies using: `npm ci` (preferred) or `npm install`.
4. Create an `.env.local` file with the InsForge credentials.
5. Run the development server: `npm run dev`.

## Code Standard (The Momentum Way)
- **UI/UX Aesthetics**: "Total Black" theme, minimal friction, highly immersive details, Glassmorphism, and Apple-Pro inspiration.
- **Copywriting Strategy**: Treat users as guests to an exclusive wealth vault. M.I.A. is not a chatbot, but an autonomous financial consciousness. High-level language is strictly required.
- **Security & Privacy**: AES-256 grade components. Middleware MUST strictly protect non-public routes (e.g., `/dashboard`, `/admin`).
- **Code Optimization**: Prevent unnecessary repaints, implement efficient React hooks, and guarantee 100% Lighthouse scores wherever possible.

## Pull Requests
1. All changes must be pushed to a branch stemming from `DEV`.
2. Fill out the **Pull Request Template** completely.
3. Link any related issues to your PR.
4. Ensure the GitHub Actions `Build & Lint` checks pass successfully.
5. Request a review from the core repository maintainers.
