import { useEffect, useMemo, useState } from "react";
import { Navbar } from "../components/layout/Navbar";
import { PageContainer } from "../components/layout/PageContainer";
import { Footer } from "../components/layout/Footer";
import { listarTodasDenuncias } from "../services/denunciaService";
import type { Denuncia } from "../types/denuncia";

interface RelatoriosPageProps {
  userName?: string;
  avatarUrl?: string | null;
  onHome: () => void;
  onAdmin: () => void;
  onPerfil: () => void;
  onLogout: () => void;
}

export function RelatoriosPage({
  userName,
  avatarUrl,
  onHome,
  onAdmin,
  onPerfil,
  onLogout,
}: RelatoriosPageProps) {
  const [denuncias, setDenuncias] = useState<Denuncia[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarRelatorios() {
      try {
        setLoading(true);
        setErro("");

        const data = await listarTodasDenuncias();
        setDenuncias(data);
      } catch (error) {
        console.error(error);
        setErro("Não foi possível carregar os relatórios.");
      } finally {
        setLoading(false);
      }
    }

    carregarRelatorios();
  }, []);

  const indicadores = useMemo(() => {
    const total = denuncias.length;

    const pendentes = denuncias.filter(
      (denuncia) => denuncia.status === "Pendente"
    ).length;

    const emAnalise = denuncias.filter(
      (denuncia) => denuncia.status === "Em análise"
    ).length;

    const emAtendimento = denuncias.filter(
      (denuncia) => denuncia.status === "Em atendimento"
    ).length;

    const resolvidas = denuncias.filter(
      (denuncia) => denuncia.status === "Resolvido"
    ).length;

    const canceladas = denuncias.filter(
      (denuncia) => denuncia.status === "Cancelado"
    ).length;

    const naoResolvidas = denuncias.filter(
      (denuncia) =>
        denuncia.status !== "Resolvido" && denuncia.status !== "Cancelado"
    ).length;

    return {
      total,
      pendentes,
      emAnalise,
      emAtendimento,
      resolvidas,
      canceladas,
      naoResolvidas,
    };
  }, [denuncias]);

  return (
    <>
      <Navbar
        userName={userName}
        avatarUrl={avatarUrl}
        isAdmin
        onDenunciar={onHome}
        onAdmin={onAdmin}
        onRelatorios={() => undefined}
        onPerfil={onPerfil}
        onLogout={onLogout}
      />

      <PageContainer>
        <section className="relatorios-header">
          <span className="section-tag">Relatórios</span>

          <h1>Visão geral das denúncias</h1>

          <p>
            Acompanhe os principais indicadores do sistema, como volume total de
            denúncias, ocorrências pendentes, atendimentos em andamento e casos
            resolvidos.
          </p>
        </section>

        {loading && <p>Carregando relatórios...</p>}

        {erro && <p className="form-error">{erro}</p>}

        {!loading && !erro && (
          <section className="relatorios-grid">
            <article className="relatorio-card relatorio-card--total">
              <span>Total de denúncias</span>
              <strong>{indicadores.total}</strong>
              <p>Ocorrências registradas na plataforma.</p>
            </article>

            <article className="relatorio-card">
              <span>Pendentes</span>
              <strong>{indicadores.pendentes}</strong>
              <p>Denúncias aguardando análise inicial.</p>
            </article>

            <article className="relatorio-card">
              <span>Em análise</span>
              <strong>{indicadores.emAnalise}</strong>
              <p>Ocorrências sendo avaliadas pela equipe.</p>
            </article>

            <article className="relatorio-card">
              <span>Em atendimento</span>
              <strong>{indicadores.emAtendimento}</strong>
              <p>Casos encaminhados para ação ou vistoria.</p>
            </article>

            <article className="relatorio-card">
              <span>Não resolvidas</span>
              <strong>{indicadores.naoResolvidas}</strong>
              <p>Denúncias ainda em aberto no fluxo.</p>
            </article>

            <article className="relatorio-card relatorio-card--success">
              <span>Resolvidas</span>
              <strong>{indicadores.resolvidas}</strong>
              <p>Ocorrências finalizadas com atendimento concluído.</p>
            </article>

            <article className="relatorio-card relatorio-card--danger">
              <span>Canceladas</span>
              <strong>{indicadores.canceladas}</strong>
              <p>Denúncias canceladas pelo usuário ou administração.</p>
            </article>
          </section>
        )}
      </PageContainer>

      <Footer />
    </>
  );
}