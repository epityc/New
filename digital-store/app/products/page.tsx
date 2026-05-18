'use client';

import { useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { products, categories } from '@/lib/products';
import ProductCard from '@/components/ProductCard';

export default function ProductsPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Tous');
  const [sort, setSort] = useState('popular');

  const filtered = products
    .filter((p) => {
      const q = search.toLowerCase();
      return (
        (category === 'Tous' || p.category === category) &&
        (p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q))
      );
    })
    .sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price;
      if (sort === 'price-desc') return b.price - a.price;
      if (sort === 'rating') return b.rating - a.rating;
      return b.reviews - a.reviews; // popular
    });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <span className="badge-pink mb-4 inline-block">Boutique</span>
        <h1 className="section-title text-gray-900 mb-4">
          Tous nos{' '}
          <span className="gradient-text">produits digitaux</span>
        </h1>
        <p className="text-gray-500 max-w-xl mx-auto">
          Des outils premium pour organiser ta vie, développer ton business et manifester tes rêves. Téléchargement instantané.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-blush-100 shadow-card p-4 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="search"
              placeholder="Rechercher un produit…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-10"
            />
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="input py-2.5 w-auto"
            >
              <option value="popular">Plus populaires</option>
              <option value="rating">Mieux notés</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
            </select>
          </div>
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2 mt-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                category === cat
                  ? 'bg-gradient-to-r from-blush-400 to-violet-500 text-white shadow-soft'
                  : 'bg-gray-100 text-gray-600 hover:bg-blush-50 hover:text-violet-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-500 mb-6">
        {filtered.length} produit{filtered.length > 1 ? 's' : ''} trouvé{filtered.length > 1 ? 's' : ''}
        {category !== 'Tous' && ` dans « ${category} »`}
        {search && ` pour « ${search} »`}
      </p>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="font-display font-bold text-xl text-gray-700 mb-2">
            Aucun produit trouvé
          </h3>
          <p className="text-gray-500 mb-6">Essaie une autre recherche ou catégorie.</p>
          <button
            onClick={() => { setSearch(''); setCategory('Tous'); }}
            className="btn-secondary"
          >
            Réinitialiser les filtres
          </button>
        </div>
      )}
    </div>
  );
}
