import { Link, useRouterState } from "@tanstack/react-router";
import { ShoppingBag, User as UserIcon, Menu, X, Flame } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Início" },
  { to: "/cardapio", label: "Cardápio" },
  { to: "/orgulho-maranhense", label: "Orgulho Maranhense" },
  { to: "/historia", label: "Nossa História" },
  { to: "/fidelidade", label: "Fidelidade" },
  { to: "/contato", label: "Contato" },
];

export function SiteHeader() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { count } = useCart();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="container-prose flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group" onClick={() => setOpen(false)}>
          <Flame className="h-6 w-6 text-primary transition-transform group-hover:rotate-12" />
          <span className="font-display text-2xl tracking-wider">
            <span className="text-foreground">MARCÃO</span>
            <span className="text-primary">.</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={cn(
                "text-sm uppercase tracking-wider transition-colors",
                path === l.to ? "text-primary" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/carrinho"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground hover:bg-secondary transition-colors"
            aria-label="Abrir carrinho"
          >
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-xs font-semibold text-accent-foreground">
                {count}
              </span>
            )}
          </Link>
          <Link
            to={user ? "/conta" : "/login"}
            className="hidden sm:inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground hover:bg-secondary transition-colors"
            aria-label={user ? "Minha conta" : "Entrar"}
          >
            <UserIcon className="h-5 w-5" />
          </Link>
          <button
            className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground hover:bg-secondary transition-colors"
            aria-label="Abrir menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="lg:hidden border-t border-border/60 bg-background">
          <div className="container-prose flex flex-col py-4">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={cn(
                  "py-3 text-sm uppercase tracking-wider",
                  path === l.to ? "text-primary" : "text-muted-foreground",
                )}
              >
                {l.label}
              </Link>
            ))}
            <Link
              to={user ? "/conta" : "/login"}
              onClick={() => setOpen(false)}
              className="py-3 text-sm uppercase tracking-wider text-muted-foreground"
            >
              {user ? "Minha conta" : "Entrar"}
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
