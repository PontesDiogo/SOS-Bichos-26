import bannerImage from "../assets/banner-sos-bichos.jpg";


interface PublicHomePageProps {
    onEntrar: () => void;
    onGoToPolitica: () => void;
    onGoToDenuncia: () => void;
}

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
                    <span>🐾</span>

                    <div>
                        <strong>SOS Bichos</strong>
                        <small>Denúncias e cuidado animal</small>
                    </div>
                </button>

                <nav className="public-navbar__links">
                    <button type="button" onClick={() => scrollToSection("sobre")}>
                        Sobre
                    </button>

                    <button type="button" onClick={() => scrollToSection("denuncias")}>
                        Denúncias
                    </button>

                    <button type="button" onClick={onGoToPolitica}>
                        Política
                    </button>

                    <button type="button" className="public-navbar__login" onClick={onEntrar}>
                        Entrar
                    </button>
                </nav>
            </header>

            <main className="public-home" id="inicio">
                <section className="public-hero">
                    <div className="public-hero__content">
                        <span className="section-tag">Projeto acadêmico</span>

                        <h1>Uma ponte entre a população e o cuidado animal</h1>

                        <p>
                            O SOS Bichos é uma plataforma criada para facilitar o registro e
                            acompanhamento de denúncias envolvendo animais, como maus-tratos,
                            abandono, animais feridos e situações relacionadas à saúde pública.
                        </p>

                        <div className="public-hero__actions">
                            <button type="button" className="primary-button" onClick={onGoToDenuncia}>
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
                    </div>

                    <div className="public-hero__visual">
                        <img
                            src={bannerImage}
                            alt="Animais representando o cuidado e a proteção animal"
                            className="public-hero__image"
                        />

                        <div className="public-hero__image-overlay" />

                        <div className="public-hero__floating-card">
                            <strong>🐶 Denunciar também é cuidar.</strong>
                            <span>
                                Ao registrar uma ocorrência com descrição, localização e imagem, você
                                ajuda a administração a identificar regiões de risco e agir com mais
                                eficiência.
                            </span>
                        </div>

                        <div className="public-hero__badges">
                            <article>
                                <strong>📍 Localização</strong>
                                <span>Endereço manual, CEP e mapa</span>
                            </article>

                            <article>
                                <strong>📸 Evidências</strong>
                                <span>Envio de foto e acompanhamento do status</span>
                            </article>
                        </div>
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
                                Descreva o caso, selecione o tipo da denúncia e adicione detalhes
                                importantes para facilitar a análise.
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
                            <h3>Acompanhe o status</h3>
                            <p>
                                A denúncia passa por etapas como pendente, em análise, em
                                atendimento, resolvida ou cancelada.
                            </p>
                        </article>
                    </div>
                </section>

                <section id="denuncias" className="public-section public-denuncia-preview">
                    <div>
                        <span className="section-tag">Denúncias</span>

                        <h2>Registre uma ocorrência</h2>

                        <p>
                            Para manter a segurança e permitir acompanhamento, é necessário
                            entrar ou criar uma conta antes de enviar uma denúncia. Você poderá
                            informar descrição, localização, foto e acompanhar o andamento.
                        </p>

                        <button type="button" className="primary-button" onClick={onGoToDenuncia}>
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
                            Faça login para liberar o formulário completo com foto, endereço e mapa.
                        </small>
                    </div>
                </section>
            </main>

            <footer className="public-footer">
                <div>
                    <strong>SOS Bichos</strong>
                    <p>Denúncias e cuidado animal.</p>
                </div>

                <nav>
                    <button type="button" onClick={() => scrollToSection("sobre")}>
                        Sobre
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