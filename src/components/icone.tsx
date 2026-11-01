import type { CSSProperties } from "react";

type Nome = "plus" | "search" | "arrow" | "check" | "list" | "flag" | "edit" | "trash" | "spark";
const caminhos: Record<Nome, string> = {
  plus: "M12 5v14M5 12h14", search: "m21 21-5.5-5.5M19 10.5a8.5 8.5 0 1 1-17 0 8.5 8.5 0 0 1 17 0",
  arrow: "M5 12h14m-6-6 6 6-6 6", check: "m5 12 4 4L19 6",
  list: "M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01",
  flag: "M5 21V4m0 0c4-4 10 4 14 0v10c-4 4-10-4-14 0",
  edit: "m16 3 5 5M4 15 16 3a2 2 0 0 1 5 5L9 20l-6 1 1-6z",
  trash: "M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7M14 10v7",
  spark: "m12 3 2.4 6.6L21 12l-6.6 2.4L12 21l-2.4-6.6L3 12l6.6-2.4L12 3z",
};

export function Icone({ nome, tamanho = 20, style }: { nome: Nome; tamanho?: number; style?: CSSProperties }) {
  return <svg aria-hidden="true" width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={style}><path d={caminhos[nome]} /></svg>;
}
