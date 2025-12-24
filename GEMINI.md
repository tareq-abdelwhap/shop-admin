# GEMINI.md - Project Context for Gemini CLI

This document provides a comprehensive overview of the **Shop Admin** project, designed to give Gemini the necessary context for effective collaboration and code generation.

## Project Overview

**Shop Admin** is a sophisticated, multi-tenant SaaS (Software as a Service) application built with the Nuxt 4 framework (using Vue 3). It serves as an administration panel for shop owners to manage their business operations.

### Key Technologies & Architecture

*   **Frontend:** Nuxt 4 (Vue 3), configured as a client-side rendered Single Page Application (SPA).
*   **Backend:** Supabase is used for the database, user authentication, and executing complex business logic via PostgreSQL functions (RPC).
*   **State Management:** Pinia is used for centralized state management, with dedicated stores for authentication, dashboard metrics, and application modules.
*   **UI/Styling:** The user interface is built with the PrimeVue component library, themed with PrimeUI's 'Aura' theme, and styled with TailwindCSS. It supports both light and dark modes, with dark mode as the default.
*   **Payments:** Stripe is integrated for subscription billing, with evidence of multiple pricing tiers (Basic, Pro). The configuration also suggests a potential integration with Amazon Payment Services (APS).
*   **Internationalization (i18n):** The application is fully internationalized, supporting English (LTR) and Arabic (RTL), with Arabic as the default language.
*   **Modular Features:** The application has a modular architecture. Features (like 'inventory' management) can be enabled or disabled on a per-shop basis, and the UI adapts accordingly.

### Core Functionality

*   **Multi-tenant Authentication:** Users sign up and a new "shop" is created for them in the backend. Users have roles (e.g., 'owner'), and their access is tied to their specific shop.
*   **Dashboard:** A central dashboard displays key performance indicators (KPIs) like revenue, profit, and expenses, along with charts for daily sales and performance overviews.
*   **Billing & Subscriptions:** Users can manage their subscriptions through a Stripe integration. Middleware protects routes based on subscription status.
*   **Invoicing:** The presence of a printing library suggests functionality for generating and printing invoices.

## Building and Running

The project uses `pnpm` as the primary package manager (inferred from `pnpm-lock.yaml`), but standard `npm`, `yarn`, or `bun` commands are also supported.

*   **Install Dependencies:**
    ```bash
    pnpm install
    ```

*   **Run Development Server:**
    Starts the development server on `http://localhost:3000`.
    ```bash
    pnpm run dev
    ```

*   **Build for Production:**
    Compiles and bundles the application for deployment.
    ```bash
    pnpm run build
    ```

*   **Preview Production Build:**
    Starts a local server to preview the production-ready application.
    ```bash
    pnpm run preview
    ```

*   **Testing:**
    `TODO`: No testing scripts were found in `package.json`. A testing framework (e.g., Vitest) should be set up, and a `test` script should be added.

## Development Conventions

*   **State Management:** All application state should be managed through Pinia stores. Follow the existing pattern of creating separate stores for distinct domains (e.g., `auth.ts`, `dashboard.ts`).
*   **Backend Logic:** Complex business logic that involves multiple database operations should be encapsulated in Supabase RPC functions (PostgreSQL functions) rather than being handled in the client-side code. The `setup_shop_for_new_user` function is a prime example of this pattern.
*   **Environment Variables:** All secret keys and environment-specific configuration must be managed through the `runtimeConfig` in `nuxt.config.ts` and loaded from a `.env` file. Do not hardcode secrets.
*   **Component Library:** Use PrimeVue components for building the UI to maintain consistency.
*   **Internationalization:** All user-facing strings must be added to the locale files in `i18n/locales` and accessed via the `$t()` function. No hardcoded text in components.
*   **Middleware:** Use Nuxt route middleware for handling authentication, authorization, and subscription checks.
