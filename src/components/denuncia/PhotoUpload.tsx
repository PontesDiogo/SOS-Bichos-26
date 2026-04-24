import { useState } from "react";
import { validarImagem } from "../../utils/validators";

interface PhotoUploadProps {
  file: File | null;
  onChange: (file: File | null) => void;
}

export function PhotoUpload({ file, onChange }: PhotoUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [erro, setErro] = useState("");

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];

    setErro("");

    if (!selectedFile) return;

    const validationError = validarImagem(selectedFile);

    if (validationError) {
      setErro(validationError);
      onChange(null);
      setPreview(null);
      return;
    }

    onChange(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  }

  function handleRemove() {
    onChange(null);
    setPreview(null);
    setErro("");
  }

  return (
    <div className="photo-upload">
      <label className="form-label">Foto da ocorrência</label>

      <input
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
      />

      {erro && <p className="form-error">{erro}</p>}

      {preview && file && (
        <div className="photo-preview">
          <img src={preview} alt="Prévia da ocorrência" />
          <button type="button" onClick={handleRemove}>
            Remover foto
          </button>
        </div>
      )}
    </div>
  );
}