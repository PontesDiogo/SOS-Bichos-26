import type { Endereco, ViaCepResponse } from "../types/endereco";

export async function buscarEnderecoPorCep(cep: string): Promise<Endereco> {
  const cepLimpo = cep.replace(/\D/g, "");

  const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
  const data: ViaCepResponse = await response.json();

  if (!response.ok || data.erro) {
    throw new Error("CEP não encontrado.");
  }

  return {
    cep: data.cep,
    rua: data.logradouro || "",
    numero: "",
    bairro: data.bairro || "",
    cidade: data.localidade || "",
    estado: data.uf || "",
  };
}