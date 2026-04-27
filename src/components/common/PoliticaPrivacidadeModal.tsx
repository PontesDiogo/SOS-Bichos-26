interface PoliticaPrivacidadeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PoliticaPrivacidadeModal({
  isOpen,
  onClose,
}: PoliticaPrivacidadeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content privacy-modal">
        <div className="modal-header">
          <div>
            <h2>Política de Privacidade</h2>
            <p>Entenda como seus dados são utilizados no SOS Bichos.</p>
          </div>

          <button type="button" onClick={onClose}>
            Fechar
          </button>
        </div>

        <div className="privacy-content">
          <h3>Dados coletados</h3>
          <p>
            Coletamos nome, e-mail, localização, descrição da denúncia e imagens
            enviadas pelo usuário.
          </p>

          <h3>Finalidade</h3>
          <p>
            Os dados são utilizados exclusivamente para registrar, acompanhar e
            administrar ocorrências relacionadas a animais.
          </p>

          <h3>Denúncias anônimas</h3>
          <p>
            Quando o usuário escolhe denunciar de forma anônima, seu nome não é
            exibido na denúncia.
          </p>

          <h3>Armazenamento</h3>
          <p>
            As informações são armazenadas no Supabase, utilizado para
            autenticação, banco de dados e imagens.
          </p>
        </div>

        <div className="modal-actions">
          <button type="button" className="primary-button" onClick={onClose}>
            Entendi
          </button>
        </div>
      </div>
    </div>
  );
}