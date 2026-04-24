import { useState } from "react";
import { signIn } from "../services/authService";
import dogImage from "../assets/images/dog.png";

interface LoginPageProps {
  onGoToRegister: () => void;
  onGoToRecoverPassword: () => void;
}

export function LoginPage({
  onGoToRegister,
  onGoToRecoverPassword,
}: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setLoading(true);
      setErro("");
      await signIn(email, senha);
    } catch {
      setErro("Usuário não cadastrado ou senha incorreta.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-shell">
        <div className="auth-content">
          <span className="section-tag">SOS Bichos</span>

          <h1>Entrar na plataforma</h1>

          <p>
            Acesse sua conta para registrar denúncias, acompanhar ocorrências e
            ajudar no cuidado animal da sua cidade.
          </p>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seuemail@exemplo.com"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Senha</label>

              <div className="password-field">
                <input
                  type={mostrarSenha ? "text" : "password"}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="Sua senha"
                  required
                />

                <button
                  type="button"
                  aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                  onClick={() => setMostrarSenha((prev) => !prev)}
                >
                  {mostrarSenha ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            <button
              type="button"
              className="auth-link"
              onClick={onGoToRecoverPassword}
            >
              Esqueci minha senha
            </button>

            {erro && <p className="form-error">{erro}</p>}

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <p className="auth-switch">
            Ainda não tem uma conta?{" "}
            <button type="button" onClick={onGoToRegister}>
              Criar cadastro
            </button>
          </p>
        </div>

        <aside className="auth-visual">
          <img src={dogImage} alt="Cachorrinho do SOS Bichos" />

          <div className="auth-visual-card">
            <strong>Denuncie, acompanhe e ajude.</strong>
            <span>Um canal simples para cuidar melhor dos animais.</span>
          </div>
        </aside>
      </section>
    </main>
  );
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 5C6.5 5 2.3 9.2 1 12c1.3 2.8 5.5 7 11 7s9.7-4.2 11-7c-1.3-2.8-5.5-7-11-7Zm0 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm0-2.2A1.8 1.8 0 1 0 12 10a1.8 1.8 0 0 0 0 3.8Z" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3.3 2 22 20.7 20.7 22l-3-3A12.2 12.2 0 0 1 12 20C6.5 20 2.3 15.8 1 13c.6-1.3 1.9-3 3.6-4.4L2 3.3 3.3 2Zm5.1 8.4A4 4 0 0 0 13.6 15.6l-1.7-1.7A1.8 1.8 0 0 1 10.1 12l-1.7-1.6ZM12 6c5.5 0 9.7 4.2 11 7a13.3 13.3 0 0 1-3.2 4.2l-2.9-2.9A4 4 0 0 0 11 8.1L8.8 5.9A12.6 12.6 0 0 1 12 6Z" />
    </svg>
  );
}