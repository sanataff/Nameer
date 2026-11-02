# AI Usage Log

## Project configuration

| Field | Value |
|-------|-------|
| Team number | 1 |
| Section | F11 |
| Current phase | 4 – Front-End |
| Member | Sana Ammar Taffour |
| Tool/model | OpenCode (DeepSeek V4.1 Flash Free) |

## Phase 4 – Front-End

| ID  | Member | Tool (model) | Purpose | Files affected |
|-----|--------|--------------|---------|----------------|
| C01 | Sana Ammar Taffour | Copilot SDK in VS Code (model unknown) | Set up required AI-use documentation and local evidence folders | `.gitignore`, `AGENTS.md`, `AI_USAGE.md`, `ai-evidence/conversations/`, `ai-evidence/artifacts/` |
| C03 | Sana Ammar Taffour | OpenCode (DeepSeek V4.1 Flash Free) | Build the supplier product catalogue page (listing, search/filters, stock states, availability toggle, add/edit side sheet, mock API) and wire it into the supplier workspace | `src/App.tsx`, `src/App.css`, `src/api/products.ts`, `src/pages/supplier/products/ProductsPage.tsx`, `src/pages/supplier/products/ProductSheet.tsx`, `src/pages/supplier/products/products.css`, `src/components/ui/switch.tsx`, `src/components/ui/dropdown-menu.tsx`, `src/components/ui/textarea.tsx`, `src/components/ui/alert-dialog.tsx`, `src/locales/en/translation.json`, `src/locales/ar/translation.json` |

| C02 | Sana Ammar Taffour | Copilot SDK in VS Code (model unknown) | Initialize React Router Framework Mode in SPA mode and document routing setup | `.gitignore`, `package.json`, `package-lock.json`, `vite.config.ts`, `react-router.config.ts`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `eslint.config.js`, `app/root.tsx`, `app/routes.ts`, `app/routes/home.tsx`, `README.md`, `AI_USAGE.md`, `index.html`, `src/main.tsx`, `routes.ts` |
| C04 | Sana Ammar Taffour | Copilot SDK in VS Code (model unknown) | Replace in-component screen switching with React Router routes for auth and supplier workspace, and add the chart dependency required by the existing chart component | `src/App.tsx`, `src/App.css`, `app/routes.ts`, `app/routes/home.tsx`, `app/routes/auth/login.tsx`, `app/routes/auth/register-supplier.tsx`, `app/routes/auth/register-cafe.tsx`, `app/routes/supplier/dashboard.tsx`, `app/routes/supplier/products.tsx`, `app/routes/design-system.tsx`, `package.json`, `package-lock.json`, `README.md`, `AI_USAGE.md` |
| C05 | Sana Ammar Taffour | Copilot SDK in VS Code (model unknown) | Split the monolithic app into focused auth and supplier page components with shared shell and language controls | `src/App.tsx`, `src/components/AppShell.tsx`, `src/components/LanguageSwitcher.tsx`, `src/hooks/use-page-title.ts`, `src/pages/auth/RoleSelectionPage.tsx`, `src/pages/auth/LoginPage.tsx`, `src/pages/auth/RegistrationPage.tsx`, `src/pages/supplier/SupplierWorkspacePage.tsx`, `app/root.tsx`, `app/routes/home.tsx`, `app/routes/auth/login.tsx`, `app/routes/auth/register-supplier.tsx`, `app/routes/auth/register-cafe.tsx`, `app/routes/supplier/dashboard.tsx`, `app/routes/supplier/products.tsx`, `AI_USAGE.md`, `README.md` |
| C06 | Sana Ammar Taffour | Copilot SDK in VS Code (model unknown) | Add a bilingual supplier orders page with order details, status filters, accept/decline/completion actions, and persisted mock data | `src/api/orders.ts`, `src/pages/supplier/orders/OrdersPage.tsx`, `src/pages/supplier/orders/orders.css`, `src/pages/supplier/SupplierSidebar.tsx`, `src/pages/supplier/SupplierWorkspacePage.tsx`, `app/routes/supplier/orders.tsx`, `app/routes.ts`, `src/locales/en/translation.json`, `src/locales/ar/translation.json`, `AI_USAGE.md` |

| C07 | Sana Ammar Taffour | Copilot SDK in VS Code (model unknown) | Improve the supplier business-request sheet spacing and css and add translations | `src/pages/supplier/SupplierWorkspacePage.tsx`, `src/App.css`, `src/locales/en/translation.json`, `src/locales/ar/translation.json`, `AI_USAGE.md` |

| C08 | Sana Ammar Taffour | Copilot SDK in VS Code (model unknown) | Add a bilingual supplier notifications page and wire it into supplier routing and navigation | `app/routes.ts`, `app/routes/supplier/notifications.tsx`, `src/pages/supplier/notifications/NotificationsPage.tsx`, `src/pages/supplier/SupplierWorkspacePage.tsx`, `src/pages/supplier/SuplierHeader.tsx`, `src/pages/supplier/SupplierSidebar.tsx`, `src/App.css`, `src/locales/en/translation.json`, `src/locales/ar/translation.json`, `AI_USAGE.md` |
| C09 | Sana Ammar Taffour | Copilot SDK in VS Code (model unknown) | Add a bilingual supplier chat UI with selectable mock conversations and client-side-only message composition | `app/routes.ts`, `app/routes/supplier/chat.tsx`, `src/pages/supplier/chat/ChatPage.tsx`, `src/pages/supplier/SupplierWorkspacePage.tsx`, `src/pages/supplier/SupplierSidebar.tsx`, `src/pages/supplier/SuplierHeader.tsx`, `src/components/ui/message-scroller.tsx`, `src/components/ui/message.tsx`, `src/components/ui/bubble.tsx`, `src/components/ui/marker.tsx`, `src/App.css`, `src/locales/en/translation.json`, `src/locales/ar/translation.json`, `package.json`, `package-lock.json`, `AI_USAGE.md` |
| C10 | Sana Ammar | Copilot (model unknown) | Explain how AppShell, the React Router app entry, and the legacy App component fit together | `APP_SHELL_AND_APP_EXPLAINED.md`, `AI_USAGE.md` |

No AI used: Not reported
