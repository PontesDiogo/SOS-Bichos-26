import bannerImage from "../assets/banner-sos-bichos.jpg";
import logoIcon from "../assets/logo-sos-bichos-icon.png";

interface PublicHomePageProps {
    onEntrar: () => void;
    onGoToPolitica: () => void;
    onGoToDenuncia: () => void;
}

const tiposOcorrencia = [
    {
        icon: "⚠️",
        title: "Maus-tratos",
        text: "Casos de violência, negligência, abandono de cuidados ou condições inadequadas.",
    },
    {
        icon: "🐾",
        title: "Abandono",
        text: "Animais deixados em ruas, terrenos, praças ou locais sem assistência.",
    },
    {
        icon: "🩹",
        title: "Animal ferido",
        text: "Ocorrências envolvendo animais machucados, debilitados ou em situação de risco.",
    },
    {
        icon: "🐀",
        title: "Infestação",
        text: "Situações com risco sanitário, zoonoses, pragas ou acúmulo de animais/vetores.",
    },
];

export function PublicHomePage({
    onEntrar,
    onGoToPolitica,
    onGoToDenuncia,
}: PublicHomePageProps) {
    function scrollToSection(id: string) {
        const section = document.getElementById(id);
        section?.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    return (
        <>
            <header className="public-navbar">
                <button
                    type="button"
                    className="public-navbar__brand"
                    onClick={() => scrollToSection("inicio")}
                >
                    <span className="public-navbar__logo">
                        <img src={logoIcon} alt="Logo SOS Bichos" />
                    </span>

                    <div>
                        <strong>SOS Bichos</strong>
                        <small>Denúncias e cuidado animal</small>
                    </div>
                </button>

                <nav className="public-navbar__links" aria-label="Navegação principal">
                    <button type="button" onClick={() => scrollToSection("sobre")}>
                        Sobre
                    </button>

                    <button type="button" onClick={() => scrollToSection("tipos")}>
                        Ocorrências
                    </button>

                    <button type="button" onClick={() => scrollToSection("denuncias")}>
                        Denúncias
                    </button>

                    <button type="button" onClick={onGoToPolitica}>
                        Política
                    </button>

                    <button
                        type="button"
                        className="public-navbar__login"
                        onClick={onEntrar}
                    >
                        Entrar
                    </button>
                </nav>
            </header>

            <main className="public-home" id="inicio">
                <section className="public-hero">
                    <div className="public-hero__content">
                        <span className="section-tag">Projeto acadêmico</span>

                        <h1>Proteja. Denuncie. Acompanhe.</h1>

                        <p>
                            O SOS Bichos aproxima a população do cuidado animal, facilitando o
                            registro de ocorrências como maus-tratos, abandono, animais feridos
                            e situações relacionadas à saúde pública.
                        </p>

                        <div className="public-hero__actions">
                            <button
                                type="button"
                                className="primary-button"
                                onClick={onGoToDenuncia}
                            >
                                Fazer denúncia
                            </button>

                            <button
                                type="button"
                                className="secondary-button"
                                onClick={() => scrollToSection("como-funciona")}
                            >
                                Como funciona
                            </button>
                        </div>

                        <div className="public-hero__mini-stats">
                            <article>
                                <strong>📍</strong>
                                <span>Localização por endereço, CEP ou mapa</span>
                            </article>

                            <article>
                                <strong>📸</strong>
                                <span>Envio de fotos para apoiar a análise</span>
                            </article>

                            <article>
                                <strong>🔎</strong>
                                <span>Acompanhamento por status e feedbacks</span>
                            </article>
                        </div>
                    </div>

                    <div className="public-hero__visual">
                        <img
                            src={bannerImage}
                            alt="Cachorro representando cuidado e proteção animal"
                            className="public-hero__image"
                        />

                        <div className="public-hero__image-overlay" />

                        <div className="public-hero__floating-card">
                            <strong>🐶 Denunciar também é cuidar.</strong>
                            <span>
                                Ao registrar uma ocorrência com descrição, localização e imagem,
                                você ajuda a administração a identificar riscos e organizar o
                                atendimento.
                            </span>
                        </div>
                    </div>
                </section>

                <section id="sobre" className="public-section public-section--split">
                    <div>
                        <span className="section-tag">Sobre</span>

                        <h2>Uma plataforma para organizar denúncias envolvendo animais</h2>

                        <p>
                            O SOS Bichos é um sistema web desenvolvido para tornar o registro,
                            acompanhamento e gestão de denúncias mais simples, acessível e
                            transparente.
                        </p>
                    </div>

                    <div className="public-highlight-card">
                        <strong>Objetivo do projeto</strong>
                        <p>
                            Facilitar a comunicação entre cidadãos e responsáveis pelo
                            atendimento, centralizando informações importantes como tipo da
                            ocorrência, localização, descrição, fotos e status.
                        </p>
                    </div>
                </section>

                <section id="tipos" className="public-section">
                    <span className="section-tag">Ocorrências</span>

                    <h2>O que pode ser registrado?</h2>

                    <p>
                        A plataforma foi pensada para apoiar o registro de diferentes tipos
                        de situações envolvendo animais e saúde pública.
                    </p>

                    <div className="public-occurrence-grid">
                        {tiposOcorrencia.map((tipo) => (
                            <article key={tipo.title}>
                                <span>{tipo.icon}</span>
                                <h3>{tipo.title}</h3>
                                <p>{tipo.text}</p>
                            </article>
                        ))}
                    </div>
                </section>

                <section id="como-funciona" className="public-section">
                    <span className="section-tag">Como funciona</span>

                    <h2>Da denúncia ao acompanhamento</h2>

                    <div className="public-steps">
                        <article>
                            <span>1</span>
                            <h3>Informe a ocorrência</h3>
                            <p>
                                Descreva o caso, selecione o tipo da denúncia e adicione os
                                detalhes necessários para facilitar a análise.
                            </p>
                        </article>

                        <article>
                            <span>2</span>
                            <h3>Marque a localização</h3>
                            <p>
                                O endereço pode ser preenchido manualmente, buscado por CEP ou
                                indicado diretamente no mapa.
                            </p>
                        </article>

                        <article>
                            <span>3</span>
                            <h3>Anexe evidências</h3>
                            <p>
                                Fotos da ocorrência ajudam a administração a entender melhor a
                                situação registrada.
                            </p>
                        </article>

                        <article>
                            <span>4</span>
                            <h3>Acompanhe o status</h3>
                            <p>
                                Após entrar na plataforma, o usuário pode acompanhar atualizações
                                e feedbacks da administração.
                            </p>
                        </article>
                    </div>
                </section>

                <section className="public-cta-band">
                    <div>
                        <span className="section-tag">Acesso à plataforma</span>
                        <h2>Para enviar uma denúncia, entre na sua conta</h2>
                        <p>
                            O login permite acompanhar suas ocorrências, visualizar feedbacks e
                            manter um histórico organizado das denúncias registradas.
                        </p>
                    </div>

                    <button type="button" className="primary-button" onClick={onEntrar}>
                        Entrar na plataforma
                    </button>
                </section>

                <section
                    id="denuncias"
                    className="public-section public-denuncia-preview"
                >
                    <div>
                        <span className="section-tag">Denúncias</span>

                        <h2>Registre uma ocorrência com detalhes</h2>

                        <p>
                            Ao criar uma denúncia, você poderá informar resumo, descrição,
                            tipo, endereço, localização no mapa e anexar imagens para apoiar a
                            análise.
                        </p>

                        <button
                            type="button"
                            className="primary-button"
                            onClick={onGoToDenuncia}
                        >
                            Entrar para registrar denúncia
                        </button>
                    </div>

                    <div className="public-form-preview">
                        <label>Resumo</label>
                        <input disabled placeholder="Ex: Animal abandonado próximo à praça" />

                        <label>Tipo da denúncia</label>
                        <select disabled>
                            <option>Maus-tratos</option>
                            <option>Abandono</option>
                            <option>Animal ferido</option>
                            <option>Infestação</option>
                            <option>Outros</option>
                        </select>

                        <label>Descrição</label>
                        <textarea
                            disabled
                            rows={4}
                            placeholder="Descreva o que aconteceu e informe pontos de referência."
                        />

                        <small>
                            Faça login para liberar o formulário completo com fotos, endereço
                            e mapa.
                        </small>
                    </div>
                </section>
            </main>
            <button
                type="button"
                className="public-scroll-top"
                onClick={() => scrollToSection("inicio")}
                aria-label="Voltar ao topo"
            >
                ↑
            </button>

            <footer className="public-footer">
                <div>
                    <strong>SOS Bichos</strong>
                    <p>Denúncias e cuidado animal.</p>
                </div>

                <nav>
                    <button type="button" onClick={() => scrollToSection("sobre")}>
                        Sobre
                    </button>

                    <button type="button" onClick={() => scrollToSection("tipos")}>
                        Ocorrências
                    </button>

                    <button type="button" onClick={() => scrollToSection("denuncias")}>
                        Denúncias
                    </button>

                    <button type="button" onClick={onGoToPolitica}>
                        Política de privacidade
                    </button>
                </nav>
            </footer>
           
        </>
    );
}