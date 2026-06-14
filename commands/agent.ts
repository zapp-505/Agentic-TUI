import { Command } from "commander";
import fs from 'fs'
import path from "path";
import os from 'os'
import { GoogleGenAI } from "@google/genai";

export const agentCommand = new Command("agent")
  .description('Runs the agent')
  .option('-p, --prompt <prompt>', 'prompt', '')
  .action((options) => {
    console.log("User prompt is ..." + options.prompt);

    const authDir = path.join(os.homedir(), '.local', 'share', 'opencode');
    const modelFile = path.join(authDir, 'model.json');
    const authFile = path.join(authDir, 'authFile.json');
    const memoryFile = path.join(authDir,'memoryFile.json')
    const content1  = fs.readFileSync(modelFile,'utf-8')
    const content2 = fs.readFileSync(authFile,'utf-8')

    const model_data = JSON.parse(content1)
    const auth_data = JSON.parse(content2)

    JSON.parse(content2)
    const current_model   = model_data.model
    const api_key = auth_data[current_model]?.key


    
  const ai = new GoogleGenAI({
    apiKey : api_key
  });

  let memory=[]
  if (fs.existsSync(memoryFile,)){
    let contents = fs.readFileSync(memoryFile,'utf-8')
    console.log(JSON.parse(contents))
    memory.push(JSON.parse(contents))
  }

  memory.push({"user" : options.prompt})

  async function main(memory) {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: memory,
    });
    return response.text
  }

  async function main() {
  const chat = ai.chats.create({ model: "gemini-2.5-flash" });

  let response = await chat.sendMessage({ message: options.prompt });
  console.log("Response 1:", response.text);

  response = await chat.sendMessage({ message: "How many paws are in my house?" });
  console.log("Response 2:", response.text);
}

  
  const response= main(memory);
  memory[-1].llm=response
  console.log(response)
  
  fs.writeFileSync(memoryFile,JSON.stringify(memory))
    
});
