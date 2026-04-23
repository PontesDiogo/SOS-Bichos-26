import type { StatusDenuncia, TipoDenuncia } from "../types/denuncia";

export const STATUS_DENUNCIA: StatusDenuncia[] = [
  "Pendente",
  "Em análise",
  "Em atendimento",
  "Resolvido",
  "Cancelado",
];

export const TIPOS_DENUNCIA: TipoDenuncia[] = [
  "Maus-tratos",
  "Abandono",
  "Animal ferido",
  "Infestação",
  "Outros",
];

export const MAX_IMAGE_SIZE_MB = 5;
export const ACCEPTED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp"];