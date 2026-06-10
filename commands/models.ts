import { Command } from "commander";

export const modelsCommand = new Command("models")
  .description('Returns all the supported models') // for help
  //angle brackets <> tell Commander that this flag requires a value to follow 
  // name of model is also for help and the default value is 'all' which means if user does not provide any model name then it will list all as the value
  .option('-m, --model <modelName>', 'name of the model', 'all')
  .action((options) => {
    console.log("Listing models...");

    console.log(options)
});