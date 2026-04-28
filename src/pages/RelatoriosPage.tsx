import { useEffect, useMemo, useState } from "react";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { Navbar } from "../components/layout/Navbar";
import { PageContainer } from "../components/layout/PageContainer";
import { Footer } from "../components/layout/Footer";
import { listarTodasDenuncias } from "../services/denunciaService";
import type { Denuncia, StatusDenuncia, TipoDenuncia } from "../types/denuncia";

interface RelatoriosPageProps {
    userName?: string;
    avatarUrl?: string | null;
    onHome: () => void;
    onAdmin: () => void;
    onPerfil: () => void;
    onLogout: () => void;
}

const STATUS_ORDEM: StatusDenuncia[] = [
    "Pendente",
    "Em análise",
    "Em atendimento",
    "Resolvido",
    "Cancelado",
];

const TIPOS_ORDEM: TipoDenuncia[] = [
    "Maus-tratos",
    "Abandono",
    "Animal ferido",
    "Infestação",
    "Outros",
];

const CHART_COLORS = [
    "#8b5e34",
    "#d9a441",
    "#52796f",
    "#84a98c",
    "#b42318",
];

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

    const dadosPorStatus = useMemo(() => {
        return STATUS_ORDEM.map((status) => ({
            nome: status,
            total: denuncias.filter((denuncia) => denuncia.status === status).length,
        }));
    }, [denuncias]);

    const dadosPorTipo = useMemo(() => {
        return TIPOS_ORDEM.map((tipo) => ({
            nome: tipo,
            total: denuncias.filter((denuncia) => denuncia.tipo === tipo).length,
        })).filter((item) => item.total > 0);
    }, [denuncias]);




    const rankingPorBairro = useMemo(() => {
        const contador = new Map<string, number>();

        denuncias.forEach((denuncia) => {
            const bairro = denuncia.bairro?.trim() || "Bairro não informado";
            contador.set(bairro, (contador.get(bairro) || 0) + 1);
        });

        return Array.from(contador.entries())
            .map(([bairro, total]) => ({ bairro, total }))
            .sort((a, b) => b.total - a.total)
            .slice(0, 8);
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
                    <>
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

                        <section className="relatorios-charts-grid">
                            <section className="relatorios-ranking-section">
                                <div className="relatorio-chart-header">
                                    <div>
                                        <span className="section-tag">Regiões</span>
                                        <h2>Bairros com mais denúncias</h2>
                                    </div>
                                </div>

                                <div className="ranking-list">
                                    {rankingPorBairro.length === 0 ? (
                                        <p className="empty-chart-message">
                                            Ainda não há dados suficientes para gerar o ranking por bairro.
                                        </p>
                                    ) : (
                                        rankingPorBairro.map((item, index) => (
                                            <div key={item.bairro} className="ranking-item">
                                                <div className="ranking-item__left">
                                                    <span className="ranking-position">{index + 1}</span>
                                                    <div>
                                                        <strong>{item.bairro}</strong>
                                                        <small>{item.total} denúncia(s)</small>
                                                    </div>
                                                </div>

                                                <div className="ranking-bar">
                                                    <span
                                                        style={{
                                                            width: `${(item.total / rankingPorBairro[0].total) * 100}%`,
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </section>
                            <article className="relatorio-chart-card">
                                <div className="relatorio-chart-header">
                                    <div>
                                        <span className="section-tag">Status</span>
                                        <h2>Denúncias por status</h2>
                                    </div>
                                </div>

                                <div className="relatorio-chart">
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={dadosPorStatus}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                            <XAxis dataKey="nome" tick={{ fontSize: 12 }} />
                                            <YAxis allowDecimals={false} />
                                            <Tooltip />
                                            <Bar dataKey="total" name="Denúncias" radius={[10, 10, 0, 0]}>
                                                {dadosPorStatus.map((_, index) => (
                                                    <Cell
                                                        key={`status-${index}`}
                                                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                                                    />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </article>

                            <article className="relatorio-chart-card">
                                <div className="relatorio-chart-header">
                                    <div>
                                        <span className="section-tag">Tipo</span>
                                        <h2>Denúncias por tipo</h2>
                                    </div>
                                </div>

                                <div className="relatorio-chart">
                                    {dadosPorTipo.length === 0 ? (
                                        <p className="empty-chart-message">
                                            Ainda não há dados suficientes para gerar este gráfico.
                                        </p>
                                    ) : (
                                        <ResponsiveContainer width="100%" height={300}>
                                            <PieChart>
                                                <Pie
                                                    data={dadosPorTipo}
                                                    dataKey="total"
                                                    nameKey="nome"
                                                    outerRadius={105}
                                                    label
                                                >
                                                    {dadosPorTipo.map((_, index) => (
                                                        <Cell
                                                            key={`tipo-${index}`}
                                                            fill={CHART_COLORS[index % CHART_COLORS.length]}
                                                        />
                                                    ))
                                                    }
                                                </Pie>
                                                <Tooltip />
                                                <Legend />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    )}
                                </div>
                            </article>
                        </section>
                    </>
                )}
            </PageContainer>

            <Footer />
        </>
    );
}