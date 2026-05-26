import { useState } from "react";

import bannerDenunciaCompleta from "../../assets/images/carousel/denuncia-completa.png";
import bannerFotosAjudam from "../../assets/images/carousel/fotos-ajudam.png";
import bannerAcompanheStatus from "../../assets/images/carousel/acompanhe-status.png";
import bannerDenunciarCuidar from "../../assets/images/carousel/denunciar-e-cuidar.png";

const noticias = [
  {
    tag: "Orientação",
    title: "Registre uma denúncia completa",
    text: "Informe o que aconteceu, adicione localização e anexe fotos para ajudar na análise.",
    image: bannerDenunciaCompleta,
    alt: "Banner orientando o registro completo de uma denúncia",
  },
  {
    tag: "Importante",
    title: "Fotos ajudam no atendimento",
    text: "Imagens da ocorrência facilitam a identificação do problema e apoiam a tomada de decisão.",
    image: bannerFotosAjudam,
    alt: "Banner explicando que fotos ajudam na análise da denúncia",
  },
  {
    tag: "Acompanhamento",
    title: "Acompanhe cada etapa",
    text: "Veja atualizações, feedbacks e o status da sua denúncia diretamente pela plataforma.",
    image: bannerAcompanheStatus,
    alt: "Banner mostrando o acompanhamento de status da denúncia",
  },
  {
    tag: "Cuidado animal",
    title: "Denunciar também é cuidar",
    text: "Cada registro ajuda a mapear riscos, orientar ações e fortalecer o cuidado animal.",
    image: bannerDenunciarCuidar,
    alt: "Banner institucional sobre cuidado animal e denúncias",
  },
];

export function HomeNewsCarousel() {
  const [indiceAtual, setIndiceAtual] = useState(0);

  const noticiaAtual = noticias[indiceAtual];

  function irParaAnterior() {
    setIndiceAtual((indice) =>
      indice === 0 ? noticias.length - 1 : indice - 1
    );
  }

  function irParaProxima() {
    setIndiceAtual((indice) =>
      indice === noticias.length - 1 ? 0 : indice + 1
    );
  }

  return (
    <section className="home-news-carousel">
      <div className="home-news-carousel__content">
        <div className="home-news-carousel__text">
          <span className="section-tag">{noticiaAtual.tag}</span>

          <h2>{noticiaAtual.title}</h2>

          <p>{noticiaAtual.text}</p>
        </div>

        <div className="home-news-carousel__image">
          <img src={noticiaAtual.image} alt={noticiaAtual.alt} />
        </div>
      </div>

      <div className="home-news-carousel__controls">
        <button
          type="button"
          onClick={irParaAnterior}
          aria-label="Notícia anterior"
        >
          <span>‹</span>
        </button>

        <div className="home-news-carousel__dots">
          {noticias.map((noticia, index) => (
            <button
              key={noticia.title}
              type="button"
              className={index === indiceAtual ? "is-active" : ""}
              onClick={() => setIndiceAtual(index)}
              aria-label={`Ver notícia ${index + 1}`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={irParaProxima}
          aria-label="Próxima notícia"
        >
          <span>›</span>
        </button>
      </div>
    </section>
  );
}