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
  userName,
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

    function handleEsc(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuAberto(false);
      }
    }

    document.addEventListener("mousedown", handleClickFora);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleClickFora);
      document.removeEventListener("keydown", handleEsc);
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
        title="Ir para o início"
        
      >
        <span className="navbar__logo" >
          <img src="/logo-sos-bichos.png" alt="Logo SOS Bichos" />
        </span>

        <div>
          <strong>SOS Bichos</strong>
          <small>Denúncias e cuidado animal</small>
        </div>
      </button>

      <nav className="navbar__actions" aria-label="Navegação principal">
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
              <span className="navbar-avatar-placeholder" aria-hidden="true">
                <svg
                  viewBox="0 0 24 24"
                  width="22"
                  height="22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M4.5 20C5.4 16.5 8.3 14.5 12 14.5C15.7 14.5 18.6 16.5 19.5 20"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            )}
          </button>

          {menuAberto && (
            <div className="navbar-dropdown" role="menu">
              <div className="navbar-dropdown__header">
                <strong>{userName || "Usuário"}</strong>
                <small>{isAdmin ? "Administrador" : "Usuário comum"}</small>
              </div>

              <div className="navbar-dropdown-divider" />

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

              {isAdmin && (
                <>
                  <div className="navbar-dropdown-divider" />

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
                </>
              )}

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