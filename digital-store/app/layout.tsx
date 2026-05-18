import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/lib/cart';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'LumiStore – Produits Digitaux Premium',
  description: 'Planificateurs, templates, guides et outils digitaux pour les femmes ambitieuses. Téléchargement instantané.',
  keywords: 'produits digitaux, planner, templates canva, notion, développement personnel, business en ligne',
  openGraph: {
    title: 'LumiStore – Produits Digitaux Premium',
    description: 'Des produits digitaux premium pour les femmes ambitieuses ✨',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-screen flex flex-col">
        <CartProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
