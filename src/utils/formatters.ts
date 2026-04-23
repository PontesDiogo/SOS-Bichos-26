export function formatarCep(cep: string): string {
  const cepLimpo = cep.replace(/\D/g, "").slice(0, 8);

  if (cepLimpo.length <= 5) return cepLimpo;
  return `${cepLimpo.slice(0, 5)}-${cepLimpo.slice(5)}`;
}

export function formatarData(dataIso: string): string {
  const data = new Date(dataIso);
  return data.toLocaleDateString("pt-BR");
}

export function formatarHora(dataIso: string): string {
  const data = new Date(dataIso);
  return data.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatarDataHora(dataIso: string): string {
  const data = new Date(dataIso);
  return data.toLocaleString("pt-BR");
}

export function formatarEndereco(endereco: string): string {
  return endereco?.trim() || "Endereço não informado";
}

export function tempoAberto(dataIso: string): string {
  const inicio = new Date(dataIso).getTime();
  const agora = Date.now();
  const diffMs = agora - inicio;

  const horas = Math.floor(diffMs / (1000 * 60 * 60));
  const dias = Math.floor(horas / 24);

  if (dias > 0) return `${dias} dia(s)`;
  return `${horas} hora(s)`;
}