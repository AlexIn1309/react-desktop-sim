import { createNode, getNode } from "../../../stores/fsDB";

export async function mkdir(
  currentPath: string,
  name: string,
): Promise<string[]> {
  if (!name) return ["Uso: mkdir <nombre>"];

  const newPath = `${currentPath}/${name}`.replace(/\/+/g, "/");
  const existing = await getNode(newPath);

  if (existing) return [`mkdir: no se puede crear '${name}': ya existe`];

  await createNode({
    name,
    path: newPath,
    parent: currentPath,
    type: "directory",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  return [];
}
