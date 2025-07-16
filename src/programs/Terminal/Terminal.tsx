import React, { useState, useEffect, useRef } from "react";
import useSystemSettings from "../../stores/systemSettingsStore";
import {
  StyledTextTerminal,
  StyledTerminalContainer,
  StyledLine,
  StyledPrompt,
  StyledInput,
} from "./styles";
import { createNode, getChildren, getNode, FSNode } from "../../stores/fsDB";
import { ls, mkdir, cd, touch, cat } from "./commands";

function TextTerminal() {
  const settings = useSystemSettings();
  const [lines, setLines] = useState<string[]>(["OS-SIM-Terminal v0.1"]);
  const [input, setInput] = useState("");
  const [currentPath, setCurrentPath] = useState("/");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [lines]);

  // Asegurar que el directorio raíz exista
  useEffect(() => {
    async function initRoot() {
      const root = await getNode("/");
      if (!root) {
        await createNode({
          name: "/",
          path: "/",
          parent: "",
          type: "directory",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        setLines((prev) => [...prev, "Directorio raíz creado."]);
      }
    }

    initRoot();
  }, []);

  const handleCommand = async (rawInput: string) => {
    const [cmd, ...args] = rawInput.trim().split(" ");
    let output: string[] = [];

    switch (cmd) {
      case "ls":
        output = await ls(currentPath);
        break;

      case "mkdir":
        output = await mkdir(currentPath, args[0]);
        break;

      case "clear":
        setLines([]);
        return;

      case "cd": {
        const result = await cd(currentPath, args[0]);
        if (result.error) {
          output = [result.error];
        } else if (result.newPath) {
          setCurrentPath(result.newPath);
        }
        break;
      }

      case "touch": {
        output = await touch(currentPath, args[0]);
        break;
      }

      case "cat": {
        output = await cat(currentPath, args[0]);
        break;
      }

      default:
        output = [`Comando no reconocido: ${cmd}`];
    }

    setLines((prev) => [...prev, `${currentPath}$ ${rawInput}`, ...output]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      await handleCommand(input);
      setInput("");
    }
  };

  return (
    <StyledTextTerminal>
      <StyledTerminalContainer>
        {lines.map((line, i) => (
          <StyledLine key={i}>{line}</StyledLine>
        ))}
        <form onSubmit={handleSubmit}>
          <StyledPrompt>
            <span>{currentPath}$&nbsp;</span>
            <StyledInput
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              autoFocus
            />
          </StyledPrompt>
        </form>
      </StyledTerminalContainer>
    </StyledTextTerminal>
  );
}

export default TextTerminal;
