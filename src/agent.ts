import { Command } from "commander";
import fs from 'fs'
import path from "path";
import os from 'os'
import { FunctionResponse, GoogleGenAI, type FunctionCall } from "@google/genai";
import { SystemPrompt } from "./utils/prompt";
import { runBashCommandDeclaration, readFileCommandDeclaration, writeFileCommandDeclaration } from "./utils/ai";
import { bashTool, readTool, writeTool } from "./utils/tools";
import chalk from "chalk";


export const agentCommand = new Command("agent")
  .description('Runs the agent')
  .option('-p, --prompt <prompt>', 'prompt', '')
  .action(async (options) => {


    const authDir = path.join(os.homedir(), '.local', 'share', 'opencode');
    const modelFile = path.join(authDir, 'model.json');
    const authFile = path.join(authDir, 'authFile.json');
    const memoryFile = path.join(authDir, 'memoryFile.json')
    const content1 = fs.readFileSync(modelFile, 'utf-8')
    const content2 = fs.readFileSync(authFile, 'utf-8')

    const model_data = JSON.parse(content1)
    const auth_data = JSON.parse(content2)

    const current_model = model_data.model
    const api_key = auth_data[current_model]?.key
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
      config: {
        systemInstruction: SystemPrompt,
        tools: [{ functionDeclarations: [runBashCommandDeclaration, readFileCommandDeclaration, writeFileCommandDeclaration] }],
      },

    });

    let initial_msg: any = options.prompt;
    const MAX_ITERATIONS = 25
    let iterations = 0

    async function toolMapper(name: any, args: any) {
      if (name === 'run_bash_command') {
        return bashTool(args.command)
      }
      else if (name === 'readFile') {
        return readTool(args.path)
      }
      else if (name === 'writeFile') {
        return writeTool(args.path, args.content)
      }
      else {
        return "Tool not found"
      }
    }

    while (iterations++ < MAX_ITERATIONS) {
      let stream = await chat.sendMessageStream({ message: initial_msg });

      const calls: FunctionCall[] = [];

      for await (const chunk of stream) {
        if (chunk.text) process.stdout.write(chunk.text);
        if (chunk.functionCalls?.length) calls.push(...chunk.functionCalls);
      }
      console.log()
      if (calls.length === 0) break;

      const responses = [];

      for (const call of calls) {
        console.log(chalk.white("Tool: " + call.name));
        let response;
        try {
          response = await toolMapper(call.name, call.args)
        } catch (error: any) {
          console.log(chalk.red(" Error: ") + error.message);
          response = { success: false, error: error.message }
        }
        console.log(chalk.gray("─".repeat(50)));
        responses.push({ functionResponse: { name: call.name, response, id: call.id ? call.id : '' } })
      }
      initial_msg = responses;
    }

    if (iterations >= MAX_ITERATIONS) {
      console.warn("\n  Max iterations reached. The agent stopped.");
    }

    const updatedMemory = await chat.getHistory();
    fs.writeFileSync(memoryFile, JSON.stringify(updatedMemory, null, 2));

  });