'use client';

import { notFound } from 'next/navigation';
import { getProduct, products } from '@/lib/products';
import { useCart } from '@/lib/cart';
import { useState } from 'react';
import Link from 'next/link';
import {
  ShoppingBag, Star, Download, Shield, Check,
  ChevronLeft, Package, Zap, RefreshCw,
} from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import clsx from 'clsx';

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = getProduct(params.id);
  if (!product) notFound();

  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  const related = products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 3);

  const fallbackRelated = products.filter((p) => p.id !== product.id).slice(0, 3);
  const relatedProducts = related.length > 0 ? related : fallbackRelated;

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-violet-600 transition-colors">Accueil</Link>
        <ChevronLeft className="w-3.5 h-3.5 rotate-180" />
        <Link href="/products" className="hover:text-violet-600 transition-colors">Boutique</Link>
        <ChevronLeft className="w-3.5 h-3.5 rotate-180" />
        <span className="text-gray-800 font-medium">{product.name}</span>
      </nav>

      {/* Product Hero */}
      <div className="grid lg:grid-cols-2 gap-12 mb-16">
        {/* Visual */}
        <div className="relative">
          <div className={clsx(
            'relative rounded-3xl h-80 lg:h-full min-h-[400px] flex items-center justify-center overflow-hidden bg-gradient-to-br',
            product.gradient
          )}>
            <div className="absolute top-6 left-6 w-24 h-24 bg-white/20 rounded-full blur-2xl" />
            <div className="absolute bottom-6 right-6 w-32 h-32 bg-white/15 rounded-full blur-2xl" />
            <span className="text-9xl drop-shadow-2xl animate-float select-none">
              {product.emoji}
            </span>

            {product.badge && (
              <div className="absolute top-4 right-4">
                <span className="badge bg-white/90 text-violet-700 text-sm shadow-sm">
                  {product.badge === 'Bestseller' ? '🏆 ' : ''}{product.badge}
                </span>
              </div>
            )}
          </div>

          {/* Trust indicators */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            {[
              { icon: <Zap className="w-4 h-4" />, label: 'Accès immédiat' },
              { icon: <Shield className="w-4 h-4" />, label: 'Paiement sécurisé' },
              { icon: <Package className="w-4 h-4" />, label: 'Accès à vie' },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-1 bg-blush-50 rounded-xl p-3 text-center">
                <div className="text-violet-500">{item.icon}</div>
                <span className="text-xs font-medium text-gray-600">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="badge-pink">{product.category}</span>
            <span className="badge bg-gray-100 text-gray-500">{product.format}</span>
            {product.pages && (
              <span className="badge bg-violet-50 text-violet-600">{product.pages} pages</span>
            )}
          </div>

          <h1 className="font-display text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            {product.name}
          </h1>
          <p className="text-lg text-blush-500 font-medium mb-4">{product.tagline}</p>

          {/* Rating */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={clsx(
                    'w-4 h-4',
                    i < Math.floor(product.rating)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-200 fill-gray-200'
                  )}
                />
              ))}
            </div>
            <span className="text-gray-700 font-semibold">{product.rating}</span>
            <span className="text-gray-400 text-sm">({product.reviews.toLocaleString()} avis)</span>
          </div>

          <p className="text-gray-600 leading-relaxed mb-6">
            {product.longDescription.split('\n\n')[0]}
          </p>

          {/* Price */}
          <div className="flex items-center gap-4 mb-6 p-4 bg-blush-50 rounded-2xl">
            <span className="text-4xl font-bold gradient-text">{product.price}€</span>
            {product.originalPrice && (
              <>
                <span className="text-gray-400 text-xl line-through">{product.originalPrice}€</span>
                <span className="badge bg-blush-500 text-white">-{discount}% de réduction</span>
              </>
            )}
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <button
              onClick={handleAdd}
              className={clsx(
                'flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-full font-bold text-lg transition-all duration-300',
                added
                  ? 'bg-green-500 text-white'
                  : 'bg-gradient-to-r from-blush-400 to-violet-500 text-white hover:shadow-glow hover:-translate-y-0.5'
              )}
            >
              {added ? (
                <><Check className="w-5 h-5" /> Ajouté au panier !</>
              ) : (
                <><ShoppingBag className="w-5 h-5" /> Ajouter au panier</>
              )}
            </button>
            <Link href="/cart" className="btn-secondary px-6 py-4 justify-center">
              Voir le panier
            </Link>
          </div>

          {/* Guarantee */}
          <div className="flex items-start gap-3 p-4 bg-violet-50 rounded-2xl border border-violet-100">
            <RefreshCw className="w-5 h-5 text-violet-500 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-semibold text-gray-800">Satisfait ou remboursé — 30 jours</div>
              <div className="text-xs text-gray-500 mt-0.5">
                Si tu n'es pas satisfaite, nous te remboursons sans question. Promis.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features + Includes */}
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <div className="card p-8">
          <h2 className="font-display font-bold text-2xl text-gray-800 mb-6">
            Ce que tu vas apprendre / faire ✨
          </h2>
          <ul className="space-y-3">
            {product.features.map((f) => (
              <li key={f} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-blush-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-blush-600" />
                </div>
                <span className="text-gray-600 text-sm">{f}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card p-8">
          <h2 className="font-display font-bold text-2xl text-gray-800 mb-6">
            Ce qui est inclus 📦
          </h2>
          <ul className="space-y-3">
            {product.includes.map((inc) => (
              <li key={inc} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Download className="w-3 h-3 text-violet-600" />
                </div>
                <span className="text-gray-600 text-sm">{inc}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 pt-6 border-t border-blush-100">
            <p className="text-xs text-gray-400">
              <span className="font-semibold text-gray-600">Format : </span>{product.format}
              {product.pages && ` · ${product.pages} pages`}
            </p>
          </div>
        </div>
      </div>

      {/* Long description */}
      {product.longDescription.split('\n\n').length > 1 && (
        <div className="bg-gradient-to-br from-blush-50 to-violet-50 rounded-3xl p-8 mb-16 border border-blush-100">
          <h2 className="font-display font-bold text-2xl text-gray-800 mb-4">À propos de ce produit</h2>
          {product.longDescription.split('\n\n').map((para, i) => (
            <p key={i} className="text-gray-600 leading-relaxed mb-3 last:mb-0">{para}</p>
          ))}
        </div>
      )}

      {/* Related */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="font-display font-bold text-2xl text-gray-800 mb-6">
            Tu pourrais aussi aimer 💜
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
