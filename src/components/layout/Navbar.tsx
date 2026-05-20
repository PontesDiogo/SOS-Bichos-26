import { useEffect, useRef, useState } from "react";
import type { User } from "@supabase/supabase-js";

interface NavbarProps {
  userName?: string;
  isAdmin?: boolean;
  user?: User | null;
  avatarUrl?: string | null;
  onHome?: () => void;
  onDenunciar?: () => void;
  onMinhasDenuncias?: () => void;
  onPerfil?: () => void;
  onAdmin?: () => void;
  onRelatorios?: () => void;
  onLogout?: () => void;
}

export function Navbar({
  isAdmin,
  user,
  avatarUrl,
  onHome,
  onDenunciar,
  onMinhasDenuncias,
  onPerfil,
  onLogout,
  onAdmin,
  onRelatorios,
}: NavbarProps) {
  const [menuAberto, setMenuAberto] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const fotoPerfil = avatarUrl || user?.user_metadata?.avatar_url || null;

  useEffect(() => {
    function handleClickFora(event: MouseEvent) {
      if (!menuRef.current) return;

      if (!menuRef.current.contains(event.target as Node)) {
        setMenuAberto(false);
      }
    }

    document.addEventListener("mousedown", handleClickFora);

    return () => {
      document.removeEventListener("mousedown", handleClickFora);
    };
  }, []);

  function handleMenuAction(action?: () => void) {
    setMenuAberto(false);
    action?.();
  }

  return (
    <header className="navbar">
      <button
        type="button"
        className="navbar__brand navbar__brand-button"
        onClick={onHome}
      >
        <span className="public-navbar__logo">
          <img src="/logo-sos-bichos.png" alt="Logo SOS Bichos" />
        </span>

        <div>
          <strong>SOS Bichos</strong>
          <small>Denúncias e cuidado animal</small>
        </div>
      </button>

      <nav className="navbar__actions">
        <button
          type="button"
          className="navbar__primary"
          onClick={onDenunciar}
        >
          Fazer denúncia
        </button>

        <div className="navbar-user-menu" ref={menuRef}>
          <button
            type="button"
            className="navbar-avatar-btn"
            onClick={() => setMenuAberto((prev) => !prev)}
            title="Abrir menu do usuário"
            aria-haspopup="menu"
            aria-expanded={menuAberto}
          >
            {fotoPerfil ? (
              <img
                src={fotoPerfil}
                alt="Perfil"
                className="navbar-avatar-img"
              />
            ) : (
              <div className="navbar-avatar-placeholder">👤</div>
            )}
          </button>

          {menuAberto && (
            <div className="navbar-dropdown" role="menu">
              {isAdmin && (
                <>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => handleMenuAction(onAdmin)}
                  >
                    Painel ADM
                  </button>

                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => handleMenuAction(onRelatorios)}
                  >
                    Relatórios
                  </button>

                  <div className="navbar-dropdown-divider" />
                </>
              )}

              <button
                type="button"
                role="menuitem"
                onClick={() => handleMenuAction(onPerfil)}
              >
                Editar perfil
              </button>

              <button
                type="button"
                role="menuitem"
                onClick={() => handleMenuAction(onMinhasDenuncias)}
              >
                Minhas denúncias
              </button>

              <div className="navbar-dropdown-divider" />

              <button
                type="button"
                role="menuitem"
                className="navbar-dropdown-danger"
                onClick={() => handleMenuAction(onLogout)}
              >
                Sair
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}