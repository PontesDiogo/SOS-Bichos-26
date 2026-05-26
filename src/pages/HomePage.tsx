import { useEffect, useMemo } from "react";
import { Footer } from "../components/layout/Footer";
import { Navbar } from "../components/layout/Navbar";
import { PageContainer } from "../components/layout/PageContainer";
import { DenunciaForm } from "../components/denuncia/DenunciaForm";
import { DenunciaList } from "../components/denuncia/DenunciaList";
import { HomeNewsCarousel } from "../components/home/HomeNewsCaroussel";
import { useDenuncias } from "../hooks/useDenuncia";
import bannerImage from "../assets/banner-sos-bichos.jpg";

interface HomePageProps {
  userId: string;
  userName?: string;
  avatarUrl?: string | null;
  isAdmin?: boolean;
  onPerfil?: () => void;
  onAdmin?: () => void;
  onRelatorios?: () => void;
  onLogout?: () => void;
  onHome?: () => void;
  scrollTarget?: "denuncia" | "minhas-denuncias" | null;
  onScrollHandled?: () => void;
  onDenunciar?: () => void;
  onMinhasDenuncias?: () => void;
  onPolitica?: () => void;
}

export function HomePage({
  userId,
  userName,
  avatarUrl,
  isAdmin,
  onHome,
  onDenunciar,
  onMinhasDenuncias,
  onPerfil,
  onAdmin,
  onRelatorios,
  onLogout,
  scrollTarget,
  onScrollHandled,
  onPolitica,
}: HomePageProps) {
  const { denuncias, loading, erro, carregarDenuncias } = useDenuncias({
    userId,
    isAdmin: false,
  });

  const resumo = useMemo(() => {
    return {
      total: denuncias.length,
      pendentes: denuncias.filter((denuncia) => denuncia.status === "Pendente")
        .length,
      emAndamento: denuncias.filter(
        (denuncia) =>
          denuncia.status === "Em análise" ||
          denuncia.status === "Em atendimento"
      ).length,
      resolvidas: denuncias.filter(
        (denuncia) => denuncia.status === "Resolvido"
      ).length,
    };
  }, [denuncias]);

  const ultimasDenuncias = denuncias.slice(0, 3);

  function handleDenunciar() {
    const section = document.getElementById("denuncias");
    section?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function handleMinhasDenuncias() {
    if (onMinhasDenuncias) {
      onMinhasDenuncias();
      return;
    }

    const section = document.getElementById("ultimas-denuncias");
    section?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  useEffect(() => {
    if (!scrollTarget) return;

    const sectionId =
      scrollTarget === "denuncia" ? "denuncias" : "ultimas-denuncias";

    setTimeout(() => {
      const section = document.getElementById(sectionId);
      section?.scrollIntoView({ behavior: "smooth", block: "start" });
      onScrollHandled?.();
    }, 100);
  }, [scrollTarget, onScrollHandled]);

  return (
    <>
      <Navbar
        userName={userName}
        avatarUrl={avatarUrl ?? null}
        isAdmin={isAdmin}
        onHome={onHome}
        onDenunciar={onDenunciar}
        onMinhasDenuncias={onMinhasDenuncias}
        onPerfil={onPerfil}
        onAdmin={onAdmin}
        onRelatorios={onRelatorios}
        onLogout={onLogout}
      />

      <PageContainer>

        <section className="logged-home-hero">
          <div className="logged-home-hero__content">
            <span className="section-tag">Área do usuário</span>

            <h1>Olá, {userName || "usuário"} 👋</h1>

            <p>
              Bem-vindo ao SOS Bichos. Registre novas ocorrências, acompanhe
              suas denúncias e consulte o andamento dos atendimentos em um só
              lugar.
            </p>

            <div className="logged-home-hero__actions">
              <button
                type="button"
                className="primary-button"
                onClick={handleDenunciar}
              >
                Fazer denúncia
              </button>

              <button
                type="button"
                className="secondary-button"
                onClick={handleMinhasDenuncias}
              >
                Minhas denúncias
              </button>
            </div>
          </div>

          <aside className="logged-home-hero__visual">
            <img
              src={bannerImage}
              alt="Cachorro representando cuidado e proteção animal"
            />

            <div className="logged-home-hero__floating">
              <strong>🐶 Denunciar também é cuidar.</strong>

              <span>
                Quanto mais completa for a ocorrência, melhor será a análise pela
                administração.
              </span>
            </div>
          </aside>
        </section>

        <HomeNewsCarousel />

        <section className="logged-summary-grid">
          <article>
            <span>Total</span>
            <strong>{resumo.total}</strong>
            <p>Denúncias registradas por você.</p>
          </article>

          <article>
            <span>Pendentes</span>
            <strong>{resumo.pendentes}</strong>
            <p>Aguardando análise inicial.</p>
          </article>

          <article>
            <span>Em andamento</span>
            <strong>{resumo.emAndamento}</strong>
            <p>Em análise ou atendimento.</p>
          </article>

          <article>
            <span>Resolvidas</span>
            <strong>{resumo.resolvidas}</strong>
            <p>Ocorrências finalizadas.</p>
          </article>
        </section>

        <section id="ultimas-denuncias" className="home-section">
          <div className="home-section__header">
            <div>
              <span className="section-tag">Acompanhamento</span>

              <h2>Últimas denúncias registradas</h2>

              <p>
                Veja rapidamente suas ocorrências mais recentes. Para consultar
                o histórico completo, acesse a página “Minhas denúncias”.
              </p>
            </div>

            <button
              type="button"
              className="secondary-button"
              onClick={handleMinhasDenuncias}
            >
              Ver todas
            </button>
          </div>

          <DenunciaList
            denuncias={ultimasDenuncias}
            loading={loading}
            erro={erro}
            onUpdated={carregarDenuncias}
          />
        </section>

        <section className="logged-flow-section">
          <span className="section-tag">Como acompanhar</span>

          <h2>Entenda o fluxo da denúncia</h2>

          <div className="logged-flow-grid">
            <article>
              <span>1</span>
              <h3>Registro</h3>
              <p>
                Você informa a ocorrência, descreve o caso, adiciona endereço e
                pode anexar imagens.
              </p>
            </article>

            <article>
              <span>2</span>
              <h3>Análise</h3>
              <p>
                A administração visualiza os detalhes e pode atualizar o status
                da denúncia.
              </p>
            </article>

            <article>
              <span>3</span>
              <h3>Acompanhamento</h3>
              <p>
                Você acompanha feedbacks, andamento e histórico da ocorrência.
              </p>
            </article>
          </div>
        </section>

        <section id="denuncias" className="home-section">


          <DenunciaForm
            userId={userId}
            nomeUsuario={userName || "Usuário"}
            onCreated={carregarDenuncias}
          />
        </section>
      </PageContainer>

      <Footer
        isAdmin={isAdmin}
        onHome={onHome}
        onDenunciar={handleDenunciar}
        onMinhasDenuncias={handleMinhasDenuncias}
        onAdmin={onAdmin}
        onRelatorios={onRelatorios}
        onPolitica={onPolitica}
      />
    </>
  );
}
