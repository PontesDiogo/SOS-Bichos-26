import bannerImage from "../../assets/banner-sos-bichos.jpg";

interface BannerProps {
  onDenunciar?: () => void;
}

export function Banner({ onDenunciar }: BannerProps) {
  return (
    <section className="banner">
      <div className="banner__content">
        <span className="banner__tag">Projeto SOS Bichos</span>

        <h1>Ajude a proteger os animais da sua cidade</h1>

        <p>
          Registre denúncias com descrição, localização e fotos para auxiliar no
          atendimento de ocorrências envolvendo animais.
        </p>

        <div className="banner__actions">
          <button type="button" onClick={onDenunciar}>
            Registrar denúncia
          </button>

          <a href="#sobre">Entender o projeto</a>
        </div>
      </div>

      <div className="banner__image">
        <img src={bannerImage} alt="Animais em cuidado e proteção" />
      </div>
    </section>
  );
}