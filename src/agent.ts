import { Command } from "commander";
import fs from 'fs'
import path from "path";
import os from 'os'
import chalk from "chalk";
import { createClient } from "./utils/client";
import { gemini_loop } from "./utils/gemini/gemini_implementation";
import { groq_loop } from "./utils/groq/groq_implementation";
import { getSystemPrompt } from "./utils/prompt";

export const agentCommand = new Command("agent")
  .description('Runs the agent')
  .option('-p, --prompt <prompt>', 'prompt', '')
  .action(async (options) => {
    const cwd = process.cwd(); // this is wherever the user ran "opencode agent" from
    const systemPrompt = getSystemPrompt(cwd);
    const authDir = path.join(os.homedir(), '.local', 'share', 'opencode');
    const modelFile = path.join(authDir, 'model.json');
    const authFile = path.join(authDir, 'authFile.json');
    const content1 = fs.readFileSync(modelFile, 'utf-8')
    const content2 = fs.readFileSync(authFile, 'utf-8')

    const model_data = JSON.parse(content1)
    const auth_data = JSON.parse(content2)

    const current_model = model_data.model
    const api_key = auth_data[current_model]?.key
    const memoryFile = path.join(authDir, `memory_${current_model}.json`)
    console.clear();
    console.log(chalk.cyan.bold("  ██████╗ ██████╗ ███████╗███╗   ██╗"));
    console.log(chalk.cyan.bold("  ██╔═══██╗██╔══██╗██╔════╝████╗  ██║"));
    console.log(chalk.cyan.bold("  ██║   ██║██████╔╝█████╗  ██╔██╗ ██║"));
    console.log(chalk.cyan.bold("  ██║   ██║██╔═══╝ ██╔══╝  ██║╚██╗██║"));
    console.log(chalk.cyan.bold("  ╚██████╔╝██║     ███████╗██║ ╚████║"));
    console.log(chalk.cyan.bold("   ╚═════╝ ╚═╝     ╚══════╝╚═╝  ╚═══╝"));
    console.log(chalk.cyan.bold("============================================"))
    console.log();
    console.log(chalk.gray("  AI-powered coding agent  •  v1.0.0"));
    console.log(chalk.gray("  Model: ") + chalk.white(current_model));
    console.log(chalk.cyan.bold("============================================"))
    console.log();

    console.log(chalk.gray("User prompt is ..." + options.prompt));

    
    let memory: any[] = []
    if (fs.existsSync(memoryFile)) {
      const contents = fs.readFileSync(memoryFile, 'utf-8')
      try {
        if (contents.trim() !== "") {
          memory = JSON.parse(contents)
        }
      }
      catch (e) {
        console.log("memory file empty");
        memory = []
      }
    }

    const clientData = await createClient(current_model, api_key, memory, systemPrompt);

    const MAX_ITERATIONS = 25
    let iterations = 0

    if (clientData.type === "gemini") {
      let initial_msg: any = options.prompt;

      while (iterations++ < MAX_ITERATIONS) {
        const responses = await gemini_loop(clientData.chat, initial_msg);
        if (responses.length === 0) break;
        initial_msg = responses;
      }


      const updatedMemory = await clientData.chat.getHistory();
      fs.writeFileSync(memoryFile, JSON.stringify(updatedMemory, null, 2));

    } else if (clientData.type === "groq") {
      
      clientData.messages.push({ role: "user", content: options.prompt });

      while (iterations++ < MAX_ITERATIONS) {
        const result = await groq_loop(clientData.client, clientData.messages);
        clientData.messages = result.messages;
        if (result.done) break;
      }

      
      const historyToSave = clientData.messages.filter((m: any) => m.role !== "system");
      fs.writeFileSync(memoryFile, JSON.stringify(historyToSave, null, 2));
    }

    if (iterations >= MAX_ITERATIONS) {
      console.warn("\n  Max iterations reached. The agent stopped.");
    }
  });