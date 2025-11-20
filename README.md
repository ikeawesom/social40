<img src="./public/images/banner.png" alt="Social40 Banner" />

# Social 40
A unified ERP and social engagement system designed to streamline administrative workflows, personnel management, and community communication within military units.
Built with Next.js, TypeScript, and TailwindCSS, the platform delivers a modern, modular, and scalable approach to digitalising army administrative processes.

## 🚀 Overview

This project combines two major domains into a single platform:

### 🪖 1. Army Administrative ERP

A suite of tools that supports unit-level and formation-level administrative operations, such as:
- Personnel management & records
- Tasking and duty planning
- Attendance / activity tracking
- Document management
- Workflow & approval systems
- Reporting and analytics

### 💬 2. Social Media & Community Engagement

An internal social platform for soldiers and commanders:
- Newsfeed & posts
- Comments, likes, and reactions
- Media uploads
- Announcements & broadcasts
- Unit-wide engagement modules

The result is a complete digital ecosystem for both operational efficiency and community cohesion.

## 🛠️ Tech Stack

- Next.js 14 (App Router)
- React + TypeScript
- TailwindCSS
- Sentry (client, server & edge monitoring)
- Vercel deployment ready
- REST APIs / internal services (extendable)
- Environment-based configuration via .env.local

## 📂 Project Structure
```
social40/
├── app/                     # Next.js app-router pages & routes
├── src/
│   ├── components/          # Reusable UI components
│   ├── hooks/               # Custom client-side hooks
│   ├── lib/                 # Utilities, API wrappers, helpers
│   └── ...
├── public/                  # Assets (images, icons)
├── sentry.*.config.ts       # Sentry monitoring configs
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── vercel.json
```

## ⚙️ Setup & Installation
### 1. Clone the repository

```
git clone https://github.com/ikeawesom/social40.git
cd social40
```

### 2. Install dependencies

```
npm install
```

### 3. Create environment configuration

Copy `.env.local` (or create it if missing) and fill in your variables:
```
NEXT_PUBLIC_API_URL=...
SENTRY_AUTH_TOKEN=...
SENTRY_DSN=...
```

### 4. Start development server

```
npm run dev
```

App will be available at `http://localhost:3000`.

## 🏗️ Build for Production
```
npm run build
npm start
```

## 🔒 Security Notes

This project is designed for internal military deployment, and includes:
- Environment-based secret separation
- Optional Sentry monitoring
- Scalable RBAC (role-based access control) patterns
- Potential integration with military networks or intranets

⚠️ Ensure environment variables containing sensitive data are never committed to version control.

## 📄 License

Specify your intended license (MIT, Apache-2.0, AGPL, or private internal license).

## 📢 Acknowledgements

This system was built to modernise and streamline administrative processes, improve communication, and enhance soldier engagement using modern web technologies.
