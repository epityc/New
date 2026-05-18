'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ShoppingBag, Menu, X, Sparkles } from 'lucide-react';
import { useCart } from '@/lib/cart';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { count } = useCart();

  const links = [
    { href: '/', label: 'Accueil' },
    { href: '/products', label: 'Boutique' },
    { href: '/about', label: 'À propos' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-blush-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blush-400 to-violet-500 flex items-center justify-center shadow-soft group-hover:shadow-glow transition-shadow">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-xl gradient-text">
              LumiStore
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-gray-600 hover:text-violet-600 font-medium transition-colors duration-200 relative group"
              >
                {l.label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-gradient-to-r from-blush-400 to-violet-500 group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </div>

          {/* Cart + Mobile menu */}
          <div className="flex items-center gap-3">
            <Link href="/cart" className="relative p-2 rounded-full hover:bg-blush-50 transition-colors">
              <ShoppingBag className="w-5 h-5 text-gray-600" />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-blush-400 to-violet-500 rounded-full text-white text-xs flex items-center justify-center font-bold">
                  {count}
                </span>
              )}
            </Link>

            <button
              onClick={() => setOpen(!open)}
              className="md:hidden p-2 rounded-full hover:bg-blush-50 transition-colors"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-blush-100 px-4 py-4 flex flex-col gap-4">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-gray-600 hover:text-violet-600 font-medium py-2 border-b border-blush-50 transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
