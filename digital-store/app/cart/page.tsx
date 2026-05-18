'use client';

import Link from 'next/link';
import { useCart } from '@/lib/cart';
import { Trash2, ShoppingBag, ArrowRight, Shield, Download, Tag } from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';

export default function CartPage() {
  const { items, removeFromCart, clearCart, total, count } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [success, setSuccess] = useState(false);

  const discount = promoApplied ? total * 0.1 : 0;
  const finalTotal = total - discount;

  function applyPromo() {
    if (promoCode.toLowerCase() === 'lumi10') {
      setPromoApplied(true);
    }
  }

  function handleCheckout() {
    setCheckingOut(true);
    setTimeout(() => {
      setSuccess(true);
      clearCart();
    }, 1500);
  }

  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-20 text-center">
        <div className="card p-12">
          <div className="text-7xl mb-6 animate-float">🎉</div>
          <h1 className="font-display text-3xl font-bold text-gray-900 mb-3">
            Merci pour ton achat !
          </h1>
          <p className="text-gray-600 mb-2">
            Un email avec tes liens de téléchargement vient d'être envoyé.
          </p>
          <p className="text-gray-500 text-sm mb-8">
            Vérifie ton dossier spam si tu ne le reçois pas dans les 5 minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/products" className="btn-primary">
              Continuer mes achats
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-20 text-center">
        <div className="card p-12">
          <div className="text-7xl mb-6">🛍️</div>
          <h1 className="font-display text-2xl font-bold text-gray-800 mb-3">
            Ton panier est vide
          </h1>
          <p className="text-gray-500 mb-8">
            Découvre nos produits digitaux premium et commence ton parcours vers une vie organisée et épanouie.
          </p>
          <Link href="/products" className="btn-primary">
            Explorer la boutique
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">
        Mon panier
      </h1>
      <p className="text-gray-500 mb-8">
        {count} article{count > 1 ? 's' : ''} · Téléchargement instantané après achat
      </p>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(({ product, quantity }) => (
            <div key={product.id} className="card p-4 flex items-center gap-4">
              {/* Emoji visual */}
              <div className={clsx(
                'w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 text-3xl bg-gradient-to-br',
                product.gradient
              )}>
                {product.emoji}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-800 truncate">{product.name}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{product.category} · {product.format}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Download className="w-3 h-3 text-violet-400" />
                  <span className="text-xs text-violet-500 font-medium">Téléchargement instantané</span>
                </div>
              </div>

              <div className="flex items-center gap-4 flex-shrink-0">
                <span className="font-bold gradient-text text-lg">{product.price}€</span>
                <button
                  onClick={() => removeFromCart(product.id)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                  aria-label="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {/* Promo code */}
          <div className="card p-4">
            <div className="flex items-center gap-2 mb-3">
              <Tag className="w-4 h-4 text-violet-500" />
              <span className="text-sm font-semibold text-gray-700">Code promo</span>
              {!promoApplied && <span className="text-xs text-gray-400">(essaie LUMI10)</span>}
            </div>
            {promoApplied ? (
              <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                <span>✓ Code LUMI10 appliqué — 10% de réduction !</span>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  placeholder="MONCODE"
                  className="input flex-1"
                />
                <button onClick={applyPromo} className="btn-secondary">
                  Appliquer
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Summary */}
        <div>
          <div className="card p-6 sticky top-20">
            <h2 className="font-display font-bold text-xl text-gray-800 mb-6">Récapitulatif</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Sous-total</span>
                <span>{total.toFixed(2)}€</span>
              </div>
              {promoApplied && (
                <div className="flex justify-between text-sm text-green-600 font-medium">
                  <span>Réduction (10%)</span>
                  <span>-{discount.toFixed(2)}€</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-gray-600">
                <span>Livraison</span>
                <span className="text-green-600 font-medium">Gratuite ✓</span>
              </div>
              <div className="border-t border-blush-100 pt-3 flex justify-between font-bold text-lg">
                <span className="text-gray-800">Total</span>
                <span className="gradient-text">{finalTotal.toFixed(2)}€</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={checkingOut}
              className={clsx(
                'w-full flex items-center justify-center gap-2 py-4 rounded-full font-bold text-white transition-all duration-300 mb-4',
                checkingOut
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blush-400 to-violet-500 hover:shadow-glow hover:-translate-y-0.5'
              )}
            >
              {checkingOut ? (
                'Traitement en cours…'
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5" />
                  Payer {finalTotal.toFixed(2)}€
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
              <Shield className="w-3.5 h-3.5" />
              Paiement 100% sécurisé SSL
            </div>

            <div className="mt-4 pt-4 border-t border-blush-100">
              <p className="text-xs text-gray-400 text-center">
                En finalisant ta commande, tu acceptes nos{' '}
                <Link href="#" className="underline hover:text-violet-500">CGV</Link>.
                Satisfait ou remboursé 30 jours.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
