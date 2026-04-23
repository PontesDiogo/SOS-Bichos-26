import { supabase } from "../lib/supabaseClient";

export async function atualizarNomePerfil(nome: string) {
  const { data, error } = await supabase.auth.updateUser({
    data: { nome },
  });

  if (error) throw error;
  return data;
}

export async function buscarUsuarioAtual() {
  const { data, error } = await supabase.auth.getUser();

  if (error) throw error;
  return data.user;
}