import { getChildren, getNode, updateFileContent } from "../../stores/fsDB";

import { useEffect, useState } from "react";
import useSystemSettings from "../../stores/systemSettingsStore";
import {
  StyledTextEditor,
  StyledTextArea,
  FileList,
  FileItem,
  DirectorySelector,
} from "./styles";

import { FSNode } from "../../stores/fsDB";

interface TextEditorProps {
  onSave?: () => void;
}

function TextEditor({ onSave }: TextEditorProps) {
  const settings = useSystemSettings();
  const [currentDir, setCurrentDir] = useState("/");
  const [items, setItems] = useState<FSNode[]>([]);
  const [selectedFile, setSelectedFile] = useState<FSNode | null>(null);
  const [content, setContent] = useState("");

  useEffect(() => {
    if (onSave) {
      window.addEventListener("save-editor", onSave);
      return () => window.removeEventListener("save-editor", onSave);
    }
  }, [onSave]);

  useEffect(() => {
    async function loadItems() {
      const children = await getChildren(currentDir);
      setItems(children);
    }
    loadItems();
  }, [currentDir]);

  const handleFileClick = async (file: FSNode) => {
    if (file.type === "directory") {
      setCurrentDir(file.path);
      setSelectedFile(null); // limpia el archivo si lo había
    } else if (file.type === "file") {
      const full = await getNode(file.path);
      setSelectedFile(full || null);
      setContent(full?.content || "");
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleSave = async () => {
    if (selectedFile) {
      await updateFileContent(selectedFile.path, content);
    }
  };

  return (
    <StyledTextEditor>
      <DirectorySelector>
        <label>Directorio actual:</label>
        <input
          type="text"
          value={currentDir}
          onChange={(e) => setCurrentDir(e.target.value)}
        />
      </DirectorySelector>

      <FileList>
        {currentDir !== "/" && (
          <FileItem
            onClick={() => {
              const parentDir =
                currentDir.split("/").slice(0, -1).join("/") || "/";
              setCurrentDir(parentDir);
              setSelectedFile(null);
            }}
          >
            🔙 Subir un nivel
          </FileItem>
        )}

        {items.map((item) => (
          <FileItem key={item.path} onClick={() => handleFileClick(item)}>
            {item.type === "directory" ? "📁" : "📄"} {item.name}
          </FileItem>
        ))}
      </FileList>

      {selectedFile && (
        <>
          <h3>Editando: {selectedFile.name}</h3>
          <StyledTextArea
            selectedColor={settings.accentColor}
            value={content}
            onChange={handleContentChange}
          />
          <button className="saving" onClick={handleSave}>
            Guardar
          </button>
        </>
      )}
    </StyledTextEditor>
  );
}

export default TextEditor;
