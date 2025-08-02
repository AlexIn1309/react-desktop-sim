import React, { useRef, useState } from "react";
import ContextMenu from "../../../components/ContextMenu/ContextMenu";
import { ContextMenuAction, getFSObjectContextMenu } from "../contextMenus";

import useBindKeyToAction from "../../../hooks/useBindKeyToAction";
import AppPopup from "../../../components/AppPopup";
import HeaderBar from "../../../components/HeaderBar";
import Box from "../../../components/Box";
import InputField from "../../../components/InputField";
import Row from "../../../components/Row";
import Button from "../../../components/Button";
import {
  StyledFolderIcon,
  StyledItem,
  StyledItemName,
  StyledFileIcon,
} from "./styles";
import useSystemSettings from "../../../stores/systemSettingsStore";
import { FSNode, renameNode, deleteNode } from "../../../stores/fsDB";

interface DirectoryOrFileProps {
  fsObject: FSNode;
  selected: boolean;
  openFSObject: (fsObject: FSNode) => void;
  setSelected: (path: string) => void;
  appRef: React.RefObject<HTMLDivElement>;
  currentDirectory: FSNode;
}

function DirectoryOrFile({
  fsObject,
  openFSObject,
  selected,
  setSelected,
  appRef,
  currentDirectory,
}: DirectoryOrFileProps) {
  const clickPosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const [contextMenuOpen, setContextMenuOpen] = useState(false);
  const [contextAction, setContextAction] = useState<ContextMenuAction | null>(
    null,
  );
  const settings = useSystemSettings();

  function handleRightClick(event: React.MouseEvent) {
    clickPosition.current = { x: event.clientX, y: event.clientY };
    event.stopPropagation();
    event.preventDefault();
    setContextMenuOpen(true);
  }

  return (
    <StyledItem
      selected={selected}
      selectedColor={settings.accentColor}
      onDoubleClick={() => openFSObject(fsObject)}
      onClick={() => setSelected(fsObject.path)}
      key={fsObject.path}
      onContextMenu={handleRightClick}
    >
      {contextMenuOpen && (
        <ContextMenu
          position={clickPosition.current}
          items={getFSObjectContextMenu(
            fsObject,
            setContextAction,
            setContextMenuOpen,
          )}
          close={() => setContextMenuOpen(!contextMenuOpen)}
        />
      )}
      {contextAction === "rename" && (
        <RenamePopup
          appRef={appRef}
          close={() => setContextAction(null)}
          currentDirectory={currentDirectory}
          fsObject={fsObject}
        />
      )}
      {contextAction === "delete" && (
        <DeletePopup
          appRef={appRef}
          close={() => setContextAction(null)}
          currentDirectory={currentDirectory}
          fsObject={fsObject}
        />
      )}
      {fsObject.type === "directory" ? (
        <StyledFolderIcon fill={settings.iconColor} />
      ) : (
        <StyledFileIcon fill={settings.iconColor} />
      )}
      <StyledItemName>{fsObject.name}</StyledItemName>
    </StyledItem>
  );
}

interface RenamePopupProps {
  fsObject: FSNode;
  appRef: React.RefObject<HTMLDivElement>;
  currentDirectory: FSNode;
  close: () => void;
}

function RenamePopup({ appRef, fsObject, close }: RenamePopupProps) {
  const valueRef = useRef("");
  const [error, setError] = useState("");

  useBindKeyToAction({
    keys: ["Escape"],
    action: close,
  });
  useBindKeyToAction({
    keys: ["Enter", "NumpadEnter"],
    action: handleClickConfirm,
  });

  function handleValueChange(value: string) {
    valueRef.current = value;

    if (!value.trim) {
      setError("El nombre no puede estar vacio");
      return;
    }

    if (value == fsObject.name) {
      setError(`${value} already exists`);
      return;
    }

    setError("");
  }

  async function handleClickConfirm() {
    if (error) return;
    await renameNode(fsObject, valueRef.current);
    close();
  }

  return (
    <AppPopup appRef={appRef} close={close}>
      <HeaderBar header={`Rename ${fsObject.type}`} />
      <Box>
        <InputField
          name="Name"
          type="string"
          onChange={handleValueChange}
          error={error}
        />

        <Row>
          <Button name="Cancel" onClick={close} />
          <Button
            name="Confirm"
            onClick={handleClickConfirm}
            disabled={!!error}
          />
        </Row>
      </Box>
    </AppPopup>
  );
}

interface DeletePopupProps {
  appRef: React.RefObject<HTMLDivElement>;
  fsObject: FSNode;
  currentDirectory: FSNode;
  close: () => void;
}

function DeletePopup({ appRef, fsObject, close }: DeletePopupProps) {
  async function handleClickConfirm() {
    await deleteNode(fsObject.path);
    close();
  }

  return (
    <AppPopup appRef={appRef} close={close}>
      <HeaderBar header={`Delete ${fsObject.type}?`} />
      <Box>
        <Row>
          <Button name="Cancel" onClick={close} />
          <Button name="Confirm" onClick={handleClickConfirm} />
        </Row>
      </Box>
    </AppPopup>
  );
}

export default DirectoryOrFile;
