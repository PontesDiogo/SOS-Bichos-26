import { Banner } from "../components/layout/Banner";
import { Footer } from "../components/layout/Footer";
import { Navbar } from "../components/layout/Navbar";
import { PageContainer } from "../components/layout/PageContainer";
import { DenunciaForm } from "../components/denuncia/DenunciaForm";

interface HomePageProps {
  userName?: string;
  isAdmin?: boolean;
  onLogout?: () => void;
}

export function HomePage({ userName, isAdmin = false, onLogout }: HomePageProps) {
  function handleDenunciar() {
    const formSection = document.getElementById("denuncias");
    formSection?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <>
      <Navbar
        userName={userName}
        isAdmin={isAdmin}
        onDenunciar={handleDenunciar}
        onPerfil={() => console.log("Ir para perfil")}
        onAdmin={() => console.log("Ir para admin")}
        onRelatorios={() => console.log("Ir para relatórios")}
        onLogout={onLogout}
      />

      <PageContainer>
        <Banner onDenunciar={handleDenunciar} />

        <section id="sobre" className="home-section">
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
            Aqui entraremos com o formulário de denúncia e, logo abaixo, a lista
            de denúncias com fotos.
          </p>

          <DenunciaForm
            userId="ID_TEMPORARIO_DO_USUARIO"
            nomeUsuario={userName || "Usuário"}
            onCreated={() => console.log("Denúncia criada")}
          />
        </section>
      </PageContainer>

      <Footer />
    </>
  );
}