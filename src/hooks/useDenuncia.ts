import { useCallback, useEffect, useState } from "react";
import type { Denuncia } from "../types/denuncia";
import {
  listarDenunciasUsuario,
  listarTodasDenuncias,
} from "../services/denunciaService";

interface UseDenunciasParams {
  userId: string;
  isAdmin?: boolean;
}

export function useDenuncias({ userId, isAdmin = false }: UseDenunciasParams) {
  const [denuncias, setDenuncias] = useState<Denuncia[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  const carregarDenuncias = useCallback(async () => {
    try {
      setLoading(true);
      setErro("");

      const data = isAdmin
        ? await listarTodasDenuncias()
        : await listarDenunciasUsuario(userId);

      setDenuncias(data);
    } catch (error) {
      console.error(error);
      setErro("Não foi possível carregar as denúncias.");
    } finally {
      setLoading(false);
    }
  }, [userId, isAdmin]);

  useEffect(() => {
    if (userId) {
      carregarDenuncias();
    }
  }, [userId, carregarDenuncias]);

  return {
    denuncias,
    loading,
    erro,
    carregarDenuncias,
  };
}