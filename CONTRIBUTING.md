# Contributing to ChronoBuilder

Thank you for your interest in contributing to ChronoBuilder! This document provides guidelines and information for contributors.

## 🎯 Ways to Contribute

- 🐛 **Bug Reports**: Found an issue? [Open an issue](https://github.com/yourusername/chronobuilder/issues)
- ✨ **Feature Requests**: Have an idea? [Start a discussion](https://github.com/yourusername/chronobuilder/discussions)
- 🔧 **Code Contributions**: Submit PRs for bug fixes or new features
- 📖 **Documentation**: Help improve our docs and guides
- 🎨 **Design**: Contribute UI/UX improvements and themes
- 🔌 **Plugins**: Create integrations for new platforms

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0
- **Git** for version control
- **PostgreSQL** for database (optional for frontend-only contributions)

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/yourusername/chronobuilder.git
   cd chronobuilder
   ```

2. **Install Dependencies**
   ```bash
   pnpm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start Development**
   ```bash
   pnpm dev
   ```

## 📝 Development Workflow

### Branch Naming Convention

- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring
- `test/description` - Test improvements

### Commit Message Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```bash
feat(timeline): add semantic search functionality
fix(ui): resolve timeline scrolling issue on mobile
docs(readme): update installation instructions
```

### Code Quality Standards

1. **TypeScript**: All code must be properly typed
2. **ESLint**: Follow the project's linting rules
3. **Prettier**: Code must be formatted consistently
4. **Tests**: New features should include tests
5. **Documentation**: Update docs for new features

### Pre-commit Hooks

We use Husky and lint-staged to ensure code quality:

```bash
# Automatically runs on commit
- ESLint checks and fixes
- Prettier formatting
- Type checking
- Test validation
```

## 🏗️ Project Structure

### Monorepo Organization

```
chronobuilder/
├── apps/           # Applications (web, api, mobile)
├── packages/       # Shared packages (ui, core, ai, etc.)
├── tools/          # Development tools and configurations
├── docs/           # Documentation
└── examples/       # Implementation examples
```

### Package Development

#### Creating a New Package

```bash
# Create package directory
mkdir packages/my-package
cd packages/my-package

# Initialize package
pnpm init

# Add to workspace
# (Already configured in pnpm-workspace.yaml)
```

#### Package Structure

```
packages/my-package/
├── src/
│   ├── index.ts        # Main entry point
│   ├── types.ts        # Type definitions
│   └── utils.ts        # Utility functions
├── tests/
│   └── index.test.ts   # Test files
├── package.json        # Package configuration
├── tsconfig.json       # TypeScript config
└── README.md           # Package documentation
```

### Working with Specific Packages

```bash
# Install dependencies for specific package
pnpm --filter @chronobuilder/ui add react

# Run scripts for specific package
pnpm --filter @chronobuilder/web dev
pnpm --filter @chronobuilder/ui test

# Build specific package
pnpm --filter @chronobuilder/core build
```

## 🧪 Testing

### Test Structure

- **Unit Tests**: Test individual functions and components
- **Integration Tests**: Test package interactions
- **E2E Tests**: Test complete user workflows

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests for specific package
pnpm --filter @chronobuilder/core test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test -- --coverage
```

### Writing Tests

```typescript
// Example test file
import { describe, it, expect } from 'vitest'
import { createTimeline } from '../src/timeline'

describe('Timeline Creation', () => {
  it('should create a timeline with entries', () => {
    const timeline = createTimeline([
      { id: '1', title: 'Test Entry', date: new Date() }
    ])
    
    expect(timeline.entries).toHaveLength(1)
    expect(timeline.entries[0].title).toBe('Test Entry')
  })
})
```

## 🎨 UI/UX Contributions

### Design System

We use a consistent design system based on:
- **Tailwind CSS** for styling
- **shadcn/ui** for base components
- **Lucide React** for icons
- **Framer Motion** for animations

### Component Development

```bash
# Start Storybook for component development
pnpm storybook

# Build Storybook
pnpm storybook:build
```

### Creating New Components

1. Create component in `packages/ui/src/components/`
2. Add TypeScript types
3. Create Storybook story
4. Add tests
5. Export from main index file

## 🔌 Plugin Development

### Plugin Architecture

ChronoBuilder supports plugins for:
- **Platform Integrations**: Connect new data sources
- **Data Processors**: Custom data transformation
- **UI Themes**: Custom visual themes
- **Verification Methods**: New verification systems

### Creating a Plugin

```typescript
// Example platform integration plugin
export interface PlatformPlugin {
  name: string
  version: string
  authenticate: () => Promise<AuthResult>
  fetchData: (userId: string) => Promise<TimelineEntry[]>
  verify: (entry: TimelineEntry) => Promise<VerificationResult>
}
```

## 📖 Documentation

### Documentation Types

- **API Documentation**: Generated from TypeScript types
- **User Guides**: Step-by-step instructions
- **Developer Guides**: Technical implementation details
- **Examples**: Code examples and tutorials

### Writing Documentation

- Use clear, concise language
- Include code examples
- Add screenshots for UI features
- Keep documentation up-to-date with code changes

## 🔍 Code Review Process

### Pull Request Guidelines

1. **Clear Description**: Explain what and why
2. **Small Changes**: Keep PRs focused and manageable
3. **Tests Included**: Add tests for new functionality
4. **Documentation Updated**: Update relevant docs
5. **No Breaking Changes**: Avoid breaking existing APIs

### Review Criteria

- Code quality and style
- Test coverage
- Performance implications
- Security considerations
- Documentation completeness

## 🚀 Release Process

### Version Management

We use [Changesets](https://github.com/changesets/changesets) for version management:

```bash
# Create a changeset
pnpm changeset

# Version packages
pnpm changeset:version

# Publish packages
pnpm changeset:publish
```

### Release Types

- **Patch**: Bug fixes and small improvements
- **Minor**: New features (backward compatible)
- **Major**: Breaking changes

## 🤝 Community Guidelines

### Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Follow project guidelines

### Communication Channels

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General questions and ideas
- **Discord**: Real-time community chat
- **Twitter**: Updates and announcements

## 🏆 Recognition

Contributors are recognized through:
- **Contributors List**: Listed in README
- **Release Notes**: Mentioned in changelogs
- **Community Highlights**: Featured on social media
- **Maintainer Status**: Opportunity to become a maintainer

## ❓ Getting Help

If you need help:

1. Check existing [documentation](https://docs.chronobuilder.dev)
2. Search [GitHub issues](https://github.com/yourusername/chronobuilder/issues)
3. Ask in [GitHub discussions](https://github.com/yourusername/chronobuilder/discussions)
4. Join our [Discord community](https://discord.gg/chronobuilder)

## 📄 License

By contributing to ChronoBuilder, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to ChronoBuilder! Your efforts help make digital identity timelines better for everyone. 🚀
