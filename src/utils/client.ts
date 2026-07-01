import { GoogleGenAI } from "@google/genai";
import Groq from "groq-sdk";
import { runBashCommandDeclaration, readFileCommandDeclaration, writeFileCommandDeclaration } from "./gemini/gemini_tools_declarations";
import { groqTools } from "./groq/groq_tools_declarations";

export async function createClient(provider: string, apiKey: string, memory: any[], systemPrompt: string) {
    if (provider == "gemini") {
        const ai = new GoogleGenAI({
            apiKey: apiKey
        })
        const chat = ai.chats.create({
            model: "gemini-2.5-flash",
            history: memory,
            config: {
                systemInstruction: systemPrompt,
                tools: [{ functionDeclarations: [runBashCommandDeclaration, readFileCommandDeclaration, writeFileCommandDeclaration] }],
            },
        });
        return { type: "gemini" as const, chat };
    }

    else if (provider == "groq") {
        const groq = new Groq({ apiKey });
        
        const messages: any[] = [
            { role: "system", content: systemPrompt },
            ...memory,
        ];
        return { type: "groq" as const, client: groq, messages, tools: groqTools };
    }

    throw new Error(`Unsupported provider: ${provider}`);
}