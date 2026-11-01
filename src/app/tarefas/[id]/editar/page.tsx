import { TRPCError } from "@trpc/server";
import { notFound } from "next/navigation";
import { FormularioTarefa } from "@/components/formulario-tarefa";
import { idSchema } from "@/lib/tarefa";
import { createServerCaller } from "@/server/caller";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function EditarTarefaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const validacao = idSchema.safeParse(await params);
  if (!validacao.success) notFound();

  const tarefa = await createServerCaller()
    .tarefas.buscarPorId(validacao.data)
    .catch((erro: unknown) => {
      if (erro instanceof TRPCError && erro.code === "NOT_FOUND") notFound();
      throw erro;
    });

  return <div className="pagina-formulario"><FormularioTarefa key={tarefa.id} tarefa={tarefa} /></div>;
}
