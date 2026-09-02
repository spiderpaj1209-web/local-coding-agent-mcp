import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { readFileSync, writeFileSync, readdirSync, mkdirSync, rmSync } from 'fs';
import { join } from 'path';

export function registerFileTools(server: Server, workspace: string) {
  server.setRequestHandler('tools/list', async () => ({
    tools: [
      {
        name: 'read_file',
        description: 'Lire un fichier',
        inputSchema: {
          type: 'object',
          properties: {
            path: { type: 'string', description: 'Chemin relatif depuis workspace' },
          },
          required: ['path'],
        },
      },
      {
        name: 'write_file',
        description: 'É¹crire un fichier',
        inputSchema: {
          type: 'object',
          properties: {
            path: { type: 'string' },
            content: { type: 'string' },
          },
          required: ['path', 'content'],
        },
      },
      {
        name: 'list_files',
        description: 'Lister un dossier',
        inputSchema: {
          type: 'object',
          properties: {
            path: { type: 'string', description: 'Chemin relatif' },
          },
          required: ['path'],
        },
      },
      {
        name: 'delete_file',
        description: 'Supprimer un fichier',
        inputSchema: {
          type: 'object',
          properties: {
            path: { type: 'string' },
          },
          required: ['path'],
        },
      },
    ],
  }));

  server.setRequestHandler('tools/call', async (request) => {
    const { name, arguments: args } = request.params;

    const safePath = (p: string) => {
      const full = join(workspace, p);
      if (!full.startsWith(workspace)) throw new Error('Path hors workspace');
      return full;
    };

    if (name === 'read_file') {
      const content = readFileSync(safePath(args.path), 'utf-8');
      return { content: [{ type: 'text', text: content }] };
    }

    if (name === 'write_file') {
      const full = safePath(args.path);
      mkdirSync(join(full, '..'), { recursive: true });
      writeFileSync(full, args.content, 'utf-8');
      return { content: [{ type: 'text', text: `Fichier écrit: ${args.path}` }] };
    }

    if (name === 'list_files') {
      const files = readdirSync(safePath(args.path), { withFileTypes: true });
      const list = files.map(f => `${f.isDirectory() ? '📁' : '📄'} ${f.name}`).join('\n');
      return { content: [{ type: 'text', text: list }] };
    }

    if (name === 'delete_file') {
      rmSync(safePath(args.path), { recursive: true, force: true });
      return { content: [{ type: 'text', text: `Supprimé·©e: ${args.path}` }] };
    }

    throw new Error(`Outil inconnu: ${name}`);
  });
}
