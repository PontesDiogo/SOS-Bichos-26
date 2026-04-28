export interface DenunciaFeedback {
  id: string;
  denuncia_id: string;
  status_novo: string;
  descricao: string;
  proxima_acao?: string | null;
  colaborador_nome?: string | null;
  colaborador_contato?: string | null;
  created_at: string;
}

export interface CriarFeedbackPayload {
  denuncia_id: string;
  status_novo: string;
  descricao: string;
  proxima_acao?: string;
  colaborador_nome?: string;
  colaborador_contato?: string;
}