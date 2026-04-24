import { useState } from "react";
import type { Endereco } from "../../types/endereco";
import type { TipoDenuncia } from "../../types/denuncia";
import { TIPOS_DENUNCIA } from "../../utils/constants";
import { criarDenuncia } from "../../services/denunciaService";
import { uploadFotoDenuncia } from "../../services/storageService";
import { PhotoUpload } from "./PhotoUpload";
import { EnderecoModal } from "../endereco/EnderecoModal";

interface DenunciaFormProps {
  userId: string;
  nomeUsuario: string;
  onCreated?: () => void;
}

const emptyEndereco: Endereco = {
  cep: "",
  rua: "",
  numero: "",
  cidade: "",
  estado: "",
};

export function DenunciaForm({
  userId,
  nomeUsuario,
  onCreated,
}: DenunciaFormProps) {
  const [resumo, setResumo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [tipo, setTipo] = useState<TipoDenuncia>("Maus-tratos");
  const [anonimo, setAnonimo] = useState(false);

  const [foto, setFoto] = useState<File | null>(null);
  const [endereco, setEndereco] = useState<Endereco>(emptyEndereco);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  const [modalEnderecoOpen, setModalEnderecoOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const enderecoFormatado = montarEnderecoFormatado(endereco);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setLoading(true);
      setErro("");
      setSucesso("");

      if (!resumo.trim()) {
        setErro("Informe um resumo da denúncia.");
        return;
      }

      if (!descricao.trim()) {
        setErro("Descreva a ocorrência.");
        return;
      }

      if (!enderecoFormatado && (!latitude || !longitude)) {
        setErro("Informe um endereço ou marque a localização no mapa.");
        return;
      }

      let fotoUrl: string | null = null;

      if (foto) {
        fotoUrl = await uploadFotoDenuncia(foto, userId);
      }

      await criarDenuncia({
        resumo,
        descricao,
        tipo,
        endereco: enderecoFormatado || "Localização informada pelo mapa",
        latitude,
        longitude,
        foto_url: fotoUrl,
        anonimo,
        user_id: userId,
        nome_usuario: anonimo ? "Anônimo" : nomeUsuario,
      });

      setResumo("");
      setDescricao("");
      setTipo("Maus-tratos");
      setAnonimo(false);
      setFoto(null);
      setEndereco(emptyEndereco);
      setLatitude(null);
      setLongitude(null);

      setSucesso("Denúncia registrada com sucesso!");
      onCreated?.();
    } catch (error) {
      console.error(error);
      setErro("Não foi possível registrar a denúncia. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="denuncia-form" onSubmit={handleSubmit}>
      <div className="form-header">
        <span className="section-tag">Nova denúncia</span>
        <h2>Registrar ocorrência</h2>
        <p>
          Preencha as informações principais para ajudar na identificação e no
          atendimento da ocorrência.
        </p>
      </div>

      <div className="form-group">
        <label className="form-label">Resumo</label>
        <input
          value={resumo}
          onChange={(e) => setResumo(e.target.value)}
          placeholder="Ex: Animal abandonado próximo à praça"
          maxLength={120}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Tipo da denúncia</label>
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
          placeholder="Descreva o que aconteceu, pontos de referência e detalhes importantes."
          rows={5}
        />
      </div>

      <div className="form-group">
        <label className="checkbox-field">
          <input
            type="checkbox"
            checked={anonimo}
            onChange={(e) => setAnonimo(e.target.checked)}
          />
          Enviar denúncia como anônima
        </label>
      </div>

      <div className="endereco-summary">
        <div>
          <strong>Endereço</strong>
          <p>
            {enderecoFormatado ||
              (latitude && longitude
                ? `Localização confirmada no mapa (${latitude.toFixed(
                    5
                  )}, ${longitude.toFixed(5)})`
                : "Nenhum endereço informado ainda.")}
          </p>
        </div>

        <button type="button" onClick={() => setModalEnderecoOpen(true)}>
          Selecionar endereço
        </button>
      </div>

      <PhotoUpload file={foto} onChange={setFoto} />

      {erro && <p className="form-error">{erro}</p>}
      {sucesso && <p className="form-success">{sucesso}</p>}

      <button type="submit" className="primary-button" disabled={loading}>
        {loading ? "Enviando..." : "Registrar denúncia"}
      </button>

      <EnderecoModal
        isOpen={modalEnderecoOpen}
        initialEndereco={endereco}
        initialLatitude={latitude}
        initialLongitude={longitude}
        onClose={() => setModalEnderecoOpen(false)}
        onConfirm={({ endereco, latitude, longitude }) => {
          setEndereco(endereco);
          setLatitude(latitude);
          setLongitude(longitude);
          setModalEnderecoOpen(false);
        }}
      />
    </form>
  );
}

function montarEnderecoFormatado(endereco: Endereco): string {
  const partes = [
    endereco.rua,
    endereco.numero,
    endereco.cidade,
    endereco.estado,
    endereco.cep,
  ].filter(Boolean);

  return partes.join(", ");
}