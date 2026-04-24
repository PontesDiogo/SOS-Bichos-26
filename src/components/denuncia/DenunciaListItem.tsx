import type { Denuncia } from "../../types/denuncia";
import { formatarData, formatarHora } from "../../utils/formatters";

interface DenunciaListItemProps {
  denuncia: Denuncia;
  isSelected: boolean;
  onClick: () => void;
}

export function DenunciaListItem({
  denuncia,
  isSelected,
  onClick,
}: DenunciaListItemProps) {
  return (
    <button
      type="button"
      className={`denuncia-list-item ${isSelected ? "is-selected" : ""}`}
      onClick={onClick}
    >
      <div className="denuncia-list-item__main">
        <strong>{denuncia.resumo || "Denúncia sem resumo"}</strong>

        <span>
          {formatarData(denuncia.created_at)} às{" "}
          {formatarHora(denuncia.created_at)}
        </span>

        <small>{denuncia.endereco || "Local não informado"}</small>
      </div>

      <div className="denuncia-list-item__side">
        <span className={`status-pill status-pill--${normalizeStatus(denuncia.status)}`}>
          {denuncia.status}
        </span>

        {denuncia.foto_url && <span className="photo-indicator">📷</span>}
      </div>
    </button>
  );
}

function normalizeStatus(status: string) {
  return status
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-");
}