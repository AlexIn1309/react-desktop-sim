import { getNode } from "../../../stores/fsDB";

export async function cd(
  currentPath: string,
  arg: string,
): Promise<{ newPath?: string; error?: string }> {
  if (!arg) {
    return { error: "Uso: cd <directorio>" };
  }

  let newPath = arg;

  // Soporte para rutas relativas
  if (arg === "..") {
    if (currentPath === "/") {
      return { newPath: "/" }; // ya estás en la raíz
    }
    newPath = currentPath.split("/").slice(0, -1).join("/") || "/";
  } else if (!arg.startsWith("/")) {
    newPath = `${currentPath}/${arg}`.replace(/\/+/g, "/");
  }

  const target = await getNode(newPath);

  if (!target) {
    return { error: `cd: no existe el directorio '${arg}'` };
  }

  if (target.type !== "directory") {
    return { error: `cd: '${arg}' no es un directorio` };
  }

  return { newPath };
}
