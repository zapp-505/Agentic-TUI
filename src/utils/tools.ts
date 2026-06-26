import { execSync } from 'child_process';
import fs from 'fs'

export const bashTool = (command: string) => {
  try {
    const result = execSync(command, {
      encoding: "utf-8",
      stdio: "pipe"
    });
    return {
      type: "result",
      content: result
    };
  } catch (error) {
    return {
      type: "error",
      content: error instanceof Error ? error.message : String(error)
    };
  }
}
  
export const readTool = (path: string)=>{
  try{  
    const result = fs.readFileSync(path, "utf-8");
    return {
      type :"result",
      content: result
    }
  }catch(error){
    return {
      type: "error",
      content: error instanceof Error ? error.message : String(error)
    };
  }
}

export const writeTool = (path: string,content:string)=>{
  try{
    fs.writeFileSync(path, content, "utf-8");
    return {
      type: "result",
      content: "File written successfully"
    };
  }catch(error){
    return {
      type: "error",
      content: error instanceof Error ? error.message : String(error)
    };
  }
}