import { Link } from "@tanstack/react-router";
import { Flame, Instagram, Facebook, MapPin, Phone } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-card/40">
      <div className="container-prose py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <Flame className="h-6 w-6 text-primary" />
            <span className="font-display text-2xl tracking-wider">
              MARCÃO<span className="text-primary">.</span>
            </span>
          </div>
          <p className="mt-4 max-w-md text-sm text-muted-foreground leading-relaxed">
            Hamburgueria artesanal com alma maranhense. Cada hambúrguer conta uma história
            de sabor — e a nossa começou em São Luís.
          </p>
        </div>

        <div>
          <h4 className="font-display text-lg tracking-widest text-primary">Navegação</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/cardapio" className="hover:text-foreground">Cardápio</Link></li>
            <li><Link to="/orgulho-maranhense" className="hover:text-foreground">Orgulho Maranhense</Link></li>
            <li><Link to="/historia" className="hover:text-foreground">Nossa História</Link></li>
            <li><Link to="/fidelidade" className="hover:text-foreground">Programa de Fidelidade</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-lg tracking-widest text-primary">Contato</h4>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><MapPin className="h-4 w-4 mt-0.5 text-primary" />Centro Histórico, São Luís — MA</li>
            <li className="flex items-start gap-2"><Phone className="h-4 w-4 mt-0.5 text-primary" />(98) 0000-0000</li>
            <li className="flex items-center gap-3 pt-1">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="hover:text-foreground"><Instagram className="h-5 w-5" /></a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="hover:text-foreground"><Facebook className="h-5 w-5" /></a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60 py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Hamburgueria do Marcão · Feito com fogo, sabor e Maranhão.
      </div>
    </footer>
  );
}
