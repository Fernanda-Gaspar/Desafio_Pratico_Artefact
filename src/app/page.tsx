import { ListaTarefas } from "@/components/lista-tarefas";
import { TAMANHO_PAGINA } from "@/lib/tarefa";
import { createServerCaller } from "@/server/caller";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type Props = {
  searchParams: Promise<{ sucesso?: string | string[] }>;
};

export default async function Home({ searchParams }: Props) {
  const caller = createServerCaller();
  const [primeiraPagina, parametros] = await Promise.all([
    caller.tarefas.listar({ limite: TAMANHO_PAGINA }),
    searchParams,
  ]);
  const texto =
    parametros.sucesso === "criada"
      ? "Tarefa criada com sucesso."
      : parametros.sucesso === "atualizada"
        ? "Tarefa atualizada com sucesso."
        : null;

  return <ListaTarefas primeiraPagina={primeiraPagina} mensagemInicial={texto ? { tipo: "sucesso", texto } : null} />;
}
