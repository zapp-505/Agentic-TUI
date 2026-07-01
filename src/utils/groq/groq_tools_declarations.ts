export const groqTools: any[] = [
      {
        type: "function",
        function: {
          name: "run_bash_command",
          description: "Runs a bash/shell command and returns the output",
          parameters: {
            type: "object",
            properties: {
              command: { type: "string", description: "The command to run" }
            },
            required: ["command"]
          }
        }
      },
      {
        type: "function",
        function: {
          name: "readFile",
          description: "Reads a file from disk and returns its contents",
          parameters: {
            type: "object",
            properties: {
              path: { type: "string", description: "Path to the file" }
            },
            required: ["path"]
          }
        }
      },
      {
        type: "function",
        function: {
          name: "writeFile",
          description: "Writes content to a file on disk",
          parameters: {
            type: "object",
            properties: {
              path: { type: "string", description: "Path to the file" },
              content: { type: "string", description: "Content to write" }
            },
            required: ["path", "content"]
          }
        }
      }
    ];