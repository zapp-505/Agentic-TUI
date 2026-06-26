import { Type } from "@google/genai";

export const runBashCommandDeclaration = {
    type: "function",
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
}as const;

export const readFileCommandDeclaration = {
    type: "function",
    name: "readFile",
    description: "Read a file in the project directory",
    parameters: {
        type: "object",
        properties: {
            path: {
                type: "string",
                description: "Path to the file to read"
            }
        },
        required: ["path"]
    }
}as const ;

export const writeFileCommandDeclaration = {
    type: "function",
    name: "writeFile",
    description: "Write a file in the project directory",
    parameters: {
      type: "object",
      properties : {
        path : {
          type : "string",
          description: "Path to the file to write"
        }
      },
      required : ["path"]
    }
} as const;