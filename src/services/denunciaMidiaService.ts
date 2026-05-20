import { supabase } from "../lib/supabaseClient";
import type {
  CriarDenunciaMidiaPayload,
  DenunciaMidia,
} from "../types/denunciaMidia";

export async function criarMidiaDenuncia(
  payload: CriarDenunciaMidiaPayload
): Promise<DenunciaMidia> {
  const { data, error } = await supabase
    .from("denuncia_midias")
    .insert([
      {
        denuncia_id: payload.denuncia_id,
        url: payload.url,
        tipo: payload.tipo,
        nome_arquivo: payload.nome_arquivo ?? null,
        ordem: payload.ordem ?? 1,
      },
    ])
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function listarMidiasPorDenuncia(
  denunciaId: string
): Promise<DenunciaMidia[]> {
  const { data, error } = await supabase
    .from("denuncia_midias")
    .select("*")
    .eq("denuncia_id", denunciaId)
    .order("ordem", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) throw error;

  return data || [];
}