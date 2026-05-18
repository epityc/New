import Link from 'next/link';
import { ArrowRight, Download, Shield, Zap, Star, Users, Package, ChevronRight } from 'lucide-react';
import { products } from '@/lib/products';
import ProductCard from '@/components/ProductCard';

export default function HomePage() {
  const featuredProducts = products.filter((p) => p.bestseller || p.new).slice(0, 3);

  return (
    <>
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden bg-hero-gradient min-h-[90vh] flex items-center">
        {/* Orbs */}
        <div className="orb w-96 h-96 bg-blush-300 -top-20 -left-20" />
        <div className="orb w-80 h-80 bg-violet-300 -bottom-20 -right-20" />
        <div className="orb w-64 h-64 bg-blush-200 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div>
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium text-violet-700 border border-violet-200 mb-6 shadow-sm">
              <Zap className="w-4 h-4 text-blush-400 fill-blush-400" />
              Téléchargement instantané · Accès à vie
            </div>

            <h1 className="font-display text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-tight mb-6">
              Des outils pour{' '}
              <span className="gradient-text">briller</span>{' '}
              dans ta vie ✨
            </h1>

            <p className="text-lg text-gray-600 leading-relaxed mb-8 max-w-lg">
              Planificateurs, templates et guides premium conçus pour les femmes ambitieuses qui veulent organiser leur vie, développer leur business et manifester leurs rêves.
            </p>

            <div className="flex flex-wrap gap-4 mb-10">
              <Link href="/products" className="btn-primary text-lg px-8 py-4">
                Découvrir la boutique
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/about" className="btn-secondary text-lg px-8 py-4">
                En savoir plus
              </Link>
            </div>

            {/* Social proof */}
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {['🌸', '💜', '✨', '🌙', '💫'].map((emoji, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-blush-300 to-violet-400 flex items-center justify-center text-sm border-2 border-white">
                      {emoji}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-800">+3 700</div>
                  <div className="text-xs text-gray-500">clientes heureuses</div>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
                <span className="text-sm font-semibold text-gray-700 ml-1">4.9/5</span>
              </div>
            </div>
          </div>

          {/* Hero visual */}
          <div className="relative flex items-center justify-center">
            <div className="relative w-full max-w-sm mx-auto">
              {/* Main card */}
              <div className="bg-white rounded-3xl p-6 shadow-glow border border-blush-100 animate-float">
                <div className="text-6xl text-center mb-4">📅</div>
                <h3 className="font-display font-bold text-xl text-gray-800 text-center mb-2">
                  Aesthetic Life Planner
                </h3>
                <p className="text-gray-500 text-sm text-center mb-4">
                  Organise ta vie avec style ✨
                </p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold gradient-text">27€</span>
                  <span className="text-gray-400 line-through text-sm">47€</span>
                </div>
                <div className="btn-primary w-full justify-center">
                  <ShoppingBagIcon />
                  Ajouter au panier
                </div>
              </div>

              {/* Floating badges */}
              <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-card p-3 border border-blush-100">
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4 text-violet-500" />
                  <span className="text-xs font-semibold text-gray-700">Instant download</span>
                </div>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-card p-3 border border-blush-100">
                <div className="flex items-center gap-2">
                  <span className="text-yellow-400">⭐</span>
                  <span className="text-xs font-semibold text-gray-700">847 avis · 4.9/5</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TRUST BAR ===== */}
      <section className="bg-white border-y border-blush-100 py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: <Download className="w-5 h-5" />, label: 'Téléchargement instantané', sub: 'Accès immédiat après achat' },
              { icon: <Shield className="w-5 h-5" />, label: 'Paiement sécurisé', sub: 'SSL & protection acheteur' },
              { icon: <Package className="w-5 h-5" />, label: 'Accès à vie', sub: 'Mises à jour gratuites' },
              { icon: <Users className="w-5 h-5" />, label: '+3 700 clientes', sub: 'Note moyenne 4.9/5' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blush-50 flex items-center justify-center text-blush-500 flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-800">{item.label}</div>
                  <div className="text-xs text-gray-500">{item.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED PRODUCTS ===== */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="badge-pink mb-4 inline-block">Produits phares</span>
            <h2 className="section-title text-gray-900 mb-4">
              Nos{' '}
              <span className="gradient-text">bestsellers</span>
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Les produits les plus aimés par notre communauté. Chaque outil a été conçu avec soin pour transformer ta vie quotidienne.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center">
            <Link href="/products" className="btn-secondary">
              Voir tous les produits
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-20 bg-gradient-to-br from-blush-50 to-violet-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <span className="badge-purple mb-4 inline-block">Comment ça marche</span>
            <h2 className="section-title text-gray-900">
              Simple, rapide,{' '}
              <span className="gradient-text">immédiat</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                emoji: '🛍️',
                title: 'Choisis ton produit',
                desc: 'Parcours notre boutique et sélectionne les outils qui vont transformer ta vie.',
              },
              {
                step: '02',
                emoji: '💳',
                title: 'Paiement sécurisé',
                desc: 'Règle en quelques secondes par carte bancaire. 100% sécurisé et protégé.',
              },
              {
                step: '03',
                emoji: '⚡',
                title: 'Téléchargement instantané',
                desc: 'Accède à ton produit immédiatement. Lien de téléchargement envoyé par email.',
              },
            ].map((item) => (
              <div key={item.step} className="relative text-center">
                <div className="absolute top-8 right-0 hidden md:last:hidden md:block w-full h-px bg-gradient-to-r from-blush-200 to-violet-200" />
                <div className="relative bg-white rounded-2xl p-8 shadow-card border border-blush-100">
                  <div className="text-xs font-bold text-violet-400 mb-4 tracking-widest">
                    ÉTAPE {item.step}
                  </div>
                  <div className="text-5xl mb-4">{item.emoji}</div>
                  <h3 className="font-display font-bold text-lg text-gray-800 mb-2">{item.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="badge-pink mb-4 inline-block">Témoignages</span>
            <h2 className="section-title text-gray-900">
              Ce qu'elles en{' '}
              <span className="gradient-text">pensent</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Sophie M.',
                role: 'Entrepreneure',
                emoji: '👩‍💼',
                text: 'Le Life Planner a complètement changé ma façon d\'organiser mes journées. Je me sens enfin en contrôle de ma vie ! Design magnifique en plus.',
                product: 'Aesthetic Life Planner',
                rating: 5,
              },
              {
                name: 'Camille D.',
                role: 'Créatrice de contenu',
                emoji: '✨',
                text: 'Le Social Media Kit est incroyable ! J\'avais du mal à être régulière, maintenant j\'ai du contenu prêt pour 1 an entier. Ça m\'a économisé des heures.',
                product: 'Social Media Content Kit',
                rating: 5,
              },
              {
                name: 'Léa R.',
                role: 'Coach bien-être',
                emoji: '🌸',
                text: 'Le Brand Kit est exactement ce dont j\'avais besoin pour lancer ma marque. Professionnel, cohérent et tellement esthétique. Mes clientes adorent !',
                product: 'Feminine Brand Identity Kit',
                rating: 5,
              },
            ].map((t) => (
              <div key={t.name} className="card p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-5 italic">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blush-300 to-violet-400 flex items-center justify-center text-lg">
                    {t.emoji}
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-gray-800">{t.name}</div>
                    <div className="text-xs text-gray-500">{t.role} · {t.product}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blush-400 via-violet-500 to-violet-600 p-10 md:p-16 text-center text-white shadow-glow">
            {/* Orbs */}
            <div className="absolute top-0 left-0 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-2xl" />

            <div className="relative">
              <div className="text-5xl mb-4">🌸</div>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Prête à transformer ta vie ?
              </h2>
              <p className="text-white/80 text-lg mb-8 max-w-md mx-auto">
                Rejoins plus de 3 700 femmes qui utilisent nos outils pour briller chaque jour.
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-violet-600 rounded-full font-bold text-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                Explorer la boutique
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function ShoppingBagIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  );
}
