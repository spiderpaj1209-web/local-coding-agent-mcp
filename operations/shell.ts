import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { execSync } from 'child_process';

export function registerShellTools(server: Server, workspace: string) {
  server.setRequestHandler('tools/list', async () => ({
    tools: [
      {
        name: 'run_command',
        description: 'Exé¹¹cuter une commande shell (npm, git, etc.)',
        inputSchema: {
          type: 'object',
          properties: {
            command: { type: 'string', description: 'Commande à exé¹¹cuter' },
          },
          required: ['command'],
        },
      },
    ],
  }));

  server.setRequestHandler('tools/call', async (request) => {
    const { name, arguments: args } = request.params;

    if (name === 'run_command') {
      try {
        const output = execSync(args.command, {
          cwd: workspace,
          encoding: 'utf-8',
          timeout: 30000,
        });
        return { content: [{ type: 'text', text: output }] };
      } catch (err: any) {
        return { content: [{ type: 'text', text: `Erreur: ${err.message}\n${err.stdout || ''}\n${err.stderr || ''}` }] };
      }
    }

    throw new Error(`Outil inconnu: ${name}`);
  });
}
