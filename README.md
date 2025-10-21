# ChronoBuilder 🕰️

> **Open-source digital identity timeline for builders, creators, and communities**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com/)

## 🎯 Vision

ChronoBuilder transforms how builders showcase their digital identity - moving from static resumes to dynamic, verifiable, and intelligent timelines. It's a blockchain-inspired, AI-powered, geo-enabled historical reference system that serves as both a living portfolio and a historical archive of your contributions to the internet and communities.

## ✨ Features

### 🔍 **AI-Powered Search & Discovery**
- **Semantic Search**: "Find all my DeFi-related contributions"
- **Temporal Queries**: "Show my growth in React skills over 2023"
- **Impact Analysis**: "Which projects had the most community engagement?"
- **Skill Evolution**: "Track my journey from frontend to full-stack"
- **Network Analysis**: "Who have I collaborated with most?"

### 🌍 **Geographic Intelligence**
- Location-based timeline entries
- Event mapping and visualization
- Privacy-controlled geographic data
- Timezone-aware chronological sorting

### 🔐 **Verification & Trust**
- Multi-source verification system
- Cryptographic content proofs
- Third-party attestations
- Blockchain-ready architecture

### 🎨 **Rich Media Support**
- 10+ different data point types
- Multiple media formats (images, videos, code, documents)
- Interactive timeline visualization
- Responsive design for all devices

## 🏗️ Architecture

ChronoBuilder is built as a modern monorepo using cutting-edge technologies:

```
chronobuilder/
├── apps/                    # Applications
│   ├── web/                # Next.js web application
│   ├── api/                # Backend API services
│   └── mobile/             # React Native mobile app (future)
├── packages/               # Shared packages
│   ├── core/              # Core timeline logic & types
│   ├── ui/                # React component library
│   ├── ai/                # AI search & analysis engine
│   ├── verification/      # Verification & proof systems
│   ├── integrations/      # Platform connectors (GitHub, Discord, etc.)
│   └── config/            # Shared configurations
├── tools/                 # Development tools
│   ├── build/             # Build scripts and configurations
│   ├── lint/              # Linting configurations
│   └── test/              # Testing utilities
├── docs/                  # Documentation
│   ├── api/               # API documentation
│   ├── guides/            # User guides
│   └── contributing/      # Contribution guidelines
└── examples/              # Implementation examples
    ├── basic-timeline/    # Simple timeline implementation
    ├── advanced-features/ # Advanced feature examples
    └── custom-plugins/    # Plugin development examples
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0 (recommended package manager)
- **Git** for version control

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/chronobuilder.git
cd chronobuilder

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Start development server
pnpm dev
```

### First Timeline Entry

```bash
# Open the web app
open http://localhost:3000

# Add your first entry through the UI or API
curl -X POST http://localhost:3001/api/entries \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Started ChronoBuilder",
    "description": "Beginning my digital identity timeline journey",
    "date": "2025-10-15",
    "type": "project_launch",
    "tags": ["timeline", "portfolio", "open-source"]
  }'
```

## 📊 Data Points & Media Types

ChronoBuilder supports 10 core data point types, each with rich media support:

| Type | Description | Media Support | Verification |
|------|-------------|---------------|--------------|
| **Code Contributions** | GitHub commits, PRs, repositories | Code snippets, diffs, graphs | GitHub API, commit signatures |
| **Community Engagement** | Discord, forums, DAO participation | Screenshots, badges, metrics | Platform APIs, message signatures |
| **Content Creation** | Blog posts, articles, tutorials | Previews, metrics, engagement | Platform APIs, content hashes |
| **Project Launches** | Product releases, deployments | Screenshots, videos, demos | Deployment records, domain ownership |
| **Speaking & Events** | Conferences, podcasts, workshops | Videos, slides, photos | Event confirmation, video proof |
| **Certifications** | Courses, certifications, assessments | Certificates, badges, progress | Platform APIs, blockchain certs |
| **Collaborations** | Joint projects, partnerships | Team photos, outcomes, testimonials | Multi-party signatures, shared repos |
| **Geographic Presence** | Hackathons, meetups, locations | Photos, maps, check-ins | GPS coordinates, event registration |
| **Financial Contributions** | Donations, grants, treasury work | Receipts, reports, announcements | Blockchain transactions, grant DBs |
| **Recognition & Awards** | Awards, mentions, rankings | Photos, press, recommendations | Issuer signatures, media links |

## 🔧 Development Workflow

### Monorepo Management

```bash
# Install dependencies for all packages
pnpm install

# Build all packages
pnpm build

# Run tests across all packages
pnpm test

# Lint all code
pnpm lint

# Clean all build artifacts
pnpm clean
```

### Package-Specific Commands

```bash
# Work on specific packages
pnpm --filter @chronobuilder/web dev
pnpm --filter @chronobuilder/ui build
pnpm --filter @chronobuilder/ai test

# Add dependencies to specific packages
pnpm --filter @chronobuilder/web add react-query
pnpm --filter @chronobuilder/ui add -D storybook
```

### Code Quality & Standards

- **TypeScript** for type safety
- **ESLint + Prettier** for code formatting
- **Husky + lint-staged** for pre-commit hooks
- **Conventional Commits** for commit messages
- **Changesets** for version management

## 🤝 Contributing

We welcome contributions from the community! ChronoBuilder is designed to be extensible and community-driven.

### Ways to Contribute

- 🐛 **Bug Reports**: Found an issue? [Open an issue](https://github.com/yourusername/chronobuilder/issues)
- ✨ **Feature Requests**: Have an idea? [Start a discussion](https://github.com/yourusername/chronobuilder/discussions)
- 🔧 **Code Contributions**: Submit PRs for bug fixes or new features
- 📖 **Documentation**: Help improve our docs and guides
- 🎨 **Design**: Contribute UI/UX improvements and themes
- 🔌 **Plugins**: Create integrations for new platforms

### Development Setup

```bash
# Fork and clone the repository
git clone https://github.com/yourusername/chronobuilder.git
cd chronobuilder

# Create a feature branch
git checkout -b feature/amazing-feature

# Make your changes and commit
git commit -m "feat: add amazing feature"

# Push and create a pull request
git push origin feature/amazing-feature
```

## 🗺️ Roadmap

### Phase 1: MVP (Q4 2025)
- [x] Core timeline functionality
- [x] Basic data point types
- [x] Simple search and filtering
- [ ] Basic verification system
- [ ] Web application deployment

### Phase 2: AI Integration (Q1 2026)
- [ ] Semantic search implementation
- [ ] Auto-categorization and tagging
- [ ] Impact analysis and metrics
- [ ] Skill tracking and evolution

### Phase 3: Community & Open Source (Q2 2026)
- [ ] Open source release
- [ ] Plugin system architecture
- [ ] Community verification features
- [ ] Template marketplace

### Phase 4: Blockchain Integration (Q3 2026)
- [ ] NFT collectible moments
- [ ] Reputation token system
- [ ] Cross-chain identity
- [ ] DAO governance structure

## 🔒 Privacy & Security

ChronoBuilder is built with privacy-first principles:

- **Zero-Knowledge Proofs**: Prove achievements without revealing details
- **Selective Disclosure**: Choose what to share with whom
- **Temporal Controls**: Time-limited access to information
- **Data Sovereignty**: Full control over your data
- **End-to-end Encryption**: Secure data transmission
- **Decentralized Storage**: IPFS for media assets

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by [grandtimeline.org](https://grandtimeline.org/) for timeline visualization
- Built with amazing open-source technologies
- Community-driven development approach
- Special thanks to all contributors and early adopters

## 📞 Support & Community

- **Documentation**: [docs.chronobuilder.dev](https://docs.chronobuilder.dev)
- **Discord**: [Join our community](https://discord.gg/chronobuilder)
- **Twitter**: [@ChronoBuilder](https://twitter.com/chronobuilder)
- **Email**: hello@chronobuilder.dev

---

## 📁 File Structure & Explanations

Below is a detailed explanation of each file and directory in the ChronoBuilder project:

### 🏠 Root Directory

| File/Directory | Purpose | Description |
|----------------|---------|-------------|
| `package.json` | Root package configuration | Defines workspace scripts, shared dependencies, and project metadata |
| `pnpm-workspace.yaml` | Workspace configuration | Defines which directories contain packages for pnpm workspaces |
| `pnpm-lock.yaml` | Dependency lock file | Ensures consistent dependency versions across all environments |
| `.env.example` | Environment template | Template for environment variables needed for development |
| `.gitignore` | Git ignore rules | Specifies files and directories to exclude from version control |
| `tsconfig.json` | TypeScript configuration | Root TypeScript configuration extended by all packages |
| `turbo.json` | Build system configuration | Defines build pipeline and caching strategies for Turborepo |
| `LICENSE` | Project license | MIT license terms for open-source usage |
| `CONTRIBUTING.md` | Contribution guidelines | Instructions for contributing to the project |
| `CHANGELOG.md` | Version history | Detailed changelog of all releases and updates |

### 📱 Apps Directory (`apps/`)

#### `apps/web/` - Next.js Web Application
| File/Directory | Purpose | Description |
|----------------|---------|-------------|
| `package.json` | Web app dependencies | Next.js app-specific dependencies and scripts |
| `next.config.js` | Next.js configuration | Build configuration, redirects, and optimizations |
| `tailwind.config.js` | Tailwind CSS config | Custom design system and component styling |
| `src/app/` | App Router pages | Next.js 14 App Router pages and layouts |
| `src/components/` | React components | Page-specific React components |
| `src/lib/` | Utility libraries | Helper functions, API clients, and utilities |
| `src/hooks/` | Custom React hooks | Reusable React hooks for state and effects |
| `src/styles/` | Global styles | CSS files and style definitions |
| `public/` | Static assets | Images, icons, and other static files |

#### `apps/api/` - Backend API Services
| File/Directory | Purpose | Description |
|----------------|---------|-------------|
| `package.json` | API dependencies | Express/Fastify server dependencies |
| `src/routes/` | API endpoints | RESTful API route definitions |
| `src/middleware/` | Express middleware | Authentication, validation, and logging |
| `src/models/` | Data models | Database schemas and data structures |
| `src/services/` | Business logic | Core business logic and external integrations |
| `src/utils/` | Utility functions | Helper functions and shared utilities |
| `prisma/` | Database schema | Prisma ORM schema and migrations |

#### `apps/mobile/` - React Native Mobile App (Future)
| File/Directory | Purpose | Description |
|----------------|---------|-------------|
| `package.json` | Mobile app dependencies | React Native and mobile-specific packages |
| `src/screens/` | Mobile screens | React Native screen components |
| `src/navigation/` | Navigation setup | React Navigation configuration |
| `src/components/` | Mobile components | Mobile-optimized React Native components |

### 📦 Packages Directory (`packages/`)

#### `packages/core/` - Core Timeline Logic
| File/Directory | Purpose | Description |
|----------------|---------|-------------|
| `src/types/` | TypeScript types | Core data structures and type definitions |
| `src/timeline/` | Timeline engine | Core timeline logic and data processing |
| `src/verification/` | Verification system | Data verification and proof generation |
| `src/search/` | Search engine | Search indexing and query processing |
| `src/utils/` | Core utilities | Shared utility functions across packages |

#### `packages/ui/` - React Component Library
| File/Directory | Purpose | Description |
|----------------|---------|-------------|
| `src/components/` | UI components | Reusable React components with TypeScript |
| `src/hooks/` | UI hooks | Custom hooks for component logic |
| `src/styles/` | Component styles | Tailwind CSS and styled-components |
| `src/icons/` | Icon components | SVG icons as React components |
| `storybook/` | Component stories | Storybook stories for component development |
| `dist/` | Built components | Compiled and bundled component library |

#### `packages/ai/` - AI Search & Analysis Engine
| File/Directory | Purpose | Description |
|----------------|---------|-------------|
| `src/search/` | Semantic search | Vector embeddings and similarity search |
| `src/analysis/` | Content analysis | AI-powered content categorization |
| `src/nlp/` | Natural language processing | Text processing and understanding |
| `src/models/` | AI models | Machine learning model configurations |
| `src/embeddings/` | Vector embeddings | Text and content vectorization |

#### `packages/verification/` - Verification & Proof Systems
| File/Directory | Purpose | Description |
|----------------|---------|-------------|
| `src/proofs/` | Cryptographic proofs | Hash-based content verification |
| `src/attestations/` | Third-party attestations | Community and peer verification |
| `src/blockchain/` | Blockchain integration | Smart contracts and on-chain verification |
| `src/signatures/` | Digital signatures | Cryptographic signature verification |

#### `packages/integrations/` - Platform Connectors
| File/Directory | Purpose | Description |
|----------------|---------|-------------|
| `src/github/` | GitHub integration | GitHub API client and data extraction |
| `src/discord/` | Discord integration | Discord bot and message verification |
| `src/twitter/` | Twitter integration | Twitter API and social proof |
| `src/linkedin/` | LinkedIn integration | Professional network data |
| `src/platforms/` | Other platforms | Additional platform integrations |

#### `packages/config/` - Shared Configurations
| File/Directory | Purpose | Description |
|----------------|---------|-------------|
| `eslint/` | ESLint configurations | Shared linting rules and configurations |
| `typescript/` | TypeScript configs | Shared TypeScript configurations |
| `tailwind/` | Tailwind presets | Shared design system configurations |
| `jest/` | Testing configurations | Shared testing setup and utilities |

### 🛠️ Tools Directory (`tools/`)

#### `tools/build/` - Build Scripts and Configurations
| File/Directory | Purpose | Description |
|----------------|---------|-------------|
| `webpack.config.js` | Webpack configuration | Custom webpack build configurations |
| `rollup.config.js` | Rollup configuration | Package bundling configurations |
| `scripts/` | Build scripts | Custom build and deployment scripts |

#### `tools/lint/` - Linting Configurations
| File/Directory | Purpose | Description |
|----------------|---------|-------------|
| `.eslintrc.js` | ESLint rules | Project-wide linting rules |
| `.prettierrc` | Prettier configuration | Code formatting rules |
| `lint-staged.config.js` | Pre-commit hooks | Git hook configurations |

#### `tools/test/` - Testing Utilities
| File/Directory | Purpose | Description |
|----------------|---------|-------------|
| `jest.config.js` | Jest configuration | Testing framework setup |
| `setup/` | Test setup files | Global test configuration and mocks |
| `utils/` | Testing utilities | Helper functions for tests |

### 📚 Documentation Directory (`docs/`)

#### `docs/api/` - API Documentation
| File/Directory | Purpose | Description |
|----------------|---------|-------------|
| `openapi.yaml` | API specification | OpenAPI/Swagger API documentation |
| `endpoints/` | Endpoint docs | Detailed endpoint documentation |
| `authentication.md` | Auth documentation | Authentication and authorization guide |

#### `docs/guides/` - User Guides
| File/Directory | Purpose | Description |
|----------------|---------|-------------|
| `getting-started.md` | Getting started guide | New user onboarding documentation |
| `timeline-creation.md` | Timeline guide | How to create and manage timelines |
| `verification.md` | Verification guide | Understanding verification systems |
| `privacy.md` | Privacy guide | Privacy controls and data management |

#### `docs/contributing/` - Contribution Guidelines
| File/Directory | Purpose | Description |
|----------------|---------|-------------|
| `development.md` | Development setup | Local development environment setup |
| `code-style.md` | Code style guide | Coding standards and conventions |
| `pull-requests.md` | PR guidelines | Pull request process and requirements |
| `plugins.md` | Plugin development | How to create custom plugins |

### 🎯 Examples Directory (`examples/`)

#### `examples/basic-timeline/` - Simple Timeline Implementation
| File/Directory | Purpose | Description |
|----------------|---------|-------------|
| `package.json` | Example dependencies | Minimal dependencies for basic usage |
| `src/` | Example source code | Simple timeline implementation example |
| `README.md` | Example documentation | How to use the basic timeline |

#### `examples/advanced-features/` - Advanced Feature Examples
| File/Directory | Purpose | Description |
|----------------|---------|-------------|
| `ai-search/` | AI search example | Implementing semantic search features |
| `verification/` | Verification example | Setting up verification systems |
| `custom-ui/` | Custom UI example | Creating custom timeline designs |

#### `examples/custom-plugins/` - Plugin Development Examples
| File/Directory | Purpose | Description |
|----------------|---------|-------------|
| `platform-connector/` | Platform integration | Creating new platform connectors |
| `data-processor/` | Data processing | Custom data processing plugins |
| `ui-theme/` | UI theme plugin | Creating custom themes and layouts |

### 🔧 Configuration Files

| File | Purpose | Description |
|------|---------|-------------|
| `.changeset/config.json` | Changesets configuration | Version management and release automation |
| `.github/workflows/` | GitHub Actions | CI/CD pipeline configurations |
| `.vscode/settings.json` | VS Code settings | Recommended editor settings |
| `docker-compose.yml` | Docker configuration | Local development environment setup |
| `vercel.json` | Vercel deployment | Production deployment configuration |

---

*This README serves as the comprehensive guide to ChronoBuilder. For more detailed information, visit our [documentation site](https://docs.chronobuilder.dev) or join our [community Discord](https://discord.gg/chronobuilder).*
