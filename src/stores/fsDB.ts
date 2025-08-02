import Dexie, { Table } from "dexie";

export interface FSNode {
  path: string; // Ej: "/documentos/archivo.txt"
  name: string; // Ej: "archivo.txt"
  type: "file" | "directory";
  parent: string; // Ej: "/documentos"
  content?: string; // solo si es archivo
  createdAt: string;
  updatedAt: string;
}

class FileSystemDB extends Dexie {
  nodes!: Table<FSNode, string>; // clave primaria: path

  constructor() {
    super("FileSystemDB");
    this.version(1).stores({
      nodes: "path, parent, type", // índices
    });
  }
}

export const fsDB = new FileSystemDB();

/**
 * Crea o actualiza un nodo (archivo o directorio)
 */
export async function createNode(node: FSNode): Promise<void> {
  await fsDB.nodes.put({
    ...node,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
}

/**
 * Obtiene los hijos de un directorio por su path
 */
export async function getChildren(parent: string): Promise<FSNode[]> {
  return await fsDB.nodes.where("parent").equals(parent).toArray();
}

/**
 * Obtiene un nodo específico por su path
 */
export async function getNode(path: string): Promise<FSNode | undefined> {
  return await fsDB.nodes.get(path);
}

/**
 * Actualiza el contenido de un archivo
 */
export async function updateFileContent(
  path: string,
  content: string,
): Promise<void> {
  await fsDB.nodes.update(path, {
    content,
    updatedAt: new Date().toISOString(),
  });
}

export async function deleteNode(path: string): Promise<void> {
  await fsDB.nodes.delete(path);
}

export async function renameNode(
  oldNode: FSNode,
  newName: string,
): Promise<void> {
  const newPath = `${oldNode.parent}/${newName}`.replace(/\/+/g, "/");
  const updated: FSNode = {
    ...oldNode,
    name: newName,
    path: newPath,
    updatedAt: new Date().toISOString(),
  };
  await deleteNode(oldNode.path);
  await createNode(updated);
}
