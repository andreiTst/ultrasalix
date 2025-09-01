# Repository Guidelines

## Project Structure & Module Organization
- `src/`: App code. Entry `main.jsx`, root `App.jsx`.
- `src/components/`: Reusable UI (PascalCase, e.g., `Header.jsx`).
- `src/pages/`: Route-level views (PascalCase, e.g., `Home.jsx`).
- `src/assets/`: Images and static imports.
- `public/`: Static files served as-is (e.g., `vite.svg`).
- `eslint.config.js`, `vite.config.js`: Linting and build config.
- Output builds to `dist/`.

## Build, Test, and Development Commands
- `npm install`: Install dependencies.
- `npm run dev`: Start Vite dev server with HMR.
- `npm run build`: Production build to `dist/`.
- `npm run preview`: Serve the built app locally.
- `npm run lint`: Run ESLint on the project.

## Coding Style & Naming Conventions
- Use modern ES modules and JSX; prefer functional React components.
- Indentation: 2 spaces; single quotes; trailing commas where valid.
- Components: PascalCase (`Header.jsx`), hooks: `useSomething.js`.
- Files in `src/pages` and `src/components` end with `.jsx`.
- Keep side effects out of renders; rely on hooks.
- Follow ESLint rules; avoid committing formatting-only changes.

## Testing Guidelines
- No test setup yet. If adding tests, prefer Vitest + React Testing Library.
- Place tests alongside files: `Component.test.jsx` or under `src/__tests__/`.
- Aim for critical-path coverage (components, routing, helpers). Target ≥80% if enabled.
- Example (after adding tooling): `npm test` or `vitest run --coverage`.

## Commit & Pull Request Guidelines
- Use Conventional Commits: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`; optional scope (`feat(header): ...`).
- Write imperative, concise subjects (≤72 chars) and meaningful bodies when needed.
- PRs must include: summary, linked issue(s), screenshots for UI changes, and notes on breaking changes.
- Ensure CI checks pass locally: `npm run lint && npm run build`.

## Security & Configuration Tips
- Env vars must start with `VITE_` (e.g., `.env.local`: `VITE_API_URL=https://...`). Never commit secrets.
- Keep `vercel.json` in sync with routing/build output if deploying to Vercel.
- Validate external links and assets live under `public/` or `src/assets/`.
