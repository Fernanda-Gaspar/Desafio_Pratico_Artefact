"use client";

import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { mensagemDeErro } from "@/lib/erro";
import { FILTROS_INICIAIS, LIMITE_TITULO, NOMES_PRIORIDADE, TAMANHO_PAGINA, type Filtros, type PaginaTarefas } from "@/lib/tarefa";
import { useTRPC } from "@/trpc/client";
import { ArteHero } from "./arte-hero";
import { Aviso, type Mensagem } from "./aviso";
import { Icone } from "./icone";

const dataFormatada = (timestamp: number) => new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit", month: "short", year: "numeric", timeZone: "America/Sao_Paulo",
}).format(timestamp);

export function ListaTarefas({ primeiraPagina, mensagemInicial = null }: {
  primeiraPagina: PaginaTarefas; mensagemInicial?: Mensagem | null;
}) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [mensagem, setMensagem] = useState<Mensagem | null>(mensagemInicial);
  const [confirmandoId, setConfirmandoId] = useState<string | null>(null);
  const [busca, setBusca] = useState("");
  const [filtros, setFiltros] = useState<Filtros>(FILTROS_INICIAIS);
  const sentinela = useRef<HTMLDivElement>(null);
  const temFiltro = Boolean(filtros.busca || filtros.status !== "todas" || filtros.prioridade !== "todas");

  useEffect(() => { if (mensagemInicial) window.history.replaceState(null, "", "/"); }, [mensagemInicial]);
  useEffect(() => {
    const timer = setTimeout(() => setFiltros(atuais => ({ ...atuais, busca: busca.trim() })), 250);
    return () => clearTimeout(timer);
  }, [busca]);

  const lista = useInfiniteQuery(trpc.tarefas.listar.infiniteQueryOptions(
    { ...filtros, limite: TAMANHO_PAGINA },
    {
      initialData: !temFiltro ? { pages: [primeiraPagina], pageParams: [null] } : undefined,
      getNextPageParam: pagina => pagina.proximoCursor,
      refetchOnMount: "always",
    },
  ));

  const atualizarLista = () => queryClient.invalidateQueries({ queryKey: trpc.tarefas.pathKey() });
  const exclusao = useMutation(trpc.tarefas.deletar.mutationOptions({
    async onSuccess() {
      setConfirmandoId(null);
      setMensagem({ tipo: "sucesso", texto: "Tarefa excluída com sucesso." });
      await atualizarLista();
    },
    onError(erro) { setMensagem({ tipo: "erro", texto: mensagemDeErro(erro) }); },
  }));
  const conclusao = useMutation(trpc.tarefas.alterarConclusao.mutationOptions({
    async onSuccess(tarefa) {
      setMensagem({ tipo: "sucesso", texto: tarefa.concluida ? "Tarefa concluída. Mais um passo realizado!" : "Tarefa reaberta com sucesso." });
      await atualizarLista();
    },
    onError(erro) { setMensagem({ tipo: "erro", texto: mensagemDeErro(erro) }); },
  }));
  const ocupado = exclusao.isPending || conclusao.isPending;
  const { hasNextPage, isFetching, isError, fetchNextPage } = lista;

  useEffect(() => {
    const elemento = sentinela.current;
    if (!elemento || !hasNextPage || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entrada]) => {
      if (entrada.isIntersecting && !isFetching && !isError && !ocupado) void fetchNextPage();
    }, { rootMargin: "120px" });
    observer.observe(elemento);
    return () => observer.disconnect();
  }, [hasNextPage, isFetching, isError, fetchNextPage, ocupado]);

  const tarefas = lista.data?.pages.flatMap(pagina => pagina.itens) ?? [];
  const resumo = lista.data?.pages[0].resumo ?? primeiraPagina.resumo;
  const total = lista.data?.pages[0].total ?? 0;
  function limparFiltros() { setBusca(""); setFiltros(FILTROS_INICIAIS); }

  return <>
    <section className="hero" aria-labelledby="titulo-principal">
      <div className="hero-letra" aria-hidden="true">A</div>
      <div className="container hero-grid">
        <div className="hero-texto">
          <p className="eyebrow"><span /> DO PLANEJAMENTO À AÇÃO</p>
          <h1 id="titulo-principal">Transforme planos<br />em <em>impacto.</em></h1>
          <p className="hero-descricao">Boas ideias merecem sair do papel.<br />Organize suas tarefas e dê espaço ao que importa.</p>
          <Link className="botao botao--principal" href="/tarefas/nova"><Icone nome="plus" tamanho={18} /> Criar uma tarefa <Icone nome="arrow" tamanho={18} /></Link>
          <div className="hero-nota"><span /> Um passo de cada vez. Uma visão do todo.</div>
        </div>
        <ArteHero />
      </div>
    </section>

    <div className="container workspace">
      <section className="metricas" id="indicadores" aria-label="Visão geral de todas as tarefas">
        <div className="metrica"><span className="metrica-icone violeta"><Icone nome="list" /></span><div><span>Total de tarefas</span><strong>{resumo.total.toString().padStart(2, "0")}</strong></div><small>Uma visão do todo</small></div>
        <div className="metrica"><span className="metrica-icone rosa"><Icone nome="flag" /></span><div><span>Em aberto</span><strong>{resumo.pendentes.toString().padStart(2, "0")}</strong></div><small>Próximos passos</small></div>
        <div className="metrica"><span className="metrica-icone verde"><Icone nome="check" /></span><div><span>Concluídas</span><strong>{resumo.concluidas.toString().padStart(2, "0")}</strong></div><small>Ideias realizadas</small></div>
      </section>

      <Aviso mensagem={mensagem} />
      <div className="workspace-grid">
        <section className="painel-tarefas" id="tarefas" aria-labelledby="titulo-lista">
          <div className="cabecalho-lista"><div><p className="sobretitulo">SEU ESPAÇO DE FOCO</p><h2 id="titulo-lista">Minhas tarefas <span className="contador">{total}</span></h2></div><Link className="botao botao--escuro" href="/tarefas/nova"><Icone nome="plus" tamanho={17} /> Nova tarefa</Link></div>
          <div className="barra-filtros">
            <div className="busca"><Icone nome="search" tamanho={18} /><label className="sr-only" htmlFor="busca">Buscar tarefas</label><input id="busca" type="search" value={busca} maxLength={LIMITE_TITULO} onChange={evento => setBusca(evento.target.value)} placeholder="Buscar por título ou descrição…" /></div>
            <label className="sr-only" htmlFor="filtro-prioridade">Filtrar por prioridade</label>
            <select id="filtro-prioridade" value={filtros.prioridade} onChange={evento => setFiltros(atuais => ({ ...atuais, prioridade: evento.target.value as Filtros["prioridade"] }))}>
              <option value="todas">Todas as prioridades</option><option value="alta">Prioridade alta</option><option value="media">Prioridade média</option><option value="baixa">Prioridade baixa</option>
            </select>
          </div>
          <div className="linha-abas">
            <div className="filtros-status" role="group" aria-label="Filtrar por status">
              {([ ["todas", "Todas"], ["pendentes", "Em aberto"], ["concluidas", "Concluídas"] ] as const).map(([valor, nome]) => <button key={valor} className={filtros.status === valor ? "aba ativa" : "aba"} aria-pressed={filtros.status === valor} onClick={() => setFiltros(atuais => ({ ...atuais, status: valor }))}>{nome}</button>)}
            </div>
            <span className="ordenacao">Mais recentes primeiro</span>
          </div>

          {lista.isError && <div className="aviso aviso--erro" role="alert"><div><strong>Não foi possível atualizar a lista.</strong><p>{mensagemDeErro(lista.error)}</p></div><button className="botao" disabled={lista.isFetching} onClick={() => void lista.refetch()}>Tentar novamente</button></div>}
          {lista.isPending ? <div className="estado-vazio" role="status"><span className="spinner" /><p>Buscando suas tarefas…</p></div>
            : tarefas.length === 0 ? <div className="estado-vazio"><span className="icone-vazio"><Icone nome={temFiltro ? "search" : "spark"} tamanho={29} /></span><h3>{temFiltro ? "Nenhuma tarefa encontrada" : "Tudo começa com uma ideia"}</h3><p>{temFiltro ? "Tente outra busca ou ajuste os filtros." : "Crie sua primeira tarefa. Os próximos passos ficam mais claros quando você os coloca no papel."}</p>{temFiltro ? <button className="botao" onClick={limparFiltros}>Limpar filtros</button> : <Link className="botao botao--principal" href="/tarefas/nova"><Icone nome="plus" tamanho={17} /> Criar primeira tarefa</Link>}</div>
              : <ul className="lista-tarefas" aria-busy={lista.isFetching}>
                {tarefas.map(tarefa => <li key={tarefa.id}><article className={`cartao-tarefa ${tarefa.concluida ? "cartao-tarefa--concluida" : ""}`}>
                  <div className="conteudo-tarefa">
                    <input className="checkbox-conclusao" type="checkbox" checked={tarefa.concluida} disabled={ocupado} aria-label={`${tarefa.concluida ? "Reabrir" : "Concluir"} tarefa: ${tarefa.titulo}`} onChange={evento => conclusao.mutate({ id: tarefa.id, concluida: evento.target.checked })} />
                    <div className="texto-tarefa"><h3>{tarefa.titulo}</h3>{tarefa.descricao && <p className="descricao-tarefa">{tarefa.descricao}</p>}<div className="metadados-tarefa"><span className={`badge-prioridade badge-prioridade--${tarefa.prioridade}`}><span /> {NOMES_PRIORIDADE[tarefa.prioridade]}</span>{tarefa.concluida && <span className="badge-concluida">Concluída</span>}<time dateTime={new Date(tarefa.dataCriacao).toISOString()}>{dataFormatada(tarefa.dataCriacao)}</time></div></div>
                  </div>
                  {confirmandoId === tarefa.id ? <div className="confirmacao" role="group" aria-label={`Excluir ${tarefa.titulo}?`}><span>Excluir esta tarefa?</span><button className="botao botao--perigo" disabled={ocupado} onClick={() => { setMensagem(null); exclusao.mutate({ id: tarefa.id }); }}>{exclusao.isPending ? "Excluindo…" : "Confirmar exclusão"}</button><button className="botao" disabled={ocupado} onClick={() => setConfirmandoId(null)}>Cancelar</button></div>
                    : <div className="acoes-tarefa"><Link className="botao-icone" href={`/tarefas/${tarefa.id}/editar`} aria-label={`Editar tarefa: ${tarefa.titulo}`} title="Editar tarefa"><Icone nome="edit" tamanho={18} /></Link><button className="botao-icone botao-icone--perigo" disabled={ocupado} onClick={() => setConfirmandoId(tarefa.id)} aria-label={`Excluir tarefa: ${tarefa.titulo}`} title="Excluir tarefa"><Icone nome="trash" tamanho={18} /></button></div>}
                </article></li>)}
              </ul>}

          <div ref={sentinela} className="rodape-lista" aria-live="polite">{lista.isFetchingNextPage ? <p>Carregando mais tarefas…</p> : lista.hasNextPage ? <button className="botao" disabled={lista.isFetching || ocupado} onClick={() => void lista.fetchNextPage()}>Carregar mais tarefas <Icone nome="arrow" tamanho={16} /></button> : tarefas.length > 0 ? <p>{tarefas.length} de {total} tarefas carregadas <span>·</span> Tudo à vista.</p> : null}</div>
          {lista.isRefetching && <p className="atualizando" role="status">Atualizando tarefas e indicadores…</p>}
        </section>

        <aside className="sidebar" aria-label="Panorama e próximo foco">
          <div className="card-panorama"><div className="sidebar-titulo"><span className="metrica-icone violeta"><Icone nome="spark" tamanho={18} /></span><h2>Seu panorama</h2></div><p className="texto-secundario">Cada tarefa concluída conta.</p><div className="percentual"><strong>{resumo.taxaConclusao}<span>%</span></strong><span>das tarefas<br />concluídas</span></div><div className="barra-progresso" role="progressbar" aria-label="Taxa de conclusão de todas as tarefas" aria-valuemin={0} aria-valuemax={100} aria-valuenow={resumo.taxaConclusao}><span style={{ width: `${resumo.taxaConclusao}%` }} /></div><p className="nota-indicador">{resumo.concluidas} de {resumo.total} tarefas concluídas.<br />Visão geral de toda a sua lista.</p></div>
          <div className="card-foco"><span className="eyebrow">CLAREZA PARA AGIR</span><h2>{resumo.altaPrioridade ? "O que merece sua atenção?" : resumo.pendentes ? "Um passo abre caminhos." : "Abra espaço para o próximo passo."}</h2><p>{resumo.altaPrioridade ? `${resumo.altaPrioridade} ${resumo.altaPrioridade === 1 ? "tarefa de prioridade alta está em aberto." : "tarefas de prioridade alta estão em aberto."} Que tal começar por aqui?` : resumo.pendentes ? `Você tem ${resumo.pendentes} ${resumo.pendentes === 1 ? "tarefa em aberto" : "tarefas em aberto"}. Escolha uma e avance no seu ritmo.` : "Uma ideia bem organizada é o começo de algo maior."}</p>{resumo.altaPrioridade > 0 && <button className="link-foco" onClick={() => { setBusca(""); setFiltros({ busca: "", status: "pendentes", prioridade: "alta" }); }}>Ver prioridades <Icone nome="arrow" tamanho={17} /></button>}<span className="foco-decoracao" aria-hidden="true">A</span></div>
          <p className="nota-sidebar">Dados que trazem clareza.<br />Pessoas que fazem acontecer.</p>
        </aside>
      </div>
    </div>
  </>;
}
