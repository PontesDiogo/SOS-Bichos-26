import { supabase } from "../lib/supabaseClient";
import { verificarContaDesativadaAposLogin } from "./perfilService";

type SignUpParams = {
  nome: string;
  email: string;
  senha: string;
  aceitouPolitica: boolean;
};

export async function signIn(email: string, senha: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: senha,
  });

  if (error) {
    throw new Error("Usuário não cadastrado ou senha incorreta.");
  }

  const verificacaoConta = await verificarContaDesativadaAposLogin();

  if (verificacaoConta.bloqueada) {
    throw new Error(verificacaoConta.mensagem);
  }

  return {
    user: data.user,
    session: data.session,
    contaReativada: verificacaoConta.reativada,
    mensagem: verificacaoConta.mensagem,
  };
}

export async function signUp({
  nome,
  email,
  senha,
  aceitouPolitica,
}: SignUpParams) {
  if (!aceitouPolitica) {
    throw new Error("Você precisa aceitar a Política de Privacidade.");
  }

  const agora = new Date().toISOString();

  const { data, error } = await supabase.auth.signUp({
    email,
    password: senha,
    options: {
      data: {
        nome,
        role: "user",
        avatar_url: null,
        conta_desativada: false,
        politica_privacidade_aceita: true,
        politica_privacidade_aceita_em: agora,
      },
    },
  });

  if (error) {
    if (
      error.message.toLowerCase().includes("already registered") ||
      error.message.toLowerCase().includes("already exists") ||
      error.message.toLowerCase().includes("user already registered")
    ) {
      throw new Error("Este e-mail já está cadastrado.");
    }

    throw error;
  }

  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();

  if (error) throw error;
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession();

  if (error) throw error;

  return data.session;
}

export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();

  if (error) throw error;

  return data.user;
}

export async function sendPasswordReset(email: string) {
  const redirectTo = `${window.location.origin}/redefinir-senha`;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  });

  if (error) throw error;
}

export async function updatePassword(newPassword: string) {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) throw error;

  return data.user;
}