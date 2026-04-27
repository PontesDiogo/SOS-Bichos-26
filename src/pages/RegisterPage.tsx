import { useState } from "react";
import { signUp } from "../services/authService";
import {
  getPasswordStrength,
  validarSenhaForte,
} from "../utils/validators";
import dogImage from "../assets/images/dog.png";

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

      if (!nome.trim()) {
        setErro("Informe seu nome.");
        return;
      }

      if (!validarSenhaForte(senha)) {
        setErro(
          "A senha precisa cumprir todos os requisitos mínimos de segurança."
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
        aceitouPolitica,
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
      <section className="auth-shell auth-shell--register">
        <div className="auth-content">
          <span className="section-tag">Criar conta</span>

          <h1>Cadastro no SOS Bichos</h1>

          <p>
            Crie sua conta para registrar denúncias, anexar fotos e acompanhar o
            andamento das ocorrências.
          </p>

          <form onSubmit={handleSubmit} className="auth-form">
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
                  aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                  onClick={() => setMostrarSenha((prev) => !prev)}
                >
                  {mostrarSenha ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>

              <PasswordStrength senha={senha} />
            </div>

            <div className="form-group">
              <label className="form-label">Confirmar senha</label>

              <div className="password-field">
                <input
                  type={mostrarConfirmarSenha ? "text" : "password"}
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  placeholder="Repita sua senha"
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

              <small
                className={`password-confirm-feedback ${confirmarSenha
                    ? senha === confirmarSenha
                      ? "password-rule--valid"
                      : "password-rule--invalid"
                    : ""
                  }`}
              >
                {confirmarSenha
                  ? senha === confirmarSenha
                    ? "As senhas conferem."
                    : "As senhas ainda não conferem."
                  : " "}
              </small>
            </div>

            <label className="checkbox-field politica-field">
              <input
                type="checkbox"
                checked={aceitouPolitica}
                onChange={(e) => setAceitouPolitica(e.target.checked)}
              />
              <span>
                Li e aceito a{" "}
                <button type="button">Política de Privacidade</button>.
              </span>
            </label>

            {erro && <p className="form-error">{erro}</p>}
            {sucesso && <p className="form-success">{sucesso}</p>}

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? "Cadastrando..." : "Cadastrar"}
            </button>
          </form>

          <p className="auth-switch">
            Já tem uma conta?{" "}
            <button type="button" onClick={onGoToLogin}>
              Entrar
            </button>
          </p>
        </div>

        <aside className="auth-visual">
          <img src={dogImage} alt="Cachorrinho do SOS Bichos" />

          <div className="auth-visual-card">
            <strong>Um cadastro, várias formas de ajudar.</strong>
            <span>Registre ocorrências com localização, descrição e foto.</span>
          </div>
        </aside>
      </section>
    </main>
  );
}

function PasswordStrength({ senha }: { senha: string }) {
  const { checks, score, label } = getPasswordStrength(senha);
  const percent = (score / 4) * 100;

  return (
    <div className="password-strength">
      <div className="password-strength__header">
        <small>Força da senha</small>
        <strong>{senha ? label : "Digite uma senha"}</strong>
      </div>

      <div className="password-strength__bar">
        <span style={{ width: `${percent}%` }} />
      </div>

      <ul className="password-rules">
        <PasswordRule valid={checks.minLength}>
          Mínimo de 8 caracteres
        </PasswordRule>

        <PasswordRule valid={checks.upperLower}>
          Letras maiúsculas e minúsculas
        </PasswordRule>

        <PasswordRule valid={checks.number}>Pelo menos 1 número</PasswordRule>

        <PasswordRule valid={checks.special}>
          Pelo menos 1 caractere especial
        </PasswordRule>
      </ul>
    </div>
  );
}

function PasswordRule({
  valid,
  children,
}: {
  valid: boolean;
  children: React.ReactNode;
}) {
  return (
    <li className={valid ? "password-rule--valid" : "password-rule--invalid"}>
      {valid ? "✓" : "•"} {children}
    </li>
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