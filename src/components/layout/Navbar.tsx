import type { User } from "@supabase/supabase-js";

interface NavbarProps {
  userName?: string;
  isAdmin?: boolean;
  user?: User | null;
  avatarUrl?: string;
  onDenunciar?: () => void;
  onPerfil?: () => void;
  onAdmin?: () => void;
  onRelatorios?: () => void;
  onLogout?: () => void;
}

export function Navbar({
  isAdmin,
  user,
  avatarUrl,
  onDenunciar,
  onPerfil,
  onLogout,
  onAdmin,
  onRelatorios,
}: NavbarProps) {
  const fotoPerfil = avatarUrl || user?.user_metadata?.avatar_url || null;

  return (
    <header className="navbar">
      <div className="navbar__brand">
        <span className="navbar__logo">🐾</span>
        <div>
          <strong>SOS Bichos</strong>
          <small>Denúncias e cuidado animal</small>
        </div>
      </div>

      <nav className="navbar__actions">
        {isAdmin && (
          <>
            <button type="button" onClick={onAdmin}>
              Admin
            </button>

            <button type="button" onClick={onRelatorios}>
              Relatórios
            </button>
          </>
        )}

        <button type="button" className="navbar__primary" onClick={onDenunciar}>
          Fazer denúncia
        </button>

        <button
          type="button"
          className="navbar-avatar-btn"
          onClick={onPerfil}
          title="Meu perfil"
        >
          {fotoPerfil ? (
            <img src={fotoPerfil} alt="Perfil" className="navbar-avatar-img" />
          ) : (
            <div className="navbar-avatar-placeholder">👤</div>
          )}
        </button>

        <button type="button" onClick={onLogout}>
          Sair
        </button>
      </nav>
    </header>
  );
}