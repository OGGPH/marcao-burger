import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Phone, MessageCircle, Instagram, Facebook } from "lucide-react";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: "Contato — Hamburgueria do Marcão" },
      { name: "description", content: "WhatsApp, redes sociais e endereço da Hamburgueria do Marcão em São Luís — MA." },
      { property: "og:title", content: "Contato — Marcão" },
      { property: "og:url", content: "/contato" },
    ],
    links: [{ rel: "canonical", href: "/contato" }],
  }),
  component: Page,
});

function Page() {
  return (
    <div className="container-prose py-20">
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs uppercase tracking-[0.3em] text-primary">Fala com a gente</span>
        <h1 className="mt-2 font-display text-5xl sm:text-6xl">Estamos aqui pra você.</h1>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: MessageCircle, t: "WhatsApp", d: "(98) 0000-0000", href: "https://wa.me/5598000000000" },
          { icon: Instagram, t: "Instagram", d: "@hamburgueriadomarcao", href: "https://instagram.com" },
          { icon: Facebook, t: "Facebook", d: "/hamburgueriadomarcao", href: "https://facebook.com" },
          { icon: MapPin, t: "Endereço", d: "Centro Histórico, São Luís — MA", href: "https://maps.google.com" },
        ].map((c) => (
          <a key={c.t} href={c.href} target="_blank" rel="noreferrer" className="group rounded-2xl border border-border/60 bg-card/40 p-6 hover:border-primary/50 transition-colors">
            <c.icon className="h-7 w-7 text-primary" />
            <h3 className="mt-4 font-display text-xl tracking-wider">{c.t}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{c.d}</p>
          </a>
        ))}
      </div>

      <div className="mt-12 grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
        <div className="rounded-2xl border border-border/60 bg-card/40 p-5"><Phone className="h-4 w-4 text-primary inline mr-2" />Seg–Dom · 18h às 23h</div>
        <div className="rounded-2xl border border-border/60 bg-card/40 p-5">Delivery até 8km de raio</div>
        <div className="rounded-2xl border border-border/60 bg-card/40 p-5">Aceitamos PIX, cartão e dinheiro</div>
      </div>
    </div>
  );
}
