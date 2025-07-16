import { createNode, getNode } from "../../../stores/fsDB";

export async function touch(
  currentPath: string,
  name: string,
): Promise<string[]> {
  if (!name) {
    return ["Uso: touch <nombre-de-archivo>"];
  }

  const newPath = `${currentPath}/${name}`.replace(/\/+/g, "/");
  const existing = await getNode(newPath);

  if (existing) {
    return [`touch: el archivo '${name}' ya existe`];
  }

  await createNode({
    name,
    path: newPath,
    parent: currentPath,
    type: "file",
    content: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  return [];
}
