'use client';

import Link from 'next/link';
import { ShoppingBag, Star, Zap } from 'lucide-react';
import { Product } from '@/lib/products';
import { useCart } from '@/lib/cart';
import { useState } from 'react';
import clsx from 'clsx';

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <Link href={`/products/${product.id}`} className="product-card card group flex flex-col overflow-hidden">
      {/* Card visual */}
      <div className={clsx(
        'relative h-48 bg-gradient-to-br flex items-center justify-center overflow-hidden',
        product.gradient
      )}>
        <span className="product-card-img text-7xl drop-shadow-lg select-none">
          {product.emoji}
        </span>

        {/* Decorative orbs */}
        <div className="absolute top-3 left-3 w-16 h-16 bg-white/20 rounded-full blur-xl" />
        <div className="absolute bottom-3 right-3 w-20 h-20 bg-white/15 rounded-full blur-xl" />

        {/* Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-1">
          {product.badge && (
            <span className="badge bg-white/90 text-violet-700 shadow-sm text-xs">
              {product.badge === 'Bestseller' && '🏆 '}{product.badge}
            </span>
          )}
          {discount > 0 && (
            <span className="badge bg-blush-500 text-white shadow-sm">
              -{discount}%
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="badge-pink">{product.category}</span>
          {product.format && (
            <span className="badge bg-gray-100 text-gray-500">{product.format}</span>
          )}
        </div>

        <h3 className="font-display font-bold text-lg text-gray-800 mb-1 group-hover:gradient-text transition-all">
          {product.name}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed flex-1 mb-3">
          {product.description}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-4">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={clsx(
                  'w-3.5 h-3.5',
                  i < Math.floor(product.rating)
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-200 fill-gray-200'
                )}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500 font-medium">
            {product.rating} ({product.reviews.toLocaleString()})
          </span>
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between">
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold gradient-text">{product.price}€</span>
            {product.originalPrice && (
              <span className="text-gray-400 text-sm line-through mb-0.5">{product.originalPrice}€</span>
            )}
          </div>

          <button
            onClick={handleAdd}
            className={clsx(
              'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300',
              added
                ? 'bg-green-100 text-green-700'
                : 'bg-gradient-to-r from-blush-400 to-violet-500 text-white hover:shadow-soft hover:-translate-y-0.5 active:translate-y-0'
            )}
          >
            {added ? (
              <>✓ Ajouté</>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                Ajouter
              </>
            )}
          </button>
        </div>
      </div>
    </Link>
  );
}
