import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getProductImage } from "@/lib/product-images";
import { useCart, formatBRL } from "@/lib/cart";
import { toast } from "sonner";
import { Plus, Flag } from "lucide-react";

export const Route = createFileRoute("/cardapio")({
  head: () => ({
    meta: [
      { title: "Cardápio — Hamburgueria do Marcão" },
      { name: "description", content: "Burgers tradicionais, maranhenses, combos, milk-shakes e bebidas. Peça online." },
      { property: "og:title", content: "Cardápio — Hamburgueria do Marcão" },
      { property: "og:url", content: "/cardapio" },
    ],
    links: [{ rel: "canonical", href: "/cardapio" }],
  }),
  component: Cardapio,
});

function Cardapio() {
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const { add } = useCart();

  const { data } = useQuery({
    queryKey: ["menu"],
    queryFn: async () => {
      const [cats, prods] = await Promise.all([
        supabase.from("categories").select("*").order("display_order"),
        supabase.from("products").select("*").eq("is_available", true).order("display_order"),
      ]);
      if (cats.error) throw cats.error;
      if (prods.error) throw prods.error;
      return { categories: cats.data ?? [], products: prods.data ?? [] };
    },
  });

  const cats = data?.categories ?? [];
  const prods = (data?.products ?? []).filter((p) => !activeCat || p.category_id === activeCat);

  return (
    <div className="container-prose py-16">
      <div className="text-center">
        <span className="text-xs uppercase tracking-[0.3em] text-primary">Nosso cardápio</span>
        <h1 className="mt-2 font-display text-5xl sm:text-6xl">Escolha seu sabor</h1>
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-2">
        <button
          onClick={() => setActiveCat(null)}
          className={`rounded-full px-5 py-2 text-xs uppercase tracking-wider transition-colors ${!activeCat ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground hover:text-foreground"}`}
        >
          Todos
        </button>
        {cats.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveCat(c.id)}
            className={`rounded-full px-5 py-2 text-xs uppercase tracking-wider transition-colors ${activeCat === c.id ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground hover:text-foreground"}`}
          >
            {c.name}
          </button>
        ))}
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {prods.map((p) => (
          <div key={p.id} className="group rounded-2xl overflow-hidden border border-border/60 bg-card hover:border-primary/50 transition-all">
            <div className="relative aspect-[4/3] overflow-hidden">
              <img src={getProductImage(p.slug)} alt={p.name} loading="lazy" width={800} height={600} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
              {p.is_maranhense && (
                <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-accent/95 px-3 py-1 text-[10px] uppercase tracking-widest text-accent-foreground">
                  <Flag className="h-3 w-3" /> Maranhense
                </span>
              )}
            </div>
            <div className="p-5">
              <h3 className="font-display text-2xl tracking-wide">{p.name}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{p.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="font-display text-xl text-primary">{formatBRL(Number(p.price))}</span>
                <button
                  onClick={() => {
                    add({ productId: p.id, name: p.name, price: Number(p.price), imageKey: p.slug });
                    toast.success(`${p.name} adicionado`);
                  }}
                  className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-2 text-xs font-semibold uppercase tracking-wider text-primary-foreground hover:opacity-90"
                >
                  <Plus className="h-3 w-3" /> Adicionar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
