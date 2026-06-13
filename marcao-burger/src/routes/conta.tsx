import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { formatBRL } from "@/lib/cart";
import { Award, LogOut } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/conta")({
  head: () => ({ meta: [{ title: "Minha conta — Marcão" }, { name: "robots", content: "noindex" }] }),
  component: Conta,
});

function Conta() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { if (!loading && !user) navigate({ to: "/login" }); }, [loading, user, navigate]);

  const { data: profile } = useQuery({
    enabled: !!user,
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", user!.id).single();
      if (error) throw error;
      return data;
    },
  });

  const { data: orders } = useQuery({
    enabled: !!user,
    queryKey: ["orders", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("id, status, total, created_at, payment_method, order_items(product_name, quantity)")
        .order("created_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      return data ?? [];
    },
  });

  async function logout() {
    await supabase.auth.signOut();
    toast.success("Até a próxima!");
    navigate({ to: "/" });
  }

  if (!user) return null;

  const tierColor: Record<string, string> = { bronze: "text-orange-300", prata: "text-zinc-300", ouro: "text-primary" };
  const statusLabel: Record<string, string> = {
    recebido: "Recebido", em_preparo: "Em preparo", saiu_entrega: "Saiu para entrega",
    entregue: "Entregue", cancelado: "Cancelado",
  };

  return (
    <div className="container-prose py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.3em] text-primary">Minha conta</span>
          <h1 className="mt-1 font-display text-4xl">Olá, {profile?.full_name ?? "amigo"}.</h1>
        </div>
        <button onClick={logout} className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground">
          <LogOut className="h-4 w-4" /> Sair
        </button>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-border/60 bg-card p-6">
          <Award className={`h-8 w-8 ${tierColor[profile?.loyalty_tier ?? "bronze"]}`} />
          <p className="mt-3 text-xs uppercase tracking-wider text-muted-foreground">Nível</p>
          <p className="font-display text-3xl tracking-wider capitalize">{profile?.loyalty_tier ?? "Bronze"}</p>
          <p className="mt-2 text-xs uppercase tracking-wider text-muted-foreground">Pontos</p>
          <p className="font-display text-3xl text-primary">{profile?.loyalty_points ?? 0}</p>
        </div>
        <div className="lg:col-span-2 rounded-2xl border border-border/60 bg-card p-6">
          <h2 className="font-display text-2xl tracking-wider">Dados do perfil</h2>
          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <div><dt className="text-muted-foreground text-xs uppercase tracking-wider">Nome</dt><dd>{profile?.full_name ?? "—"}</dd></div>
            <div><dt className="text-muted-foreground text-xs uppercase tracking-wider">E-mail</dt><dd>{user.email}</dd></div>
            <div><dt className="text-muted-foreground text-xs uppercase tracking-wider">Telefone</dt><dd>{profile?.phone ?? "—"}</dd></div>
            <div><dt className="text-muted-foreground text-xs uppercase tracking-wider">Endereço</dt><dd>{profile?.address ?? "—"}</dd></div>
          </dl>
        </div>
      </div>

      <h2 className="mt-12 font-display text-3xl">Meus pedidos</h2>
      {!orders || orders.length === 0 ? (
        <p className="mt-4 text-muted-foreground">Você ainda não fez pedidos. <Link to="/cardapio" className="text-primary">Comece agora</Link>.</p>
      ) : (
        <ul className="mt-6 space-y-3">
          {orders.map((o) => (
            <li key={o.id} className="rounded-xl border border-border/60 bg-card/40 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">#{o.id.slice(0, 8)} · {new Date(o.created_at).toLocaleString("pt-BR")}</p>
                  <p className="mt-1 font-display text-xl">{statusLabel[o.status]}</p>
                </div>
                <p className="font-display text-2xl text-primary">{formatBRL(Number(o.total))}</p>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {o.order_items?.map((i) => `${i.quantity}x ${i.product_name}`).join(" · ")}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
