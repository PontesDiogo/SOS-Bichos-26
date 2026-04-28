import { supabase } from "../lib/supabaseClient";
import type {
  CriarFeedbackPayload,
  DenunciaFeedback,
} from "../types/feedback";

export async function criarFeedbackDenuncia(payload: CriarFeedbackPayload) {
  const { data, error } = await supabase
    .from("denuncia_feedbacks")
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error("Erro ao criar feedback:", error);
    console.error("Payload enviado:", payload);
    throw error;
  }

  return data as DenunciaFeedback;
}

export async function listarFeedbacksPorDenuncia(denunciaId: string) {
  const { data, error } = await supabase
    .from("denuncia_feedbacks")
    .select("*")
    .eq("denuncia_id", denunciaId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data as DenunciaFeedback[];
}