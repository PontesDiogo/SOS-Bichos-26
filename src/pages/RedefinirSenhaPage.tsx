import { useState } from "react";
import { updatePassword } from "../services/authService";
import { validarSenhaForte } from "../utils/validators";

interface RedefinirSenhaPageProps {
  onGoToLogin: () => void;
}

export function RedefinirSenhaPage({ onGoToLogin }: RedefinirSenhaPageProps) {
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setLoading(true);
      setErro("");
      setSucesso("");

      if (!validarSenhaForte(senha)) {
        setErro(
          "A senha precisa ter pelo menos 8 caracteres, letra maiúscula, minúscula, número e caractere especial."
        );
        return;
      }

      if (senha !== confirmarSenha) {
        setErro("As senhas não conferem.");
        return;
      }

      await updatePassword(senha);

      setSucesso("Senha atualizada com sucesso! Agora você pode fazer login.");
      setSenha("");
      setConfirmarSenha("");

      setTimeout(() => {
        onGoToLogin();
      }, 1500);
    } catch (error) {
      console.error(error);
      setErro("Não foi possível atualizar a senha. Tente acessar o link novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-shell auth-shell--simple">
        <div className="auth-content auth-content--center">
          <span className="section-tag">Nova senha</span>

          <h1>Redefinir senha</h1>

          <p>Crie uma nova senha segura para acessar sua conta.</p>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">Nova senha</label>

              <div className="password-field">
                <input
                  type={mostrarSenha ? "text" : "password"}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="Crie uma nova senha"
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

            <div className="form-group">
              <label className="form-label">Confirmar nova senha</label>

              <div className="password-field">
                <input
                  type={mostrarConfirmarSenha ? "text" : "password"}
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  placeholder="Repita a nova senha"
                  required
                />

                <button
                  type="button"
                  aria-label={
                    mostrarConfirmarSenha
                      ? "Ocultar confirmação de senha"
                      : "Mostrar confirmação de senha"
                  }
                  onClick={() => setMostrarConfirmarSenha((prev) => !prev)}
                >
                  {mostrarConfirmarSenha ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            {erro && <p className="form-error">{erro}</p>}
            {sucesso && <p className="form-success">{sucesso}</p>}

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar nova senha"}
            </button>
          </form>

          <p className="auth-switch">
            <button type="button" onClick={onGoToLogin}>
              Voltar para login
            </button>
          </p>
        </div>
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