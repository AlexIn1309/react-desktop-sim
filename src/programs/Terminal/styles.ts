import styled from "@emotion/styled";

export const StyledTextTerminal = styled.div`
  height: 100%;
  width: 100%;
`;

export const StyledTerminalContainer = styled.div`
  height: 95%;
  width: 95%;
  padding: 10px;
  font-family: monospace;
  font-size: 16px;
  color: white;
  background-color: black;
  overflow-y: auto;
`;

export const StyledLine = styled.div`
  white-space: pre-wrap;
  margin-bottom: 2px;
`;

export const StyledPrompt = styled.div`
  display: flex;
`;

export const StyledInput = styled.input`
  background: none;
  border: none;
  color: white;
  font-family: monospace;
  font-size: 16px;
  width: 100%;

  &:focus {
    outline: none;
  }
`;
