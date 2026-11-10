# Nameer

Nameer is a React and TypeScript web application using React Router Framework Mode in SPA mode, Vite, Tailwind CSS, and shadcn/ui components. The interface supports Arabic (RTL) and English (LTR).


## Requirements

- Git
- Node.js (use a current LTS release)
- npm (included with Node.js)

## Get started

Clone the repository and install the exact dependency versions from the lockfile:

```bash
git clone https://github.com/sanataff/Nameer.git
cd Nameer
npm ci
```

Start the local development server:

```bash
npm run dev
```

Vite prints the local URL in the terminal (usually `http://localhost:5173`).

## Available commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the React Router development server with hot reload |
| `npm run lint` | Check the project with ESLint |
| `npm run typecheck` | Generate route types and run the TypeScript project build |
| `npm run build` | Type-check and create the React Router production build |
| `npm run preview` | Preview the client-side production build locally (run `npm run build` first) |

Before submitting a change, run:

```bash
npm run lint
npm run build
```

## Project structure

```text
src/
  components/
    ui/          # shadcn/ui components used by the app
    AppShell.tsx  # Shared page shell and language switch
  lib/           # Shared utilities
  pages/
    auth/        # Role selection, login, and registration screens
    supplier/    # Supplier workspace screens
  App.css        # Shared application page styles
  index.css      # Global styles and design tokens
app/
  root.tsx       # HTML document shell and direction provider
  routes.ts      # React Router route configuration
  routes/
    home.tsx     # Home route
    auth/        # Login and registration routes
    supplier/    # Supplier dashboard and product routes
react-router.config.ts
vite.config.ts
```

Routes are configured in `app/routes.ts`. Current routes are `/` (account type selection), `/login`, `/admin/login` (administrator sign-in UI; authentication is not connected), `/admin/users` (administrator user management with browser-local demo data), `/admin/store-verification` (supplier and café application review), `/admin/customer-service` (customer request list), `/admin/customer-service/:requestId` (a unique detail page for each request), `/register/supplier`, `/register/cafe`, `/supplier/dashboard`, and `/supplier/products`. Approvals, rejections, user-management changes, and customer-request statuses are stored in browser-local demo records. The latest customer-request status is visible in user management. Add a route module under `app/routes/` and register its URL in `app/routes.ts` when adding a page. SPA mode keeps language detection in the browser and serves the built client app for all routes.

## Working with shadcn/ui

This project uses shadcn/ui with Tailwind CSS v4 and the `@` alias for `src`. Add only the components you need:

```bash
npx shadcn@latest add button input
```

Use semantic theme classes such as `bg-primary` and `text-foreground` so components follow the shared theme. The primary brand color is configured in `src/index.css`.

## Contributing

1. Update your local `main` branch before starting work:

   ```bash
   git switch main
   git pull
   ```

2. Create a branch for your change:

   ```bash
   git switch -c feature/short-description
   ```

3. Make focused changes that match the existing React, TypeScript, and shadcn/ui patterns.
4. Run `npm run lint` and `npm run build`.
5. Commit your changes with a clear message and push your branch:

   ```bash
   git add <changed-files>
   git commit -m "Describe the change"
   git push -u origin feature/short-description
   ```

6. Open a pull request against `main`. Include a concise summary, screenshots for UI changes, and the checks you ran.
