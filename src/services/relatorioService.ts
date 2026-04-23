import { supabase } from "../lib/supabaseClient";

export async function buscarCardsRelatorio() {
  const { data, error } = await supabase.from("denuncias").select("status, tipo");

  if (error) throw error;

  const denuncias = data || [];

  const total = denuncias.length;
  const resolvidas = denuncias.filter((d) => d.status === "Resolvido").length;
  const pendentes = denuncias.filter((d) => d.status === "Pendente").length;
  const canceladas = denuncias.filter((d) => d.status === "Cancelado").length;

  return {
    total,
    resolvidas,
    pendentes,
    canceladas,
  };
}

export async function buscarRelatorioPorStatus() {
  const { data, error } = await supabase.from("denuncias").select("status");

  if (error) throw error;

  const contagem: Record<string, number> = {};

  (data || []).forEach((item) => {
    contagem[item.status] = (contagem[item.status] || 0) + 1;
  });

  return Object.entries(contagem).map(([status, quantidade]) => ({
    status,
    quantidade,
  }));
}

export async function buscarRelatorioPorTipo() {
  const { data, error } = await supabase.from("denuncias").select("tipo");

  if (error) throw error;

  const contagem: Record<string, number> = {};

  (data || []).forEach((item) => {
    contagem[item.tipo] = (contagem[item.tipo] || 0) + 1;
  });

  return Object.entries(contagem).map(([tipo, quantidade]) => ({
    tipo,
    quantidade,
  }));
}