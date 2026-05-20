import { useMemo, useState } from "react";
import type { DenunciaMidia } from "../../types/denunciaMidia";

interface DenunciaMediaCarouselProps {
  midias: DenunciaMidia[];
  fotoUrlLegada?: string | null;
}

export function DenunciaMediaCarousel({
  midias,
  fotoUrlLegada,
}: DenunciaMediaCarouselProps) {
  const [indiceAtual, setIndiceAtual] = useState(0);

  const midiasNormalizadas = useMemo(() => {
    const midiasAtuais = midias || [];

    if (midiasAtuais.length > 0) {
      return midiasAtuais;
    }

    if (fotoUrlLegada) {
      return [
        {
          id: "foto-legada",
          denuncia_id: "",
          url: fotoUrlLegada,
          tipo: "imagem" as const,
          nome_arquivo: "Foto da ocorrência",
          ordem: 1,
          created_at: "",
        },
      ];
    }

    return [];
  }, [midias, fotoUrlLegada]);

  if (midiasNormalizadas.length === 0) {
    return null;
  }

  const midiaAtual = midiasNormalizadas[indiceAtual];

  function irParaAnterior() {
    setIndiceAtual((indice) =>
      indice === 0 ? midiasNormalizadas.length - 1 : indice - 1
    );
  }

  function irParaProxima() {
    setIndiceAtual((indice) =>
      indice === midiasNormalizadas.length - 1 ? 0 : indice + 1
    );
  }

  return (
    <section className="denuncia-media">
      <div className="denuncia-media__header">
        <div>
          <span className="section-tag">Mídias</span>
          <h3>Registros da ocorrência</h3>
        </div>

        <small>
          {midiasNormalizadas.length} anexo
          {midiasNormalizadas.length > 1 ? "s" : ""}
        </small>
      </div>

      <div className="denuncia-media__viewer">
        {midiaAtual.tipo === "video" ? (
          <video src={midiaAtual.url} controls className="denuncia-media__item">
            Seu navegador não suporta a reprodução de vídeo.
          </video>
        ) : (
          <img
            src={midiaAtual.url}
            alt={midiaAtual.nome_arquivo || "Mídia da ocorrência"}
            className="denuncia-media__item"
          />
        )}

        {midiasNormalizadas.length > 1 && (
          <>
            <button
              type="button"
              className="denuncia-media__control denuncia-media__control--prev"
              onClick={irParaAnterior}
              aria-label="Mídia anterior"
            >
              <span>‹</span>
            </button>

            <button
              type="button"
              className="denuncia-media__control denuncia-media__control--next"
              onClick={irParaProxima}
              aria-label="Próxima mídia"
            >
              <span>›</span>
            </button>
          </>
        )}
      </div>

      {midiasNormalizadas.length > 1 && (
        <div className="denuncia-media__thumbs">
          {midiasNormalizadas.map((midia, index) => (
            <button
              key={midia.id}
              type="button"
              className={index === indiceAtual ? "is-active" : ""}
              onClick={() => setIndiceAtual(index)}
              aria-label={`Visualizar mídia ${index + 1}`}
            >
              {midia.tipo === "video" ? (
                <span>▶</span>
              ) : (
                <img
                  src={midia.url}
                  alt={midia.nome_arquivo || `Miniatura ${index + 1}`}
                />
              )}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}