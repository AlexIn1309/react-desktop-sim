import styled from "@emotion/styled";
import { ReactComponent as FolderIcon } from "../../../assets/icons/folder-icon.svg";
import { ReactComponent as FileIcon } from "../../../assets/icons/file-2-svgrepo-com.svg";

export const StyledItem = styled.div<{
  selected: boolean;
  selectedColor: string;
}>`
  width: 100%;
  padding: 10px;
  overflow-wrap: break-word;
  word-break: normal;
  box-sizing: border-box;
  aspect-ratio: 1/1;
  height: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 10px;
  border-radius: 10px;
  background-color: ${(props) =>
    props.selected ? props.selectedColor : undefined};
`;

export const StyledItemName = styled.span``;

export const StyledFolderIcon = styled(FolderIcon)<{ fill: string }>`
  height: 80%;
  width: 80%;
  path {
    fill: ${(props) => props.fill};
  }
`;

export const StyledFileIcon = styled(FileIcon)<{ fill: string }>`
  height: 80%;
  width: 80%;
  path {
    fill: ${(props) => props.fill};
  }
`;
