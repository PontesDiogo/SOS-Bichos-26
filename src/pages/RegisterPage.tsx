import { useState } from "react";
import { signUp } from "../services/authService";
import { validarSenhaForte } from "../utils/validators";

interface RegisterPageProps {
  onGoToLogin: () => void;
}

export function RegisterPage({ onGoToLogin }: RegisterPageProps) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [aceitouPolitica, setAceitouPolitica] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setLoading(true);
      setErro("");
      setSucesso("");

      if (!nome.trim()) {
        setErro("Informe seu nome.");
        return;
      }

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

      if (!aceitouPolitica) {
        setErro("Você precisa aceitar a Política de Privacidade para continuar.");
        return;
      }

      await signUp({
        nome,
        email,
        senha,
      });

      setSucesso("Cadastro realizado com sucesso! Agora você pode fazer login.");
      setNome("");
      setEmail("");
      setSenha("");
      setConfirmarSenha("");
      setAceitouPolitica(false);
    } catch {
      setErro("Não foi possível realizar o cadastro. Verifique os dados.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <span className="section-tag">Criar conta</span>

        <h1>Cadastro no SOS Bichos</h1>

        <p>
          Crie sua conta para registrar denúncias e acompanhar o andamento das
          ocorrências.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nome</label>
            <input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Seu nome"
              required
            />
          </div>

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
                placeholder="Crie uma senha"
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

          <div className="form-group">
            <label className="form-label">Confirmar senha</label>
            <input
              type={mostrarSenha ? "text" : "password"}
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              placeholder="Repita sua senha"
              required
            />
          </div>

          <label className="checkbox-field politica-field">
            <input
              type="checkbox"
              checked={aceitouPolitica}
              onChange={(e) => setAceitouPolitica(e.target.checked)}
            />
            Li e aceito a Política de Privacidade do SOS Bichos.
          </label>

          {erro && <p className="form-error">{erro}</p>}
          {sucesso && <p className="form-success">{sucesso}</p>}

          <button type="submit" className="primary-button" disabled={loading}>
            {loading ? "Cadastrando..." : "Cadastrar"}
          </button>
        </form>

        <div className="auth-links">
          <button type="button" onClick={onGoToLogin}>
            Já tenho uma conta
          </button>
        </div>
      </section>
    </main>
  );
}