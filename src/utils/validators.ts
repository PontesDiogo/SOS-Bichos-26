import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_SIZE_MB } from "./constants";

export function validarEmail(email: string): boolean {
  return /\S+@\S+\.\S+/.test(email);
}

export function validarCep(cep: string): boolean {
  const cepLimpo = cep.replace(/\D/g, "");
  return cepLimpo.length === 8;
}

export function validarSenhaForte(senha: string): boolean {
  const temMinimo8 = senha.length >= 8;
  const temMaiuscula = /[A-Z]/.test(senha);
  const temMinuscula = /[a-z]/.test(senha);
  const temNumero = /\d/.test(senha);
  const temEspecial = /[^A-Za-z0-9]/.test(senha);

  return temMinimo8 && temMaiuscula && temMinuscula && temNumero && temEspecial;
}

export function validarImagem(file: File): string | null {
  const tamanhoMaximo = MAX_IMAGE_SIZE_MB * 1024 * 1024;

  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return "Formato de imagem inválido. Use PNG, JPG, JPEG ou WEBP.";
  }

  if (file.size > tamanhoMaximo) {
    return `A imagem deve ter no máximo ${MAX_IMAGE_SIZE_MB}MB.`;
  }

  return null;
}