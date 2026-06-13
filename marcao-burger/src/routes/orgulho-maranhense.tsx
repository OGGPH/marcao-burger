import { createFileRoute } from "@tanstack/react-router";
import maranhao from "@/assets/maranhao-culture.jpg";

export const Route = createFileRoute("/orgulho-maranhense")({
  head: () => ({
    meta: [
      { title: "Orgulho Maranhense — Hamburgueria do Marcão" },
      { name: "description", content: "A cultura, os ingredientes e a história do Maranhão que vivem em cada hambúrguer artesanal do Marcão." },
      { property: "og:title", content: "Orgulho Maranhense" },
      { property: "og:url", content: "/orgulho-maranhense" },
    ],
    links: [{ rel: "canonical", href: "/orgulho-maranhense" }],
  }),
  component: Page,
});

function Page() {
  return (
    <article>
      <section className="relative">
        <img src={maranhao} alt="Cores do Maranhão" width={1600} height={1000} className="h-[55vh] w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute inset-0 flex items-end">
          <div className="container-prose pb-12">
            <span className="text-xs uppercase tracking-[0.3em] text-primary">Nossa essência</span>
            <h1 className="mt-2 font-display text-5xl sm:text-7xl">Orgulho<br />Maranhense.</h1>
          </div>
        </div>
      </section>

      <section className="container-prose py-16 max-w-3xl">
        <p className="text-lg leading-relaxed text-muted-foreground">
          O Maranhão é tambor, é bumba-meu-boi, é São Luís pintada de azulejos azuis.
          É o sabor da carne de sol no fogão a lenha, do queijo coalho dourado na chapa,
          do cuxá que carrega séculos de tradição indígena, africana e portuguesa.
        </p>
        <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
          A Hamburgueria do Marcão nasceu desse chão. Antes do primeiro pão e da
          primeira carne, veio a vontade de contar a nossa história usando uma das
          comidas mais democráticas do mundo: o hambúrguer.
        </p>

        <div className="my-12 grid gap-6 md:grid-cols-2">
          {[
            { t: "Carne de Sol", d: "Curada artesanalmente, desfiada e refogada com manteiga de garrafa." },
            { t: "Queijo Coalho", d: "Grelhado na chapa até formar a crosta dourada perfeita." },
            { t: "Cuxá", d: "Molho de vinagreira, gergelim e camarão seco — patrimônio maranhense." },
            { t: "Cupuaçu", d: "A fruta da Amazônia que brilha no milk-shake mais pedido da casa." },
          ].map((i) => (
            <div key={i.t} className="rounded-2xl border border-border/60 bg-card/40 p-6">
              <h3 className="font-display text-2xl tracking-wider text-primary">{i.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{i.d}</p>
            </div>
          ))}
        </div>

        <p className="text-lg leading-relaxed text-muted-foreground">
          Aqui no Marcão, cada mordida é uma celebração do nosso povo. Não somos só
          uma hamburgueria — somos um pedaço do Maranhão que cabe na palma da mão.
        </p>
      </section>
    </article>
  );
}
