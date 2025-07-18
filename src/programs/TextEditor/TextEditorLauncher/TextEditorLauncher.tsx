import TextEditor from "..";
import Launcher from "../../../components/BottomBar/Launcher";
import { MenuItemProps } from "../../../components/MenuItems";
import icon from "./text-editor-launcher-icon.svg";

function TextEditorLauncher() {
  const handleSave = () => {
    const event = new Event("save-editor");
    window.dispatchEvent(event);
  };

  const menus: MenuItemProps[] = [
    {
      title: "File",
      items: [
        {
          title: "Save",
          action: handleSave, // <- ahora ejecuta una acción real
        },
        // ...
      ],
    },
    // ...
  ];

  return (
    <Launcher
      windowType="text-editor"
      WindowTitle="Text Editor"
      initialDimensions={{ height: 500, width: 900 }}
      menus={menus}
      appContent={<TextEditor onSave={handleSave} />}
      icon={icon}
    />
  );
}
export default TextEditorLauncher;
