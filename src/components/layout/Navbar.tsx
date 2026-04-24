interface NavbarProps {
  userName?: string;
  isAdmin?: boolean;
  onDenunciar?: () => void;
  onPerfil?: () => void;
  onAdmin?: () => void;
  onRelatorios?: () => void;
  onLogout?: () => void;
}

export function Navbar({
  userName,
  isAdmin = false,
  onDenunciar,
  onPerfil,
  onAdmin,
  onRelatorios,
  onLogout,
}: NavbarProps) {
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

        <button type="button" onClick={onPerfil}>
          {userName ? `Olá, ${userName}` : "Usuário"}
        </button>

        <button type="button" onClick={onLogout}>
          Sair
        </button>
      </nav>
    </header>
  );
}