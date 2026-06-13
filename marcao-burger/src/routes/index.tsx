import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Flame, Star, Truck, Heart } from "lucide-react";
import heroBurger from "@/assets/hero-burger.jpg";
import maranhao from "@/assets/maranhao-culture.jpg";
import { supabase } from "@/integrations/supabase/client";
import { getProductImage } from "@/lib/product-images";
import { formatBRL } from "@/lib/cart";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Hamburgueria do Marcão — Sabor artesanal maranhense" },
      { name: "description", content: "Cada hambúrguer conta uma história de sabor maranhense. Artesanal, premium, com delivery em São Luís." },
      { property: "og:title", content: "Hamburgueria do Marcão" },
      { property: "og:description", content: "Cada hambúrguer conta uma história de sabor maranhense." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Restaurant",
        name: "Hamburgueria do Marcão",
        servesCuisine: ["Hambúrguer artesanal", "Culinária maranhense"],
        address: { "@type": "PostalAddress", addressLocality: "São Luís", addressRegion: "MA", addressCountry: "BR" },
        priceRange: "$$",
      }),
    }],
  }),
  component: Home,
});

function Home() {
  const { data: featured } = useQuery({
    queryKey: ["featured-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, slug, description, price")
        .eq("is_featured", true)
        .eq("is_available", true)
        .order("display_order");
      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="container-prose grid gap-10 lg:grid-cols-2 items-center py-20 lg:py-28">
          <div className="fade-up">
            <span className="inline-block text-xs uppercase tracking-[0.3em] text-primary">Artesanal · Maranhense · Premium</span>
            <h1 className="mt-4 font-display text-5xl sm:text-6xl lg:text-7xl leading-[0.95]">
              Cada hambúrguer<br />
              conta uma <span className="text-gradient-gold">história</span><br />
              de sabor maranhense.
            </h1>
            <p className="mt-6 max-w-lg text-base text-muted-foreground leading-relaxed">
              Carne selecionada, pão artesanal e ingredientes do Maranhão. Uma experiência
              que respeita a tradição e provoca o paladar.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/cardapio" className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-wider text-primary-foreground shadow-gold hover:opacity-90 transition">
                Ver cardápio <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/orgulho-maranhense" className="inline-flex items-center gap-2 rounded-md border border-primary/50 px-6 py-3 text-sm font-semibold uppercase tracking-wider text-primary hover:bg-primary/10 transition">
                Orgulho Maranhense
              </Link>
            </div>
          </div>
          <div className="relative">
            <img src={heroBurger} alt="Hambúrguer artesanal duplo com queijo derretido" width={1920} height={1080} className="rounded-3xl shadow-card float-slow" />
            <div className="absolute -inset-4 -z-10 rounded-3xl bg-primary/20 blur-3xl" />
          </div>
        </div>
      </section>

      {/* DIFERENCIAIS */}
      <section className="container-prose py-20">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: Flame, title: "Carne artesanal", desc: "Blend exclusivo, grelhado no ponto certo." },
            { icon: Heart, title: "Alma maranhense", desc: "Sabores e ingredientes do nosso estado." },
            { icon: Truck, title: "Delivery rápido", desc: "Quentinho na sua porta, sem perder o ponto." },
          ].map((d) => (
            <div key={d.title} className="rounded-2xl border border-border/60 bg-card/40 p-6 hover:border-primary/50 transition-colors">
              <d.icon className="h-8 w-8 text-primary" />
              <h3 className="mt-4 font-display text-2xl tracking-wider">{d.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{d.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* DESTAQUES */}
      <section className="container-prose py-12">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-primary">Os preferidos</span>
            <h2 className="mt-2 font-display text-4xl sm:text-5xl">Produtos em destaque</h2>
          </div>
          <Link to="/cardapio" className="hidden sm:inline-flex items-center gap-2 text-sm uppercase tracking-wider text-primary hover:opacity-80">
            Ver tudo <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {(featured ?? []).map((p) => (
            <Link to="/cardapio" key={p.id} className="group rounded-2xl overflow-hidden border border-border/60 bg-card hover:border-primary/50 transition-all hover:-translate-y-1">
              <div className="aspect-[4/3] overflow-hidden">
                <img src={getProductImage(p.slug)} alt={p.name} loading="lazy" width={800} height={600} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
              </div>
              <div className="p-5">
                <h3 className="font-display text-2xl tracking-wide">{p.name}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{p.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="font-display text-xl text-primary">{formatBRL(Number(p.price))}</span>
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">Pedir</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ORGULHO MARANHENSE TEASER */}
      <section className="relative my-24 overflow-hidden">
        <div className="container-prose grid lg:grid-cols-2 gap-10 items-center">
          <img src={maranhao} alt="Cultura maranhense — arquitetura colonial" loading="lazy" width={1600} height={1000} className="rounded-3xl shadow-card" />
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-accent">Nossa essência</span>
            <h2 className="mt-2 font-display text-4xl sm:text-5xl">Orgulho<br />Maranhense.</h2>
            <p className="mt-5 text-muted-foreground leading-relaxed">
              Carne de sol, queijo coalho, cuxá, cupuaçu — ingredientes que carregam séculos
              de história. Cada receita do Marcão é uma homenagem ao Maranhão, contada na
              linguagem universal do hambúrguer.
            </p>
            <Link to="/orgulho-maranhense" className="mt-6 inline-flex items-center gap-2 text-sm uppercase tracking-wider text-primary hover:opacity-80">
              Conheça a história <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* AVALIAÇÕES */}
      <section className="container-prose py-12">
        <div className="text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-primary">O que dizem</span>
          <h2 className="mt-2 font-display text-4xl sm:text-5xl">Quem prova, volta.</h2>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            { name: "Ana Letícia", text: "O Maranhense Burger é uma viagem pelo sabor da minha infância. Sensacional." },
            { name: "Rafael Costa", text: "Pão perfeito, carne no ponto, atendimento de outro nível. Virei cliente fiel." },
            { name: "Família Souza", text: "Pedimos o Combo Família toda sexta. Chegou quente e maravilhoso!" },
          ].map((r) => (
            <div key={r.name} className="rounded-2xl border border-border/60 bg-card/40 p-6">
              <div className="flex gap-1 text-primary">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
              </div>
              <p className="mt-3 text-sm text-muted-foreground italic">"{r.text}"</p>
              <p className="mt-4 font-display text-lg tracking-wider">— {r.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="container-prose py-24">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-ember p-10 sm:p-16 text-center shadow-ember">
          <h2 className="font-display text-4xl sm:text-6xl text-accent-foreground">Pediu, chegou. Quente.</h2>
          <p className="mt-3 text-accent-foreground/90 max-w-xl mx-auto">
            Faça seu pedido agora e ganhe pontos no nosso programa de fidelidade.
          </p>
          <Link to="/cardapio" className="mt-7 inline-flex items-center gap-2 rounded-md bg-background px-7 py-3 text-sm font-semibold uppercase tracking-wider text-foreground hover:opacity-90">
            Fazer pedido <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
