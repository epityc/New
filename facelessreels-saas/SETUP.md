# FacelessReels SaaS — Installation

## Étape 1 — Créer le projet Next.js

```bash
npx create-next-app@14 facelessreels-saas \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"

cd facelessreels-saas
```

## Étape 2 — Installer les dépendances

```bash
# Core + UI
npm install @clerk/nextjs lucide-react clsx tailwind-merge class-variance-authority tailwindcss-animate

# Shadcn UI (initialisation)
npx shadcn-ui@latest init
npx shadcn-ui@latest add button input label select tabs card badge progress toast dialog separator

# Base de données
npm install @prisma/client prisma
npx prisma init

# IA & APIs
npm install openai zod

# Paiements
npm install stripe @stripe/stripe-js

# Vidéo
npm install remotion @remotion/bundler @remotion/cli @remotion/renderer @remotion/google-fonts

# Webhook validation
npm install svix
```

## Étape 3 — Configurer l'environnement

```bash
cp .env.example .env.local
# Remplir toutes les variables dans .env.local
```

## Étape 4 — Base de données (Supabase)

1. Créer un projet sur supabase.com
2. Copier l'URL de connexion dans DATABASE_URL
3. Appliquer le schéma :

```bash
npx prisma db push
npx prisma generate
```

## Étape 5 — Clerk (Auth)

1. Créer un projet sur clerk.com
2. Copier les clés dans .env.local
3. Configurer le webhook Clerk → /api/webhooks/clerk

## Étape 6 — Stripe

1. Créer un compte sur stripe.com
2. Créer 3 produits (Starter 10 crédits, Pro 50 crédits, Unlimited 200 crédits)
3. Copier les price_id dans .env.local
4. Configurer le webhook Stripe → /api/webhooks/stripe

## Lancer le projet

```bash
npm run dev
# → http://localhost:3000
```

## Prévisualiser la composition Remotion

```bash
npx remotion studio src/remotion/Root.tsx
# → http://localhost:3001
```

## Notes sur le rendu vidéo

- Le rendu Remotion utilise Chromium headless — il faut ~2 Go de RAM minimum.
- Sur Vercel (serverless), les fonctions timeout à 60s → utilisez **Vercel Functions Pro** (max 15min) ou déployez sur **Railway / Render** (Node.js persistent).
- Pour Vercel, remplacez `renderMedia()` par **@remotion/lambda** (rendu AWS Lambda).
- Le bucket Supabase Storage `videos` doit être créé en **public** pour que les URLs fonctionnent.

