import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Entrar — Marcão" }, { name: "robots", content: "noindex" }] }),
  component: Login,
});

function Login() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { if (user) navigate({ to: "/conta" }); }, [user, navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: window.location.origin, data: { full_name: name } },
        });
        if (error) throw error;
        toast.success("Conta criada! Verifique seu e-mail para confirmar.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Bem-vindo de volta!");
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro de autenticação");
    } finally { setLoading(false); }
  }

  async function google() {
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/conta" });
    if (result.error) toast.error("Falha ao entrar com Google");
  }

  return (
    <div className="container-prose py-20 max-w-md">
      <h1 className="font-display text-4xl text-center">{mode === "login" ? "Entrar" : "Criar conta"}</h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        {mode === "login" ? "Acesse sua conta Marcão" : "Junte-se ao Marcão e ganhe pontos"}
      </p>

      <button onClick={google} className="mt-8 w-full rounded-md border border-border bg-secondary py-3 text-sm font-semibold uppercase tracking-wider hover:bg-secondary/70 transition">
        Continuar com Google
      </button>

      <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
        <div className="h-px flex-1 bg-border" />ou<div className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={submit} className="space-y-3">
        {mode === "signup" && (
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu nome" required className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm" />
        )}
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-mail" required className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm" />
        <input type="password" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Senha" required className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm" />
        <button disabled={loading} className="w-full rounded-md bg-primary py-3 text-sm font-semibold uppercase tracking-wider text-primary-foreground hover:opacity-90 disabled:opacity-60">
          {loading ? "Aguarde..." : mode === "login" ? "Entrar" : "Criar conta"}
        </button>
      </form>

      <button onClick={() => setMode(mode === "login" ? "signup" : "login")} className="mt-5 w-full text-center text-sm text-muted-foreground hover:text-foreground">
        {mode === "login" ? "Não tem conta? Cadastre-se" : "Já tem conta? Entrar"}
      </button>
    </div>
  );
}
