import { Type } from "@google/genai";
import type { FunctionDeclaration } from "@google/genai";

export const runBashCommandDeclaration: FunctionDeclaration = {
  name: "run_bash_command",
  description:
    "Executes a bash/shell command inside the project directory on the host machine.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      command: {
        type: Type.STRING,
        description:
          'The exact shell command to run (e.g. dir, node -e "...", tsc, etc.)',
      },
    },
    required: ["command"],
  },
};

export const readFileCommandDeclaration: FunctionDeclaration = {
    name: "readFile",
    description: "Read a file in the project directory",
    parameters: {
        type: Type.OBJECT,
        properties: {
            path: {
                type: Type.STRING,
                description: "Path to the file to read"
            }
        },
        required: ["path"]
    }
};

export const writeFileCommandDeclaration: FunctionDeclaration = {
    name: "writeFile",
    description: "Write a file in the project directory",
    parameters: {
      type: Type.OBJECT,
      properties : {
        path : {
          type : Type.STRING,
          description: "Path to the file to write"
        },
        content:{
            type:Type.STRING,
            description: "Content to write in the file"
        }
      },
      required : ["path","content"]
    }
};