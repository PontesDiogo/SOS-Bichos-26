export type StatusDenuncia =
  | "Pendente"
  | "Em análise"
  | "Em atendimento"
  | "Resolvido"
  | "Cancelado";

export type TipoDenuncia =
  | "Maus-tratos"
  | "Abandono"
  | "Animal ferido"
  | "Infestação"
  | "Outros";

export interface Denuncia {
  id: string;
  resumo: string;
  descricao: string;
  tipo: TipoDenuncia;
  status: StatusDenuncia;
  endereco: string;
  latitude: number | null;
  longitude: number | null;
  foto_url?: string | null;
  anonimo: boolean;
  user_id: string;
  nome_usuario: string;
  created_at: string;
  updated_at?: string | null;
  resolved_at?: string | null;
}

export interface CriarDenunciaPayload {
  resumo: string;
  descricao: string;
  tipo: TipoDenuncia;
  endereco: string;
  latitude: number | null;
  longitude: number | null;
  foto_url?: string | null;
  anonimo: boolean;
  user_id: string;
  nome_usuario: string;
}

export interface EditarDenunciaPayload {
  resumo?: string;
  descricao?: string;
  tipo?: TipoDenuncia;
  endereco?: string;
  latitude?: number | null;
  longitude?: number | null;
  foto_url?: string | null;
}