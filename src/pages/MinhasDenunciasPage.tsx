import { useMemo, useState } from "react";
import { Navbar } from "../components/layout/Navbar";
import { PageContainer } from "../components/layout/PageContainer";
import { Footer } from "../components/layout/Footer";
import { DenunciaList } from "../components/denuncia/DenunciaList";
import { useDenuncias } from "../hooks/useDenuncia";
import type { StatusDenuncia, TipoDenuncia } from "../types/denuncia";
import { TIPOS_DENUNCIA } from "../utils/constants";


interface MinhasDenunciasPageProps {
    userId: string;
    userName?: string;
    avatarUrl?: string | null;
    isAdmin?: boolean;
    onHome: () => void;
    onDenunciar: () => void;
    onPerfil: () => void;
    onAdmin?: () => void;
    onRelatorios?: () => void;
    onLogout: () => void;
}

const STATUS_DENUNCIA: Array<StatusDenuncia | "Todos"> = [
    "Todos",
    "Pendente",
    "Em análise",
    "Em atendimento",
    "Resolvido",
    "Cancelado",
];

export function MinhasDenunciasPage({
    userId,
    userName,
    avatarUrl,
    isAdmin,
    onHome,
    onDenunciar,
    onPerfil,
    onAdmin,
    onRelatorios,
    onLogout,
}: MinhasDenunciasPageProps) {
    const { denuncias, loading, erro, carregarDenuncias } = useDenuncias({
        userId,
        isAdmin: false,
    });

    const [filtroStatus, setFiltroStatus] =
        useState<StatusDenuncia | "Todos">("Todos");

    const [filtroTipo, setFiltroTipo] = useState<TipoDenuncia | "Todos">("Todos");
    const [pesquisa, setPesquisa] = useState("");

    const denunciasFiltradas = useMemo(() => {
        const termo = pesquisa.trim().toLowerCase();

        return denuncias.filter((denuncia) => {
            const statusOk =
                filtroStatus === "Todos" || denuncia.status === filtroStatus;

            const tipoOk = filtroTipo === "Todos" || denuncia.tipo === filtroTipo;

            const textoOk =
                !termo ||
                denuncia.resumo?.toLowerCase().includes(termo) ||
                denuncia.descricao?.toLowerCase().includes(termo) ||
                denuncia.endereco?.toLowerCase().includes(termo) ||
                denuncia.bairro?.toLowerCase().includes(termo);

            return statusOk && tipoOk && textoOk;
        });
    }, [denuncias, filtroStatus, filtroTipo, pesquisa]);

    const resumo = useMemo(() => {
        return {
            total: denuncias.length,
            pendentes: denuncias.filter((denuncia) => denuncia.status === "Pendente")
                .length,
            emAndamento: denuncias.filter(
                (denuncia) =>
                    denuncia.status === "Em análise" ||
                    denuncia.status === "Em atendimento"
            ).length,
            resolvidas: denuncias.filter(
                (denuncia) => denuncia.status === "Resolvido"
            ).length,
        };
    }, [denuncias]);

    function limparFiltros() {
        setFiltroStatus("Todos");
        setFiltroTipo("Todos");
        setPesquisa("");
    }

    return (
        <>
            <Navbar
                userName={userName}
                avatarUrl={avatarUrl}
                isAdmin={isAdmin}
                onHome={onHome}
                onDenunciar={onDenunciar}
                onMinhasDenuncias={() => undefined}
                onPerfil={onPerfil}
                onAdmin={onAdmin}
                onRelatorios={onRelatorios}
                onLogout={onLogout}
            />

            <PageContainer>
                <section className="minhas-denuncias-header">
                    <span className="section-tag">Acompanhamento</span>

                    <h1>Minhas denúncias</h1>

                    <p>
                        Consulte suas ocorrências registradas, acompanhe o andamento,
                        visualize atualizações da administração e edite ou cancele denúncias
                        enquanto ainda estiverem pendentes.
                    </p>
                </section>

                <section className="minhas-denuncias-summary">
                    <article>
                        <span>Total</span>
                        <strong>{resumo.total}</strong>
                        <p>Denúncias registradas por você.</p>
                    </article>

                    <article>
                        <span>Pendentes</span>
                        <strong>{resumo.pendentes}</strong>
                        <p>Aguardando análise inicial.</p>
                    </article>

                    <article>
                        <span>Em andamento</span>
                        <strong>{resumo.emAndamento}</strong>
                        <p>Em análise ou atendimento.</p>
                    </article>

                    <article>
                        <span>Resolvidas</span>
                        <strong>{resumo.resolvidas}</strong>
                        <p>Ocorrências finalizadas.</p>
                    </article>
                </section>

                <section className="minhas-denuncias-toolbar">
                    <div className="form-group">
                        <label className="form-label">Pesquisar</label>
                        <input
                            type="search"
                            value={pesquisa}
                            onChange={(e) => setPesquisa(e.target.value)}
                            placeholder="Buscar por resumo, descrição, endereço ou bairro"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Status</label>
                        <select
                            value={filtroStatus}
                            onChange={(e) =>
                                setFiltroStatus(e.target.value as StatusDenuncia | "Todos")
                            }
                        >
                            {STATUS_DENUNCIA.map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Tipo</label>
                        <select
                            value={filtroTipo}
                            onChange={(e) =>
                                setFiltroTipo(e.target.value as TipoDenuncia | "Todos")
                            }
                        >
                            <option value="Todos">Todos</option>

                            {TIPOS_DENUNCIA.map((tipo) => (
                                <option key={tipo} value={tipo}>
                                    {tipo}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="minhas-denuncias-toolbar__actions">
                        <button
                            type="button"
                            className="secondary-button"
                            onClick={limparFiltros}
                        >
                            Limpar filtros
                        </button>

                        <button type="button" className="primary-button" onClick={onDenunciar}>
                            Nova denúncia
                        </button>
                    </div>
                </section>

                <section className="minhas-denuncias-result-info">
                    <strong>{denunciasFiltradas.length}</strong>
                    <span>denúncia(s) encontrada(s)</span>
                </section>

                <section className="minhas-denuncias-panel">
                    <DenunciaList
                        denuncias={denunciasFiltradas}
                        loading={loading}
                        erro={erro}
                        onUpdated={carregarDenuncias}
                    />
                </section>
            </PageContainer>

            <Footer
                currentPage="minhas-denuncias"
                isAdmin={isAdmin}
                onHome={onHome}
                onDenunciar={onDenunciar}
                onAdmin={onAdmin}
                onRelatorios={onRelatorios}
            />
        </>
    );
}