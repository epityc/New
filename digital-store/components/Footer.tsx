import Link from 'next/link';
import { Sparkles, Heart, Instagram, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-blush-50 to-violet-50 border-t border-blush-100 mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-10">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blush-400 to-violet-500 flex items-center justify-center shadow-soft">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-2xl gradient-text">LumiStore</span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              Des produits digitaux premium pour les femmes ambitieuses qui veulent briller dans leur vie et leur business. ✨
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a href="#" className="w-9 h-9 rounded-full bg-white border border-blush-200 flex items-center justify-center hover:border-blush-400 hover:shadow-soft transition-all">
                <Instagram className="w-4 h-4 text-blush-500" />
              </a>
              <a href="mailto:hello@lumistore.com" className="w-9 h-9 rounded-full bg-white border border-blush-200 flex items-center justify-center hover:border-blush-400 hover:shadow-soft transition-all">
                <Mail className="w-4 h-4 text-blush-500" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-4">Boutique</h4>
            <ul className="space-y-2">
              {['Tous les produits', 'Planificateurs', 'Social Media', 'Branding', 'Business'].map((item) => (
                <li key={item}>
                  <Link href="/products" className="text-gray-500 text-sm hover:text-violet-600 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-4">Informations</h4>
            <ul className="space-y-2">
              {[
                { label: 'À propos', href: '/about' },
                { label: 'Contact', href: '#' },
                { label: 'FAQ', href: '#' },
                { label: 'Politique de remboursement', href: '#' },
                { label: 'Conditions générales', href: '#' },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-gray-500 text-sm hover:text-violet-600 transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="bg-white rounded-2xl p-6 border border-blush-100 shadow-card mb-8">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex-1">
              <h4 className="font-display font-bold text-lg text-gray-800 mb-1">
                Rejoins la communauté ✨
              </h4>
              <p className="text-gray-500 text-sm">Reçois des tips exclusifs et des offres privées.</p>
            </div>
            <form className="flex gap-2 w-full md:w-auto" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="ton@email.com"
                className="input flex-1 md:w-64"
              />
              <button type="submit" className="btn-primary whitespace-nowrap">
                Rejoindre
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-blush-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-gray-400 text-sm">
            © 2025 LumiStore. Tous droits réservés.
          </p>
          <p className="text-gray-400 text-sm flex items-center gap-1">
            Fait avec <Heart className="w-3.5 h-3.5 text-blush-400 fill-blush-400" /> & passion
          </p>
        </div>
      </div>
    </footer>
  );
}
