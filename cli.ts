import { program } from 'commander';
import { modelsCommand } from './src/models';
import { agentCommand } from './src/agent';
import { providerCommand } from './src/providers';

program
  .name('opencode')
  .description('Coding agent cli')
  .version('0.1.0')
  .addCommand(modelsCommand)
  .addCommand(agentCommand)
  .addCommand(providerCommand);

program.parse();
