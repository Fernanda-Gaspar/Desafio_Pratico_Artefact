import { z } from "zod";

export const TAMANHO_PAGINA = 10;
export const LIMITE_TITULO = 120;
export const LIMITE_DESCRICAO = 2000;
export const prioridadeSchema = z.enum(["baixa", "media", "alta"]);
export type Prioridade = z.infer<typeof prioridadeSchema>;
export const NOMES_PRIORIDADE: Record<Prioridade, string> = {
  baixa: "Baixa", media: "Média", alta: "Alta",
};

export const tarefaSchema = z.object({
  titulo: z.string({ error: "Informe o título da tarefa." }).trim()
    .min(1, "Informe o título da tarefa.")
    .max(LIMITE_TITULO, `Use no máximo ${LIMITE_TITULO} caracteres no título.`),
  descricao: z.string().trim()
    .max(LIMITE_DESCRICAO, `Use no máximo ${LIMITE_DESCRICAO} caracteres na descrição.`).optional(),
  prioridade: prioridadeSchema.default("media"),
});

export const idSchema = z.object({ id: z.uuid({ error: "O identificador da tarefa é inválido." }) });
export const cursorSchema = z.object({ dataCriacao: z.number().int().nonnegative(), id: z.uuid() });

export const FILTROS_INICIAIS = { busca: "", status: "todas", prioridade: "todas" } as const;
export const filtrosSchema = z.object({
  busca: z.string().trim().max(LIMITE_TITULO).default(""),
  status: z.enum(["todas", "pendentes", "concluidas"]).default("todas"),
  prioridade: z.enum(["todas", "baixa", "media", "alta"]).default("todas"),
});
export type Filtros = z.infer<typeof filtrosSchema>;

export const listarTarefasSchema = filtrosSchema.extend({
  limite: z.number().int().min(1).max(50).default(TAMANHO_PAGINA),
  cursor: cursorSchema.nullish(),
}).default({ ...FILTROS_INICIAIS, limite: TAMANHO_PAGINA });

export type DadosTarefa = z.infer<typeof tarefaSchema>;
export type Cursor = z.infer<typeof cursorSchema>;
export type Tarefa = DadosTarefa & {
  id: string;
  dataCriacao: number;
  concluida: boolean;
};
export type ResumoTarefas = {
  total: number; pendentes: number; concluidas: number;
  altaPrioridade: number; taxaConclusao: number;
};
export type PaginaTarefas = {
  itens: Tarefa[]; proximoCursor: Cursor | null;
  total: number; resumo: ResumoTarefas;
};
