export type TipoMidiaDenuncia = "imagem" | "video";

export interface DenunciaMidia {
  id: string;
  denuncia_id: string;
  url: string;
  tipo: TipoMidiaDenuncia;
  nome_arquivo?: string | null;
  ordem: number;
  created_at: string;
}

export interface CriarDenunciaMidiaPayload {
  denuncia_id: string;
  url: string;
  tipo: TipoMidiaDenuncia;
  nome_arquivo?: string | null;
  ordem?: number;
}