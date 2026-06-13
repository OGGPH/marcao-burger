import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCart, formatBRL } from "@/lib/cart";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";
import { getProductImage } from "@/lib/product-images";

export const Route = createFileRoute("/carrinho")({
  head: () => ({ meta: [{ title: "Carrinho — Marcão" }, { name: "robots", content: "noindex" }] }),
  component: Carrinho,
});

function Carrinho() {
  const { items, setQty, remove, subtotal, clear, count } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [payment, setPayment] = useState<"pix" | "cartao" | "dinheiro">("pix");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const deliveryFee = subtotal > 0 && subtotal < 50 ? 7 : 0;
  const total = subtotal + deliveryFee;

  async function checkout() {
    if (!user) { navigate({ to: "/login", search: { redirect: "/carrinho" } as never }); return; }
    if (!address.trim() || !phone.trim()) { toast.error("Informe endereço e telefone"); return; }
    setSubmitting(true);
    try {
      const { data: order, error } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          payment_method: payment,
          subtotal,
          delivery_fee: deliveryFee,
          total,
          delivery_address: address,
          phone,
          notes: notes || null,
        })
        .select("id")
        .single();
      if (error) throw error;

      const { error: itemsErr } = await supabase.from("order_items").insert(
        items.map((i) => ({
          order_id: order.id,
          product_id: i.productId,
          product_name: i.name,
          unit_price: i.price,
          quantity: i.quantity,
          subtotal: i.price * i.quantity,
        })),
      );
      if (itemsErr) throw itemsErr;

      clear();
      toast.success("Pedido recebido! Acompanhe na sua conta.");
      navigate({ to: "/conta" });
    } catch (e) {
      console.error(e);
      toast.error("Não foi possível enviar o pedido. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  }

  if (count === 0) {
    return (
      <div className="container-prose py-24 text-center">
        <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground" />
        <h1 className="mt-4 font-display text-4xl">Seu carrinho está vazio</h1>
        <p className="mt-2 text-muted-foreground">Que tal começar pelo nosso cardápio?</p>
        <Link to="/cardapio" className="mt-6 inline-flex rounded-md bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-wider text-primary-foreground">
          Ver cardápio
        </Link>
      </div>
    );
  }

  return (
    <div className="container-prose py-16 grid gap-10 lg:grid-cols-[1fr_380px]">
      <div>
        <h1 className="font-display text-4xl">Seu carrinho</h1>
        <ul className="mt-6 divide-y divide-border/60">
          {items.map((i) => (
            <li key={i.productId} className="flex gap-4 py-4">
              <img src={getProductImage(i.imageKey ?? "")} alt="" width={80} height={80} className="h-20 w-20 rounded-lg object-cover" />
              <div className="flex-1">
                <p className="font-display text-xl tracking-wider">{i.name}</p>
                <p className="text-sm text-muted-foreground">{formatBRL(i.price)}</p>
                <div className="mt-2 inline-flex items-center gap-1 rounded-md border border-border">
                  <button onClick={() => setQty(i.productId, i.quantity - 1)} className="p-2 hover:bg-secondary"><Minus className="h-3 w-3" /></button>
                  <span className="px-3 text-sm">{i.quantity}</span>
                  <button onClick={() => setQty(i.productId, i.quantity + 1)} className="p-2 hover:bg-secondary"><Plus className="h-3 w-3" /></button>
                </div>
              </div>
              <div className="text-right">
                <p className="font-display text-lg text-primary">{formatBRL(i.price * i.quantity)}</p>
                <button onClick={() => remove(i.productId)} className="mt-2 text-muted-foreground hover:text-destructive" aria-label="Remover">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <aside className="h-fit rounded-2xl border border-border/60 bg-card p-6 sticky top-24">
        <h2 className="font-display text-2xl tracking-wider">Finalizar</h2>

        <div className="mt-4 space-y-3">
          <label className="block text-xs uppercase tracking-wider text-muted-foreground">Endereço de entrega
            <input value={address} onChange={(e) => setAddress(e.target.value)} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground" placeholder="Rua, número, bairro" />
          </label>
          <label className="block text-xs uppercase tracking-wider text-muted-foreground">Telefone
            <input value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground" placeholder="(98) 9..." />
          </label>
          <label className="block text-xs uppercase tracking-wider text-muted-foreground">Observações
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground" placeholder="Sem cebola, ponto da carne..." />
          </label>
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Pagamento</p>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {(["pix", "cartao", "dinheiro"] as const).map((m) => (
                <button key={m} onClick={() => setPayment(m)} className={`rounded-md border px-2 py-2 text-xs uppercase tracking-wider transition ${payment === m ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"}`}>
                  {m === "pix" ? "PIX" : m === "cartao" ? "Cartão" : "Dinheiro"}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-1 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatBRL(subtotal)}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Entrega</span><span>{deliveryFee === 0 ? "Grátis" : formatBRL(deliveryFee)}</span></div>
          <div className="flex justify-between pt-2 border-t border-border font-display text-xl"><span>Total</span><span className="text-primary">{formatBRL(total)}</span></div>
        </div>

        <button onClick={checkout} disabled={submitting} className="mt-5 w-full rounded-md bg-primary py-3 text-sm font-semibold uppercase tracking-wider text-primary-foreground hover:opacity-90 disabled:opacity-60">
          {submitting ? "Enviando..." : user ? "Confirmar pedido" : "Entrar para finalizar"}
        </button>
      </aside>
    </div>
  );
}
