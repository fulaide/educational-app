# 📚 Educational App Platform

> Comprehensive educational platform for primary school students learning reading and writing, built with modern web technologies.

## 🎯 Overview

This monorepo contains a complete educational ecosystem:

- **Student Mobile App** - SvelteKit + Capacitor for iOS/Android
- **Teacher Web Portal** - Class management and progress tracking
- **Parent Web Portal** - Child progress and reward management  
- **Admin Dashboard** - System administration and analytics

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm 9+
- Git

### Development Setup

```bash
# Clone and install
git clone <repository-url>
cd educational-app
npm install

# Start all applications in development
npm run dev

# Start specific applications
npm run dev:student   # Student app only
npm run dev:teacher   # Teacher portal only
npm run dev:parent    # Parent portal only
```

### Database Setup

```bash
# Run database migrations
npm run db:migrate

# Seed development data
npm run db:seed

# Open Prisma Studio
npm run db:studio
```

## 🏗 Architecture

### Technology Stack

- **Framework**: SvelteKit with Svelte 5 (runes syntax)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 4.0
- **Mobile**: Capacitor 6.1+
- **Database**: PostgreSQL + SQLite (offline)
- **ORM**: Prisma 6.10+
- **API**: tRPC with Zod validation
- **Auth**: Auth.js with JWT strategy
- **Monorepo**: Turborepo with remote caching

### Project Structure

```
educational-app/
├── apps/
│   ├── student-app/          # Mobile-first student application
│   ├── teacher-portal/       # Teacher dashboard and tools
│   ├── parent-portal/        # Parent progress and rewards
│   └── admin-dashboard/      # System administration
├── packages/
│   ├── ui/                   # Shared Svelte 5 components
│   ├── database/             # Prisma schema and client
│   ├── api/                  # tRPC routers and procedures
│   ├── sync-engine/          # Offline synchronization
│   ├── auth/                 # Authentication configuration
│   ├── types/                # Shared TypeScript definitions
│   └── platform/             # Platform abstraction layer
└── infrastructure/
    ├── docker/               # Development containers
    └── scripts/              # Build and deployment scripts
```

## 🎮 Key Features

### For Students
- **Offline-First Learning** - Works without internet connection
- **QR Code Login** - No passwords needed (COPPA compliant)
- **Gamification** - XP, levels, achievements, and virtual pets
- **Interactive Challenges** - Writing exercises and vocabulary games
- **Progress Tracking** - Real-time learning analytics

### For Teachers  
- **Class Management** - Create and manage student accounts
- **Assignment Tools** - Assign tasks and track completion
- **Progress Analytics** - Detailed learning insights
- **Bulk Operations** - Efficient classroom administration

### For Parents
- **Child Linking** - Connect via secure student codes
- **Progress Reports** - Email notifications and dashboards
- **Reward System** - Manage real-world rewards for achievements
- **Privacy Controls** - COPPA/GDPR compliant data management

## 🔧 Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start all apps in development mode |
| `npm run build` | Build all applications for production |
| `npm run test` | Run complete test suite |
| `npm run lint` | Lint all packages |
| `npm run type-check` | TypeScript type checking |
| `npm run db:migrate` | Run database migrations |
| `npm run db:seed` | Seed development data |
| `npm run format` | Format code with Prettier |

## 📱 Mobile Development

The student app uses Capacitor for native iOS and Android deployment:

```bash
# Add mobile platforms (after initial build)
cd apps/student-app
npx cap add ios
npx cap add android

# Development with live reload
npm run dev:student
npx cap run ios --livereload --external
npx cap run android --livereload --external
```

## 🔐 Authentication & Privacy

### Multi-Role System
- **Students**: UUID-based authentication (no personal data)
- **Teachers**: Email/password with organization linking  
- **Parents**: Secure child linking then email verification
- **Admins**: Enhanced security with role-based permissions

### Privacy Compliance
- **COPPA Compliant**: No PII collection for users under 13
- **GDPR Ready**: Full data privacy controls
- **Anonymous Profiles**: Students identified by UUID only
- **Secure Sync**: End-to-end encrypted data synchronization

## 🧪 Testing

- **Unit Tests**: Vitest with TypeScript support
- **Component Tests**: Testing Library for Svelte
- **E2E Tests**: Playwright across all applications  
- **API Tests**: tRPC procedure testing
- **Mobile Tests**: Capacitor device testing

## 🚢 Deployment

### Development
- **Vercel**: Automatic preview deployments for web apps
- **Local**: SQLite database for development
- **Live Reload**: Hot reloading across all applications

### Production
- **Web Apps**: Vercel with PostgreSQL
- **Mobile Apps**: App Store and Google Play
- **Database**: Managed PostgreSQL with Redis caching
- **CDN**: Vercel Edge Network

## 📖 Documentation

- [Architecture Guide](docs/architecture/) - Technical deep-dive
- [API Documentation](docs/api/) - tRPC procedures and schemas  
- [Development Guide](docs/guides/) - Contribution guidelines
- [Deployment Guide](docs/guides/deployment.md) - Production setup

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/EDU-XXX-description`
3. Make changes and add tests
4. Run quality checks: `npm run lint && npm run type-check && npm run test`
5. Commit with conventional format: `git commit -m "feat: add student progress tracking"`
6. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🏁 Getting Started

Ready to contribute? Check out our [Development Guide](docs/guides/development.md) and [Good First Issues](https://github.com/educational-app/educational-app/labels/good%20first%20issue).

---

Built with ❤️ for education, powered by modern web technologies.