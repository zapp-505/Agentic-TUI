import os from 'os';
import path from 'path';
import { Command } from 'commander';
import fs from 'fs'
export const loginCommand = new Command("login")
    .description('Lets user login into the provider (use it as default)')
    .option('-p, --provider <providerName>', 'Name of the provider (gemini, claude etc)', '') 
    .option('-a, --api_key <apiKey>', 'Your api key', '')
    .action((options) => {
        console.log("logging into " + options.provider)
        const authDir = path.join(os.homedir(), '.local', 'share', 'opencode');
        const authFile = path.join(authDir, 'authFile.json');
        
        try{
            fs.mkdirSync(authDir, { recursive: true })
                }
        catch(e){
            console.log(e)
        }

        let currentData: any = {}
        if (fs.existsSync(authFile)){
            const fileContent = fs.readFileSync(authFile, 'utf-8')
            currentData = JSON.parse(fileContent);
        }
        currentData[options.provider]={key: options.api_key}
        console.log(currentData)
        fs.writeFileSync(authFile,JSON.stringify(currentData))
    })
        
