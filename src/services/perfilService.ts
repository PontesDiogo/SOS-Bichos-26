import { supabase } from "../lib/supabaseClient";

export async function atualizarNomePerfil(nome: string) {
  const { data, error } = await supabase.auth.updateUser({
    data: { nome },
  });

  if (error) throw error;

  return data.user;
}

export async function atualizarAvatarPerfil(avatarUrl: string) {
  const { data, error } = await supabase.auth.updateUser({
    data: { avatar_url: avatarUrl },
  });

  if (error) throw error;

  return data.user;
}

export async function atualizarSenhaPerfil(novaSenha: string) {
  const { data, error } = await supabase.auth.updateUser({
    password: novaSenha,
  });

  if (error) throw error;

  return data.user;
}

export async function desativarContaUsuario(senhaAtual: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) {
    throw new Error("Usuário não encontrado.");
  }

  const { error: senhaError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: senhaAtual,
  });

  if (senhaError) {
    throw new Error("Senha atual incorreta.");
  }

  const agora = new Date();
  const efetivaEm = new Date(agora);
  efetivaEm.setDate(efetivaEm.getDate() + 30);

  const metadataAtual = user.user_metadata ?? {};

  const { error: updateError } = await supabase.auth.updateUser({
    data: {
      ...metadataAtual,
      conta_desativada: true,
      conta_desativada_em: agora.toISOString(),
      conta_desativacao_efetiva_em: efetivaEm.toISOString(),
    },
  });

  if (updateError) {
    throw updateError;
  }

  const { error: logoutError } = await supabase.auth.signOut();

  if (logoutError) {
    throw logoutError;
  }
}

export async function reativarContaUsuario() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Usuário não encontrado.");
  }

  const metadataAtual = user.user_metadata ?? {};
  const agora = new Date();

  const { data, error } = await supabase.auth.updateUser({
    data: {
      ...metadataAtual,
      conta_desativada: false,
      conta_reativada_em: agora.toISOString(),
    },
  });

  if (error) throw error;

  return data.user;
}

export async function verificarContaDesativadaAposLogin() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      bloqueada: false,
      reativada: false,
    };
  }

  const metadata = user.user_metadata ?? {};

  if (!metadata.conta_desativada) {
    return {
      bloqueada: false,
      reativada: false,
    };
  }

  const efetivaEm = metadata.conta_desativacao_efetiva_em
    ? new Date(metadata.conta_desativacao_efetiva_em)
    : null;

  const agora = new Date();

  if (efetivaEm && agora >= efetivaEm) {
    await supabase.auth.signOut();

    return {
      bloqueada: true,
      reativada: false,
      mensagem:
        "Esta conta foi encerrada após o prazo de 30 dias. Para acessar novamente, faça um novo cadastro.",
    };
  }

  await reativarContaUsuario();

  return {
    bloqueada: false,
    reativada: true,
    mensagem: "Conta reativada com sucesso!",
  };
}