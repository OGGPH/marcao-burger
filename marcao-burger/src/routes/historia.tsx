import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/historia")({
  head: () => ({
    meta: [
      { title: "Nossa História — Hamburgueria do Marcão" },
      { name: "description", content: "Como nasceu a Hamburgueria do Marcão, nossa missão, visão e valores." },
      { property: "og:title", content: "Nossa História — Marcão" },
      { property: "og:url", content: "/historia" },
    ],
    links: [{ rel: "canonical", href: "/historia" }],
  }),
  component: Page,
});

function Page() {
  return (
    <div className="container-prose py-20 max-w-3xl">
      <span className="text-xs uppercase tracking-[0.3em] text-primary">Nossa história</span>
      <h1 className="mt-2 font-display text-5xl sm:text-6xl">Do fogão a lenha<br />ao smash burger.</h1>
      <p className="mt-8 text-lg leading-relaxed text-muted-foreground">
        A Hamburgueria do Marcão começou pequena, numa esquina movimentada de São Luís,
        com uma chapa, um sonho e a receita de família. Marcão queria provar que um
        hambúrguer podia carregar a alma do Maranhão sem perder a alma do hambúrguer.
      </p>
      <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
        Hoje somos referência regional em sabor artesanal. Mas continuamos a mesma
        casa: acolhedora, honesta, apaixonada por comida e por cliente bem servido.
      </p>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {[
          { t: "Missão", d: "Servir hambúrgueres artesanais que valorizem a cultura maranhense, com qualidade absoluta e atendimento acolhedor." },
          { t: "Visão", d: "Ser referência regional em hamburgueria artesanal, conhecida pelo sabor e pelo respeito ao nosso povo." },
          { t: "Valores", d: "Qualidade, honestidade, higiene, respeito ao cliente e valorização da cultura maranhense." },
        ].map((b) => (
          <div key={b.t} className="rounded-2xl border border-border/60 bg-card/40 p-6">
            <h3 className="font-display text-2xl tracking-wider text-primary">{b.t}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{b.d}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
