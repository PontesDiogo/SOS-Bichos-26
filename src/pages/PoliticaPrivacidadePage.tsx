interface PoliticaPrivacidadePageProps {
  onBack: () => void;
  isModal?: boolean;
}

export function PoliticaPrivacidadePage({
  onBack,
  isModal = false,
}: PoliticaPrivacidadePageProps) {
  return (
    <main className={isModal ? "policy-page policy-page--modal" : "policy-page"}>
      <section className="policy-card">
        <span className="section-tag">SOS Bichos</span>

        <h1>Política de Privacidade</h1>

        <p>
          O SOS Bichos coleta apenas as informações necessárias para registrar,
          acompanhar e administrar denúncias relacionadas a ocorrências
          envolvendo animais.
        </p>

        <h2>Dados coletados</h2>
        <p>
          Podemos coletar nome, e-mail, descrição da denúncia, endereço,
          localização aproximada e imagens anexadas pelo usuário.
        </p>

        <h2>Uso das informações</h2>
        <p>
          As informações são utilizadas para identificar, organizar e acompanhar
          as ocorrências registradas, permitindo que administradores analisem e
          atualizem o status das denúncias.
        </p>

        <h2>Compartilhamento</h2>
        <p>
          Os dados não são utilizados para fins comerciais. Em um cenário real,
          poderiam ser acessados apenas por responsáveis autorizados pelo
          atendimento das ocorrências.
        </p>

        <h2>Denúncias anônimas</h2>
        <p>
          Quando o usuário opta por enviar uma denúncia como anônima, o nome não
          é exibido na ocorrência para fins de acompanhamento visual.
        </p>

        <h2>Armazenamento</h2>
        <p>
          Os dados são armazenados em ambiente Supabase, utilizado no projeto
          para autenticação, banco de dados e armazenamento de imagens.
        </p>

        <button
          type="button"
          className="policy-back-button"
          onClick={onBack}
        >
          {isModal ? "Fechar" : "Voltar"}
        </button>
      </section>
    </main>
  );
}