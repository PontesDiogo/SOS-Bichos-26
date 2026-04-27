import { supabase } from "../lib/supabaseClient";

export async function atualizarNomePerfil(nome: string) {
  const { data, error } = await supabase.auth.updateUser({
    data: { nome },
  });

  if (error) throw error;
  return data;
}

export async function atualizarAvatarPerfil(avatarUrl: string) {
  const { data, error } = await supabase.auth.updateUser({
    data: { avatar_url: avatarUrl },
  });

  if (error) throw error;
  return data;
}

export async function atualizarSenhaPerfil(novaSenha: string) {
  const { data, error } = await supabase.auth.updateUser({
    password: novaSenha,
  });

  if (error) throw error;
  return data;
}

export async function desativarContaUsuario() {
  const { data, error } = await supabase.auth.updateUser({
    data: {
      conta_desativada: true,
      conta_desativada_em: new Date().toISOString(),
    },
  });

  if (error) throw error;
  return data;
}