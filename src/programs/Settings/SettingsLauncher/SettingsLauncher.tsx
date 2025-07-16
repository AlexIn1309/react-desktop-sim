import Settings from "..";
import Launcher from "../../../components/BottomBar/Launcher";
import icon from "./settings-cog-options-config-configure-gear-engineering-svgrepo-com.svg";
interface SettingsLauncherProps {}

// eslint-disable-next-line no-empty-pattern
function SettingsLauncher({}: SettingsLauncherProps) {
  return (
    <Launcher
      windowType={"settings"}
      WindowTitle="Settings"
      initialDimensions={{ height: 500, width: 500 }}
      menus={[]}
      appContent={<Settings />}
      icon={icon}
    ></Launcher>
  );
}

export default SettingsLauncher;
