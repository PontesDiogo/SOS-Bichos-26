import { useEffect, useState } from "react";
import type { Denuncia } from "../../types/denuncia";
import type { DenunciaFeedback } from "../../types/feedback";
import { cancelarDenuncia } from "../../services/denunciaService";
import { listarFeedbacksPorDenuncia } from "../../services/feedbackService";
import { formatarDataHora } from "../../utils/formatters";
import { getTipoDenunciaIcon } from "../../utils/denunciaVisual";
import type { DenunciaMidia } from "../../types/denunciaMidia";
import { listarMidiasPorDenuncia } from "../../services/denunciaMidiaService";
import { DenunciaMediaCarousel } from "./DenunciaMediaCarousel";

interface DenunciaCardProps {
  denuncia: Denuncia | null;
  onEdit?: (denuncia: Denuncia) => void;
  onUpdated?: () => void;
}

export function DenunciaCard({
  denuncia,
  onEdit,
  onUpdated,
}: DenunciaCardProps) {
  const [feedbacks, setFeedbacks] = useState<DenunciaFeedback[]>([]);
  const [loadingFeedbacks, setLoadingFeedbacks] = useState(false);
  const [midias, setMidias] = useState<DenunciaMidia[]>([]);
  const [loadingMidias, setLoadingMidias] = useState(false);


  useEffect(() => {
    async function carregarFeedbacks() {
      if (!denuncia?.id) {
        setFeedbacks([]);
        return;
      }

      try {
        setLoadingFeedbacks(true);

        const data = await listarFeedbacksPorDenuncia(denuncia.id);

        setFeedbacks(data);
      } catch (error) {
        console.error(error);
        setFeedbacks([]);
      } finally {
        setLoadingFeedbacks(false);
      }
    }

    carregarFeedbacks();
  }, [denuncia?.id]);

  useEffect(() => {
    async function carregarMidias() {
      if (!denuncia?.id) {
        setMidias([]);
        return;
      }

      try {
        setLoadingMidias(true);

        const data = await listarMidiasPorDenuncia(denuncia.id);
        setMidias(data);
      } catch (error) {
        console.error(error);
        setMidias([]);
      } finally {
        setLoadingMidias(false);
      }
    }

    carregarMidias();
  }, [denuncia?.id]);



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

  async function handleCancelar() {
    if (!denuncia) return;

    const confirmar = window.confirm(
      "Tem certeza que deseja cancelar esta denúncia?"
    );

    if (!confirmar) return;

    try {
      await cancelarDenuncia(denuncia.id);
      onUpdated?.();
    } catch (error) {
      console.error(error);
      alert("Não foi possível cancelar a denúncia.");
    }
  }

  const podeEditarOuCancelar = denuncia.status === "Pendente";

  return (
    <article className="denuncia-card">


      <div className="denuncia-card__content">
        <div className="denuncia-card__header">
          <div className="denuncia-card__title-row">
            <span className="denuncia-type-icon denuncia-type-icon--large">
              {getTipoDenunciaIcon(denuncia.tipo)}
            </span>

            <div>
              <span className="section-tag">
                {denuncia.tipo || "Ocorrência"}
              </span>

              <h3>{denuncia.resumo || "Denúncia sem resumo"}</h3>
            </div>
          </div>

          <span
            className={`status-pill status-pill--${normalizeStatus(
              denuncia.status
            )}`}
          >
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
        {loadingMidias ? (
          <p className="denuncia-card__description">Carregando mídias...</p>
        ) : (
          <DenunciaMediaCarousel
            midias={midias}
            fotoUrlLegada={denuncia.foto_url}
          />
        )}

        <div className="feedback-box">
          <h3>Histórico da denúncia</h3>

          {loadingFeedbacks && <p>Carregando atualizações...</p>}

          {!loadingFeedbacks && feedbacks.length === 0 && (
            <p>Ainda não há atualizações registradas para esta denúncia.</p>
          )}

          {!loadingFeedbacks &&
            feedbacks.map((feedback) => (
              <div key={feedback.id} className="feedback-item">
                <div className="feedback-item__header">
                  <strong>{feedback.status_novo}</strong>
                  <small>{formatarDataHora(feedback.created_at)}</small>
                </div>

                <p>{feedback.descricao}</p>

                {feedback.proxima_acao && (
                  <p>
                    <strong>Próxima ação:</strong> {feedback.proxima_acao}
                  </p>
                )}
              </div>
            ))}
        </div>

        {podeEditarOuCancelar && (
          <div className="denuncia-card__actions">
            <button type="button" onClick={() => onEdit?.(denuncia)}>
              Editar denúncia
            </button>

            <button
              type="button"
              className="danger-button"
              onClick={handleCancelar}
            >
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