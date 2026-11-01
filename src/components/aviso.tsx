export type Mensagem = { tipo: "sucesso" | "erro"; texto: string };

export function Aviso({ mensagem }: { mensagem: Mensagem | null }) {
  if (!mensagem) return null;

  return (
    <div
      className={`aviso aviso--${mensagem.tipo}`}
      role={mensagem.tipo === "erro" ? "alert" : "status"}
    >
      <span aria-hidden="true">{mensagem.tipo === "sucesso" ? "✓" : "!"}</span>
      {mensagem.texto}
    </div>
  );
}
