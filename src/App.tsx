import { useEffect, useState } from "react";
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
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";

type AuthScreen = "login" | "register" | "recover" | "reset";
type AppScreen = "home" | "perfil" | "admin" | "relatorios" | "politica";



function App() {
  const { user, nome, role, isAdmin, loadingAuth, logout } = useAuth();
  const [authScreen, setAuthScreen] = useState<AuthScreen>("login");
  const [appScreen, setAppScreen] = useState<AppScreen>("home");


  useEffect(() => {
    const currentPath = window.location.pathname;

    if (currentPath.includes("redefinir-senha")) {
      setAuthScreen("reset");
    }
  }, []);

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

        onLogout={logout}
      />
    );
  }

  if (!user || authScreen === "reset") {
    if (authScreen === "register") {
      return (
        <RegisterPage
          onGoToLogin={() => setAuthScreen("login")}
          onGoToPolitica={() => setAuthScreen("login")}
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

  if (appScreen === "admin" && isAdmin && user) {
    return (
      <AdminPage
        userName={nome}
        avatarUrl={user.user_metadata?.avatar_url ?? null}
        onHome={() => setAppScreen("home")}
        onPerfil={() => setAppScreen("perfil")}
        onRelatorios={() => setAppScreen("relatorios")}
        onLogout={logout}
      />
    );
  }

  if (appScreen === "perfil" && user) {
    return (
      <>
        <Navbar
          userName={nome}
          avatarUrl={user.user_metadata?.avatar_url ?? null}
          isAdmin={isAdmin}
          onHome={() => setAppScreen("home")}
          onDenunciar={() => setAppScreen("home")}
          onPerfil={() => setAppScreen("perfil")}
          onAdmin={() => setAppScreen("admin")}
          onRelatorios={() => setAppScreen("relatorios")}
          onLogout={logout}
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

  return (
    <HomePage
      userId={user.id}
      userName={nome}
      avatarUrl={user.user_metadata?.avatar_url ?? null}
      isAdmin={isAdmin}
      onHome={() => setAppScreen("home")}
      onPerfil={() => setAppScreen("perfil")}
      onAdmin={() => setAppScreen("admin")}
      onRelatorios={() => setAppScreen("relatorios")}
      onLogout={logout}
    />
  );
}

export default App;