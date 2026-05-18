import Link from 'next/link';
import { Heart, Sparkles, Star, ArrowRight, CheckCircle } from 'lucide-react';

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-hero-gradient py-20 px-4 sm:px-6">
        <div className="orb w-80 h-80 bg-blush-300 -top-20 -right-20" />
        <div className="orb w-64 h-64 bg-violet-300 bottom-0 left-0" />

        <div className="relative max-w-3xl mx-auto text-center">
          <div className="text-6xl mb-6 animate-float">🌸</div>
          <h1 className="section-title text-gray-900 mb-6">
            Notre mission : t'aider à{' '}
            <span className="gradient-text">briller</span>
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
            LumiStore est né d'une conviction simple : chaque femme mérite des outils beaux et fonctionnels pour organiser sa vie, développer son business et réaliser ses rêves.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="badge-pink mb-4 inline-block">Notre histoire</span>
              <h2 className="font-display text-3xl font-bold text-gray-900 mb-6">
                Créées par des femmes,{' '}
                <span className="gradient-text">pour des femmes</span>
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Tout a commencé avec une frustration : les outils digitaux disponibles étaient soit trop complexes, soit trop ternes. Nous voulions quelque chose de beau, d'efficace et d'inspirant.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                Chaque produit LumiStore est conçu avec soin, testé par notre communauté et amélioré en continu. Nous ne lançons un produit que lorsque nous sommes fières de le mettre entre tes mains.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Rejoins plus de 3 700 femmes qui utilisent nos outils pour transformer leur quotidien. ✨
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { number: '3 700+', label: 'Clientes heureuses', emoji: '💜' },
                { number: '4.9/5', label: 'Note moyenne', emoji: '⭐' },
                { number: '6', label: 'Produits premium', emoji: '📦' },
                { number: '30j', label: 'Garantie remboursement', emoji: '🛡️' },
              ].map((stat) => (
                <div key={stat.label} className="card p-6 text-center">
                  <div className="text-3xl mb-2">{stat.emoji}</div>
                  <div className="font-display text-2xl font-bold gradient-text mb-1">{stat.number}</div>
                  <div className="text-xs text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gradient-to-br from-blush-50 to-violet-50 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="badge-purple mb-4 inline-block">Nos valeurs</span>
            <h2 className="section-title text-gray-900">
              Ce qui nous{' '}
              <span className="gradient-text">guide</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: '✨',
                title: 'Qualité premium',
                desc: 'Chaque produit est conçu avec soin et testé rigoureusement. Nous ne faisons aucun compromis sur la qualité.',
              },
              {
                icon: '💜',
                title: 'Design esthétique',
                desc: 'La beauté n\'est pas un luxe, c\'est une nécessité. Nos produits sont beaux parce que tu mérites le meilleur.',
              },
              {
                icon: '🌱',
                title: 'Impact réel',
                desc: 'Nous mesurons notre succès au changement positif que nos outils apportent dans ta vie quotidienne.',
              },
            ].map((value) => (
              <div key={value.title} className="card p-8 text-center">
                <div className="text-5xl mb-4">{value.icon}</div>
                <h3 className="font-display font-bold text-xl text-gray-800 mb-3">{value.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promises */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="section-title text-gray-900">
              Notre promesse{' '}
              <span className="gradient-text">envers toi</span>
            </h2>
          </div>

          <div className="space-y-4">
            {[
              'Téléchargement instantané dès l\'achat confirmé',
              'Mises à jour gratuites à vie sur tous les produits',
              'Satisfait ou remboursé sous 30 jours, sans question',
              'Support client réactif en français',
              'Produits créés et testés par de vraies utilisatrices',
              'Aucune donnée personnelle revendue à des tiers',
            ].map((promise) => (
              <div key={promise} className="flex items-center gap-3 p-4 bg-violet-50 rounded-xl border border-violet-100">
                <CheckCircle className="w-5 h-5 text-violet-500 flex-shrink-0" />
                <span className="text-gray-700 text-sm font-medium">{promise}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blush-400 to-violet-600 p-12 text-white shadow-glow">
            <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
            <div className="relative">
              <Sparkles className="w-8 h-8 mx-auto mb-4 text-white/80" />
              <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">
                Prête à commencer ?
              </h2>
              <p className="text-white/80 mb-8">
                Découvre tous nos produits et trouve ceux qui vont transformer ta vie.
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-violet-600 rounded-full font-bold hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                Voir la boutique
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
