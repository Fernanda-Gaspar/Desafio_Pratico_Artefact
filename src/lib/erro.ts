import { TRPCClientError } from "@trpc/client";

export function mensagemDeErro(erro: unknown): string {
  if (erro instanceof TRPCClientError) {
    if (!erro.data) {
      return "Não foi possível conectar ao servidor. Verifique a conexão e tente novamente.";
    }
    if (erro.data.code === "INTERNAL_SERVER_ERROR") {
      return "Ocorreu uma falha no servidor. Tente novamente em instantes.";
    }
    return erro.message;
  }

  return "Não foi possível concluir a operação. Tente novamente.";
}
