import { useState } from "react";
import { updatePassword } from "../services/authService";
import { validarSenhaForte } from "../utils/validators";
import { EyeIcon, EyeOffIcon } from "../components/common/Icons/EyeIcon";

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

