import { useEffect, useState } from "react";
import { ScrollToTopButton } from "../common/ScrollToTopButton";

interface FooterProps {
  isAdmin?: boolean;
  onHome?: () => void;
  onDenunciar?: () => void;
  onMinhasDenuncias?: () => void;
  onPolitica?: () => void;
  onAdmin?: () => void;
  onRelatorios?: () => void;
}


export function Footer({
  isAdmin = false,
  onHome,
  onDenunciar,
  onMinhasDenuncias,
  onPolitica,
  onAdmin,
  onRelatorios,
}: FooterProps) {

  return (
    <footer className="footer">
      <div className="footer__content">
        <div className="footer__brand">
          <img
            src="/logo-sos-bichos-icon.png"
            alt="Logo SOS Bichos"
            className="footer__logo"
          />

          <strong>SOS Bichos</strong>
        </div>

        <div className="footer__about">
          <p>
            Projeto acadêmico voltado ao registro, acompanhamento e gestão de
            denúncias envolvendo animais.
          </p>

          <small>
            Plataforma desenvolvida para fins educacionais, com foco em cuidado
            animal, organização das ocorrências e transparência no
            acompanhamento.
          </small>
        </div>

        <div className="footer__nav-group">
          <div className="footer__nav">
            <strong>Navegação</strong>

            {onHome && (
              <button type="button" onClick={onHome}>
                Início
              </button>
            )}

            {onDenunciar && (
              <button type="button" onClick={onDenunciar}>
                Fazer denúncia
              </button>
            )}

            {onMinhasDenuncias && (
              <button type="button" onClick={onMinhasDenuncias}>
                Minhas denúncias
              </button>
            )}

            {onPolitica && (
              <button type="button" onClick={onPolitica}>
                Política de privacidade
              </button>
            )}
          </div>

          {isAdmin && (
            <div className="footer__nav footer__nav--admin">
              <strong>Administração</strong>

              {onAdmin && (
                <button type="button" onClick={onAdmin}>
                  Painel ADM
                </button>
              )}

              {onRelatorios && (
                <button type="button" onClick={onRelatorios}>
                  Relatórios
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    <ScrollToTopButton />
    </footer>
    
  );
}