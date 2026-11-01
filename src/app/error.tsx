"use client";

import Link from "next/link";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="painel-mensagem" role="alert">
      <p className="sobretitulo">VAMOS TENTAR DE NOVO</p>
      <h1>Não foi possível carregar esta página.</h1>
      <p className="texto-secundario">Ocorreu uma falha inesperada. Tente novamente em instantes.</p>
      <div className="acoes-centralizadas">
        <button className="botao botao--principal" onClick={reset}>Tentar novamente</button>
        <Link className="botao" href="/">Voltar para tarefas</Link>
      </div>
    </div>
  );
}
