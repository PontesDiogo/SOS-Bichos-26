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
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Navbar } from "../components/layout/Navbar";
import { PageContainer } from "../components/layout/PageContainer";
import { Footer } from "../components/layout/Footer";
import { listarTodasDenuncias } from "../services/denunciaService";
import type { Denuncia, StatusDenuncia, TipoDenuncia } from "../types/denuncia";
import { formatarDataHora } from "../utils/formatters";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface RelatoriosPageProps {
  userName?: string;
  avatarUrl?: string | null;
  onHome: () => void;
  onAdmin: () => void;
  onPerfil: () => void;
  onLogout: () => void;
}

type RelatorioAba =
  | "visao-geral"
  | "graficos"
  | "regioes"
  | "tabela"
  | "exportacoes";

type OrdenacaoCampo = "resumo" | "tipo" | "status" | "bairro" | "created_at";
type OrdenacaoDirecao = "asc" | "desc";

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

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

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

  const [abaAtiva, setAbaAtiva] = useState<RelatorioAba>("visao-geral");
  const [dataInicial, setDataInicial] = useState("");
  const [dataFinal, setDataFinal] = useState("");
  const [filtroStatus, setFiltroStatus] = useState<StatusDenuncia | "Todos">(
    "Todos"
  );
  const [filtroTipo, setFiltroTipo] = useState<TipoDenuncia | "Todos">("Todos");
  const [filtroBairro, setFiltroBairro] = useState("Todos");
  const [pesquisaTexto, setPesquisaTexto] = useState("");

  const [ordenacao, setOrdenacao] = useState<{
    campo: OrdenacaoCampo;
    direcao: OrdenacaoDirecao;
  }>({
    campo: "created_at",
    direcao: "desc",
  });

  const [filtrosAplicados, setFiltrosAplicados] = useState({
    dataInicial: "",
    dataFinal: "",
    status: "Todos" as StatusDenuncia | "Todos",
    tipo: "Todos" as TipoDenuncia | "Todos",
    bairro: "Todos",
    pesquisa: "",
  });

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

  const bairrosDisponiveis = useMemo(() => {
    return Array.from(
      new Set(
        denuncias.map(
          (denuncia) => denuncia.bairro?.trim() || "Bairro não informado"
        )
      )
    ).sort();
  }, [denuncias]);

  const denunciasFiltradas = useMemo(() => {
    return denuncias.filter((denuncia) => {
      const dataDenuncia = new Date(denuncia.created_at);

      const dentroDataInicial =
        !filtrosAplicados.dataInicial ||
        dataDenuncia >= new Date(`${filtrosAplicados.dataInicial}T00:00:00`);

      const dentroDataFinal =
        !filtrosAplicados.dataFinal ||
        dataDenuncia <= new Date(`${filtrosAplicados.dataFinal}T23:59:59`);

      const statusOk =
        filtrosAplicados.status === "Todos" ||
        denuncia.status === filtrosAplicados.status;

      const tipoOk =
        filtrosAplicados.tipo === "Todos" || denuncia.tipo === filtrosAplicados.tipo;

      const bairro = denuncia.bairro?.trim() || "Bairro não informado";
      const bairroOk =
        filtrosAplicados.bairro === "Todos" || bairro === filtrosAplicados.bairro;

      const termo = filtrosAplicados.pesquisa.trim().toLowerCase();
      const textoOk =
        !termo ||
        denuncia.resumo?.toLowerCase().includes(termo) ||
        denuncia.descricao?.toLowerCase().includes(termo);

      return (
        dentroDataInicial &&
        dentroDataFinal &&
        statusOk &&
        tipoOk &&
        bairroOk &&
        textoOk
      );
    });
  }, [denuncias, filtrosAplicados]);

  const denunciasOrdenadas = useMemo(() => {
    return [...denunciasFiltradas].sort((a, b) => {
      if (ordenacao.campo === "created_at") {
        const dataA = new Date(a.created_at).getTime();
        const dataB = new Date(b.created_at).getTime();
        return ordenacao.direcao === "asc" ? dataA - dataB : dataB - dataA;
      }

      const valorA = obterValorOrdenacao(a, ordenacao.campo);
      const valorB = obterValorOrdenacao(b, ordenacao.campo);

      const comparacao = valorA.localeCompare(valorB, "pt-BR", {
        sensitivity: "base",
      });

      return ordenacao.direcao === "asc" ? comparacao : -comparacao;
    });
  }, [denunciasFiltradas, ordenacao]);

  const indicadores = useMemo(() => {
    const total = denunciasFiltradas.length;

    const pendentes = denunciasFiltradas.filter(
      (denuncia) => denuncia.status === "Pendente"
    ).length;

    const emAnalise = denunciasFiltradas.filter(
      (denuncia) => denuncia.status === "Em análise"
    ).length;

    const emAtendimento = denunciasFiltradas.filter(
      (denuncia) => denuncia.status === "Em atendimento"
    ).length;

    const resolvidas = denunciasFiltradas.filter(
      (denuncia) => denuncia.status === "Resolvido"
    ).length;

    const canceladas = denunciasFiltradas.filter(
      (denuncia) => denuncia.status === "Cancelado"
    ).length;

    const naoResolvidas = denunciasFiltradas.filter(
      (denuncia) =>
        denuncia.status !== "Resolvido" && denuncia.status !== "Cancelado"
    ).length;

    const taxaResolucao = total > 0 ? Math.round((resolvidas / total) * 100) : 0;

    return {
      total,
      pendentes,
      emAnalise,
      emAtendimento,
      resolvidas,
      canceladas,
      naoResolvidas,
      taxaResolucao,
    };
  }, [denunciasFiltradas]);

  const dadosPorStatus = useMemo(() => {
    return STATUS_ORDEM.map((status) => ({
      nome: status,
      total: denunciasFiltradas.filter((denuncia) => denuncia.status === status)
        .length,
    }));
  }, [denunciasFiltradas]);

  const dadosPorTipo = useMemo(() => {
    return TIPOS_ORDEM.map((tipo) => ({
      nome: tipo,
      total: denunciasFiltradas.filter((denuncia) => denuncia.tipo === tipo)
        .length,
    })).filter((item) => item.total > 0);
  }, [denunciasFiltradas]);

  const rankingPorBairro = useMemo(() => {
    const contador = new Map<string, number>();

    denunciasFiltradas.forEach((denuncia) => {
      const bairro = denuncia.bairro?.trim() || "Bairro não informado";
      contador.set(bairro, (contador.get(bairro) || 0) + 1);
    });

    return Array.from(contador.entries())
      .map(([bairro, total]) => ({ bairro, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 8);
  }, [denunciasFiltradas]);

  const denunciasComLocalizacao = useMemo(() => {
    return denunciasFiltradas.filter(
      (denuncia) =>
        typeof denuncia.latitude === "number" &&
        typeof denuncia.longitude === "number"
    );
  }, [denunciasFiltradas]);

  const bairroMaisRecorrente = rankingPorBairro[0]?.bairro || "Sem dados";
  const tipoMaisRecorrente = dadosPorTipo.length
    ? [...dadosPorTipo].sort((a, b) => b.total - a.total)[0].nome
    : "Sem dados";

  function aplicarFiltros() {
    setFiltrosAplicados({
      dataInicial,
      dataFinal,
      status: filtroStatus,
      tipo: filtroTipo,
      bairro: filtroBairro,
      pesquisa: pesquisaTexto,
    });
  }

  function limparFiltros() {
    setDataInicial("");
    setDataFinal("");
    setFiltroStatus("Todos");
    setFiltroTipo("Todos");
    setFiltroBairro("Todos");
    setPesquisaTexto("");
    setFiltrosAplicados({
      dataInicial: "",
      dataFinal: "",
      status: "Todos",
      tipo: "Todos",
      bairro: "Todos",
      pesquisa: "",
    });
  }

  function alternarOrdenacao(campo: OrdenacaoCampo) {
    setOrdenacao((prev) => {
      if (prev.campo === campo) {
        return {
          campo,
          direcao: prev.direcao === "asc" ? "desc" : "asc",
        };
      }

      return {
        campo,
        direcao: campo === "created_at" ? "desc" : "asc",
      };
    });
  }
  function escaparCsv(valor: unknown) {
    const texto = String(valor ?? "Não informado");
    return `"${texto.replace(/"/g, '""')}"`;
  }

  function formatarValorCsv(valor: unknown, fallback = "Não informado") {
    if (valor === null || valor === undefined || valor === "") {
      return fallback;
    }

    return valor;
  }

  function montarNomeArquivoCsv() {
    const dataAtual = new Date().toISOString().slice(0, 10);

    const partesFiltro = [
      filtrosAplicados.dataInicial && `de-${filtrosAplicados.dataInicial}`,
      filtrosAplicados.dataFinal && `ate-${filtrosAplicados.dataFinal}`,
      filtrosAplicados.status !== "Todos" &&
      `status-${normalizarNomeArquivo(filtrosAplicados.status)}`,
      filtrosAplicados.tipo !== "Todos" &&
      `tipo-${normalizarNomeArquivo(filtrosAplicados.tipo)}`,
      filtrosAplicados.bairro !== "Todos" &&
      `bairro-${normalizarNomeArquivo(filtrosAplicados.bairro)}`,
    ].filter(Boolean);

    const sufixo = partesFiltro.length > 0 ? partesFiltro.join("_") : "geral";

    return `relatorio-denuncias-${sufixo}-${dataAtual}.csv`;
  }

  function normalizarNomeArquivo(valor: string) {
    return valor
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function exportarCsv() {

    const cabecalho = [
      "Data de criação",
      "Resumo",
      "Tipo da denúncia",
      "Status",
      "Bairro",
      "Endereço",
      "Descrição",
      "Usuário responsável",
      "Latitude",
      "Longitude",
    ];

    const linhas = denunciasFiltradas.map((denuncia) => [
      formatarDataHora(denuncia.created_at),
      formatarValorCsv(denuncia.resumo, "Denúncia sem resumo"),
      formatarValorCsv(denuncia.tipo),
      formatarValorCsv(denuncia.status),
      formatarValorCsv(denuncia.bairro, "Bairro não informado"),
      formatarValorCsv(denuncia.endereco, "Endereço não informado"),
      formatarValorCsv(denuncia.descricao, "Sem descrição"),
      denuncia.anonimo
        ? "Anônimo"
        : formatarValorCsv(denuncia.nome_usuario, "Usuário não informado"),
      formatarValorCsv(denuncia.latitude),
      formatarValorCsv(denuncia.longitude),
    ]);

    const conteudoCsv = [cabecalho, ...linhas]
      .map((linha) => linha.map(escaparCsv).join(";"))
      .join("\n");

    const blob = new Blob(["\uFEFF" + conteudoCsv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = montarNomeArquivoCsv();
    link.click();

    URL.revokeObjectURL(url);
  }

  function montarDescricaoFiltros() {
    const filtros = [
      filtrosAplicados.dataInicial
        ? `Data inicial: ${filtrosAplicados.dataInicial}`
        : "Data inicial: não definida",

      filtrosAplicados.dataFinal
        ? `Data final: ${filtrosAplicados.dataFinal}`
        : "Data final: não definida",

      `Status: ${filtrosAplicados.status}`,
      `Tipo: ${filtrosAplicados.tipo}`,
      `Bairro: ${filtrosAplicados.bairro}`,

      filtrosAplicados.pesquisa
        ? `Pesquisa: ${filtrosAplicados.pesquisa}`
        : "Pesquisa: não definida",
    ];

    return filtros.join(" | ");
  }

  function exportarPdf() {
    const documento = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    const dataGeracao = formatarDataHora(new Date().toISOString());

    documento.setFont("helvetica", "bold");
    documento.setFontSize(18);
    documento.text("Relatório de Denúncias - SOS Bichos", 14, 16);

    documento.setFont("helvetica", "normal");
    documento.setFontSize(10);
    documento.text(`Gerado em: ${dataGeracao}`, 14, 24);

    const descricaoFiltros = montarDescricaoFiltros();

    const linhasFiltro = documento.splitTextToSize(descricaoFiltros, 265);

    documento.setFont("helvetica", "bold");
    documento.text("Filtros aplicados:", 14, 32);

    documento.setFont("helvetica", "normal");
    documento.text(linhasFiltro, 14, 38);

    const inicioResumoY = 38 + linhasFiltro.length * 5 + 6;

    documento.setFont("helvetica", "bold");
    documento.setFontSize(12);
    documento.text("Resumo", 14, inicioResumoY);

    documento.setFont("helvetica", "normal");
    documento.setFontSize(10);

    const resumoTexto = [
      `Total de denúncias: ${indicadores.total}`,
      `Pendentes: ${indicadores.pendentes}`,
      `Em análise: ${indicadores.emAnalise}`,
      `Em atendimento: ${indicadores.emAtendimento}`,
      `Resolvidas: ${indicadores.resolvidas}`,
      `Canceladas: ${indicadores.canceladas}`,
      `Não resolvidas: ${indicadores.naoResolvidas}`,
    ];

    documento.text(resumoTexto.join(" | "), 14, inicioResumoY + 7);

    const linhasTabela = denunciasFiltradas.map((denuncia) => [
      formatarDataHora(denuncia.created_at),
      denuncia.resumo || "Denúncia sem resumo",
      denuncia.tipo || "Não informado",
      denuncia.status || "Não informado",
      denuncia.bairro || "Bairro não informado",
      denuncia.endereco || "Endereço não informado",
      denuncia.anonimo ? "Anônimo" : denuncia.nome_usuario || "Não informado",
    ]);

    autoTable(documento, {
      startY: inicioResumoY + 14,
      head: [[
        "Data",
        "Resumo",
        "Tipo",
        "Status",
        "Bairro",
        "Endereço",
        "Usuário",
      ]],
      body: linhasTabela,
      styles: {
        font: "helvetica",
        fontSize: 8,
        cellPadding: 2.4,
        overflow: "linebreak",
        valign: "top",
      },
      headStyles: {
        fillColor: [139, 94, 52],
        textColor: 255,
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [250, 247, 241],
      },
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 48 },
        2: { cellWidth: 28 },
        3: { cellWidth: 30 },
        4: { cellWidth: 34 },
        5: { cellWidth: 70 },
        6: { cellWidth: 32 },
      },
      margin: {
        left: 14,
        right: 14,
      },
      didDrawPage: (data) => {
        const pageCount = documento.getNumberOfPages();
        const pageSize = documento.internal.pageSize;
        const pageWidth = pageSize.getWidth();
        const pageHeight = pageSize.getHeight();

        documento.setFontSize(8);
        documento.setTextColor(120);
        documento.text(
          `SOS Bichos - Página ${data.pageNumber} de ${pageCount}`,
          pageWidth / 2,
          pageHeight - 8,
          { align: "center" }
        );
      },
    });

    const dataAtual = new Date().toISOString().slice(0, 10);
    documento.save(`relatorio-denuncias-${dataAtual}.pdf`);
  }

  function renderOrdenacaoIcon(campo: OrdenacaoCampo) {
    if (ordenacao.campo !== campo) return "↕";
    return ordenacao.direcao === "asc" ? "↑" : "↓";
  }

  return (
    <>
      <Navbar
        userName={userName}
        avatarUrl={avatarUrl}
        isAdmin
        onHome={onHome}
        onDenunciar={onHome}
        onAdmin={onAdmin}
        onRelatorios={() => undefined}
        onPerfil={onPerfil}
        onLogout={onLogout}
        onMinhasDenuncias={onHome}
      />

      <PageContainer>
        <section className="relatorios-header">
          <span className="section-tag">Relatórios</span>

          <h1>Visão geral das denúncias</h1>

          <p>
            Acompanhe os principais indicadores do sistema, filtre os dados por
            palavra-chave, período, status, tipo e bairro, e consulte análises
            visuais e geográficas das ocorrências.
          </p>
        </section>

        <section className="relatorios-toolbar">
          <div className="relatorios-tabs">
            <button
              type="button"
              className={abaAtiva === "visao-geral" ? "is-active" : ""}
              onClick={() => setAbaAtiva("visao-geral")}
            >
              Visão geral
            </button>

            <button
              type="button"
              className={abaAtiva === "graficos" ? "is-active" : ""}
              onClick={() => setAbaAtiva("graficos")}
            >
              Gráficos
            </button>

            <button
              type="button"
              className={abaAtiva === "regioes" ? "is-active" : ""}
              onClick={() => setAbaAtiva("regioes")}
            >
              Regiões
            </button>

            <button
              type="button"
              className={abaAtiva === "tabela" ? "is-active" : ""}
              onClick={() => setAbaAtiva("tabela")}
            >
              Tabela
            </button>

            <button
              type="button"
              className={abaAtiva === "exportacoes" ? "is-active" : ""}
              onClick={() => setAbaAtiva("exportacoes")}
            >
              Exportações
            </button>
          </div>

          <div className="relatorios-filtros">
            <div className="relatorios-filtro-search">
              <label>Pesquisar</label>
              <input
                type="search"
                value={pesquisaTexto}
                onChange={(e) => setPesquisaTexto(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    aplicarFiltros();
                  }
                }}
                placeholder="Buscar por resumo ou descrição"
              />
            </div>

            <div>
              <label>Data inicial</label>
              <input
                type="date"
                value={dataInicial}
                onChange={(e) => setDataInicial(e.target.value)}
              />
            </div>

            <div>
              <label>Data final</label>
              <input
                type="date"
                value={dataFinal}
                onChange={(e) => setDataFinal(e.target.value)}
              />
            </div>

            <div>
              <label>Status</label>
              <select
                value={filtroStatus}
                onChange={(e) =>
                  setFiltroStatus(e.target.value as StatusDenuncia | "Todos")
                }
              >
                <option value="Todos">Todos</option>
                {STATUS_ORDEM.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label>Tipo</label>
              <select
                value={filtroTipo}
                onChange={(e) =>
                  setFiltroTipo(e.target.value as TipoDenuncia | "Todos")
                }
              >
                <option value="Todos">Todos</option>
                {TIPOS_ORDEM.map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {tipo}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label>Bairro</label>
              <select
                value={filtroBairro}
                onChange={(e) => setFiltroBairro(e.target.value)}
              >
                <option value="Todos">Todos</option>
                {bairrosDisponiveis.map((bairro) => (
                  <option key={bairro} value={bairro}>
                    {bairro}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="relatorios-toolbar-footer">
            <span>{denunciasFiltradas.length} denúncia(s) encontradas</span>

            <div className="relatorios-filter-actions">
              <button
                type="button"
                className="relatorios-clear-button"
                onClick={limparFiltros}
              >
                Limpar busca
              </button>

              <button
                type="button"
                className="relatorios-search-button"
                onClick={aplicarFiltros}
              >
                Pesquisar
              </button>
            </div>
          </div>
        </section>

        {loading && <p>Carregando relatórios...</p>}

        {erro && <p className="form-error">{erro}</p>}

        {!loading && !erro && (
          <>
            {abaAtiva === "visao-geral" && (
              <section className="relatorios-section">
                <div className="relatorios-section-header">
                  <div>
                    <span className="section-tag">Visão geral</span>
                    <h2>Resumo operacional</h2>
                  </div>

                  <p>
                    Indicadores principais considerando os filtros selecionados.
                  </p>
                </div>

                <section className="relatorios-overview-dashboard">
                  <article className="relatorio-hero-card">
                    <span>Total filtrado</span>
                    <strong>{indicadores.total}</strong>
                    <p>
                      Denúncias encontradas conforme os filtros aplicados no
                      relatório.
                    </p>
                  </article>

                  <div className="relatorio-insights-grid">
                    <article className="relatorio-insight-card">
                      <span>Taxa de resolução</span>
                      <strong>{indicadores.taxaResolucao}%</strong>
                      <p>{indicadores.resolvidas} denúncia(s) resolvida(s).</p>
                    </article>

                    <article className="relatorio-insight-card">
                      <span>Em aberto</span>
                      <strong>{indicadores.naoResolvidas}</strong>
                      <p>Pendentes, em análise ou em atendimento.</p>
                    </article>

                    <article className="relatorio-insight-card">
                      <span>Bairro mais recorrente</span>
                      <strong>{bairroMaisRecorrente}</strong>
                      <p>Região com maior concentração nos filtros atuais.</p>
                    </article>

                    <article className="relatorio-insight-card">
                      <span>Tipo mais recorrente</span>
                      <strong>{tipoMaisRecorrente}</strong>
                      <p>Categoria mais frequente nas denúncias filtradas.</p>
                    </article>
                  </div>
                </section>

                <section className="relatorios-grid relatorios-grid--compact">
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

                <article className="relatorio-summary-note">
                  <strong>Resumo do período:</strong>{" "}
                  {indicadores.total === 0
                    ? "nenhuma denúncia encontrada para os filtros selecionados."
                    : `foram encontradas ${indicadores.total} denúncia(s), com ${indicadores.naoResolvidas} ainda em aberto e ${indicadores.resolvidas} já resolvida(s).`}
                </article>
              </section>
            )}

            {abaAtiva === "graficos" && (
              <section className="relatorios-section">
                <div className="relatorios-section-header">
                  <div>
                    <span className="section-tag">Gráficos</span>
                    <h2>Análise visual das denúncias</h2>
                  </div>

                  <p>
                    Distribuição por status e tipo de ocorrência com base nos
                    filtros selecionados.
                  </p>
                </div>

                <section className="relatorios-charts-grid">
                  <article className="relatorio-chart-card">
                    <div className="relatorio-chart-header">
                      <div>
                        <span className="section-tag">Status</span>
                        <h3>Denúncias por status</h3>
                      </div>
                    </div>

                    <div className="relatorio-chart">
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={dadosPorStatus}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="nome" tick={{ fontSize: 12 }} />
                          <YAxis allowDecimals={false} />
                          <Tooltip />
                          <Bar
                            dataKey="total"
                            name="Denúncias"
                            radius={[10, 10, 0, 0]}
                          >
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
                        <h3>Denúncias por tipo</h3>
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
                              ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                  </article>
                </section>
              </section>
            )}

            {abaAtiva === "regioes" && (
              <section className="relatorios-section">
                <div className="relatorios-section-header">
                  <div>
                    <span className="section-tag">Regiões</span>
                    <h2>Distribuição regional</h2>
                  </div>

                  <p>
                    Ranking por bairro e mapa geográfico das ocorrências
                    registradas.
                  </p>
                </div>

                <section className="relatorios-ranking-section">
                  <div className="relatorio-chart-header">
                    <div>
                      <span className="section-tag">Ranking</span>
                      <h3>Bairros com mais denúncias</h3>
                    </div>
                  </div>

                  <div className="ranking-list">
                    {rankingPorBairro.length === 0 ? (
                      <p className="empty-chart-message">
                        Ainda não há dados suficientes para gerar o ranking por
                        bairro.
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
                                width: `${(item.total / rankingPorBairro[0].total) * 100
                                  }%`,
                              }}
                            />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </section>

                <section className="relatorios-map-section">
                  <div className="relatorio-chart-header">
                    <div>
                      <span className="section-tag">Mapa</span>
                      <h3>Distribuição das denúncias</h3>
                    </div>
                  </div>

                  <p className="relatorios-map-description">
                    Visualize a distribuição geográfica das denúncias
                    registradas. O mapa é iniciado em Itu/SP e se ajusta
                    automaticamente conforme aparecem ocorrências em outras
                    regiões.
                  </p>

                  <div className="relatorios-map-box">
                    {denunciasComLocalizacao.length === 0 ? (
                      <div className="empty-map-message">
                        Ainda não há denúncias com localização para exibir no
                        mapa.
                      </div>
                    ) : (
                      <MapContainer
                        center={[-23.2642, -47.2992]}
                        zoom={13}
                        className="relatorios-map"
                        scrollWheelZoom={false}
                      >
                        <TileLayer
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        <AjustarMapa denuncias={denunciasComLocalizacao} />

                        {denunciasComLocalizacao.map((denuncia) => (
                          <Marker
                            key={denuncia.id}
                            position={[denuncia.latitude!, denuncia.longitude!]}
                            icon={markerIcon}
                          >
                            <Popup>
                              <strong>
                                {denuncia.resumo || "Denúncia sem resumo"}
                              </strong>
                              <br />
                              {denuncia.tipo}
                              <br />
                              Status: {denuncia.status}
                              <br />
                              {denuncia.bairro ||
                                denuncia.endereco ||
                                "Local não informado"}
                            </Popup>
                          </Marker>
                        ))}
                      </MapContainer>
                    )}
                  </div>
                </section>
              </section>
            )}

            {abaAtiva === "tabela" && (
              <section className="relatorios-section">
                <div className="relatorios-section-header">
                  <div>
                    <span className="section-tag">Tabela</span>
                    <h2>Dados detalhados</h2>
                  </div>

                  <p>
                    Listagem das denúncias considerando os filtros selecionados.
                    Clique nos cabeçalhos para ordenar os dados.
                  </p>
                </div>

                <div className="relatorios-table-wrap">
                  <table className="relatorios-table">
                    <thead>
                      <tr>
                        <th>
                          <button
                            type="button"
                            className="relatorios-sort-button"
                            onClick={() => alternarOrdenacao("resumo")}
                          >
                            Resumo {renderOrdenacaoIcon("resumo")}
                          </button>
                        </th>
                        <th>
                          <button
                            type="button"
                            className="relatorios-sort-button"
                            onClick={() => alternarOrdenacao("tipo")}
                          >
                            Tipo {renderOrdenacaoIcon("tipo")}
                          </button>
                        </th>
                        <th>
                          <button
                            type="button"
                            className="relatorios-sort-button"
                            onClick={() => alternarOrdenacao("status")}
                          >
                            Status {renderOrdenacaoIcon("status")}
                          </button>
                        </th>
                        <th>
                          <button
                            type="button"
                            className="relatorios-sort-button"
                            onClick={() => alternarOrdenacao("bairro")}
                          >
                            Bairro {renderOrdenacaoIcon("bairro")}
                          </button>
                        </th>
                        <th>
                          <button
                            type="button"
                            className="relatorios-sort-button"
                            onClick={() => alternarOrdenacao("created_at")}
                          >
                            Data {renderOrdenacaoIcon("created_at")}
                          </button>
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {denunciasOrdenadas.length === 0 ? (
                        <tr>
                          <td colSpan={5}>Nenhuma denúncia encontrada.</td>
                        </tr>
                      ) : (
                        denunciasOrdenadas.map((denuncia) => (
                          <tr key={denuncia.id}>
                            <td>{denuncia.resumo || "Denúncia sem resumo"}</td>
                            <td>{denuncia.tipo}</td>
                            <td>{denuncia.status}</td>
                            <td>{denuncia.bairro || "Bairro não informado"}</td>
                            <td>{formatarDataHora(denuncia.created_at)}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {abaAtiva === "exportacoes" && (
              <section className="relatorios-section">
                <div className="relatorios-section-header">
                  <div>
                    <span className="section-tag">Exportações</span>
                    <h2>Gerar arquivos de relatório</h2>
                  </div>

                  <p>
                    Exporte os dados filtrados em formatos como PDF, XML e CSV.
                  </p>
                </div>

                <div className="exportacoes-card">
                  <h3>Exportar dados filtrados</h3>

                  <p>
                    Os arquivos gerados consideram os filtros aplicados no topo da página,
                    incluindo período, status, tipo, bairro e palavra-chave.
                  </p>

                  <div className="exportacoes-actions">
                    <button
                      type="button"
                      onClick={exportarPdf}
                      disabled={denunciasFiltradas.length === 0}
                    >
                      Exportar PDF
                    </button>

                    <button type="button" disabled>
                      Exportar XML em breve
                    </button>

                    <button
                      type="button"
                      onClick={exportarCsv}
                      disabled={denunciasFiltradas.length === 0}
                    >
                      Exportar CSV
                    </button>
                  </div>
                </div>
              </section>
            )}
          </>
        )}
      </PageContainer>

      <Footer />
    </>
  );
}

function obterValorOrdenacao(denuncia: Denuncia, campo: OrdenacaoCampo) {
  if (campo === "bairro") return denuncia.bairro || "Bairro não informado";
  return String(denuncia[campo] || "");
}

function AjustarMapa({ denuncias }: { denuncias: Denuncia[] }) {
  const map = useMap();

  useEffect(() => {
    const pontos = denuncias
      .filter(
        (denuncia) =>
          typeof denuncia.latitude === "number" &&
          typeof denuncia.longitude === "number"
      )
      .map(
        (denuncia) => [denuncia.latitude!, denuncia.longitude!] as [number, number]
      );

    if (pontos.length === 0) return;

    if (pontos.length === 1) {
      map.setView(pontos[0], 14);
      return;
    }

    const bounds = L.latLngBounds(pontos);
    map.fitBounds(bounds, { padding: [40, 40] });
  }, [denuncias, map]);

  return null;
}
