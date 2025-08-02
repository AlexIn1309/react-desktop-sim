import { useEffect, useRef, useState } from "react";
import { getMainContentContextItems } from "../contextMenus";
import ContextMenu from "../../../components/ContextMenu/ContextMenu";
import DirectoryOrFile from "../DirectoryOrFile";
import { StyledMainContent } from "./styles";
import { FSNode, getChildren } from "../../../stores/fsDB";

interface MainContentProps {
  currentDirectory: FSNode;
  openFSObject: (fsObject: FSNode) => void;
  appRef: React.RefObject<HTMLDivElement>;
}

function MainContent({
  currentDirectory,
  openFSObject,
  appRef,
}: MainContentProps) {
  const [selected, setSelected] = useState<string>("");
  const clickPosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const [contextMenuOpen, setContextMenuOpen] = useState(false);
  const [children, setChildren] = useState<FSNode[]>([]);

  function handleRightClick(e: React.MouseEvent) {
    clickPosition.current = { x: e.clientX, y: e.clientY };
    e.stopPropagation();
    e.preventDefault();
    setContextMenuOpen(true);
  }

  useEffect(() => {
    async function loadChildren() {
      const result = await getChildren(currentDirectory.path);
      setChildren(result);
    }
    loadChildren();
  }, [currentDirectory]);

  return (
    <StyledMainContent onContextMenu={handleRightClick}>
      {contextMenuOpen && (
        <ContextMenu
          position={clickPosition.current}
          items={getMainContentContextItems(
            currentDirectory.path,
            setContextMenuOpen,
            () => getChildren(currentDirectory.path).then(setChildren),
          )}
          close={() => setContextMenuOpen(!contextMenuOpen)}
        />
      )}

      {children.map((fsObject) => (
        <DirectoryOrFile
          fsObject={fsObject}
          openFSObject={openFSObject}
          selected={selected === fsObject.path}
          setSelected={setSelected}
          key={fsObject.path}
          appRef={appRef}
          currentDirectory={currentDirectory}
        />
      ))}
    </StyledMainContent>
  );
}

export default MainContent;
