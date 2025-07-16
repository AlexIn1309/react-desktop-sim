import Terminal from "..";
import Launcher from "../../../components/BottomBar/Launcher";
import { MenuItemProps } from "../../../components/MenuItems";
import icon from "./terminal-svgrepo-com.svg";

const windowType = "terminal";

interface TerminalLauncherProps {}

const menus: MenuItemProps[] = [
  {
    title: "Terminal",
    items: [
      {
        title: "Save",
        items: [
          {
            title: "Really save?",
          },
        ],
      },
      {
        title: "Load",
        items: [
          {
            title: "Really load?",
            items: [
              {
                title: "REALLY LOAD???",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    title: "Edit",
    items: [
      {
        title: "Preferences",
        items: [
          {
            title: "Spacing",
          },
        ],
      },
      {
        title: "Document",
      },
    ],
  },
];

// eslint-disable-next-line no-empty-pattern
function TerminalLauncher({}: TerminalLauncherProps) {
  return (
    <Launcher
      windowType={windowType}
      WindowTitle="Terminal"
      initialDimensions={{ height: 500, width: 800 }}
      menus={menus}
      appContent={<Terminal />}
      icon={icon}
    >
      {/* <Icon style={{ width: "100%", height: "100%" }} /> */}
    </Launcher>
  );
}

export default TerminalLauncher;
