import chalk from "chalk";
import Groq from "groq-sdk";
import { toolMapper } from "../tools";
import { groqTools } from "./groq_tools_declarations";

export const groq_loop = async (client: Groq, messages: any[]) => {
    const response = await client.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: messages,
        tools: groqTools,
    });

    const choice = response.choices[0]!;
    const assistantMsg = choice.message;

    const hasFinalContent = assistantMsg.content && (!assistantMsg.tool_calls || assistantMsg.tool_calls.length === 0);
    if (hasFinalContent) {
        process.stdout.write(assistantMsg.content!);
        console.log();
    }

    messages.push(assistantMsg);

    if (!assistantMsg.tool_calls || assistantMsg.tool_calls.length === 0) {
        return { messages, done: true };
    }

    for (const toolCall of assistantMsg.tool_calls) {
        const name = toolCall.function.name;
        const args = JSON.parse(toolCall.function.arguments);

        console.log( chalk.white("Tool: " + name));
        let result;
        try {
            result = await toolMapper(name, args);
        } catch (error: any) {
            console.log(chalk.red(" Error: ") + error.message);
            result = { success: false, error: error.message };
        }
        console.log(chalk.gray("─".repeat(50)));

        messages.push({
            role: "tool",
            tool_call_id: toolCall.id,
            content: JSON.stringify(result),
        });
    }

    return { messages, done: false };
};
