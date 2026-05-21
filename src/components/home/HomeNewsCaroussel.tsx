import { useState } from "react";

const noticias = [
  {
    tag: "Orientação",
    title: "Como registrar uma denúncia completa",
    text: "Inclua uma descrição clara, informe o endereço ou marque no mapa e, se possível, adicione fotos da ocorrência.",
    icon: "📝",
  },
  {
    tag: "Importante",
    title: "Fotos ajudam na análise",
    text: "As imagens auxiliam a equipe responsável a entender melhor a situação e priorizar atendimentos quando necessário.",
    icon: "📸",
  },
  {
    tag: "Acompanhamento",
    title: "Entenda os status da denúncia",
    text: "Sua denúncia pode passar por etapas como pendente, em análise, em atendimento, resolvida ou cancelada.",
    icon: "🔎",
  },
  {
    tag: "Cuidado animal",
    title: "Denunciar também é proteger",
    text: "O registro organizado das ocorrências ajuda a identificar áreas de risco e melhorar o cuidado com os animais.",
    icon: "🐾",
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
        <span className="section-tag">{noticiaAtual.tag}</span>

        <div className="home-news-carousel__body">
          <span className="home-news-carousel__icon">{noticiaAtual.icon}</span>

          <div>
            <h2>{noticiaAtual.title}</h2>
            <p>{noticiaAtual.text}</p>
          </div>
        </div>
      </div>

      <div className="home-news-carousel__controls">
        <button
          type="button"
          onClick={irParaAnterior}
          aria-label="Notícia anterior"
        >
          ‹
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
          ›
        </button>
      </div>
    </section>
  );

}