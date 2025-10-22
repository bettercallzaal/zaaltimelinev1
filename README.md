# ChronoBuilder 🕰️

> **Open-source photo timeline for organizing your digital memories**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/bettercallzaal/zaaltimelinev1&project-name=chronobuilder&repository-name=chronobuilder)

## 🎯 What is ChronoBuilder?

A simple, beautiful photo timeline that helps you organize your digital memories chronologically. Upload photos, add descriptions and dates, and watch your story unfold in a clean timeline view.

**Perfect for:**
- Personal memory keeping
- Project documentation
- Portfolio showcases  
- Life milestones tracking
- Team progress updates

## ✨ Key Features

- 📸 **Drag & Drop Upload** - Easy photo uploads with preview
- 📅 **Date Organization** - Automatic chronological sorting
- 🔗 **Optional Links** - Add URLs to projects, posts, or websites
- 💾 **Persistent Storage** - Your data stays forever with PostgreSQL
- 📱 **Mobile Responsive** - Works perfectly on all devices
- 🚀 **One-Click Deploy** - Deploy your own instance in minutes

## 🚀 Quick Deploy (5 minutes)

### Option 1: One-Click Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/bettercallzaal/zaaltimelinev1&project-name=chronobuilder&repository-name=chronobuilder)

1. Click the deploy button above
2. Connect your GitHub account
3. Set up a free Neon database (instructions below)
4. Add `DATABASE_URL` environment variable
5. Deploy and enjoy your timeline!

### Option 2: Manual Deploy

#### Step 1: Fork & Clone
```bash
git clone https://github.com/bettercallzaal/zaaltimelinev1.git
cd zaaltimelinev1
```

#### Step 2: Set up Database
1. Go to [neon.tech](https://neon.tech) and create a free account
2. Create a new project
3. Copy your connection string

#### Step 3: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) and import your GitHub repo
2. Set **Root Directory** to `apps/web`
3. Add environment variable:
   - **Name**: `DATABASE_URL`
   - **Value**: Your Neon connection string
4. Deploy!

## 🛠️ Local Development

```bash
# Install dependencies
pnpm install

# Set up environment
cp apps/web/.env.example apps/web/.env.local
# Add your DATABASE_URL to .env.local

# Generate database client
cd apps/web
pnpm db:generate

# Start development server
pnpm dev
```

Visit `http://localhost:3000` to see your timeline!

## 🏗️ Tech Stack

- **Frontend**: Next.js 14 with TypeScript
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Deployment**: Vercel
- **Storage**: Base64 images (database)

## 📁 Project Structure

```
apps/web/
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── api/           # API routes
│   │   └── page.tsx       # Main timeline page
│   ├── components/        # React components
│   │   ├── Timeline.tsx
│   │   ├── AddEntryModal.tsx
│   │   └── TimelineEntryCard.tsx
│   └── lib/               # Utilities
│       ├── db.ts          # Database connection
│       └── types.ts       # TypeScript types
├── prisma/
│   └── schema.prisma      # Database schema
└── package.json
```

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** and test locally
4. **Commit your changes**: `git commit -m 'Add amazing feature'`
5. **Push to the branch**: `git push origin feature/amazing-feature`
6. **Open a Pull Request**

### Development Guidelines
- Use TypeScript for type safety
- Follow the existing code style
- Add comments for complex logic
- Test your changes locally before submitting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Database by [Neon](https://neon.tech/)
- Deployed on [Vercel](https://vercel.com/)
- Icons by [Lucide](https://lucide.dev/)

## 📞 Support

- 🐛 **Bug Reports**: [Open an issue](https://github.com/bettercallzaal/zaaltimelinev1/issues)
- 💡 **Feature Requests**: [Start a discussion](https://github.com/bettercallzaal/zaaltimelinev1/discussions)
- 📧 **Questions**: Open an issue with the "question" label

---

**⭐ If ChronoBuilder helps you organize your memories, please give it a star!**
