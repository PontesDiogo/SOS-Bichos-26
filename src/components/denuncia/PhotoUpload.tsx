import { useEffect, useState } from "react";
import { validarImagem } from "../../utils/validators";

interface PhotoUploadProps {
  file: File | null;
  onChange: (file: File | null) => void;
}

export function PhotoUpload({ file, onChange }: PhotoUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];

    setErro("");

    if (!selectedFile) return;

    const validationError = validarImagem(selectedFile);

    if (validationError) {
      setErro(validationError);
      onChange(null);
      return;
    }
    

    onChange(selectedFile);
  }

  function handleRemove() {
    onChange(null);
    setPreview(null);
    setErro("");
  }

  return (
    
    <div className="photo-upload">
      <label className="form-label">Foto da ocorrência</label>

      <p className="photo-upload__hint">
        Você pode tirar uma foto na hora ou escolher uma imagem da galeria.
      </p>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
      />

      {file && <small className="photo-upload__filename">{file.name}</small>}

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