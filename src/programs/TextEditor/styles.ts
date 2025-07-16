import styled from "@emotion/styled";

export const StyledTextEditor = styled.div`
  height: 100%;
  width: 100%;
  color: white;
  padding: 10px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  .saving {
    padding: 5px;
    margin-top: 10px;
    background-color: #7cb342;
    border-radius: 5px;
    border: none;
    width: 6rem;
  }
`;

export const DirectorySelector = styled.div`
  margin-bottom: 10px;

  label {
    margin-right: 8px;
  }

  input {
    background: transparent;
    color: white;
    border: 1px solid gray;
    padding: 4px 8px;
    border-radius: 6px;
  }

  display: flex;
  flex-direction: row;
`;

export const FileList = styled.ul`
  list-style: none;
  padding: 0;
  margin-bottom: 10px;
  max-height: 200px;
  overflow-y: auto;
  display: flex;
  flex-direction: row;
`;

export const FileItem = styled.li`
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

export const StyledTextArea = styled.textarea<{ selectedColor: string }>`
  width: 100%;
  height: 200px;
  border: none;
  resize: vertical;
  background-color: transparent;
  color: white;
  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.5) inset;
  border-radius: 10px;
  padding: 10px;
  box-sizing: border-box;

  &:focus-visible {
    outline: none;
  }

  ::selection {
    background-color: ${(props) => props.selectedColor};
  }
`;
