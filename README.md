# 🎬 StreamVibe - Your Ultimate Movie Streaming Platform

<div align="center">
  <img src="https://i.imgur.com/XYZ123.png" alt="StreamVibe Logo" width="200"/>
  
  [![Next.js](https://img.shields.io/badge/Next.js-13.0-black?logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
  [![TMDB API](https://img.shields.io/badge/TMDB-API-01D277?logo=themoviedatabase)](https://www.themoviedb.org/documentation/api)
  
  [![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
  [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
</div>

## 🌟 Features

- 🎯 **Smart Movie Discovery**
  - AI-powered recommendations
  - Personalized watchlist
  - Genre-based browsing
  - Trending movies section

- 🎥 **Multi-Source Streaming**
  - Integration with popular streaming services
  - Free movie sources
  - HD quality playback
  - Custom video player

- 👤 **User Experience**
  - Beautiful, responsive design
  - Dark mode support
  - Mobile-friendly interface
  - Smooth animations

- 🔒 **Security**
  - Secure authentication
  - Protected admin routes
  - Rate limiting
  - Input validation

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- TMDB API key

### Installation

1. Clone the repository
```bash
git clone https://github.com/HP/StreamVibe.git
cd StreamVibe
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Set up environment variables
```bash
cp .env.example .env.local
```
Edit `.env.local` with your configuration:
```env
TMDB_API_KEY=your_tmdb_api_key
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

4. Start the development server
```bash
npm run dev
# or
yarn dev
```

## 🛠️ Tech Stack

- **Frontend**
  - Next.js 13
  - TypeScript
  - Tailwind CSS
  - Framer Motion
  - React Query

- **Backend**
  - Next.js API Routes
  - NextAuth.js
  - TMDB API
  - Prisma (coming soon)

- **Deployment**
  - Vercel
  - Docker (coming soon)

## 📱 Screenshots

<div align="center">
  <img src="https://i.imgur.com/ABC123.png" alt="Homepage" width="300"/>
  <img src="https://i.imgur.com/DEF456.png" alt="Movie Details" width="300"/>
  <img src="https://i.imgur.com/GHI789.png" alt="Streaming Player" width="300"/>
</div>

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [TMDB](https://www.themoviedb.org/) for their amazing API
- [Next.js](https://nextjs.org/) team for the incredible framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework

## 📞 Support

Need help? Join our [Discord community](https://discord.gg/streamvibe) or open an issue.

---

<div align="center">
  Made with ❤️ by the StreamVibe Team
</div> 
