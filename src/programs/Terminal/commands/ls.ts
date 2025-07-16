import { getChildren } from "../../../stores/fsDB";
export async function ls(currentPath: string): Promise<string[]> {
  const children = await getChildren(currentPath);
  if (children.length === 0) {
    return ["(vacio)"];
  } else {
    return children.map(
      (child) => `${child.type === "directory" ? "[D]" : "[F]"} ${child.name}`,
    );
  }
}
