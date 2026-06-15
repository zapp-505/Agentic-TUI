import { Command } from "commander";
import fs from 'fs'
import path from "path";
import os from 'os'
import { GoogleGenAI } from "@google/genai";

export const agentCommand = new Command("agent")
  .description('Runs the agent')
  .option('-p, --prompt <prompt>', 'prompt', '')
  .action(async (options) => {
    console.log("User prompt is ..." + options.prompt);

    const authDir = path.join(os.homedir(), '.local', 'share', 'opencode');
    const modelFile = path.join(authDir, 'model.json');
    const authFile = path.join(authDir, 'authFile.json');
    const memoryFile = path.join(authDir, 'memoryFile.json')
    const content1 = fs.readFileSync(modelFile, 'utf-8')
    const content2 = fs.readFileSync(authFile, 'utf-8')

    const model_data = JSON.parse(content1)
    const auth_data = JSON.parse(content2)

    JSON.parse(content2)
    const current_model = model_data.model
    const api_key = auth_data[current_model]?.key



    const ai = new GoogleGenAI({
      apiKey: api_key
    });

    let memory = []
    if (fs.existsSync(memoryFile)) {
      const contents = fs.readFileSync(memoryFile, 'utf-8')
      try {
        if (contents.trim() !== "") {
          memory = (JSON.parse(contents))
        }
      }
      catch (e) {
        console.log("memory file empty");
        memory = []
      }

    }


    const chat = ai.chats.create({
      model: "gemini-2.5-flash",
      history: memory,
    });

    let response = await chat.sendMessage({ message: options.prompt });
    console.log("\nAgent:", response.text);


    const updatedMemory = await chat.getHistory();
    fs.writeFileSync(memoryFile, JSON.stringify(updatedMemory, null, 2))
  });
