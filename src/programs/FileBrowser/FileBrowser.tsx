import React, { useEffect, useRef, useState } from "react";

import AppSideBar from "../../components/AppSideBar";
import MainContent from "./MainContent";
import { getChildren, getNode, FSNode } from "../../stores/fsDB";
import {
  StyledBottomBar,
  StyledFileBrowser,
  StyledTopBar,
  StyledTopBarButton,
  StyledTopBarButtons,
  StyledTopBarPath,
} from "./styles";

interface FileBrowserProps {
  path?: string;
}

interface TopBarProps {
  pathSearch: string;
  onPathInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPathInputSubmit: (e: React.KeyboardEvent) => void;
  navForward: () => void;
  navBack: () => void;
}
function TopBar({
  pathSearch,
  onPathInputChange,
  onPathInputSubmit,
  navForward,
  navBack,
}: TopBarProps) {
  return (
    <StyledTopBar>
      <StyledTopBarButtons>
        <StyledTopBarButton onClick={navBack}>←</StyledTopBarButton>
        <StyledTopBarButton onClick={navForward}>→</StyledTopBarButton>
      </StyledTopBarButtons>
      <StyledTopBarPath
        value={pathSearch}
        onChange={onPathInputChange}
        onKeyDown={onPathInputSubmit}
      />
    </StyledTopBar>
  );
}

function FileBrowser({ path = "/" }: FileBrowserProps) {
  const appRef = useRef<HTMLDivElement>(null);

  const [currentPath, setCurrentPath] = useState<string>(path);
  const [currentDirectory, setCurrentDirectory] = useState<FSNode | null>(null);
  const [pathSearch, setPathSearch] = useState<string>(path);
  const [history, setHistory] = useState<string[]>([path]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  useEffect(() => {
    async function loadCurrentDirectory() {
      const dir = await getNode(currentPath);
      if (dir && dir.type === "directory") {
        setCurrentDirectory(dir);
        setPathSearch(dir.path);
      }
    }
    loadCurrentDirectory();
  }, [currentPath]);

  function navToPath(newPath: string) {
    if (newPath === currentPath) return;
    setCurrentPath(newPath);
    const updatedHistory = history.slice(0, historyIndex + 1);
    updatedHistory.push(newPath);
    setHistory(updatedHistory);
    setHistoryIndex(updatedHistory.length - 1);
  }

  function navBack() {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setCurrentPath(history[newIndex]);
    }
  }

  function navForward() {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setCurrentPath(history[newIndex]);
    }
  }

  function onPathInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPathSearch(e.currentTarget.value);
  }

  function onPathInputSubmit(e: React.KeyboardEvent) {
    if (e.code === "Enter") {
      navToPath(pathSearch);
    }
  }

  return (
    <StyledFileBrowser ref={appRef}>
      <TopBar
        pathSearch={pathSearch}
        onPathInputChange={onPathInputChange}
        onPathInputSubmit={onPathInputSubmit}
        navBack={navBack}
        navForward={navForward}
      />

      <AppSideBar
        items={[
          {
            title: "Home",
            isActive: currentPath === "/",
            onClick: () => navToPath("/"),
          },
          {
            title: "User",
            isActive: currentPath === "/User",
            onClick: () => navToPath("/User"),
          },
        ]}
      />

      {currentDirectory && (
        <MainContent
          currentDirectory={currentDirectory}
          openFSObject={(fsObject) => navToPath(fsObject.path)}
          appRef={appRef}
        />
      )}

      <StyledBottomBar />
    </StyledFileBrowser>
  );
}

export default FileBrowser;
