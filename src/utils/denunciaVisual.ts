import type { TipoDenuncia } from "../types/denuncia";

export function getTipoDenunciaIcon(tipo?: TipoDenuncia | string | null) {
  switch (tipo) {
    case "Maus-tratos":
      return "⚠️";
    case "Abandono":
      return "🐾";
    case "Animal ferido":
      return "🩹";
    case "Infestação":
      return "🐀";
    case "Outros":
      return "📌";
    default:
      return "🐶";
  }
}

export function getTipoDenunciaLabel(tipo?: TipoDenuncia | string | null) {
  return tipo || "Ocorrência";
}