"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { mensagemDeErro } from "@/lib/erro";
import {
  LIMITE_DESCRICAO,
  LIMITE_TITULO,
  tarefaSchema,
  NOMES_PRIORIDADE,
  type Prioridade,
  type Tarefa,
} from "@/lib/tarefa";
import { useTRPC } from "@/trpc/client";
import { Aviso, type Mensagem } from "./aviso";

type ErrosFormulario = { titulo?: string; descricao?: string };

export function FormularioTarefa({ tarefa }: { tarefa?: Tarefa }) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [titulo, setTitulo] = useState(tarefa?.titulo ?? "");
  const [descricao, setDescricao] = useState(tarefa?.descricao ?? "");
  const [prioridade, setPrioridade] = useState<Prioridade>(tarefa?.prioridade ?? "media");
  const [erros, setErros] = useState<ErrosFormulario>({});
  const [mensagem, setMensagem] = useState<Mensagem | null>(null);
  const [redirecionando, setRedirecionando] = useState(false);
  const criacao = useMutation(trpc.tarefas.criar.mutationOptions());
  const atualizacao = useMutation(trpc.tarefas.atualizar.mutationOptions());
  const ocupado = criacao.isPending || atualizacao.isPending || redirecionando;

  async function salvar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (ocupado) return;
    setMensagem(null);

    const resultado = tarefaSchema.safeParse({ titulo, descricao, prioridade });

    if (!resultado.success) {
      const campos = resultado.error.flatten().fieldErrors;
      setErros({ titulo: campos.titulo?.[0], descricao: campos.descricao?.[0] });
      document.getElementById(campos.titulo ? "titulo" : "descricao")?.focus();
      return;
    }

    setErros({});

    try {
      if (tarefa) {
        await atualizacao.mutateAsync({ id: tarefa.id, ...resultado.data });
      } else {
        await criacao.mutateAsync(resultado.data);
      }
    } catch (erro) {
      setMensagem({
        tipo: "erro",
        texto: mensagemDeErro(erro),
      });
      return;
    }

    setRedirecionando(true);
    await queryClient.invalidateQueries({ queryKey: trpc.tarefas.pathKey() });
    router.push(`/?sucesso=${tarefa ? "atualizada" : "criada"}`);
    router.refresh();
  }

  return (
    <>
      <Link className="link-voltar" href="/">← Voltar para tarefas</Link>
      <div className="cabecalho-formulario">
        <p className="sobretitulo">DO PLANO AO PRÓXIMO PASSO</p>
        <h1>{tarefa ? "Editar tarefa" : "Nova tarefa"}</h1>
        <p className="texto-secundario">{tarefa ? "Ajuste os detalhes e siga em frente." : "Tire uma ideia da cabeça e dê o primeiro passo."}</p>
      </div>

      <Aviso mensagem={mensagem} />

      <form className="formulario" onSubmit={salvar} noValidate aria-busy={ocupado}>
        <div className="campo">
          <label htmlFor="titulo">Título <span className="texto-secundario">(obrigatório)</span></label>
          <input
            id="titulo"
            name="titulo"
            value={titulo}
            onChange={(evento) => {
              setTitulo(evento.target.value);
              setErros((atuais) => ({ ...atuais, titulo: undefined }));
            }}
            placeholder="Ex.: Preparar a apresentação"
            maxLength={LIMITE_TITULO}
            required
            disabled={ocupado}
            aria-invalid={Boolean(erros.titulo)}
            aria-describedby={erros.titulo ? "erro-titulo" : "ajuda-titulo"}
          />
          {erros.titulo ? (
            <p id="erro-titulo" className="erro-campo" role="alert">{erros.titulo}</p>
          ) : (
            <p id="ajuda-titulo" className="ajuda-campo">Um título curto ajuda a encontrar a tarefa depois.</p>
          )}
        </div>

        <div className="campo">
          <label htmlFor="descricao">Descrição <span className="texto-secundario">(opcional)</span></label>
          <textarea
            id="descricao"
            name="descricao"
            value={descricao}
            onChange={(evento) => {
              setDescricao(evento.target.value);
              setErros((atuais) => ({ ...atuais, descricao: undefined }));
            }}
            placeholder="Inclua os detalhes que fazem diferença."
            rows={6}
            maxLength={LIMITE_DESCRICAO}
            disabled={ocupado}
            aria-invalid={Boolean(erros.descricao)}
            aria-describedby={erros.descricao ? "erro-descricao" : "ajuda-descricao"}
          />
          {erros.descricao && <p id="erro-descricao" className="erro-campo" role="alert">{erros.descricao}</p>}
          <p id="ajuda-descricao" className="ajuda-campo contador-caracteres">{descricao.length}/{LIMITE_DESCRICAO}</p>
        </div>

        <div className="campo campo-prioridade">
          <label htmlFor="prioridade">Prioridade</label>
          <select id="prioridade" name="prioridade" value={prioridade} onChange={evento => setPrioridade(evento.target.value as Prioridade)} disabled={ocupado}>
            {(["baixa", "media", "alta"] as const).map(valor => <option key={valor} value={valor}>{NOMES_PRIORIDADE[valor]}</option>)}
          </select>
          <p className="ajuda-campo">Defina o que merece atenção primeiro.</p>
        </div>
        <div className="rodape-formulario">
          <button
            className="botao"
            type="button"
            disabled={ocupado}
            onClick={() => router.push("/")}
          >
            Cancelar
          </button>
          <button className="botao botao--principal" type="submit" disabled={ocupado}>
            {ocupado ? "Salvando…" : tarefa ? "Salvar alterações" : "Criar tarefa"}
          </button>
        </div>
      </form>
    </>
  );
}
