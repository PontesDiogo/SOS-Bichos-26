import type { Denuncia } from "../../types/denuncia";
import { formatarDataHora } from "../../utils/formatters";

interface DenunciaCardProps {
  denuncia: Denuncia | null;
}

export function DenunciaCard({ denuncia }: DenunciaCardProps) {
  if (!denuncia) {
    return (
      <article className="denuncia-card denuncia-card--empty">
        <h3>Selecione uma denúncia</h3>
        <p>
          Clique em uma denúncia da lista para visualizar os detalhes da
          ocorrência.
        </p>
      </article>
    );
  }

  return (
    <article className="denuncia-card">
      {denuncia.foto_url && (
        <div className="denuncia-card__image">
          <img src={denuncia.foto_url} alt="Foto da ocorrência denunciada" />
        </div>
      )}

      <div className="denuncia-card__content">
        <div className="denuncia-card__header">
          <div>
            <span className="section-tag">{denuncia.tipo || "Ocorrência"}</span>
            <h3>{denuncia.resumo || "Denúncia sem resumo"}</h3>
          </div>

          <span className={`status-pill status-pill--${normalizeStatus(denuncia.status)}`}>
            {denuncia.status}
          </span>
        </div>

        <p className="denuncia-card__description">{denuncia.descricao}</p>

        <div className="denuncia-card__details">
          <div>
            <strong>Endereço</strong>
            <span>{denuncia.endereco || "Não informado"}</span>
          </div>

          <div>
            <strong>Data de envio</strong>
            <span>{formatarDataHora(denuncia.created_at)}</span>
          </div>

          <div>
            <strong>Identificação</strong>
            <span>{denuncia.anonimo ? "Anônima" : denuncia.nome_usuario}</span>
          </div>

          {denuncia.latitude && denuncia.longitude && (
            <div>
              <strong>Coordenadas</strong>
              <span>
                {denuncia.latitude.toFixed(5)}, {denuncia.longitude.toFixed(5)}
              </span>
            </div>
          )}
        </div>

        {denuncia.status === "Pendente" && (
          <div className="denuncia-card__actions">
            <button type="button">Editar denúncia</button>
            <button type="button" className="danger-button">
              Cancelar denúncia
            </button>
          </div>
        )}
      </div>
    </article>
  );
}

function normalizeStatus(status: string) {
  return status
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-");
}