import { test, expect } from "playwright/test";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@/server/router";

const api = createTRPCClient<AppRouter>({
  links: [httpBatchLink({ url: "http://127.0.0.1:3100/api/trpc" })],
});

test.beforeEach(async () => {
  const pagina = await api.tarefas.listar.query({ limite: 50 });
  for (const tarefa of pagina.itens) await api.tarefas.deletar.mutate({ id: tarefa.id });
});

test("SSR entrega a primeira página com JavaScript desativado", async ({ browser }) => {
  for (let i = 1; i <= 12; i++) await api.tarefas.criar.mutate({ titulo: `E2E SSR ${i}` });
  const contexto = await browser.newContext({ javaScriptEnabled: false });
  const pagina = await contexto.newPage();
  await pagina.goto("http://127.0.0.1:3100");
  await expect(pagina.locator(".lista-tarefas li")).toHaveCount(10);
  await expect(pagina.getByRole("heading", { name: "Minhas tarefas" })).toBeVisible();
  await contexto.close();
});

test("CRUD, validação, prioridade, conclusão e falha de rede", async ({ page }) => {
  const erros: string[] = [];
  page.on("pageerror", erro => erros.push(erro.message));
  await page.goto("/tarefas/nova");
  await page.getByRole("button", { name: "Criar tarefa", exact: true }).click();
  await expect(page.locator("#erro-titulo")).toHaveText("Informe o título da tarefa.");
  await page.getByLabel("Título").fill("E2E entrega de dados");
  await page.getByLabel("Descrição").fill("Preparar a demonstração.");
  await page.getByLabel("Prioridade", { exact: true }).selectOption("alta");
  await page.getByRole("button", { name: "Criar tarefa", exact: true }).click();
  await expect(page.getByRole("heading", { name: "E2E entrega de dados", exact: true })).toBeVisible();
  await expect(page.locator(".badge-prioridade")).toHaveText("Alta");
  await page.getByRole("checkbox", { name: "Concluir tarefa: E2E entrega de dados", exact: true }).click();
  await expect(page.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "100");
  await page.getByRole("button", { name: "Concluídas", exact: true }).click();
  await expect(page.locator(".lista-tarefas li")).toHaveCount(1);

  await page.getByRole("link", { name: "Editar tarefa: E2E entrega de dados", exact: true }).click();
  await page.getByLabel("Título").fill("E2E revisão final");
  await page.getByLabel("Prioridade", { exact: true }).selectOption("baixa");
  await page.getByRole("button", { name: "Salvar alterações" }).click();
  await expect(page.getByRole("heading", { name: "E2E revisão final", exact: true })).toBeVisible();
  await expect(page.locator(".badge-prioridade")).toHaveText("Baixa");
  await page.getByRole("button", { name: "Excluir tarefa: E2E revisão final", exact: true }).click();
  await page.getByRole("button", { name: "Cancelar", exact: true }).click();
  await expect(page.getByRole("heading", { name: "E2E revisão final", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Excluir tarefa: E2E revisão final", exact: true }).click();
  await page.getByRole("button", { name: "Confirmar exclusão" }).click();
  await expect(page.locator(".lista-tarefas li")).toHaveCount(0);
  await expect(page.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "0");

  await page.goto("/tarefas/nova");
  await page.getByLabel("Título").fill("Preservar formulário");
  await page.route("**/api/trpc/**", rota => rota.abort());
  await page.getByRole("button", { name: "Criar tarefa", exact: true }).click();
  await expect(page.locator("main [role='alert']")).toContainText("Não foi possível conectar ao servidor.");
  await expect(page.getByLabel("Título")).toHaveValue("Preservar formulário");
  await expect(page.getByRole("button", { name: "Criar tarefa", exact: true })).toBeEnabled();
  expect(erros).toEqual([]);
});

test("scroll incremental, busca no servidor e filtros em tela pequena", async ({ page }) => {
  for (let i = 1; i <= 23; i++) await api.tarefas.criar.mutate({
    titulo: i === 1 ? "E2E Análise prioritária" : `E2E tarefa ${i}`,
    prioridade: i === 1 ? "alta" : "media",
  });
  await page.goto("/");
  await expect(page.locator(".lista-tarefas li")).toHaveCount(10);
  await page.locator(".rodape-lista").scrollIntoViewIfNeeded();
  await expect(page.locator(".lista-tarefas li")).toHaveCount(20);
  await page.locator(".rodape-lista").scrollIntoViewIfNeeded();
  await expect(page.locator(".lista-tarefas li")).toHaveCount(23);

  await page.getByRole("searchbox", { name: "Buscar tarefas" }).fill("analise");
  await expect(page.locator(".lista-tarefas li")).toHaveCount(1);
  await page.getByLabel("Filtrar por prioridade").selectOption("alta");
  await expect(page.getByRole("heading", { name: "E2E Análise prioritária", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Concluídas", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Nenhuma tarefa encontrada" })).toBeVisible();
  await page.getByRole("button", { name: "Limpar filtros" }).click();
  await expect(page.locator(".lista-tarefas li")).toHaveCount(23);

  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});
