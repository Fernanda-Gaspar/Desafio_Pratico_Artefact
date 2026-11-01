import "server-only";
import type { Tarefa } from "@/lib/tarefa";
import type { Context } from "./trpc";

const globalStore = globalThis as typeof globalThis & {
  tarefasDoDesafio?: Map<string, Tarefa>;
};

const tarefas = (globalStore.tarefasDoDesafio ??= new Map<string, Tarefa>());

export function createContext(): Context {
  return { tarefas };
}
