import { supabase } from "../lib/supabaseClient";

interface SignUpPayload {
  nome: string;
  email: string;
  senha: string;
}

export async function signIn(email: string, senha: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: senha,
  });

  if (error) throw error;
  return data;
}
interface SignUpPayload {
  nome: string;
  email: string;
  senha: string;
  aceitouPolitica?: boolean;
}

export async function signUp({
  nome,
  email,
  senha,
  aceitouPolitica = false,
}: SignUpPayload) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password: senha,
    options: {
      data: {
        nome,
        role: "user",
        avatar_url: null,
        conta_desativada: false,
        politica_privacidade_aceita: aceitouPolitica,
        politica_privacidade_aceita_em: aceitouPolitica
          ? new Date().toISOString()
          : null,
      },
    },
  });

  if (error) {
    if (
      error.message.toLowerCase().includes("already registered") ||
      error.message.toLowerCase().includes("already exists")
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
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/redefinir-senha`,
  });

  if (error) throw error;
}

export async function updatePassword(newPassword: string) {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) throw error;
  return data;
}