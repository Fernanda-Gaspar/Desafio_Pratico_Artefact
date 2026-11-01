# Artefact Tasks

Aplicação de gerenciamento de tarefas desenvolvida para um desafio técnico com **Next.js 15, React, TypeScript e tRPC**. O projeto oferece CRUD, renderização inicial no servidor, carregamento incremental e dados mantidos exclusivamente na memória do backend.

A interface usa uma identidade visual inspirada na referência da Artefact, com gradiente azul, roxo e rosa, elementos vetoriais e organização responsiva. Trata-se de um projeto de avaliação técnica, sem vínculo de produto oficial com a empresa.

## Índice

- [Visão geral](#visão-geral)
- [Requisitos atendidos](#requisitos-atendidos)
- [Tecnologias](#tecnologias)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Execução](#execução)
- [Como utilizar](#como-utilizar)
- [Comandos disponíveis](#comandos-disponíveis)
- [Testes e integração contínua](#testes-e-integração-contínua)
- [Estrutura e arquitetura](#estrutura-e-arquitetura)
- [Modelo de dados e operações](#modelo-de-dados-e-operações)
- [SSR, paginação e indicadores](#ssr-paginação-e-indicadores)
- [Guia do backend em TypeScript](#guia-do-backend-em-typescript)
- [Diferenciais do projeto](#diferenciais-do-projeto)
- [Apresentação do projeto](#apresentação-do-projeto)
- [Solução de problemas](#solução-de-problemas)
- [Próximos passos de melhoria](#próximos-passos-de-melhoria)
- [Limitações e decisões de escopo](#limitações-e-decisões-de-escopo)
- [Referências](#referências)

## Visão geral

O objetivo é permitir que uma pessoa registre tarefas, organize prioridades e acompanhe sua lista em uma interface simples.

O frontend e o backend executam no **mesmo servidor Next.js**. As operações do backend são expostas por tRPC e usam uma coleção em memória. O frontend recebe a primeira página já renderizada no servidor e utiliza TanStack Query para as interações seguintes.

Funcionalidades disponíveis:

- Criar, listar, consultar, editar e excluir tarefas.
- Validar título obrigatório e comprimentos dos campos.
- Concluir e reabrir uma tarefa.
- Definir prioridade baixa, média ou alta.
- Buscar por título ou descrição, sem diferenciar maiúsculas e acentos.
- Filtrar por status e prioridade no backend.
- Carregar mais tarefas conforme a rolagem ou por um botão.
- Acompanhar total, tarefas em aberto, concluídas e taxa de conclusão.
- Filtrar rapidamente as tarefas de prioridade alta em aberto.
- Receber feedback de carregamento, sucesso e erro.

A aplicação começa com a lista vazia. A primeira tarefa pode ser cadastrada pela interface.

## Requisitos atendidos

| Requisito do desafio | Implementação |
| --- | --- |
| Next.js 15 | App Router com Next.js 15.5.28 |
| Comunicação via tRPC | Procedures tipadas em `src/server/routers/tarefas.ts` |
| Armazenamento em memória | `Map<string, Tarefa>` no contexto do servidor |
| Campos obrigatórios da tarefa | ID, título, descrição opcional e timestamp de criação |
| CRUD completo | Criação, listagem, edição e exclusão |
| Validação no backend | Schema Zod aplicado às entradas das procedures |
| Erros significativos | `BAD_REQUEST` e `NOT_FOUND` |
| Listagem com SSR | Consulta ao router antes da renderização do HTML |
| Formulário com hooks | Componente funcional compartilhado para criação e edição |
| Exclusão na listagem | Confirmação, bloqueio durante a operação e feedback |
| Estados da interface | Carregamento, lista vazia, falha de rede e nova tentativa |
| Infinite scroll | Paginação por cursor e `IntersectionObserver` |
| Comentários e documentação | Decisões comentadas no código e documentação consolidada aqui |

Conclusão, prioridade, busca, filtros e indicadores são extras. Eles complementam o CRUD sem alterar a exigência de armazenamento em memória.

## Tecnologias

| Tecnologia | Versão ou linha adotada | Uso |
| --- | --- | --- |
| Next.js | 15.5.28 | Rotas, SSR e servidor da aplicação |
| React | 19.x | Interface e componentes funcionais |
| TypeScript | 5.9.3 | Tipagem estática |
| tRPC | 11.22.1 | Procedures e contrato entre cliente e servidor |
| TanStack Query | 5.x | Consultas, mutações, cache e paginação |
| Zod | 4.x | Validação compartilhada |
| Node.js test runner + tsx | Conforme o lockfile | Testes do backend e transporte HTTP |
| Playwright Test | 1.64.1 | Testes de navegador |
| ESLint | 9.x | Análise estática |
| GitHub Actions | Workflow incluído | Verificações de integração contínua |
| CSS e SVG locais | Sem biblioteca de componentes | Layout e elementos visuais |

O `package-lock.json` registra as versões resolvidas. Use `npm ci` para instalar esse conjunto de dependências.

## Pré-requisitos

- **Node.js 22 ou superior**, com npm disponível.
- **Git**, caso a instalação seja feita por clonagem.
- Um navegador para utilizar a aplicação.
- Chromium do Playwright apenas para executar a suíte E2E.

Confira o ambiente:

```bash
node --version
npm --version
git --version
```

O arquivo `.nvmrc` indica Node.js 22 para quem utiliza um gerenciador de versões.

Não é necessário configurar banco de dados, .NET, Docker, chave de IA ou um segundo servidor. A versão atual também não exige arquivo `.env`.

## Instalação

### Clonar o repositório

Substitua `URL_DO_REPOSITORIO` pelo endereço HTTPS ou SSH real deste repositório antes de executar:

```bash
git clone URL_DO_REPOSITORIO artefact-tasks
cd artefact-tasks
npm ci --include=dev
```

O argumento `artefact-tasks` define o nome da pasta local, independentemente do nome do repositório remoto.

A opção `--include=dev` garante a instalação das ferramentas usadas para tipos, lint e testes, incluindo o Playwright.

### Instalar a partir do ZIP

1. Extraia o arquivo do projeto.
2. Abra um terminal na pasta que contém `package.json` e `tsconfig.json`.
3. Instale as dependências:

```bash
npm ci --include=dev
```

Abra essa mesma pasta no editor. Evite abrir somente um arquivo isolado, pois o TypeScript precisa localizar a configuração do projeto.

### Configurar o editor

No VS Code, selecione a versão de TypeScript instalada no workspace:

1. Abra a paleta de comandos com `Ctrl + Shift + P`.
2. Execute `TypeScript: Select TypeScript Version`.
3. Selecione `Use Workspace Version`.

O arquivo `.vscode/settings.json` aponta para `node_modules/typescript/lib`. As declarações de CSS ficam em `src/types/styles.d.ts`.

## Execução

### Desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

Frontend e backend iniciam juntos. Para encerrar o servidor, use `Ctrl + C` no terminal.

Se a porta 3000 estiver ocupada:

```bash
npm run dev -- --port 3001
```

Nesse caso, acesse [http://localhost:3001](http://localhost:3001).

### Build e execução de produção local

```bash
npm run build
npm start
```

O comando `build` gera a aplicação otimizada; `start` executa o resultado na porta 3000. Execute o build antes de usar `npm start`.

Para conferir o fluxo completo, prefira a versão de produção local. O armazenamento continua em memória nesse modo.

> **Dados temporários:** reiniciar o servidor apaga as tarefas. Esse comportamento é esperado no desafio.

## Como utilizar

1. Clique em **Criar uma tarefa** ou **Nova tarefa**.
2. Informe o título, acrescente uma descrição se necessário e escolha a prioridade.
3. Salve para retornar à listagem.
4. Use o ícone de edição para alterar os campos.
5. Marque a caixa de seleção para concluir; desmarque para reabrir.
6. Use a busca e os filtros para localizar tarefas.
7. Clique no ícone de exclusão e confirme ou cancele a operação.
8. Com mais de 10 tarefas, role até o fim para carregar a próxima página.
9. Consulte o panorama para acompanhar os indicadores globais.

As mensagens da interface informam o resultado das operações. Em uma falha de gravação, o formulário preserva os dados para permitir nova tentativa.

## Comandos disponíveis

| Comando | Finalidade |
| --- | --- |
| `npm ci --include=dev` | Instalar as dependências do lockfile, incluindo desenvolvimento |
| `npm run dev` | Iniciar o servidor de desenvolvimento |
| `npm run build` | Gerar o build de produção |
| `npm start` | Executar o build de produção |
| `npm run lint` | Executar o ESLint |
| `npm run typecheck` | Gerar os tipos de rota e verificar o TypeScript |
| `npm test` | Executar os 17 testes do backend/adapter HTTP |
| `npm run test:e2e` | Executar os 3 cenários Playwright |
| `npm run check` | Executar lint, tipos, testes de backend e build |

`npm run check` não inclui os testes de navegador. A suíte E2E é executada separadamente.

## Testes e integração contínua

### Verificação principal

```bash
npm run check
```

Também é possível executar cada etapa:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

### Testes do backend

Os **17 testes** de `tests/tarefas.test.ts` usam `node:test` com `tsx` e coleções isoladas por teste. Cobrem:

- CRUD, geração de ID e preservação da data de criação.
- Descrição opcional, título vazio, espaços e limites dos campos.
- Consulta, atualização e exclusão de tarefas inexistentes.
- Paginação com timestamps iguais, sem repetição ou omissão.
- Exclusão do cursor e alterações entre páginas.
- Transporte HTTP, mensagens amigáveis e rejeição de mutation por GET.
- Prioridades, conclusão, indicadores globais e idempotência da definição de conclusão.
- Busca sem acentos em tarefas fora da primeira página.
- Rejeição de uma prioridade inválida.

### Testes de navegador

Instale o navegador do Playwright:

```bash
npx playwright install chromium
```

No Linux, caso sejam necessárias as bibliotecas do sistema:

```bash
npx playwright install --with-deps chromium
```

Depois, execute:

```bash
npm run build
npm run test:e2e
```

O `playwright.config.ts` inicia um processo Next.js exclusivo na porta **3100**. Deixe essa porta livre. A suíte não reutiliza a instância pessoal iniciada na porta 3000.

Os **3 cenários** verificam:

1. Primeira página com 10 tarefas visíveis com JavaScript desativado.
2. CRUD, validação, prioridade, conclusão e tratamento de falha de rede.
3. Scroll de 10 para 20 e 23 tarefas, busca no servidor, filtros e largura de 390 px.

A suíte limpa as tarefas do servidor exclusivo antes de cada cenário. Os arquivos de diagnóstico de falhas ficam em `test-results/`.

Para apenas listar os cenários, sem abrir o navegador:

```bash
npx playwright test --list
```

### Integração contínua

O workflow `.github/workflows/ci.yml` é acionado em `push` e `pull_request`. Ele executa instalação, lint, tipos, testes do backend, build, instalação do Chromium e testes E2E.

Para usá-lo, envie os arquivos deste projeto para a raiz do repositório GitHub e mantenha o GitHub Actions habilitado. A execução remota depende desse repositório; a presença do workflow não significa que uma execução remota já foi concluída.

## Estrutura e arquitetura

| Arquivo ou pasta | Responsabilidade |
| --- | --- |
| `src/app/page.tsx` | Listagem inicial e SSR |
| `src/app/layout.tsx` | Estrutura compartilhada da interface |
| `src/app/tarefas/nova/page.tsx` | Criação de tarefa |
| `src/app/tarefas/[id]/editar/page.tsx` | Edição carregada no servidor |
| `src/app/tarefas/loading.tsx` | Estado de carregamento das rotas de formulário |
| `src/app/error.tsx` | Falha inesperada de página |
| `src/app/not-found.tsx` | Página ou tarefa inexistente |
| `src/app/api/trpc/[trpc]/route.ts` | Handler HTTP do tRPC |
| `src/server/context.ts` | Coleção em memória do processo |
| `src/server/trpc.ts` | Configuração do tRPC e formatação de erros |
| `src/server/routers/tarefas.ts` | Regras das operações, filtros, resumo e paginação |
| `src/server/router.ts` | Composição de `AppRouter` |
| `src/server/caller.ts` | Acesso ao router durante SSR |
| `src/lib/tarefa.ts` | Tipos, constantes e schemas compartilhados |
| `src/lib/erro.ts` | Mensagens de falha para a interface |
| `src/trpc/` | Cliente, provider e TanStack Query |
| `src/components/` | Formulário, listagem, feedback e ilustração |
| `src/types/styles.d.ts` | Declaração de imports CSS |
| `tests/tarefas.test.ts` | Testes do backend |
| `tests/e2e/tarefas.spec.ts` | Testes de navegador |

No navegador, o cliente tRPC faz requisições ao handler em `/api/trpc`, que executa as procedures com acesso à coleção em memória. No SSR, a página chama o mesmo router diretamente no servidor.

As procedures operam sobre o contexto, sem camadas adicionais de serviço ou repositório que apenas repassariam chamadas neste escopo.

## Modelo de dados e operações

### Tarefa

| Campo | Tipo | Regra |
| --- | --- | --- |
| `id` | `string` com UUID | Gerado no backend por `crypto.randomUUID()` |
| `titulo` | `string` | Obrigatório após `trim()`; até 120 caracteres |
| `descricao` | `string` opcional | Até 2.000 caracteres; vazia é normalizada para ausência |
| `dataCriacao` | `number` | Timestamp Unix em milissegundos, gerado no backend |
| `prioridade` | `baixa`, `media` ou `alta` | Padrão `media` |
| `concluida` | `boolean` | `false` na criação |

A edição preserva ID, data de criação e conclusão. O formulário substitui os campos editáveis, incluindo a prioridade. Omitir a descrição ou enviá-la vazia remove o valor anterior.

### Procedures tRPC

| Procedure | Tipo | Entrada | Retorno |
| --- | --- | --- | --- |
| `tarefas.listar` | Query | Limite, cursor, busca, status e prioridade | Página e resumo global |
| `tarefas.buscarPorId` | Query | ID | Tarefa existente |
| `tarefas.criar` | Mutation | Título, descrição e prioridade | Tarefa criada |
| `tarefas.atualizar` | Mutation | ID e campos do formulário | Tarefa atualizada |
| `tarefas.alterarConclusao` | Mutation | ID e booleano `concluida` | Tarefa com o estado definido |
| `tarefas.deletar` | Mutation | ID | ID excluído |

Os parâmetros opcionais têm os padrões definidos nos schemas. Queries usam GET e mutations usam POST pelo protocolo tRPC.

### Tratamento de erros

- `BAD_REQUEST`: entrada inválida.
- `NOT_FOUND`: tarefa inexistente.
- Mensagens de validação são formatadas para evitar a exibição do JSON bruto do Zod.
- Falhas de rede recebem uma mensagem de conexão na interface.
- Mutações não são repetidas automaticamente.
- O cache é invalidado depois de uma mutação confirmada.

A operação de conclusão recebe o estado desejado, em vez de inverter o valor. Repetir a mesma chamada com `concluida: true` não reabre a tarefa.

## SSR, paginação e indicadores

### Renderização inicial no servidor

`src/app/page.tsx` é um Server Component assíncrono com `dynamic = "force-dynamic"`. A cada requisição, ele consulta `createServerCaller().tarefas.listar(...)` e passa a primeira página como `initialData`.

O caller reutiliza a validação e as regras do mesmo router do CRUD. A primeira lista já compõe o HTML inicial.

A página principal não usa um `loading.tsx` global que a envolva automaticamente em uma fronteira de Suspense. O carregamento de rota está restrito aos formulários, permitindo verificar a lista inicial visível com JavaScript desativado.

Um Client Component permite hooks e eventos e também participa da renderização inicial no servidor. `"use client"` não elimina o SSR.

### Paginação e filtros

- Padrão de 10 e máximo de 50 tarefas por página.
- Ordenação decrescente por data e ID.
- Cursor com `dataCriacao` e `id` da última tarefa.
- `proximoCursor: null` indica o fim.
- A exclusão da tarefa do cursor não impede o carregamento seguinte, pois a comparação usa valores.
- Busca e filtros são aplicados à coleção inteira antes da paginação.
- O frontend usa `useInfiniteQuery` e `IntersectionObserver`, com botão alternativo.
- Depois de uma falha de paginação, uma nova tentativa depende da ação do usuário.

### Definição dos indicadores

| Indicador | Cálculo |
| --- | --- |
| Total | Quantidade de tarefas na coleção |
| Em aberto | Total menos concluídas |
| Concluídas | Quantidade com `concluida: true` |
| Prioridade alta em aberto | Quantidade não concluída com prioridade alta |
| Taxa de conclusão | `Math.round(concluidas / total * 100)`; zero para lista vazia |

O `total` da página reflete a busca e os filtros. O `resumo` reflete a coleção inteira, independentemente dos itens carregados no navegador.

Esses indicadores descrevem a lista. Eles não comprovam aumento de produtividade, economia de tempo ou impacto financeiro. O cartão de foco é uma regra determinística baseada nas prioridades, não uma funcionalidade de IA.

As datas são exibidas no horário de São Paulo. Os elementos visuais usam CSS e SVG locais, sem imagens ou fontes externas obrigatórias.

## Guia do backend em TypeScript

O backend é integralmente TypeScript e roda no processo Node do Next.js. O tRPC publica as operações para o navegador.

### Comparação de responsabilidades

| Em uma API .NET | Neste projeto |
| --- | --- |
| Ação do controller | Procedure tRPC |
| DTO com validação | Schema Zod |
| Classe/record do contrato | Tipo TypeScript inferido do schema |
| Serviço singleton em memória | Map no contexto, mantido em globalThis |
| Erro 400/404 da API | TRPCError BAD_REQUEST/NOT_FOUND |
| Cliente HTTP tipado | Cliente tRPC inferido de AppRouter |

A comparação é sobre responsabilidades: os mecanismos de execução e o modelo de concorrência são diferentes.

### Ordem de leitura

1. `src/lib/tarefa.ts`: define os dados e os campos aceitos.
2. `src/server/context.ts`: cria a coleção em memória.
3. `src/server/trpc.ts`: inicializa o tRPC e formata os erros.
4. `src/server/routers/tarefas.ts`: implementa as operações.
5. `src/server/router.ts`: compõe o router principal e exporta seu tipo.
6. `src/app/api/trpc/[trpc]/route.ts`: recebe as requisições HTTP.
7. `src/server/caller.ts` e `src/app/page.tsx`: usam as mesmas operações no SSR.

### O papel do Zod

`tarefaSchema` descreve e valida os campos recebidos. `z.infer<typeof tarefaSchema>` obtém o tipo TypeScript correspondente.

A procedure declara `.input(tarefaSchema)`. O tRPC valida a entrada antes de executar a operação, como a validação de um DTO antes de chegar à ação da API.

O formulário reutiliza o mesmo schema, mas o backend continua validando chamadas feitas sem passar pela interface.

### Contexto e memória

`createContext()` disponibiliza `ctx.tarefas` para as procedures. A coleção é um `Map` indexado pelo UUID.

`globalThis` preserva a referência no processo, inclusive em reavaliações do módulo no desenvolvimento. Isso não é persistência: reiniciar o processo apaga a coleção.

As operações de leitura e escrita do Map são síncronas e não contêm `await` entre verificar e alterar a tarefa. Não há coordenação entre processos ou garantia de edição concorrente entre clientes; uma atualização posterior pode substituir a anterior.

### Queries e mutations

`listar` e `buscarPorId` são queries de leitura. `criar`, `atualizar`, `alterarConclusao` e `deletar` são mutations.

O transporte HTTP usa GET para queries e POST para mutations. Esses nomes identificam operações do protocolo tRPC, em vez de rotas REST por verbo/recurso.

`encontrar()` centraliza o erro de tarefa inexistente. No frontend, os erros são convertidos em mensagens visíveis.

### Tipagem e execução

O frontend importa `AppRouter` com `import type`. Isso compartilha o contrato durante a compilação, sem incluir a implementação do servidor no bundle do navegador.

A tipagem ajuda a detectar chamadas incorretas no desenvolvimento. Zod verifica os dados em tempo de execução.

No SSR, o servidor chama o router diretamente. Depois da hidratação, o navegador usa o cliente tRPC por HTTP.

### Já implementados

| Diferencial | O que demonstra |
| --- | --- |
| Indicadores calculados no backend | Uso dos dados disponíveis com definição clara |
| Conclusão e prioridade | Tradução de uma necessidade de organização em comportamento simples |
| Busca e filtros antes da paginação | Correção mesmo para dados ainda não carregados |
| Cursor com data e ID | Tratamento de exclusões e timestamps iguais |
| SSR visível sem JavaScript | Entendimento do requisito e verificação no navegador |
| Contratos compartilhados e validação | Consistência entre interface e backend |
| Testes de regras e fluxos | Confiança nos comportamentos importantes |
| CI preparada | Verificações reproduzíveis ao entregar |
| Interface acessível e responsiva | Atenção à experiência das pessoas |
| README com limites e decisões | Comunicação técnica e controle do escopo |

Os indicadores são contagem e taxa de conclusão de tarefas. Não há dados suficientes para afirmar aumento de produtividade, economia de tempo ou impacto financeiro.

### Próximo passo: Agente IA 

- **sugerir subtarefas a partir da descrição de uma tarefa**.

O fluxo proposto: a pessoa pede a sugestão, vê uma prévia e escolhe o que aproveitar. A criação continua dependendo da confirmação humana.

## Solução de problemas

### Playwright não encontrado ou parâmetros com any implícito

Reinstale as dependências de desenvolvimento na raiz:

```bash
npm ci --include=dev
npm ls @playwright/test
```

Se a dependência tiver sido removida do `package.json`, recoloque a versão adotada:

```bash
npm install -D --save-exact @playwright/test@1.64.1 --include=dev
```

Os testes devem permanecer separados:

| Arquivo | Executor e import |
| --- | --- |
| `tests/tarefas.test.ts` | Backend: `import { test } from "node:test";` |
| `tests/e2e/tarefas.spec.ts` | Navegador: `import { test, expect } from "@playwright/test";` |

O conteúdo E2E não deve ser copiado para o arquivo de testes do backend. Quando o pacote é resolvido, os tipos de `page`, `browser` e callbacks são inferidos.

### Porta ocupada ou erro de conexão

Para desenvolvimento, use outra porta com `npm run dev -- --port 3001`. Para E2E, deixe livre a porta 3100 configurada no Playwright.

Se a interface informar falha de conexão, verifique se o servidor está em execução e consulte seu terminal. Neste projeto não existe uma API separada que precise ser iniciada em outro processo.

## Próximos passos de melhoria

| Prioridade | Melhoria | Objetivo | Como validar |
| --- | --- | --- | --- |
| Alta | Publicar e acompanhar a CI no repositório | Tornar a validação remota reproduzível | Pipeline completo aprovado em uma PR |
| Alta | Auditoria automatizada de acessibilidade | Ampliar a verificação de contraste, teclado e semântica | Testes automatizados mais revisão manual |
| Alta | Controle de versão por tarefa | Detectar edições concorrentes em vez de sobrescrever silenciosamente | Teste de duas edições sobre a mesma versão |
| Média | Observabilidade estruturada | Diagnosticar latência e falhas das operações | Logs correlacionados e testes dos eventos essenciais |
| Média | Exportação dos resultados filtrados | Facilitar a revisão da lista fora da aplicação | Exportar todas as páginas respeitando filtros |
| Média | Ampliação dos testes de interface | Verificar outros tamanhos de tela e navegadores | Casos adicionais e execução em CI |
| Evolução de produto | Persistência compartilhada | Manter dados após reinício e suportar réplicas | Testes de integração com armazenamento real |
| Evolução de produto | Autenticação e autorização | Separar tarefas por usuário com verificação no backend | Testes de acesso permitido e negado |
| Diferencial | IA para sugerir subtarefas | Ajudar a transformar uma descrição em próximos passos | Saída validada, prévia, confirmação e tratamento de falha |

## Limitações e decisões de escopo

- O armazenamento é um `Map` compartilhado somente no processo Node atual.
- Reiniciar o servidor remove os dados; várias instâncias não compartilham a lista.
- O modo atual deve ser executado em uma única instância Node. Ambientes serverless ou réplicas exigiriam rever o armazenamento.
- Não há autenticação, isolamento por usuário ou sincronização em tempo real entre abas.
- A paginação não representa um snapshot entre requisições; alterações concorrentes podem aparecer nas atualizações seguintes.
- Uma edição posterior pode substituir dados de outra edição. Controle de concorrência está no roadmap.
- A acessibilidade atual contempla práticas básicas; uma auditoria completa está planejada.
- A identidade visual é um estudo inspirado na referência fornecida para o desafio técnico.

## Referências

- [Next.js 15](https://nextjs.org/docs/15)
- [tRPC](https://trpc.io/docs/)
- [TanStack Query](https://tanstack.com/query/latest/docs/framework/react/overview)
- [Zod](https://zod.dev/)
- [Playwright](https://playwright.dev/docs/intro)
- [TypeScript e imports por efeito colateral](https://www.typescriptlang.org/tsconfig/noUncheckedSideEffectImports.html)
- [Artefact](https://www.artefact.com/br/)
- [Data & Software Engineer — Artefact](https://jobs.artefact.com/job/data-software-engineer-m-f-d/)
