import { useEffect, useState } from "react";
import type { Denuncia } from "../../types/denuncia";
import { DenunciaCard } from "./DenunciaCard";
import { DenunciaListItem } from "./DenunciaListItem";

interface DenunciaListProps {
  denuncias: Denuncia[];
  loading?: boolean;
  erro?: string;
}

export function DenunciaList({
  denuncias,
  loading = false,
  erro = "",
}: DenunciaListProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (denuncias.length > 0 && !selectedId) {
      setSelectedId(denuncias[0].id);
    }

    if (denuncias.length === 0) {
      setSelectedId(null);
    }
  }, [denuncias, selectedId]);

  const selectedDenuncia =
    denuncias.find((denuncia) => denuncia.id === selectedId) || null;

  if (loading) {
    return (
      <section className="denuncias-panel">
        <div className="placeholder-card">
          <strong>Carregando denúncias...</strong>
          <p>Buscando suas ocorrências registradas.</p>
        </div>
      </section>
    );
  }

  if (erro) {
    return (
      <section className="denuncias-panel">
        <div className="placeholder-card">
          <strong>Erro ao carregar</strong>
          <p>{erro}</p>
        </div>
      </section>
    );
  }

  if (denuncias.length === 0) {
    return (
      <section className="denuncias-panel">
        <div className="placeholder-card">
          <strong>Nenhuma denúncia registrada ainda</strong>
          <p>
            Quando você registrar uma denúncia, ela aparecerá aqui para
            acompanhamento.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="denuncias-panel">
      <div className="denuncias-list">
        {denuncias.map((denuncia) => (
          <DenunciaListItem
            key={denuncia.id}
            denuncia={denuncia}
            isSelected={denuncia.id === selectedId}
            onClick={() => setSelectedId(denuncia.id)}
          />
        ))}
      </div>

      <DenunciaCard denuncia={selectedDenuncia} />
    </section>
  );
}