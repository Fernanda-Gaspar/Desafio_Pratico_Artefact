import { initTRPC } from "@trpc/server";
import { ZodError } from "zod";
import type { Tarefa } from "@/lib/tarefa";

export type Context = {
  tarefas: Map<string, Tarefa>;
};

const t = initTRPC.context<Context>().create({
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      message:
        error.cause instanceof ZodError
          ? error.cause.issues[0]?.message ?? "Verifique os dados informados."
          : shape.message,
    };
  },
});

export const router = t.router;
export const publicProcedure = t.procedure;
