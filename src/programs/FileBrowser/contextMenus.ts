import { MenuItemProps } from "../../components/MenuItems";
import { FSNode, createNode } from "../../stores/fsDB";

export type ContextMenuAction = "delete" | "rename";

export function getMainContentContextItems(
  currentPath: string,
  setContextMenuOpen: (open: boolean) => void,
  refresh?: () => void,
): Array<MenuItemProps> {
  async function createItem(type: "file" | "directory") {
    const name = window.prompt(`Nombre del $(type): `);
    if (!name) return;

    const path = `${currentPath}/${name}`.replace(/\/+/g, "/");
    await createNode({
      name,
      path,
      parent: currentPath,
      type,
      content: type === "file" ? "" : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    setContextMenuOpen(false);
    refresh?.();
  }

  return [
    {
      title: "Create Directory",
      action: () => createItem("directory"),
    },
    {
      title: "Create File",
      action: () => createItem("file"),
    },
    {
      title: "Open in Terminal",
    },
  ];
}

export function getFSObjectContextMenu(
  fsObject: FSNode,
  setContextAction: (action: ContextMenuAction) => void,
  setContextMenuOpen: (open: boolean) => void,
): Array<MenuItemProps> {
  if (fsObject.type === "file") {
    return getFSFileContextMenu(setContextAction, setContextMenuOpen);
  }

  return getFSDirectoryContextMenu(setContextAction, setContextMenuOpen);
}

function getFSFileContextMenu(
  setContextAction: (action: ContextMenuAction) => void,
  setContextMenuOpen: (open: boolean) => void,
): Array<MenuItemProps> {
  return [
    {
      title: "Rename File",
      action: () => {
        setContextAction("rename");
        setContextMenuOpen(false);
      },
    },
    {
      title: "Delete File",
      action: () => {
        setContextAction("delete");
        setContextMenuOpen(false);
      },
    },
  ];
}

function getFSDirectoryContextMenu(
  setContextAction: (action: ContextMenuAction) => void,
  setContextMenuOpen: (open: boolean) => void,
): Array<MenuItemProps> {
  return [
    {
      title: "Rename Directory",
      action: () => {
        setContextAction("rename");
        setContextMenuOpen(false);
      },
    },
    {
      title: "Delete Directory",
      action: () => {
        setContextAction("delete");
        setContextMenuOpen(false);
      },
    },
  ];
}
