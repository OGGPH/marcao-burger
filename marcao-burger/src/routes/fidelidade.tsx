import { createFileRoute, Link } from "@tanstack/react-router";
import { Award, Gift, Star } from "lucide-react";

export const Route = createFileRoute("/fidelidade")({
  head: () => ({
    meta: [
      { title: "Programa de Fidelidade — Hamburgueria do Marcão" },
      { name: "description", content: "Acumule pontos a cada pedido e troque por recompensas. Níveis Bronze, Prata e Ouro." },
      { property: "og:title", content: "Programa de Fidelidade" },
      { property: "og:url", content: "/fidelidade" },
    ],
    links: [{ rel: "canonical", href: "/fidelidade" }],
  }),
  component: Page,
});

const tiers = [
  { icon: Award, name: "Bronze", from: 0, color: "text-orange-300", perks: ["1 ponto a cada R$ 1", "Acesso a promoções"] },
  { icon: Star, name: "Prata", from: 300, color: "text-zinc-300", perks: ["Frete grátis em pedidos > R$ 70", "Brindes em datas especiais"] },
  { icon: Gift, name: "Ouro", from: 1000, color: "text-primary", perks: ["10% off em todo pedido", "Combo surpresa no aniversário", "Atendimento VIP"] },
];

function Page() {
  return (
    <div className="container-prose py-20">
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs uppercase tracking-[0.3em] text-primary">Marcão Recompensa</span>
        <h1 className="mt-2 font-display text-5xl sm:text-6xl">Quanto mais você pede,<br />mais você ganha.</h1>
        <p className="mt-5 text-muted-foreground">
          Cada R$ 1 gasto = 1 ponto. Suba de nível e desbloqueie benefícios exclusivos.
        </p>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {tiers.map((t) => (
          <div key={t.name} className="rounded-2xl border border-border/60 bg-card/40 p-8">
            <t.icon className={`h-10 w-10 ${t.color}`} />
            <h2 className="mt-4 font-display text-3xl tracking-wider">{t.name}</h2>
            <p className="text-sm text-muted-foreground">A partir de {t.from} pontos</p>
            <ul className="mt-5 space-y-2 text-sm">
              {t.perks.map((p) => (
                <li key={p} className="flex gap-2"><span className="text-primary">✦</span>{p}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-14 text-center">
        <Link to="/login" className="inline-flex rounded-md bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-wider text-primary-foreground shadow-gold hover:opacity-90">
          Criar minha conta
        </Link>
      </div>
    </div>
  );
}
