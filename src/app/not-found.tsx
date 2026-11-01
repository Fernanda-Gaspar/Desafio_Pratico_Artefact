import Link from "next/link";

export default function NotFound() {
  return (
    <div className="painel-mensagem">
      <p className="sobretitulo">404</p>
      <h1>Página ou tarefa não encontrada.</h1>
      <p className="texto-secundario">O endereço pode estar incorreto ou a tarefa já foi excluída.</p>
      <Link className="botao botao--principal" href="/">Voltar para tarefas</Link>
    </div>
  );
}
