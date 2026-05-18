export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  longDescription: string;
  price: number;
  originalPrice?: number;
  category: string;
  badge?: string;
  emoji: string;
  gradient: string;
  features: string[];
  includes: string[];
  format: string;
  pages?: number;
  rating: number;
  reviews: number;
  bestseller?: boolean;
  new?: boolean;
}

export const products: Product[] = [
  {
    id: 'aesthetic-life-planner',
    name: 'Aesthetic Life Planner',
    tagline: 'Organise ta vie avec style ✨',
    description: 'Un planificateur de vie complet au design rose & violet pour atteindre tes objectifs avec élégance.',
    longDescription: `Le planificateur de vie le plus esthétique qui soit ! Conçu pour les femmes ambitieuses qui veulent organiser leur vie quotidienne, leurs objectifs et leurs rêves dans un cadre visuellement magnifique.

Ce planificateur digital comprend 120+ pages entièrement personnalisables, avec des sections dédiées à tes objectifs annuels, mensuels et hebdomadaires. Chaque page a été pensée pour t'inspirer et te motiver tout au long de l'année.`,
    price: 27,
    originalPrice: 47,
    category: 'Planificateurs',
    badge: 'Bestseller',
    emoji: '📅',
    gradient: 'from-blush-300 to-violet-400',
    features: [
      'Vision Board annuel',
      'Tracker d\'habitudes mensuel',
      'Planificateur hebdomadaire',
      'Journal de gratitude',
      'Suivi des objectifs SMART',
      'Budget mensuel',
      'Lecture & apprentissage tracker',
      'Bien-être & self-care planner',
    ],
    includes: [
      '120+ pages PDF haute résolution',
      'Version A4 & Letter',
      'Version imprimable & numérique',
      'Guide d\'utilisation inclus',
      'Mises à jour gratuites à vie',
    ],
    format: 'PDF',
    pages: 120,
    rating: 4.9,
    reviews: 847,
    bestseller: true,
  },
  {
    id: 'social-media-content-kit',
    name: 'Social Media Content Kit',
    tagline: '365 jours de contenu prêt-à-poster 🌸',
    description: 'Calendrier éditorial complet + 200 templates Canva pour dominer les réseaux sociaux toute l\'année.',
    longDescription: `Arrête de te demander quoi poster ! Ce kit complet te donne 365 idées de contenu organisées par thème + 200 templates Canva esthétiques prêts à personnaliser en quelques minutes.

Conçu pour les créatrices de contenu, entrepreneurs et influenceuses qui veulent une présence cohérente et professionnelle sur Instagram, TikTok, Pinterest et Facebook.`,
    price: 37,
    originalPrice: 67,
    category: 'Social Media',
    badge: 'Nouveau',
    emoji: '📱',
    gradient: 'from-violet-300 to-blush-400',
    features: [
      '365 idées de contenu organisées',
      '200 templates Canva inclus',
      'Captions prêts-à-l\'emploi',
      'Hashtag strategy par niche',
      'Calendrier éditorial mensuel',
      'Stories, Reels & Posts',
      'Guide Instagram Growth',
      'Stratégie Pinterest incluse',
    ],
    includes: [
      'Accès Canva (200 templates)',
      'Calendrier PDF 365 jours',
      'Guide stratégie réseaux sociaux',
      'Bonus : 50 captions virales',
      'Accès communauté privée',
    ],
    format: 'PDF + Canva',
    rating: 4.8,
    reviews: 412,
    new: true,
  },
  {
    id: 'manifestation-journal',
    name: 'Manifestation & Gratitude Journal',
    tagline: 'Manifeste ta vie de rêve ✨',
    description: 'Journal de manifestation guidé pour transformer tes pensées en réalité avec la loi de l\'attraction.',
    longDescription: `Ce journal de manifestation guidé combine la loi de l'attraction, la méthode 369, la gratitude quotidienne et la visualisation créatrice pour t'aider à manifester la vie que tu mérites.

Chaque jour commence par une affirmation positive et se termine par une réflexion de gratitude. Les exercices guidés t'accompagnent pas à pas vers tes désirs les plus profonds.`,
    price: 17,
    originalPrice: 29,
    category: 'Développement Personnel',
    emoji: '🌙',
    gradient: 'from-blush-200 to-violet-300',
    features: [
      'Méthode 369 de manifestation',
      'Affirmations positives quotidiennes',
      'Exercices de visualisation',
      'Journal de gratitude guidé',
      'Script de manifestation',
      'Moon cycle planner',
      'Vision board digital',
      'Méditations guidées',
    ],
    includes: [
      '90 jours de journal guidé (180 pages)',
      'Guide de la loi de l\'attraction',
      'Affirmations audio MP3',
      'Méditation de manifestation',
      'Bonus : Vision Board template',
    ],
    format: 'PDF + MP3',
    pages: 180,
    rating: 4.9,
    reviews: 623,
  },
  {
    id: 'brand-identity-kit',
    name: 'Feminine Brand Identity Kit',
    tagline: 'Lance ta marque avec élégance 💜',
    description: 'Kit complet d\'identité visuelle féminine : logos, palettes, typographies et templates pour une marque cohérente.',
    longDescription: `Crée une identité de marque professionnelle et cohérente sans designer ! Ce kit complet inclut tout ce dont tu as besoin pour lancer ou relooker ta marque avec un style féminin, élégant et moderne.

Conçu sur Canva et Adobe Illustrator, tous les éléments sont entièrement personnalisables. Parfait pour les coachs, entrepreneurs, bloggeuses et créatrices de contenu.`,
    price: 47,
    originalPrice: 97,
    category: 'Branding',
    badge: 'Premium',
    emoji: '💎',
    gradient: 'from-violet-400 to-blush-300',
    features: [
      '3 variations de logo vectoriel',
      '5 palettes de couleurs tendance',
      '4 paires de typographies',
      'Business card templates',
      'Instagram highlight covers',
      'Signature email',
      'Brand guidelines document',
      'Mockups professionnels',
    ],
    includes: [
      'Fichiers SVG & PNG (fonds transparents)',
      'Accès Canva (50+ templates)',
      'Adobe Illustrator source files',
      'Guide d\'utilisation de la marque',
      'Bonus : Media Kit template',
    ],
    format: 'SVG + PNG + Canva',
    rating: 4.7,
    reviews: 289,
  },
  {
    id: 'notion-life-dashboard',
    name: 'Notion Life Dashboard',
    tagline: 'Ton QG de productivité ultime 🚀',
    description: 'Dashboard Notion all-in-one pour gérer ta vie, ton business et tes projets depuis un seul endroit.',
    longDescription: `Le système Notion ultime pour les femmes organisées ! Ce dashboard tout-en-un centralise ta vie personnelle et professionnelle dans un espace de travail magnifique et fonctionnel.

Fini les 15 applications différentes ! Gère tes tâches, projets, finances, lectures, objectifs, habitudes et bien plus encore depuis un seul tableau de bord Notion au design soigné.`,
    price: 22,
    originalPrice: 39,
    category: 'Productivité',
    emoji: '🗂️',
    gradient: 'from-blush-300 to-violet-500',
    features: [
      'Hub central life management',
      'Project management system',
      'Finance tracker complet',
      'Reading & learning log',
      'Habit tracker avancé',
      'Content calendar intégré',
      'Goals & OKR framework',
      'Journaling espace dédié',
    ],
    includes: [
      'Template Notion (duplication 1 clic)',
      'Guide de configuration vidéo',
      'Tutoriel Notion pour débutantes',
      'Mises à jour gratuites à vie',
      'Bonus : 20 templates Notion supplémentaires',
    ],
    format: 'Notion Template',
    rating: 4.8,
    reviews: 534,
  },
  {
    id: 'digital-marketing-blueprint',
    name: 'Digital Marketing Blueprint',
    tagline: 'Le guide ultime pour vendre en ligne 💸',
    description: 'Formation complète pour lancer et scaler ton business digital : email marketing, funnels, SEO et réseaux sociaux.',
    longDescription: `Tout ce que tu dois savoir pour construire un business digital rentable de zéro ! Ce guide complet de 200+ pages couvre toutes les stratégies de marketing digital utilisées par les entrepreneuses qui font 6 chiffres en ligne.

De la création de ton offre à l'automatisation de tes ventes, chaque étape est expliquée clairement avec des exemples concrets, des templates et des checklists actionables.`,
    price: 67,
    originalPrice: 127,
    category: 'Business',
    badge: 'Bestseller',
    emoji: '📈',
    gradient: 'from-violet-500 to-blush-400',
    features: [
      'Stratégie email marketing complète',
      'Création de funnels de vente',
      'SEO pour débutantes',
      'Publicité Meta & Google',
      'Stratégie de contenu organique',
      'Automatisation des ventes',
      'Pricing & offres irrésistibles',
      'Analyse des données & KPIs',
    ],
    includes: [
      'Guide PDF 200+ pages',
      '30 templates email marketing',
      'Checklist lancement de produit',
      'Calculateur de pricing',
      'Accès formation vidéo (5h)',
      'Bonus : Script de vente DM',
    ],
    format: 'PDF + Vidéo',
    pages: 200,
    rating: 4.9,
    reviews: 1024,
    bestseller: true,
  },
];

export const categories = [
  'Tous',
  'Planificateurs',
  'Social Media',
  'Développement Personnel',
  'Branding',
  'Productivité',
  'Business',
];

export function getProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}
