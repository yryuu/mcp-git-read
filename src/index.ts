#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
    Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { resolve, isAbsolute } from 'path';
import { GitManager } from './git.js';

// Get root path from environment variable or use current directory
const ROOT_PATH = process.env.MCP_ROOT_PATH || process.cwd();
const rootPath = resolve(ROOT_PATH);

console.error(`MCP Git Read Server starting with root path: ${rootPath}`);

const gitManager = new GitManager(rootPath);

const server = new Server(
    {
        name: 'mcp-git-read',
        version: '1.0.0',
    },
    {
        capabilities: {
            tools: {},
        },
    }
);

const tools: Tool[] = [
    {
        name: 'git_status',
        description: 'Get the git status of the repository. Returns modified, staged, and untracked files.',
        inputSchema: {
            type: 'object',
            properties: {},
        },
    },
    {
        name: 'git_diff',
        description: 'Get the git diff of the repository. By default shows unstaged changes. Can show staged changes, or compare branches/commits.',
        inputSchema: {
            type: 'object',
            properties: {
                staged: {
                    type: 'boolean',
                    description: 'If true, shows cached (staged) changes. Default is false.',
                },
                target: {
                    type: 'string',
                    description: 'Optional: Target branch/commit to compare. If provided, compares target against source (or working tree if source is omitted).',
                },
                source: {
                    type: 'string',
                    description: 'Optional: Source branch/commit to compare against target. Used as `git diff target source`.',
                },
            },
        },
    },
    {
        name: 'git_log',
        description: 'Get the git log of the repository.',
        inputSchema: {
            type: 'object',
            properties: {
                max_count: {
                    type: 'number',
                    description: 'Maximum number of commits to show. Default is 10.',
                },
            },
        },
    },
    {
        name: 'git_blame',
        description: 'Show what revision and author last modified each line of a file.',
        inputSchema: {
            type: 'object',
            properties: {
                path: {
                    type: 'string',
                    description: 'Path to the file to blame.',
                },
            },
            required: ['path'],
        },
    },
    {
        name: 'git_show',
        description: 'Show various types of objects (commits, tags, etc.) or file content at a specific revision.',
        inputSchema: {
            type: 'object',
            properties: {
                object: {
                    type: 'string',
                    description: 'The object to show (e.g., commit hash, "HEAD:path/to/file").',
                },
            },
            required: ['object'],
        },
    },
];

server.setRequestHandler(ListToolsRequestSchema, async () => {
    return { tools };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
        switch (name) {
            case 'git_status': {
                const status = await gitManager.getStatus();
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(status, null, 2),
                        },
                    ],
                };
            }

            case 'git_diff': {
                const staged = args?.staged as boolean | undefined;
                const target = args?.target as string | undefined;
                const source = args?.source as string | undefined;

                let diff;
                if (target) {
                    diff = await gitManager.getDiffBase(target, source);
                } else {
                    diff = await gitManager.getDiff(staged);
                }

                return {
                    content: [
                        {
                            type: 'text',
                            text: diff || 'No changes.',
                        },
                    ],
                };
            }

            case 'git_log': {
                const maxCount = (args?.max_count as number) || 10;
                const log = await gitManager.getLog(maxCount);
                return {
                    content: [
                        {
                            type: 'text',
                            text: log,
                        },
                    ],
                };
            }

            case 'git_blame': {
                const path = args?.path as string;
                const blame = await gitManager.getBlame(path);
                return {
                    content: [
                        {
                            type: 'text',
                            text: blame,
                        },
                    ],
                };
            }

            case 'git_show': {
                const object = args?.object as string;
                const content = await gitManager.getShow(object);
                return {
                    content: [
                        {
                            type: 'text',
                            text: content,
                        },
                    ],
                };
            }

            default:
                throw new Error(`Unknown tool: ${name}`);
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return {
            content: [
                {
                    type: 'text',
                    text: `Error: ${errorMessage}`,
                },
            ],
            isError: true,
        };
    }
});

async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('MCP Git Read Server running on stdio');
}

main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
});
