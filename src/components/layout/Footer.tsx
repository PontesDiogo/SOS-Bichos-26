import logoCompleta from "../../assets/logo-sos-bichos.png";

interface FooterProps {
  isAdmin?: boolean;
  onHome?: () => void;
  onMinhasDenuncias?: () => void;
  onDenunciar?: () => void;
  onAdmin?: () => void;
  onRelatorios?: () => void;
  onPolitica?: () => void;
}

export function Footer({
  isAdmin = false,
  onHome,
  onMinhasDenuncias,
  onDenunciar,
  onAdmin,
  onRelatorios,
  onPolitica,
}: FooterProps) {
  return (
    <footer className="footer">
      <div className="footer__brand">
        <div className="footer__logo">
          <img src={logoCompleta} alt="Logo SOS Bichos" />
        </div>

        <div className="footer__brand-text">
          <p>
            Projeto acadêmico voltado ao registro, acompanhamento e gestão de
            denúncias envolvendo animais.
          </p>

          <small>
            Plataforma desenvolvida para fins educacionais, com foco em cuidado
            animal, organização das ocorrências e transparência no acompanhamento.
          </small>
        </div>
      </div>

      <div className="footer__group">
        <h3>Navegação</h3>

        <div className="footer__links">
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
      </div>

      {isAdmin && (
        <div className="footer__group">
          <h3>Administração</h3>

          <div className="footer__links">
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
        </div>
      )}
    </footer>
  );
}     