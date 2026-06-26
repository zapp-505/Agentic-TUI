
import { Command } from 'commander';
import fs from 'fs'
import os from 'os'
import path from 'path'
export const setProviderCommand = new Command("set")
    .description('Lets user set the default provider')
    .option('-p, --provider <providerName>', 'Name of the provider (gemini, claude etc)', '')
    .action((options) => {
        console.log("provider is  " + JSON.stringify(options))
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
