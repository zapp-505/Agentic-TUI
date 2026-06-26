
import { Command } from 'commander';

export const listCommand = new Command("list")
    .description('Lets user login into the provider (use it as default)')
    .option('-p, --provider <providerName>', 'Name of the provider (gemini, claude etc)', '')
    .option('-a, --api_key <apiKey>', 'Your api key', '')
    .action((options) => {
        console.log("logging into " + options.providerName)
    })
