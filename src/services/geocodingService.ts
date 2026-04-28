import type { Endereco } from "../types/endereco";

export async function buscarEnderecoPorCoordenadas(
  latitude: number,
  longitude: number
): Promise<Endereco> {
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&addressdetails=1`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Não foi possível buscar o endereço pelas coordenadas.");
  }

  const data = await response.json();
  const address = data.address || {};

  return {
    cep: address.postcode || "",
    rua: address.road || address.pedestrian || address.footway || "",
    numero: address.house_number || "",
    bairro:
      address.suburb ||
      address.neighbourhood ||
      address.quarter ||
      address.city_district ||
      address.county ||
      "",
    cidade:
      address.city ||
      address.town ||
      address.village ||
      address.municipality ||
      "",
    estado: address.state || "",
  };
}