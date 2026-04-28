import { useEffect, useState } from "react";
import { Navbar } from "../components/layout/Navbar";
import { PageContainer } from "../components/layout/PageContainer";
import { Footer } from "../components/layout/Footer";
import { listarTodasDenuncias } from "../services/denunciaService";
import type { Denuncia } from "../types/denuncia";
import { formatarDataHora } from "../utils/formatters";

interface AdminPageProps {
  userName?: string;
  avatarUrl?: string | null;
  onHome: () => void;
  onPerfil: () => void;
  onLogout: () => void;
}

export function AdminPage({
  userName,
  avatarUrl,
  onHome,
  onPerfil,
  onLogout,
}: AdminPageProps) {
  const [denuncias, setDenuncias] = useState<Denuncia[]>([]);
  const [denunciaSelecionada, setDenunciaSelecionada] =
    useState<Denuncia | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  async function carregarDenunciasAdmin() {
    try {
      setLoading(true);
      setErro("");

      const data = await listarTodasDenuncias();

      setDenuncias(data);
      setDenunciaSelecionada(data[0] ?? null);
    } catch (error) {
      console.error(error);
      setErro("Não foi possível carregar as denúncias.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarDenunciasAdmin();
  }, []);

  return (
    <>
      <Navbar
        userName={userName}
        avatarUrl={avatarUrl}
        isAdmin
        onDenunciar={onHome}
        onPerfil={onPerfil}
        onAdmin={() => undefined}
        onRelatorios={() => console.log("Ir para relatórios")}
        onLogout={onLogout}
      />

      <PageContainer>
        <section className="admin-header">
          <span className="section-tag">Painel administrativo</span>

          <h1>Gestão de denúncias</h1>

          <p>
            Visualize todas as ocorrências registradas na plataforma, acompanhe
            detalhes e gerencie o atendimento das denúncias.
          </p>
        </section>

        {loading && <p>Carregando denúncias...</p>}

        {erro && <p className="form-error">{erro}</p>}

        {!loading && !erro && denuncias.length === 0 && (
          <p>Nenhuma denúncia cadastrada até o momento.</p>
        )}

        {!loading && !erro && denuncias.length > 0 && (
          <section className="admin-panel">
            <div className="admin-list">
              {denuncias.map((denuncia) => (
                <button
                  key={denuncia.id}
                  type="button"
                  className={`admin-list-item ${
                    denunciaSelecionada?.id === denuncia.id ? "is-selected" : ""
                  }`}
                  onClick={() => setDenunciaSelecionada(denuncia)}
                >
                  <div>
                    <strong>{denuncia.resumo || "Denúncia sem resumo"}</strong>
                    <span>{denuncia.tipo}</span>
                    <small>{formatarDataHora(denuncia.created_at)}</small>
                  </div>

                  <span className="status-pill">{denuncia.status}</span>
                </button>
              ))}
            </div>

            <article className="admin-detail-card">
              {denunciaSelecionada ? (
                <>
                  {denunciaSelecionada.foto_url && (
                    <div className="admin-detail-image">
                      <img
                        src={denunciaSelecionada.foto_url}
                        alt="Foto da denúncia"
                      />
                    </div>
                  )}

                  <div className="admin-detail-content">
                    <div className="admin-detail-header">
                      <div>
                        <span className="section-tag">
                          {denunciaSelecionada.tipo}
                        </span>
                        <h2>{denunciaSelecionada.resumo || "Denúncia sem resumo"}</h2>
                      </div>

                      <span className="status-pill">
                        {denunciaSelecionada.status}
                      </span>
                    </div>

                    <p>{denunciaSelecionada.descricao}</p>

                    <div className="admin-detail-grid">
                      <div>
                        <strong>Usuário</strong>
                        <span>
                          {denunciaSelecionada.anonimo
                            ? "Anônimo"
                            : denunciaSelecionada.nome_usuario || "Não informado"}
                        </span>
                      </div>

                      <div>
                        <strong>Data</strong>
                        <span>
                          {formatarDataHora(denunciaSelecionada.created_at)}
                        </span>
                      </div>

                      <div>
                        <strong>Endereço</strong>
                        <span>
                          {denunciaSelecionada.endereco || "Não informado"}
                        </span>
                      </div>

                      <div>
                        <strong>Coordenadas</strong>
                        <span>
                          {denunciaSelecionada.latitude &&
                          denunciaSelecionada.longitude
                            ? `${denunciaSelecionada.latitude}, ${denunciaSelecionada.longitude}`
                            : "Não informado"}
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <p>Selecione uma denúncia para visualizar os detalhes.</p>
              )}
            </article>
          </section>
        )}
      </PageContainer>

      <Footer />
    </>
  );
}