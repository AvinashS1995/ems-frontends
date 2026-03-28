# EMS Frontend Portal

A modern Angular 18+ single-page HR/EMS dashboard built with Angular Material, CDK, and standalone components for attendance, leave, approvals, payroll, and project collaboration.

![Angular 18.2](https://img.shields.io/badge/angular-18.2.0-red)
![Material 18.2](https://img.shields.io/badge/%40angular%2Fmaterial-18.2.14-blueviolet)
![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![License](https://img.shields.io/badge/license-<LICENSE>-blue)
![Node >=18](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)
![Demo](https://img.shields.io/badge/demo-live-brightgreen)
![API](https://img.shields.io/badge/api-REST-blue)

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation & Setup](#installation--setup)
- [Usage](#usage)
- [Folder Structure](#folder-structure)
- [Demo / Deployment](#demo--deployment)
- [Contributing](#contributing)
- [License](#license)
- [Author / Contact](#author--contact)

## Features

- **Role-aware shell:** Standalone `LayoutComponent` with `Header`/`Sidenav` consumes `CommonService` and dynamically loads role-wise menu metadata from `API_ENDPOINTS.SERVICE_ROLEWISEMENUS`, supporting collapsible, token-secured navigation and logout confirmation.
- **Secure authentication flows:** Login with remember-me, global JWT handling (via `StorageService`, `KeyService`, and `CommonService`), OTP-protected forgot-password flow, and attendance check-ins/check-outs that request/verify OTPs before updating session state.
- **Dashboard insights:** `DashboardComponent` resolves upcoming holidays, meeting events, attendance summaries, and pending requests via `DashboardResolverService` while offering event, chatbot, and check-in dialogs powered by shared widgets.
- **Attendance & leave management:** Modular pages for attendance check-ins, leave dashboards, approval flows, leave balances, and holiday awareness, using forms, paginators, filters, and dialog-based Apply Leave/Approval Flow flows.
- **Administrative configuration:** CRUD screens for role types, popup/message banners, menu configurations (including role-wise hierarchies), and approval workflows with resolver-backed data fetching.
- **Meetings + collaboration:** Meeting schedule list and creator screens, event dialogs, chat-bot modal, and document/image viewers to keep teams aligned.
- **Project, task & payroll operations:** Project/task management pages, assign-request lists, payroll summary, and payslip endpoints (via `payroll/get-all-employee-monthly-payslip`) for managers and HR.
- **Employee management:** Profile, list, and add-employee flows backed by resolvers (`EmployeeManagementResolverService`, `EmployeeProfileResolverService`) with CRUD-ready APIs.
- **Shared utilities:** `ApiService` wraps `HttpService` (which adds spinner loader hooks via `NgxSpinnerService`), `authInterceptor` injects JWT headers, reusable snackbars/dialogs, pipes, and Crypto helpers for secure storage.

## Tech Stack

- **Frameworks & Core:** Angular 18.2.x (standalone components), Angular CLI 18.2.12, TypeScript 5.5.2, RxJS 7.8, Zone.js 0.14.
- **UI & Components:** Angular Material 18.2.14 + CDK, Ngx Spinner 18.0.0, Ngx Mat Timepicker 18.0.0, custom theming via `styles.scss`.
- **Authentication & Security:** JWT decoding (`jwt-decode` 4.0.0), Crypto-JS AES encryption (with `StorageService`, `CryptoService`, `KeyService`), HTTP interceptor for Authorization headers.
- **HTTP & APIs:** `HttpService` wraps Angular `HttpClient`, central `API_ENDPOINTS` map, loader hooks, and environment-based base URL (`https://ems-backend-api.onrender.com/api/`).
- **Shared helpers:** Custom pipes (`initial-name.pipe.ts`), dialog widgets (approval flow, event, OTP, chat bot, document/image viewer), snack bars, and confirmation helpers.

## Installation & Setup

**Prerequisites:**

1. Node.js >= 18.x (matches Angular 18 requirements).
2. npm (comes with Node) and optionally the global Angular CLI `@angular/cli@18.2.12` if you want CLI commands outside npm scripts.

**Steps:**

```bash
git clone <https://github.com/AvinashS1995/ems-frontend.git>
cd ems-frontend
npm install
```

If you haven’t installed Angular globally, install it with `npm install -g @angular/cli@18.2.12`.

## Usage

- Run the dev server: `npm start` or `ng serve --configuration development` and open `http://localhost:4200/`.
- Run unit tests: `npm test` (Karma + Jasmine).
- Build for production: `npm run build` or `ng build --configuration production`.
- API base URL is defined in `src/environments/environment.ts`; swap `apiUrl` to point to staging/production backends as needed.
- Default login/demo credentials (replace with real data):
  - Email: `demo@example.com`
  - Password: `Demo@123`
  - The app enforces OTP for check-ins and password resets—use the provided modals/dialogs for flows.
- For visual feedback, the shared `NgxSpinnerModule` is imported globally via `app.config.ts` and triggered by `LoaderService` within HTTP helpers.

## Folder Structure

```
src/app/
├── app.component.*           # Standalone shell that boots services and spinner
├── app.routes.ts             # Lazy-loaded route definitions + resolvers
├── app.config.ts             # ApplicationConfig with router, HTTP client, interceptor, spinner
├── components/
│   ├── layout/               # LayoutComponent stitches header + sidenav
│   ├── common/               # Header, Sidenav, shared UI pieces
│   ├── user/                 # Login, forgot-password with OTP
│   └── pages/                # Feature modules (dashboard, attendance, employee, leave, approval, configuration, meetings, projects, payroll)
│       ├── dashboard/
│       ├── attendence/
│       ├── employee/
│       ├── leave/
│       ├── approval/
│       ├── configuration/
│       ├── meetings/
│       ├── projects/
│       └── payroll-management/
├── shared/
│   ├── common/               # Material exports, constants, API endpoints, pipes
│   ├── service/               # API, HTTP + loader, storage/crypto/key, loaders, common helpers
│   ├── interceptor/           # JWT auth interceptor
│   ├── widget/                # Dialogs (approval flow, OTP, events, chat bot, document/image viewers, snack bars)
│   └── pipes/                 # Custom pipes (e.g., initials)
└── environments/              # Environment configuration (dev/prod base URLs)
```

## Demo / Deployment

- Live demo: `<https://ems-project-kappa.vercel.app/login>`
- Preview screenshot: `![Screenshot](<SCREENSHOT_LINK>)`
- Deployment tips: build with `ng build --configuration production`, serve `dist/ems-frontend`, and point `environment.prod.ts` API to the production backend before release.

## Contributing

1. Fork the repository, create a named branch (`feature/xxx`), and make sure formatting follows SCSS + Angular Style Guide conventions.
2. Install dependencies with `npm install` and run `npm test` before pushing changes.
3. Open a pull request describing the business value and reference related issue/requirement.
4. Document new API hooks or environment flags in this README and keep `API_ENDPOINTS` map in sync.

## License

This project is licensed under `<LICENSE>`. Add a `LICENSE` file or update this section with the correct SPDX identifier.

## Author / Contact

- **Name:** `<Avinash Suryawanshi>`
- **LinkedIn:** `<https://www.linkedin.com/in/your-handle>`
- **GitHub:** `<https://github.com/your-handle>`

Please replace placeholders with actual repository, licensing, and contact information before publishing.
