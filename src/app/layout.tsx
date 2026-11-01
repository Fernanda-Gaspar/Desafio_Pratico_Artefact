import type { Metadata } from "next";
import Link from "next/link";
import { Providers } from "@/trpc/provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Artefact Tasks | Transforme planos em impacto",
  description: "Organize tarefas, priorize próximos passos e acompanhe sua lista. Projeto de desafio técnico.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <a className="pular-conteudo" href="#conteudo">Pular para o conteúdo</a>
        <Providers>
          <header className="cabecalho-site">
            <div className="container barra-superior">
              <Link className="marca" href="/" aria-label="Tarefas, página inicial">
                <span className="wordmark">ARTEFACT<span>TASKS WORKSPACE</span></span>
              </Link>
              <nav aria-label="Navegação principal"><Link href="/#tarefas">Minhas tarefas</Link><Link href="/#indicadores">Visão geral</Link></nav>
              <span className="assinatura">Desafio técnico <span aria-hidden="true">↗</span></span>
            </div>
          </header>
          <main id="conteudo" className="conteudo-principal">{children}</main>
          <footer className="rodape-site"><div className="container"><span>ARTEFACT <strong>· TASKS</strong></span><p>Interface inspirada na Artefact · Projeto de avaliação técnica</p><a href="#conteudo">Voltar ao topo ↑</a></div></footer>
        </Providers>
      </body>
    </html>
  );
}
