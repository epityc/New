import Link from "next/link";
import { Zap, Video, Image, TrendingUp, Check } from "lucide-react";

const features = [
  { icon: Video, title: "Vidéos UGC en 1 clic", desc: "Génère des vidéos publicitaires authentiques avec des influenceurs IA." },
  { icon: Image, title: "Visuels produit", desc: "Photos produit professionnelles sans shooting photo." },
  { icon: TrendingUp, title: "ROAS optimisé", desc: "Des créatifs qui convertissent, générés à l'échelle." },
];

const plans = [
  {
    name: "Starter",
    price: "49",
    credits: "50 crédits / mois",
    features: ["Vidéos Sora 2 & Veo 3.1", "Images Nano Banana", "Historique 30 jours", "Support email"],
  },
  {
    name: "Pro",
    price: "149",
    credits: "200 crédits / mois",
    features: ["Tout Starter", "Kling 3.0 inclus", "Influenceurs personnalisés", "Historique illimité", "Support prioritaire"],
    highlighted: true,
  },
  {
    name: "Agency",
    price: "399",
    credits: "Crédits illimités",
    features: ["Tout Pro", "Multi-comptes", "API access", "Onboarding dédié", "Account manager"],
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <span className="text-xl font-bold text-brand-600">Creator</span>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">Connexion</Link>
          <Link href="/signup" className="bg-brand-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-brand-700 transition-colors">
            Commencer gratuitement
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="text-center px-6 py-24 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-brand-50 text-brand-700 text-sm px-3 py-1 rounded-full mb-6">
          <Zap size={14} />
          Propulsé par Arcads, Sora 2 & Veo 3.1
        </div>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
          Des vidéos publicitaires IA<br />
          <span className="text-brand-600">en quelques secondes</span>
        </h1>
        <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
          Crée des vidéos UGC, des visuels produit et des publicités qui convertissent — sans équipe créative.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/signup" className="bg-brand-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-brand-700 transition-colors">
            Créer mon premier spot
          </Link>
          <Link href="#pricing" className="border border-gray-200 text-gray-700 px-8 py-4 rounded-xl text-lg font-semibold hover:border-gray-300 transition-colors">
            Voir les tarifs
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-16 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="p-6 border border-gray-100 rounded-2xl hover:border-brand-200 transition-colors">
              <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center mb-4">
                <Icon size={20} className="text-brand-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{title}</h3>
              <p className="text-gray-500 text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="px-6 py-24 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Tarifs simples et transparents</h2>
          <p className="text-center text-gray-500 mb-12">Sans engagement, annulable à tout moment.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-8 ${plan.highlighted ? "bg-brand-600 text-white ring-2 ring-brand-600" : "bg-white border border-gray-200"}`}
              >
                <h3 className={`font-bold text-lg mb-1 ${plan.highlighted ? "text-white" : ""}`}>{plan.name}</h3>
                <p className={`text-sm mb-4 ${plan.highlighted ? "text-brand-100" : "text-gray-500"}`}>{plan.credits}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className={`text-sm ${plan.highlighted ? "text-brand-100" : "text-gray-500"}`}>/mois</span>
                </div>
                <ul className="space-y-2 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <Check size={16} className={plan.highlighted ? "text-brand-100" : "text-brand-600"} />
                      <span className={plan.highlighted ? "text-brand-50" : "text-gray-600"}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/signup"
                  className={`block text-center py-3 rounded-xl font-semibold text-sm transition-colors ${
                    plan.highlighted
                      ? "bg-white text-brand-600 hover:bg-brand-50"
                      : "bg-brand-600 text-white hover:bg-brand-700"
                  }`}
                >
                  Démarrer avec {plan.name}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-400 text-sm">
        © {new Date().getFullYear()} Creator. Tous droits réservés.
      </footer>
    </div>
  );
}
