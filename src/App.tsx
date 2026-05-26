import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { RecuperarSenhaPage } from "./pages/RecuperarSenhaPage";
import { RedefinirSenhaPage } from "./pages/RedefinirSenhaPage";
import { PerfilPage } from "./pages/PerfilPage";
import { PoliticaPrivacidadePage } from "./pages/PoliticaPrivacidadePage";
import { useAuth } from "./hooks/useAuth";
import { AdminPage } from "./pages/AdminPage";
import "./index.css";
import "./styles/layout.css";
import { RelatoriosPage } from "./pages/RelatoriosPage";

import { Footer } from "./components/layout/Footer";
import { MinhasDenunciasPage } from "./pages/MinhasDenunciasPage";
import { PublicHomePage } from "./pages/PublicHomePage";

type AuthScreen = "public" | "login" | "register" | "recover" | "reset";
type AppScreen =
  | "home"
  | "perfil"
  | "admin"
  | "relatorios"
  | "minhas-denuncias"
  | "politica";



function App() {
  const { user, nome, role, isAdmin, loadingAuth, logout } = useAuth();
  const [authScreen, setAuthScreen] = useState<AuthScreen>("public");
  const [appScreen, setAppScreen] = useState<AppScreen>("home");
  const [scrollTarget, setScrollTarget] = useState<"denuncia" | "minhas-denuncias" | null>(null);
  const [politicaAberta, setPoliticaAberta] = useState(false);


  function irParaDenuncia() {
    setAppScreen("home");
    setScrollTarget("denuncia");
  }

  function irParaMinhasDenuncias() {
    setAppScreen("minhas-denuncias");
    setScrollTarget(null);
  }

  useEffect(() => {
    const currentPath = window.location.pathname;

    if (currentPath.includes("redefinir-senha")) {
      setAuthScreen("reset");
    }
  }, []);


  function renderComPolitica(conteudo: ReactNode) {
    return (
      <>
        {conteudo}

        {politicaAberta && (
          <div className="policy-modal-overlay">
            <div className="policy-modal-content">
              <button
                type="button"
                className="policy-modal-close"
                onClick={() => setPoliticaAberta(false)}
                aria-label="Fechar política de privacidade"
              >
                ×
              </button>

              <div className="policy-modal-scroll">
                <PoliticaPrivacidadePage
                  onBack={() => setPoliticaAberta(false)}
                  isModal
                />
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  if (loadingAuth) {
    return (
      <main className="auth-page">
        <section className="auth-shell auth-shell--simple">
          <div className="auth-content auth-content--center">
            <p>Carregando...</p>
          </div>
        </section>
      </main>
    );
  }

  if (appScreen === "relatorios" && isAdmin && user) {
    return (
      <RelatoriosPage
        userName={nome}
        avatarUrl={user.user_metadata?.avatar_url ?? null}
        onHome={() => setAppScreen("home")}
        onAdmin={() => setAppScreen("admin")}
        onPerfil={() => setAppScreen("perfil")}
        onDenunciar={() => {
          setAppScreen("home");
          setScrollTarget("denuncia");
        }}
        onMinhasDenuncias={() => setAppScreen("minhas-denuncias")}
        onLogout={logout}
      />
    );
  }

  if (!user || authScreen === "reset") {
    if (!user || authScreen === "reset") {
      if (authScreen === "public") {
        return renderComPolitica(
          <PublicHomePage
            onEntrar={() => setAuthScreen("login")}
            onGoToDenuncia={() => setAuthScreen("login")}
            onGoToPolitica={() => setPoliticaAberta(true)}
          />
        );
      }



      if (authScreen === "register") {
        return renderComPolitica(
          <RegisterPage
            onGoToLogin={() => setAuthScreen("login")}
            onGoToPolitica={() => setPoliticaAberta(true)}

          />
        );
      }

      if (authScreen === "recover") {
        return <RecuperarSenhaPage onGoToLogin={() => setAuthScreen("login")} />;
      }

      if (authScreen === "reset") {
        return (
          <RedefinirSenhaPage
            onGoToLogin={async () => {
              await logout();
              window.history.replaceState({}, "", "/");
              setAuthScreen("login");
            }}
          />
        );
      }

      return (
        <LoginPage
          onGoToRegister={() => setAuthScreen("register")}
          onGoToRecoverPassword={() => setAuthScreen("recover")}
        />
      );
    }
  }

  if (appScreen === "admin" && isAdmin && user) {
    return (
      <AdminPage
        userName={nome}
        avatarUrl={user.user_metadata?.avatar_url ?? null}
        onHome={() => setAppScreen("home")}
        onPerfil={() => setAppScreen("perfil")}
        onRelatorios={() => setAppScreen("relatorios")}
        onMinhasDenuncias={() => setAppScreen("minhas-denuncias")}
        onAdmin={() => setAppScreen("admin")}
        onLogout={logout}
      />
    );
  }

  if (appScreen === "minhas-denuncias" && user) {
    return (
      <MinhasDenunciasPage
        userId={user.id}
        userName={nome}
        avatarUrl={user.user_metadata?.avatar_url ?? null}
        isAdmin={isAdmin}
        onHome={() => setAppScreen("home")}
        onDenunciar={() => {
          setAppScreen("home");
          setScrollTarget("denuncia");
        }}
        onPerfil={() => setAppScreen("perfil")}
        onAdmin={() => setAppScreen("admin")}
        onRelatorios={() => setAppScreen("relatorios")}
        onLogout={logout}
      />
    );
  }

  if (appScreen === "perfil" && user) {
    return (
      <>
        <Footer
          isAdmin={isAdmin}
          onHome={() => setAppScreen("home")}
          onDenunciar={() => {
            setAppScreen("home");
            setScrollTarget("denuncia");
          }}
          onMinhasDenuncias={irParaMinhasDenuncias}
          onPolitica={() => setAppScreen("politica")}
          onAdmin={() => setAppScreen("admin")}
          onRelatorios={() => setAppScreen("relatorios")}
        />

        <PerfilPage
          userId={user.id}
          nome={nome}
          email={user.email}
          role={role}
          avatarUrl={user.user_metadata?.avatar_url ?? null}
          onBack={() => setAppScreen("home")}
          onLogout={logout}
          onUpdated={() => window.location.reload()}
        />

        <Footer />
      </>
    );
  }

  if (appScreen === "politica") {
    return <PoliticaPrivacidadePage onBack={() => setAppScreen("home")} />;
  }

  return renderComPolitica(
    <HomePage
      userId={user.id}
      userName={nome}
      avatarUrl={user.user_metadata?.avatar_url ?? null}
      isAdmin={isAdmin}
      onHome={() => {
        setAppScreen("home");
        setScrollTarget(null);
      }}
      onPolitica={() => setPoliticaAberta(true)}
      onDenunciar={irParaDenuncia}
      onMinhasDenuncias={irParaMinhasDenuncias}
      onPerfil={() => setAppScreen("perfil")}
      onAdmin={() => setAppScreen("admin")}
      onRelatorios={() => setAppScreen("relatorios")}
      onLogout={logout}
      scrollTarget={scrollTarget}
      onScrollHandled={() => setScrollTarget(null)}
    />
  );
}

export default App;