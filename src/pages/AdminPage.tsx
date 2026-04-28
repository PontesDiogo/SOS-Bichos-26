import { useEffect, useMemo, useState } from "react";
import { Navbar } from "../components/layout/Navbar";
import { PageContainer } from "../components/layout/PageContainer";
import { Footer } from "../components/layout/Footer";
import { formatarDataHora } from "../utils/formatters";
import {
  listarTodasDenuncias,
  atualizarStatusDenuncia,
} from "../services/denunciaService";
import type { Denuncia, StatusDenuncia, TipoDenuncia } from "../types/denuncia";
import type { DenunciaFeedback } from "../types/feedback";
import {
  criarFeedbackDenuncia,
  listarFeedbacksPorDenuncia,
} from "../services/feedbackService";

interface AdminPageProps {
  userName?: string;
  avatarUrl?: string | null;
  onHome: () => void;
  onPerfil: () => void;
  onLogout: () => void;
  onRelatorios: () => void;
}

export function AdminPage({
  userName,
  avatarUrl,
  onHome,
  onPerfil,
  onLogout,
  onRelatorios,
}: AdminPageProps) {
  const [denuncias, setDenuncias] = useState<Denuncia[]>([]);
  const [denunciaSelecionada, setDenunciaSelecionada] =
    useState<Denuncia | null>(null);

  const [feedbacks, setFeedbacks] = useState<DenunciaFeedback[]>([]);

  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  const [filtroStatus, setFiltroStatus] =
    useState<StatusDenuncia | "Todos">("Todos");
  const [filtroTipo, setFiltroTipo] = useState<TipoDenuncia | "Todos">("Todos");

  const [modalStatusAberto, setModalStatusAberto] = useState(false);
  const [novoStatus, setNovoStatus] = useState<StatusDenuncia>("Pendente");
  const [descricaoFeedback, setDescricaoFeedback] = useState("");
  const [proximaAcao, setProximaAcao] = useState("");
  const [colaboradorNome, setColaboradorNome] = useState("");
  const [colaboradorContato, setColaboradorContato] = useState("");
  const [salvandoStatus, setSalvandoStatus] = useState(false);

  const denunciasFiltradas = useMemo(() => {
    return denuncias.filter((denuncia) => {
      const statusOk =
        filtroStatus === "Todos" || denuncia.status === filtroStatus;

      const tipoOk = filtroTipo === "Todos" || denuncia.tipo === filtroTipo;

      return statusOk && tipoOk;
    });
  }, [denuncias, filtroStatus, filtroTipo]);

  async function carregarFeedbacks(denunciaId: string) {
    try {
      const data = await listarFeedbacksPorDenuncia(denunciaId);
      setFeedbacks(data);
    } catch (error) {
      console.error(error);
      setFeedbacks([]);
    }
  }

  async function carregarDenunciasAdmin(denunciaIdParaManter?: string) {
    try {
      setLoading(true);
      setErro("");

      const data = await listarTodasDenuncias();

      setDenuncias(data);

      const denunciaAtualizada =
        data.find((denuncia) => denuncia.id === denunciaIdParaManter) ??
        data[0] ??
        null;

      setDenunciaSelecionada(denunciaAtualizada);

      if (denunciaAtualizada) {
        await carregarFeedbacks(denunciaAtualizada.id);
      } else {
        setFeedbacks([]);
      }
    } catch (error) {
      console.error(error);
      setErro("Não foi possível carregar as denúncias.");
    } finally {
      setLoading(false);
    }
  }

  function abrirModalAtualizacaoStatus(statusSelecionado: StatusDenuncia) {
    if (!denunciaSelecionada) return;

    setNovoStatus(statusSelecionado);
    setDescricaoFeedback("");
    setProximaAcao("");
    setColaboradorNome("");
    setColaboradorContato("");
    setModalStatusAberto(true);
  }

  function fecharModalAtualizacaoStatus() {
    setModalStatusAberto(false);
    setDescricaoFeedback("");
    setProximaAcao("");
    setColaboradorNome("");
    setColaboradorContato("");
  }

  async function handleConfirmarAtualizacaoStatus() {
    if (!denunciaSelecionada) return;

    if (!descricaoFeedback.trim()) {
      alert("Informe uma breve descrição da atualização.");
      return;
    }

    try {
      setSalvandoStatus(true);

      await atualizarStatusDenuncia(denunciaSelecionada.id, novoStatus);

      await criarFeedbackDenuncia({
        denuncia_id: denunciaSelecionada.id,
        status_novo: novoStatus,
        descricao: descricaoFeedback.trim(),
        proxima_acao: proximaAcao.trim() || undefined,
        colaborador_nome: colaboradorNome.trim() || undefined,
        colaborador_contato: colaboradorContato.trim() || undefined,
      });

      await carregarDenunciasAdmin(denunciaSelecionada.id);

      fecharModalAtualizacaoStatus();

      alert("Status atualizado e feedback registrado com sucesso.");
    } catch (error) {
      console.error(error);
      alert("Não foi possível atualizar o status da denúncia.");
    } finally {
      setSalvandoStatus(false);
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
        onRelatorios={onRelatorios}
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

        <section className="admin-filters">
          <div className="form-group">
            <label className="form-label">Filtrar por status</label>
            <select
              value={filtroStatus}
              onChange={(e) =>
                setFiltroStatus(e.target.value as StatusDenuncia | "Todos")
              }
            >
              <option value="Todos">Todos</option>
              <option value="Pendente">Pendente</option>
              <option value="Em análise">Em análise</option>
              <option value="Em atendimento">Em atendimento</option>
              <option value="Resolvido">Resolvido</option>
              <option value="Cancelado">Cancelado</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Filtrar por tipo</label>
            <select
              value={filtroTipo}
              onChange={(e) =>
                setFiltroTipo(e.target.value as TipoDenuncia | "Todos")
              }
            >
              <option value="Todos">Todos</option>
              <option value="Maus-tratos">Maus-tratos</option>
              <option value="Abandono">Abandono</option>
              <option value="Animal ferido">Animal ferido</option>
              <option value="Infestação">Infestação</option>
              <option value="Outros">Outros</option>
            </select>
          </div>
        </section>

        {loading && <p>Carregando denúncias...</p>}

        {erro && <p className="form-error">{erro}</p>}

        {!loading && !erro && denuncias.length === 0 && (
          <p>Nenhuma denúncia cadastrada até o momento.</p>
        )}

        {!loading && !erro && denuncias.length > 0 && (
          <>
            {denunciasFiltradas.length === 0 ? (
              <p>Nenhuma denúncia encontrada com os filtros selecionados.</p>
            ) : (
              <section className="admin-panel">
                <div className="admin-list">
                  {denunciasFiltradas.map((denuncia) => (
                    <button
                      key={denuncia.id}
                      type="button"
                      className={`admin-list-item ${
                        denunciaSelecionada?.id === denuncia.id
                          ? "is-selected"
                          : ""
                      }`}
                      onClick={() => {
                        setDenunciaSelecionada(denuncia);
                        carregarFeedbacks(denuncia.id);
                      }}
                    >
                      <div>
                        <strong>{denuncia.resumo || "Denúncia sem resumo"}</strong>
                        <span>{denuncia.tipo}</span>
                        <small>{formatarDataHora(denuncia.created_at)}</small>
                        <small>{denuncia.endereco || "Local não informado"}</small>
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
                            <h2>
                              {denunciaSelecionada.resumo ||
                                "Denúncia sem resumo"}
                            </h2>
                          </div>

                          <span className="status-pill">
                            {denunciaSelecionada.status}
                          </span>
                        </div>

                        <p>{denunciaSelecionada.descricao}</p>

                        <div className="admin-status-control">
                          <label className="form-label">Atualizar status</label>

                          <select
                            value={denunciaSelecionada.status}
                            onChange={(e) =>
                              abrirModalAtualizacaoStatus(
                                e.target.value as StatusDenuncia
                              )
                            }
                            disabled={salvandoStatus}
                          >
                            <option value="Pendente">Pendente</option>
                            <option value="Em análise">Em análise</option>
                            <option value="Em atendimento">Em atendimento</option>
                            <option value="Resolvido">Resolvido</option>
                            <option value="Cancelado">Cancelado</option>
                          </select>
                        </div>

                        <div className="admin-detail-grid">
                          <div>
                            <strong>Usuário</strong>
                            <span>
                              {denunciaSelecionada.anonimo
                                ? "Anônimo"
                                : denunciaSelecionada.nome_usuario ||
                                  "Não informado"}
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

                        <div className="feedback-box">
                          <h3>Histórico de atualizações</h3>

                          {feedbacks.length === 0 ? (
                            <p>Nenhum feedback registrado ainda.</p>
                          ) : (
                            feedbacks.map((feedback) => (
                              <div key={feedback.id} className="feedback-item">
                                <div className="feedback-item__header">
                                  <strong>{feedback.status_novo}</strong>
                                  <small>
                                    {formatarDataHora(feedback.created_at)}
                                  </small>
                                </div>

                                <p>{feedback.descricao}</p>

                                {feedback.proxima_acao && (
                                  <p>
                                    <strong>Próxima ação:</strong>{" "}
                                    {feedback.proxima_acao}
                                  </p>
                                )}

                                <div className="feedback-internal">
                                  {feedback.colaborador_nome && (
                                    <span>
                                      <strong>Responsável:</strong>{" "}
                                      {feedback.colaborador_nome}
                                    </span>
                                  )}

                                  {feedback.colaborador_contato && (
                                    <span>
                                      <strong>Contato:</strong>{" "}
                                      {feedback.colaborador_contato}
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </>
                  ) : (
                    <p>Selecione uma denúncia para visualizar os detalhes.</p>
                  )}
                </article>
              </section>
            )}
          </>
        )}
      </PageContainer>

      {modalStatusAberto && denunciaSelecionada && (
        <div className="modal-overlay">
          <div className="modal-content modal-content--small">
            <h3>Confirmar atualização</h3>

            <p className="modal-text">
              Você está alterando o status para <strong>{novoStatus}</strong>.
              Informe os detalhes para registrar o feedback da denúncia.
            </p>

            <div className="form-group">
              <label className="form-label">Descrição da atualização</label>
              <textarea
                rows={4}
                value={descricaoFeedback}
                onChange={(e) => setDescricaoFeedback(e.target.value)}
                placeholder="Ex: Ocorrência encaminhada para avaliação da equipe responsável."
              />
            </div>

            <div className="form-group">
              <label className="form-label">Próxima ação</label>
              <input
                value={proximaAcao}
                onChange={(e) => setProximaAcao(e.target.value)}
                placeholder="Ex: Aguardar vistoria no local."
              />
            </div>

            <div className="form-group">
              <label className="form-label">Colaborador designado</label>
              <input
                value={colaboradorNome}
                onChange={(e) => setColaboradorNome(e.target.value)}
                placeholder="Nome do responsável"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Contato do colaborador</label>
              <input
                value={colaboradorContato}
                onChange={(e) => setColaboradorContato(e.target.value)}
                placeholder="Telefone ou e-mail interno"
              />
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={fecharModalAtualizacaoStatus}
                disabled={salvandoStatus}
              >
                Cancelar
              </button>

              <button
                type="button"
                className="primary-button"
                onClick={handleConfirmarAtualizacaoStatus}
                disabled={salvandoStatus}
              >
                {salvandoStatus ? "Salvando..." : "Confirmar atualização"}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
