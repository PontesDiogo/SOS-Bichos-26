import { Banner } from "../components/layout/Banner";
import { Footer } from "../components/layout/Footer";
import { Navbar } from "../components/layout/Navbar";
import { PageContainer } from "../components/layout/PageContainer";
import { DenunciaForm } from "../components/denuncia/DenunciaForm";
import { DenunciaList } from "../components/denuncia/DenunciaList";
import { useDenuncias } from "../hooks/useDenuncia";
import { useEffect } from "react";

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
}: HomePageProps) {
  const { denuncias, loading, erro, carregarDenuncias } = useDenuncias({
    userId,
    isAdmin: false,
  });

  function handleDenunciar() {
    const section = document.getElementById("denuncias");
    section?.scrollIntoView({ behavior: "smooth" });
  }
  function handleMinhasDenuncias() {
    const section = document.getElementById("minhas-denuncias");
    section?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    if (!scrollTarget) return;

    const sectionId =
      scrollTarget === "denuncia" ? "denuncias" : "minhas-denuncias";

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
        isAdmin={isAdmin}
        avatarUrl={avatarUrl}
        onHome={onHome}
        onDenunciar={onDenunciar || handleDenunciar}
        onMinhasDenuncias={onMinhasDenuncias || handleMinhasDenuncias}
        onPerfil={onPerfil}
        onAdmin={onAdmin}
        onRelatorios={onRelatorios}
        onLogout={onLogout}
      />

      <PageContainer>
        <Banner onDenunciar={handleDenunciar} />
        <section id="minhas-denuncias" className="home-section">
          <span className="section-tag">Sobre o projeto</span>

          <h2>Uma ponte entre a população e o atendimento responsável</h2>

          <p>
            O SOS Bichos foi criado para facilitar o registro de denúncias
            envolvendo animais, permitindo que o cidadão informe o ocorrido,
            indique a localização e acompanhe o andamento da solicitação.
          </p>

          <div className="info-grid">
            <article>
              <h3>Registro simples</h3>
              <p>
                O usuário informa um resumo, descrição, endereço ou localização
                no mapa e pode anexar fotos da ocorrência.
              </p>
            </article>

            <article>
              <h3>Acompanhamento</h3>
              <p>
                As denúncias possuem status, permitindo que o cidadão acompanhe
                se a ocorrência está pendente, em análise, em atendimento ou
                resolvida.
              </p>
            </article>

            <article>
              <h3>Gestão administrativa</h3>
              <p>
                O administrador pode visualizar denúncias, aplicar filtros,
                atualizar status e consultar relatórios.
              </p>
            </article>
          </div>
        </section>

        <section id="denuncias" className="home-section">
          <span className="section-tag">Denúncias</span>

          <h2>Registrar e acompanhar ocorrências</h2>

          <p>
            Aqui você pode registrar uma nova denúncia com descrição,
            localização e foto.
          </p>

          <DenunciaForm
            userId={userId}
            nomeUsuario={userName || "Usuário"}
            onCreated={carregarDenuncias}
          />
        </section>

        <section id="minhas-denuncias" className="home-section">
          <span className="section-tag">Acompanhamento</span>

          <h2>Minhas denúncias</h2>

          <p>
            Acompanhe abaixo as ocorrências registradas por você e seus
            respectivos status.
          </p>

          <DenunciaList
            denuncias={denuncias}
            loading={loading}
            erro={erro}
            onUpdated={carregarDenuncias}
          />
        </section>
      </PageContainer>

      <Footer />
    </>
  );
}