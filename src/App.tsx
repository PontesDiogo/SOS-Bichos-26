import { useState } from "react";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { useAuth } from "./hooks/useAuth";
import "./index.css";
import "./styles/layout.css";

type AuthScreen = "login" | "register" | "recover" | "reset";

function App() {
  const { user, nome, isAdmin, loadingAuth, logout } = useAuth();
  const [authScreen, setAuthScreen] = useState<AuthScreen>("login");

  if (loadingAuth) {
    return (
      <main className="auth-page">
        <section className="auth-card">
          <p>Carregando...</p>
        </section>
      </main>
    );
  }

  if (!user) {
    if (authScreen === "register") {
      return <RegisterPage onGoToLogin={() => setAuthScreen("login")} />;
    }

    return (
      <LoginPage
        onGoToRegister={() => setAuthScreen("register")}
        onGoToRecoverPassword={() => setAuthScreen("recover")}
      />
    );
  }

  return (
    <HomePage
      userId={user.id}
      userName={nome}
      isAdmin={isAdmin}
      onLogout={logout}
    />
  );
}

export default App;