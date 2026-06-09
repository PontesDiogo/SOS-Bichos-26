import { useState } from "react";
import {
  atualizarAvatarPerfil,
  atualizarNomePerfil,
  atualizarSenhaPerfil,
  desativarContaUsuario,
} from "../services/perfilService";
import { uploadFotoPerfil } from "../services/storageService";
import { validarImagem, validarSenhaForte } from "../utils/validators";
import { EyeIcon, EyeOffIcon } from "../components/common/Icons/EyeIcon";

interface PerfilPageProps {
  userId: string;
  nome: string;
  email?: string;
  role: string;
  avatarUrl?: string | null;
  onBack: () => void;
  onLogout: () => void;
  onUpdated?: () => void;
}

export function PerfilPage({
  userId,
  nome,
  email,
  avatarUrl,
  onBack,
  onUpdated,
}: PerfilPageProps) {
  const [novoNome, setNovoNome] = useState(nome);
  const [preview, setPreview] = useState<string | null>(avatarUrl || null);

  const [mostrarModalAvatar, setMostrarModalAvatar] = useState(false);
  const [novaFotoPerfil, setNovaFotoPerfil] = useState<File | null>(null);
  const [previewFotoPerfil, setPreviewFotoPerfil] = useState<string | null>(null);
  const [loadingAvatar, setLoadingAvatar] = useState(false);

  const [mostrarModalDesativar, setMostrarModalDesativar] = useState(false);
  const [senhaDesativacao, setSenhaDesativacao] = useState("");
  const [mostrarSenhaDesativacao, setMostrarSenhaDesativacao] = useState(false);
  const [loadingDesativacao, setLoadingDesativacao] = useState(false);

  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  function handleSelecionarFotoPerfil(file: File | null) {
    if (!file) return;

    const validationError = validarImagem(file);

    if (validationError) {
      setErro(validationError);
      return;
    }

    setErro("");
    setNovaFotoPerfil(file);
    setPreviewFotoPerfil(URL.createObjectURL(file));
  }

  async function handleConfirmarFotoPerfil() {
    if (!novaFotoPerfil) return;

    try {
      setLoadingAvatar(true);
      setErro("");
      setSucesso("");

      const avatarPublicUrl = await uploadFotoPerfil(novaFotoPerfil, userId);

      await atualizarAvatarPerfil(avatarPublicUrl);

      setPreview(avatarPublicUrl);
      setSucesso("Foto de perfil atualizada com sucesso!");

      setMostrarModalAvatar(false);
      setNovaFotoPerfil(null);
      setPreviewFotoPerfil(null);

      onUpdated?.();
    } catch (error) {
      console.error(error);
      setErro("Não foi possível atualizar a foto de perfil.");
    } finally {
      setLoadingAvatar(false);
    }
  }

  async function handleSalvarPerfil(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setLoading(true);
      setErro("");
      setSucesso("");

      if (!novoNome.trim()) {
        setErro("Informe um nome válido.");
        return;
      }

      await atualizarNomePerfil(novoNome.trim());

      setSucesso("Perfil atualizado com sucesso!");
      onUpdated?.();
    } catch (error) {
      console.error(error);
      setErro("Não foi possível atualizar o perfil.");
    } finally {
      setLoading(false);
    }
  }

  async function handleAtualizarSenha() {
    try {
      setLoading(true);
      setErro("");
      setSucesso("");

      if (!validarSenhaForte(novaSenha)) {
        setErro(
          "A nova senha precisa ter pelo menos 8 caracteres, letra maiúscula, minúscula, número e caractere especial."
        );
        return;
      }

      if (novaSenha !== confirmarSenha) {
        setErro("As senhas não conferem.");
        return;
      }

      await atualizarSenhaPerfil(novaSenha);

      setNovaSenha("");
      setConfirmarSenha("");
      setSucesso("Senha atualizada com sucesso.");
      onUpdated?.();
    } catch (error) {
      console.error(error);
      setErro("Não foi possível atualizar a senha.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDesativarConta() {
    try {
      setLoadingDesativacao(true);
      setErro("");
      setSucesso("");

      await desativarContaUsuario(senhaDesativacao);

      alert(
        "Conta desativada com sucesso. Você poderá reativá-la fazendo login novamente em até 30 dias."
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro ao desativar conta.";

      alert(message);
    } finally {
      setLoadingDesativacao(false);
      setSenhaDesativacao("");
      setMostrarSenhaDesativacao(false);
      setMostrarModalDesativar(false);
    }
  }

  return (
    <main className="simple-page">
      <section className="simple-card profile-card">
        <span className="section-tag">Meu perfil</span>

        <h1>Dados do usuário</h1>

        <p>
          Atualize seus dados básicos, foto de perfil e senha de acesso à
          plataforma.
        </p>

        <form onSubmit={handleSalvarPerfil} className="profile-form">
          <div className="profile-avatar-section">
            <div className="profile-avatar">
              {preview ? (
                <img src={preview} alt="Foto de perfil" />
              ) : (
                <span>🐾</span>
              )}
            </div>

            <div>
              <label className="form-label">Foto de perfil</label>

              <button
                type="button"
                className="secondary-button"
                onClick={() => setMostrarModalAvatar(true)}
              >
                Alterar foto de perfil
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Nome</label>
            <input
              value={novoNome}
              onChange={(e) => setNovoNome(e.target.value)}
              placeholder="Seu nome"
            />
          </div>

          <div className="form-group">
            <label className="form-label">E-mail</label>
            <input value={email || ""} disabled />
          </div>



          <button type="submit" className="primary-button" disabled={loading}>
            {loading ? "Salvando..." : "Salvar perfil"}
          </button>
        </form>

        <div className="profile-password-box">
          <h2>Alterar senha</h2>

          <div className="form-group">
            <label className="form-label">Nova senha</label>
            <input
              type="password"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              placeholder="Nova senha"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Confirmar nova senha</label>
            <input
              type="password"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              placeholder="Repita a nova senha"
            />
          </div>
          <div className="form-group">
            <button
              type="button"
              className="secondary-button"
              onClick={handleAtualizarSenha}
              disabled={loading}
            >
              Atualizar senha
            </button>
          </div>


        </div>

        {erro && <p className="form-error">{erro}</p>}
        {sucesso && <p className="form-success">{sucesso}</p>}

        <div className="profile-actions">
          <button type="button" className="secondary-button" onClick={onBack}>
            Voltar
          </button>

          <button
            type="button"
            className="danger-button"
            onClick={() => setMostrarModalDesativar(true)}
          >
            Desativar conta
          </button>
        </div>
      </section>

      {mostrarModalAvatar && (
        <div className="modal-overlay">
          <div className="modal-content modal-content--small">
            <h3>Atualizar foto de perfil</h3>

            <p className="modal-text">
              Escolha uma imagem para visualizar antes de salvar.
            </p>

            <div className="avatar-update-preview">
              {previewFotoPerfil ? (
                <img src={previewFotoPerfil} alt="Prévia da foto" />
              ) : (
                <div className="avatar-update-placeholder">👤</div>
              )}
            </div>

            <div className="avatar-upload-control">
              <span className="avatar-upload-label">Imagem do perfil</span>

              <label className="file-input-label">
                📷 Escolher imagem
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleSelecionarFotoPerfil(e.target.files?.[0] ?? null)
                  }
                  hidden
                />
              </label>

              <p className="file-input-hint">
                Você poderá visualizar a imagem antes de salvar.
              </p>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={() => {
                  setMostrarModalAvatar(false);
                  setNovaFotoPerfil(null);
                  setPreviewFotoPerfil(null);
                }}
              >
                Cancelar
              </button>

              <button
                type="button"
                className="primary-button"
                onClick={handleConfirmarFotoPerfil}
                disabled={!novaFotoPerfil || loadingAvatar}
              >
                {loadingAvatar ? "Salvando..." : "Salvar foto"}
              </button>
            </div>
          </div>
        </div>
      )}

      {mostrarModalDesativar && (
        <div className="modal-overlay">
          <div className="modal-content modal-content--small">
            <h3>Desativar conta</h3>

            <p className="modal-text">
              Para confirmar a desativação, informe sua senha atual.
              <br />
              Sua conta ficará disponível para reativação por até 30 dias.
            </p>

            <div className="password-field">
              <input
                type={mostrarSenhaDesativacao ? "text" : "password"}
                placeholder="Digite sua senha atual"
                value={senhaDesativacao}
                onChange={(e) => setSenhaDesativacao(e.target.value)}
              />

              <button
                type="button"
                aria-label={mostrarSenhaDesativacao ? "Ocultar senha" : "Mostrar senha"}
                onClick={() => setMostrarSenhaDesativacao((prev) => !prev)}
              >
                {mostrarSenhaDesativacao ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={() => {
                  setMostrarModalDesativar(false);
                  setSenhaDesativacao("");
                  setMostrarSenhaDesativacao(false);
                }}
              >
                Cancelar
              </button>

              <button
                type="button"
                className="danger-button"
                onClick={handleDesativarConta}
                disabled={loadingDesativacao || !senhaDesativacao.trim()}
              >
                {loadingDesativacao
                  ? "Desativando..."
                  : "Confirmar desativação"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}