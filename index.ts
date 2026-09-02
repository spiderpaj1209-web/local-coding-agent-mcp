import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { registerFileTools } from './operations/files.js';
import { registerShellTools } from './operations/shell.js';
import { registerGitTools } from './operations/git.js';

const WORKSPACE = process.env.WORKSPACE_PATH || '/app/workspace';

const server = new Server(
  {
    name: 'local-coding-agent',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

registerFileTools(server, WORKSPACE);
registerShellTools(server, WORKSPACE);
registerGitTools(server, WORKSPACE);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Serveur MCP démarré·©e sur', WORKSPACE);
}

main().catch(console.error);
