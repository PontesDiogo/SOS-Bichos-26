import { useEffect, useState } from "react";
import type { Denuncia, TipoDenuncia } from "../../types/denuncia";
import { TIPOS_DENUNCIA } from "../../utils/constants";
import { editarDenuncia } from "../../services/denunciaService";

interface EditarDenunciaModalProps {
  denuncia: Denuncia | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdated: () => void;
}

export function EditarDenunciaModal({
  denuncia,
  isOpen,
  onClose,
  onUpdated,
}: EditarDenunciaModalProps) {
  const [resumo, setResumo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [tipo, setTipo] = useState<TipoDenuncia>("Maus-tratos");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (denuncia && isOpen) {
      setResumo(denuncia.resumo || "");
      setDescricao(denuncia.descricao || "");
      setTipo((denuncia.tipo as TipoDenuncia) || "Maus-tratos");
      setErro("");
    }
  }, [denuncia, isOpen]);

  if (!isOpen || !denuncia) return null;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!denuncia) return;

    if (denuncia.status !== "Pendente") {
      setErro("Só é possível editar denúncias pendentes.");
      return;
    }

    try {
      setLoading(true);
      setErro("");

      await editarDenuncia(denuncia.id, {
        resumo,
        descricao,
        tipo,
      });

      onUpdated();
      onClose();
    } catch (error) {
      console.error(error);
      setErro("Não foi possível editar a denúncia.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content editar-denuncia-modal">
        <div className="modal-header">
          <div>
            <h2>Editar denúncia</h2>
            <p>Você pode editar a denúncia enquanto ela estiver pendente.</p>
          </div>

          <button type="button" onClick={onClose}>
            Fechar
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Resumo</label>
            <input
              value={resumo}
              onChange={(e) => setResumo(e.target.value)}
              maxLength={120}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Tipo</label>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value as TipoDenuncia)}
            >
              {TIPOS_DENUNCIA.map((tipoItem) => (
                <option key={tipoItem} value={tipoItem}>
                  {tipoItem}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Descrição</label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              rows={5}
              required
            />
          </div>

          {erro && <p className="form-error">{erro}</p>}

          <div className="modal-actions modal-actions--edit">
            <button type="button" className="secondary-button" onClick={onClose}>
              Cancelar
            </button>

            <button type="submit" className="primary-button" disabled={loading}>
              {loading ? "Salvando..." : "Salvar alterações"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}