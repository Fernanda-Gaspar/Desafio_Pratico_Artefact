import { randomUUID } from "node:crypto";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { idSchema, listarTarefasSchema, tarefaSchema, type PaginaTarefas } from "@/lib/tarefa";
import { publicProcedure, router, type Context } from "../trpc";

function encontrar(ctx: Context, id: string) {
  const tarefa = ctx.tarefas.get(id);
  if (!tarefa) throw new TRPCError({ code: "NOT_FOUND", message: "Tarefa não encontrada. Ela pode ter sido excluída." });
  return tarefa;
}

const normalizarBusca = (texto: string) => texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR");

export const tarefasRouter = router({
  listar: publicProcedure.input(listarTarefasSchema).query(({ ctx, input }): PaginaTarefas => {
    const todas = [...ctx.tarefas.values()];
    const concluidas = todas.filter(tarefa => tarefa.concluida).length;
    const busca = normalizarBusca(input.busca);

    const filtradas = todas.filter(tarefa =>
      (input.status === "todas" || (input.status === "concluidas" ? tarefa.concluida : !tarefa.concluida))
      && (input.prioridade === "todas" || tarefa.prioridade === input.prioridade)
      && (!busca || normalizarBusca(`${tarefa.titulo} ${tarefa.descricao ?? ""}`).includes(busca)),
    ).sort((a, b) => b.dataCriacao - a.dataCriacao || (a.id < b.id ? 1 : -1));

    const cursor = input.cursor;

    const restantes = cursor ? filtradas.filter(tarefa =>
      tarefa.dataCriacao < cursor.dataCriacao
      || (tarefa.dataCriacao === cursor.dataCriacao && tarefa.id < cursor.id),
    ) : filtradas;
    const itens = restantes.slice(0, input.limite);
    const ultima = itens.at(-1);

    return {
      itens, total: filtradas.length,
      proximoCursor: restantes.length > input.limite && ultima ? { dataCriacao: ultima.dataCriacao, id: ultima.id } : null,

      resumo: {
        total: todas.length, concluidas, pendentes: todas.length - concluidas,
        altaPrioridade: todas.filter(tarefa => !tarefa.concluida && tarefa.prioridade === "alta").length,
        taxaConclusao: todas.length ? Math.round(concluidas / todas.length * 100) : 0,
      },
    };
  }),
  buscarPorId: publicProcedure.input(idSchema).query(({ ctx, input }) => encontrar(ctx, input.id)),
  criar: publicProcedure.input(tarefaSchema).mutation(({ ctx, input }) => {
    const tarefa = { ...input, descricao: input.descricao || undefined, id: randomUUID(), dataCriacao: Date.now(), concluida: false };
    ctx.tarefas.set(tarefa.id, tarefa);
    return tarefa;
  }),
  atualizar: publicProcedure.input(tarefaSchema.extend(idSchema.shape)).mutation(({ ctx, input }) => {
    const existente = encontrar(ctx, input.id);
    const tarefa = { ...existente, titulo: input.titulo, descricao: input.descricao || undefined, prioridade: input.prioridade };
    ctx.tarefas.set(tarefa.id, tarefa);
    return tarefa;
  }),
  alterarConclusao: publicProcedure.input(idSchema.extend({ concluida: z.boolean() })).mutation(({ ctx, input }) => {

    const tarefa = { ...encontrar(ctx, input.id), concluida: input.concluida };
    ctx.tarefas.set(tarefa.id, tarefa);
    return tarefa;
  }),
  deletar: publicProcedure.input(idSchema).mutation(({ ctx, input }) => {
    encontrar(ctx, input.id);
    ctx.tarefas.delete(input.id);
    return { id: input.id };
  }),
});
