---
description: how to deploy Project Architect
---

### 🚀 Deployment Options

Project Architect is a Next.js 16 application optimized for modern cloud platforms.

#### 1. Vercel (Recommended)
The fastest way to deploy. Vercel is the creator of Next.js and provides zero-config deployment.
- Install Vercel CLI: `npm i -g vercel`
- Run `vercel` in the project root.
- Follow the prompts to link your account and deploy.

#### 2. Netlify
- Create a new site from Git on Netlify.
- Build command: `npm run build`
- Publish directory: `.next`

#### 3. Manual Server (Docker/PM2)
- Build the project: `npm run build`
- Start the production server: `npm run start`
- For Docker, use a standard Node.js 20+ image and expose port 3000.

### 🛠️ Production Checklist
- [ ] Set `NODE_ENV=production`
- [ ] Ensure all API endpoints in `AiChatbot.tsx` are pointing to production URLs if applicable.
- [ ] Check `sessionStorage` and `localStorage` persistence settings for public access.
