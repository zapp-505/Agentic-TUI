import os from 'os';
import path from 'path';
import { Command } from 'commander';
import fs from 'fs'
export const loginCommand = new Command("login")
    .description('Lets user login into the provider (use it as default)')
    .option('-p, --provider <providerName>', 'Name of the provider (gemini, claude etc)', '') 
    .option('-a, --api_key <apiKey>', 'Your api key', '')
    .action((options) => {
        console.log("logging into " + options.providerName)
        const authDir = path.join(os.homedir(), '.local', 'share', 'opencode');
                const modelFile = path.join(authDir, 'model.json');
        
                try{
                    fs.mkdirSync(authDir, { recursive: true })
                }
                catch(e){
                    console.log(e)
                }
        
                let currentData: any = {}
                if (fs.existsSync(modelFile)){
                    const fileContent = fs.readFileSync(modelFile, 'utf-8')
                    currentData = JSON.parse(fileContent);
                }
                
                currentData.model=options.provider
                console.log(currentData)
                fs.writeFileSync(modelFile,JSON.stringify(currentData))
            })
        
