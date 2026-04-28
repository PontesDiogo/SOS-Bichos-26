import { useState } from "react";
import { signIn } from "../services/authService";
import dogImage from "../assets/images/dog.png";
import { EyeIcon, EyeOffIcon } from "../components/common/Icons/EyeIcon";

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

