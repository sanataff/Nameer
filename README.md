# Nameer

Nameer is a React and TypeScript web application built with Vite. The current interface is an Arabic, right-to-left styled with Tailwind CSS and shadcn/ui components.


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
| `npm run dev` | Start the Vite development server with hot reload |
| `npm run lint` | Check the project with ESLint |
| `npm run build` | Run the TypeScript project build and create a production build |
| `npm run preview` | Preview the production build locally (run `npm run build` first) |

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
  lib/           # Shared utilities
  App.tsx        # Main application UI
  App.css        # Application-specific styles
  index.css      # Global styles and design tokens
  main.tsx       # React entry point
index.html       # HTML entry point; Arabic language and RTL direction
```

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

