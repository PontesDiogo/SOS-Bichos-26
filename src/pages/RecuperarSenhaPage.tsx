import { useState } from "react";
import { sendPasswordReset } from "../services/authService";

interface RecuperarSenhaPageProps {
  onGoToLogin: () => void;
}

export function RecuperarSenhaPage({ onGoToLogin }: RecuperarSenhaPageProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setLoading(true);
      setErro("");
      setSucesso("");

      await sendPasswordReset(email);

      setSucesso(
        "Enviamos um link para seu e-mail. Acesse o link para redefinir sua senha."
      );
      setEmail("");
    } catch (error) {
      console.error(error);
      setErro("Não foi possível enviar o link de recuperação.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-shell auth-shell--simple">
        <div className="auth-content auth-content--center">
          <span className="section-tag">Recuperar acesso</span>

          <h1>Esqueci minha senha</h1>

          <p>
            Informe seu e-mail cadastrado. Você receberá um link para criar uma
            nova senha.
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

            {erro && <p className="form-error">{erro}</p>}
            {sucesso && <p className="form-success">{sucesso}</p>}

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? "Enviando..." : "Enviar link de recuperação"}
            </button>
          </form>

          <p className="auth-switch">
            Lembrou sua senha?{" "}
            <button type="button" onClick={onGoToLogin}>
              Voltar para login
            </button>
          </p>
        </div>
      </section>
    </main>
  );
}