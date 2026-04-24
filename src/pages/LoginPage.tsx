import { useState } from "react";
import { signIn } from "../services/authService";

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
      <section className="auth-card">
        <span className="section-tag">SOS Bichos</span>

        <h1>Entrar na plataforma</h1>

        <p>
          Acesse sua conta para registrar e acompanhar suas denúncias.
        </p>

        <form onSubmit={handleSubmit}>
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
                onClick={() => setMostrarSenha((prev) => !prev)}
              >
                {mostrarSenha ? "Ocultar" : "Mostrar"}
              </button>
            </div>
          </div>

          {erro && <p className="form-error">{erro}</p>}

          <button type="submit" className="primary-button" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className="auth-links">
          <button type="button" onClick={onGoToRecoverPassword}>
            Esqueci minha senha
          </button>

          <button type="button" onClick={onGoToRegister}>
            Criar uma conta
          </button>
        </div>
      </section>
    </main>
  );
}