import { getNode } from "../../../stores/fsDB";

export async function cat(
  currentPath: string,
  name: string,
): Promise<string[]> {
  if (!name) {
    return ["Uso: cat <archivo>"];
  }

  const path = `${currentPath}/${name}`.replace(/\/+/g, "/");
  const node = await getNode(path);

  if (!node) {
    return [`cat: no se encontró el archivo '${name}'`];
  }

  if (node.type !== "file") {
    return [`cat: '${name}' no es un archivo`];
  }

  return [node.content || "(archivo vacío)"];
}
