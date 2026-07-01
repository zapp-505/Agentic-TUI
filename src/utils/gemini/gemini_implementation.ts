import chalk from "chalk";
import type { FunctionCall } from "@google/genai";
import { toolMapper } from "../tools";

export const gemini_loop = async (client: any, initial_msg: any) => {
  let stream = await client.sendMessageStream({ message: initial_msg });

  const calls: FunctionCall[] = [];

  for await (const chunk of stream) {
    if (chunk.functionCalls?.length) {
      calls.push(...chunk.functionCalls);
    } else if (chunk.text) {
      process.stdout.write(chunk.text);
    }
  }
  console.log()
  if (calls.length === 0) return [];

  const responses: Array<{ functionResponse: { name: string; response: any; id: string }; }> = [];
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
    responses.push({ functionResponse: { name: call.name ?? "", response, id: call.id ?? "" } })
  }

  return responses;
}