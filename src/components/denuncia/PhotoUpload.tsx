import { useEffect, useState } from "react";
import { validarImagem } from "../../utils/validators";

interface PhotoUploadProps {
  files: File[];
  onChange: (files: File[]) => void;
  maxFiles?: number;
}

export function PhotoUpload({
  files,
  onChange,
  maxFiles = 2,
}: PhotoUploadProps) {
  const [previews, setPreviews] = useState<string[]>([]);
  const [erro, setErro] = useState("");

  useEffect(() => {
    const objectUrls = files.map((file) => URL.createObjectURL(file));
    setPreviews(objectUrls);

    return () => {
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [files]);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(event.target.files || []);

    setErro("");

    if (selectedFiles.length === 0) return;

    const totalFiles = [...files, ...selectedFiles];

    if (totalFiles.length > maxFiles) {
      setErro(`Você pode anexar no máximo ${maxFiles} imagens.`);
      event.target.value = "";
      return;
    }

    for (const file of selectedFiles) {
      const validationError = validarImagem(file);

      if (validationError) {
        setErro(validationError);
        event.target.value = "";
        return;
      }
    }

    onChange(totalFiles);
    event.target.value = "";
  }

  function handleRemove(index: number) {
    const updatedFiles = files.filter((_, fileIndex) => fileIndex !== index);
    onChange(updatedFiles);
    setErro("");
  }

  return (
    <div className="photo-upload">
      <label className="form-label">Fotos da ocorrência</label>

      <p className="photo-upload__hint">
        Você pode anexar até {maxFiles} imagens da ocorrência. Isso ajuda na
        análise da denúncia.
      </p>

      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        disabled={files.length >= maxFiles}
      />

      {files.length > 0 && (
        <small className="photo-upload__filename">
          {files.length} imagem(ns) selecionada(s)
        </small>
      )}

      {erro && <p className="form-error">{erro}</p>}

      {previews.length > 0 && (
        <div className="photo-preview photo-preview--grid">
          {previews.map((preview, index) => (
            <div key={preview} className="photo-preview__item">
              <img src={preview} alt={`Prévia ${index + 1} da ocorrência`} />

              <button type="button" onClick={() => handleRemove(index)}>
                Remover
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}