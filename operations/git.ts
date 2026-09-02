import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import simpleGit, { SimpleGit } from 'simple-git';

export function registerGitTools(server: Server, workspace: string) {
  const git: SimpleGit = simpleGit(workspace);

  server.setRequestHandler('tools/list', async () => ({
    tools: [
      {
        name: 'git_status',
        description: 'Voir le statut git',
        inputSchema: { type: 'object', properties: {} },
      },
      {
        name: 'git_commit',
        description: 'Faire un commit',
        inputSchema: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            all: { type: 'boolean' },
          },
          required: ['message'],
        },
      },
      {
        name: 'git_push',
        description: 'Push vers remote',
        inputSchema: { type: 'object', properties: {} },
      },
    ],
  }));

  server.setRequestHandler('tools/call', async (request) => {
    const { name, arguments: args } = request.params;

    if (name === 'git_status') {
      const status = await git.status();
      return { content: [{ type: 'text', text: status.summary.changed + ' fichiers modifié·¹s' }] };
    }

    if (name === 'git_commit') {
      await git.commit(args.message, args.all ? ['-a'] : []);
      return { content: [{ type: 'text', text: 'Commit effectué' }] };
    }

    if (name === 'git_push') {
      await git.push();
      return { content: [{ type: 'text', text: 'Push effectué' }] };
    }

    throw new Error(`Outil inconnu: ${name}`);
  });
}
