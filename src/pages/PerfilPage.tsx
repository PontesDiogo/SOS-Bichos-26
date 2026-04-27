import { useState } from "react";
import {
  atualizarAvatarPerfil,
  atualizarNomePerfil,
  atualizarSenhaPerfil,
  desativarContaUsuario,
} from "../services/perfilService";
import { uploadFotoPerfil } from "../services/storageService";
import { validarImagem, validarSenhaForte } from "../utils/validators";

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
  role,
  avatarUrl,
  onBack,
  onLogout,
  onUpdated,
}: PerfilPageProps) {
  const [novoNome, setNovoNome] = useState(nome);
  const [foto, setFoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(avatarUrl || null);

  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  function handleFotoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    const validationError = validarImagem(selectedFile);

    if (validationError) {
      setErro(validationError);
      return;
    }

    setFoto(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
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

      if (foto) {
        const avatarPublicUrl = await uploadFotoPerfil(foto, userId);
        await atualizarAvatarPerfil(avatarPublicUrl);
      }

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
    } catch (error) {
      console.error(error);
      setErro("Não foi possível atualizar a senha.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDesativarConta() {
    const confirmar = window.confirm(
      "Tem certeza que deseja desativar sua conta? Você será desconectado."
    );

    if (!confirmar) return;

    try {
      setLoading(true);
      setErro("");

      await desativarContaUsuario();
      await onLogout();
    } catch (error) {
      console.error(error);
      setErro("Não foi possível desativar a conta.");
    } finally {
      setLoading(false);
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
              {preview ? <img src={preview} alt="Foto de perfil" /> : <span>🐾</span>}
            </div>

            <div>
              <label className="form-label">Foto de perfil</label>
              <input type="file" accept="image/*" onChange={handleFotoChange} />
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

          <div className="form-group">
            <label className="form-label">Tipo de perfil</label>
            <input value={role === "admin" ? "Administrador" : "Usuário"} disabled />
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

          <button
            type="button"
            className="secondary-button"
            onClick={handleAtualizarSenha}
            disabled={loading}
          >
            Atualizar senha
          </button>
        </div>

        {erro && <p className="form-error">{erro}</p>}
        {sucesso && <p className="form-success">{sucesso}</p>}

        <div className="profile-actions">
          <button type="button" className="secondary-button" onClick={onBack}>
            Voltar
          </button>

          <button
            type="button"
            className="danger-button danger-button--filled"
            onClick={handleDesativarConta}
            disabled={loading}
          >
            Desativar conta
          </button>
        </div>
      </section>
    </main>
  );
}