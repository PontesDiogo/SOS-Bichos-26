import { useState } from "react";
import type { Endereco } from "../../types/endereco";
import { buscarEnderecoPorCep } from "../../services/cepService";
import { formatarCep } from "../../utils/formatters";
import { MapaSelector } from "../mapa/MapaSelector";

interface EnderecoModalProps {
  isOpen: boolean;
  initialEndereco?: Endereco;
  initialLatitude?: number | null;
  initialLongitude?: number | null;
  onClose: () => void;
  onConfirm: (data: {
    endereco: Endereco;
    latitude: number | null;
    longitude: number | null;
  }) => void;
}

const emptyEndereco: Endereco = {
  cep: "",
  rua: "",
  numero: "",
  cidade: "",
  estado: "",
};

export function EnderecoModal({
  isOpen,
  initialEndereco,
  initialLatitude = null,
  initialLongitude = null,
  onClose,
  onConfirm,
}: EnderecoModalProps) {
  const [endereco, setEndereco] = useState<Endereco>(
    initialEndereco || emptyEndereco
  );
  const [latitude, setLatitude] = useState<number | null>(initialLatitude);
  const [longitude, setLongitude] = useState<number | null>(initialLongitude);
  const [loadingCep, setLoadingCep] = useState(false);
  const [erro, setErro] = useState("");

  if (!isOpen) return null;

  function updateField(field: keyof Endereco, value: string) {
    setEndereco((prev) => ({
      ...prev,
      [field]: field === "cep" ? formatarCep(value) : value,
    }));
  }

  async function handleBuscarCep() {
    try {
      setErro("");
      setLoadingCep(true);

      const enderecoEncontrado = await buscarEnderecoPorCep(endereco.cep);

      setEndereco((prev) => ({
        ...prev,
        ...enderecoEncontrado,
        numero: prev.numero,
      }));
    } catch {
      setErro("Não foi possível encontrar o CEP informado.");
    } finally {
      setLoadingCep(false);
    }
  }

  function handleConfirm() {
    onConfirm({
      endereco,
      latitude,
      longitude,
    });
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content endereco-modal">
        <div className="modal-header">
          <div>
            <h2>Endereço da ocorrência</h2>
            <p>Informe o endereço ou marque a localização no mapa.</p>
          </div>

          <button type="button" onClick={onClose}>
            Fechar
          </button>
        </div>

        <div className="form-grid">
          <div>
            <label className="form-label">CEP</label>
            <input
              value={endereco.cep}
              onChange={(e) => updateField("cep", e.target.value)}
              placeholder="00000-000"
            />
          </div>

          <div className="form-action-field">
            <button type="button" onClick={handleBuscarCep} disabled={loadingCep}>
              {loadingCep ? "Buscando..." : "Buscar por CEP"}
            </button>
          </div>

          <div>
            <label className="form-label">Rua</label>
            <input
              value={endereco.rua}
              onChange={(e) => updateField("rua", e.target.value)}
              placeholder="Rua / Avenida"
            />
          </div>

          <div>
            <label className="form-label">Número</label>
            <input
              value={endereco.numero}
              onChange={(e) => updateField("numero", e.target.value)}
              placeholder="Nº"
            />
          </div>

          <div>
            <label className="form-label">Cidade</label>
            <input
              value={endereco.cidade}
              onChange={(e) => updateField("cidade", e.target.value)}
              placeholder="Cidade"
            />
          </div>

          <div>
            <label className="form-label">Estado</label>
            <input
              value={endereco.estado}
              onChange={(e) => updateField("estado", e.target.value)}
              placeholder="UF"
            />
          </div>
        </div>

        {erro && <p className="form-error">{erro}</p>}

        <button
          type="button"
          className="link-button"
          onClick={() =>
            setEndereco({
              ...endereco,
              cep: "",
            })
          }
        >
          Não sei meu CEP
        </button>

        <MapaSelector
          latitude={latitude}
          longitude={longitude}
          onChange={({ latitude, longitude }) => {
            setLatitude(latitude);
            setLongitude(longitude);
          }}
        />

        <div className="modal-actions">
          <button type="button" onClick={onClose}>
            Cancelar
          </button>

          <button type="button" className="primary-button" onClick={handleConfirm}>
            Confirmar endereço
          </button>
        </div>
      </div>
    </div>
  );
}