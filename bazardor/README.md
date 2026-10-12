# 🛒 বাজার দর (BazarDor)

> প্রয়োজনীয় পণ্যের দাম এক নজরে — Bangladesh's daily essential-goods price tracker for rice, pulses, oil, vegetables, fish, meat, eggs/dairy and spices.

**Live:** _add your Vercel link_ · **Repo:** _add your GitHub link_

## 📖 Description
BazarDor shows today's market prices with the day-over-day change, market-wise min / max / average prices and sortable category pages. Prices are shown with Bengali digits, and details pages are protected behind login (BetterAuth).

## ✨ Key Features
1. **Live price ticker** — an infinitely scrolling marquee with emoji, name, price/unit and ▲/▼ %.
2. **Top risers & fallers** — home page highlights the 6 biggest price rises and falls, plus a grid of all products.
3. **Category pages with numeric sort** — default / low→high / high→low; sorting uses numeric values, so Bengali digits sort correctly.
4. **Protected product details** — min / max / average price and a market-wise price table, behind sign-in.
5. **Authentication** — email/password + Google + GitHub via BetterAuth, with toast notifications and protected-route redirects.
6. **Profile & update** — view your account and update your name (BetterAuth `updateUser`).
7. **Responsive & resilient** — works on mobile/tablet/desktop; skeleton loaders, custom 404 page, and a local data fallback if the API is down.

## 🧰 Technologies
Next.js (App Router) · React · TypeScript · Tailwind CSS v4 · BetterAuth · MongoDB · react-hot-toast · Hind Siliguri font

## 🚀 Getting started
```bash
npm install
cp .env.example .env.local   # fill in values
npm run dev
```
Environment variables: `MONGODB_URI`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `GOOGLE_CLIENT_ID/SECRET`, `GITHUB_CLIENT_ID/SECRET`.
OAuth callback URLs: `<BETTER_AUTH_URL>/api/auth/callback/google` and `/github`.

## 🔌 API
`https://openapi.programming-hero.com/api/bazardor` — `/products`, `/products?category=`, `/products/:id`, `/categories`, `/categories/:slug`.
