import { supabase } from "../lib/supabaseClient";
import type {
  CriarDenunciaPayload,
  Denuncia,
  EditarDenunciaPayload,
  StatusDenuncia,
} from "../types/denuncia";

export async function criarDenuncia(payload: CriarDenunciaPayload): Promise<Denuncia> {
  const { data, error } = await supabase
    .from("denuncias")
    .insert([
      {
        ...payload,
        status: "Pendente",
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function listarDenunciasUsuario(userId: string): Promise<Denuncia[]> {
  const { data, error } = await supabase
    .from("denuncias")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function listarTodasDenuncias(): Promise<Denuncia[]> {
  const { data, error } = await supabase
    .from("denuncias")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function editarDenuncia(id: string, payload: EditarDenunciaPayload) {
  const { data, error } = await supabase
    .from("denuncias")
    .update({
      ...payload,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function cancelarDenuncia(id: string) {
  const { data, error } = await supabase
    .from("denuncias")
    .update({
      status: "Cancelado",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function atualizarStatusDenuncia(id: string, status: StatusDenuncia) {
  const updatePayload: Record<string, string> = {
    status,
    updated_at: new Date().toISOString(),
  };

  if (status === "Resolvido") {
    updatePayload.resolved_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from("denuncias")
    .update(updatePayload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}