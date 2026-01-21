# MCP Git Read Server

A Model Context Protocol (MCP) server for reading git status, diffs, logs, and checking file history. This server provides read-only access to git repositories, optimized for code review agents.

## Usage with Claude Desktop

To use this server with Claude Desktop, add the following configuration to your `claude_desktop_config.json`:

### Option 1: Run directly from GitHub (Recommended)
This method requires `npx` installed.

```json
{
  "mcpServers": {
    "git-read": {
      "command": "npx",
      "args": [
        "-y",
        "github:yryuu/mcp-git-read"
      ],
      "env": {
        "MCP_ROOT_PATH": "/path/to/your/git/repository"
      }
    }
  }
}
```

### Option 2: Run locally
Clone the repository, build it, and point to it.

```bash
git clone https://github.com/yryuu/mcp-git-read.git
cd mcp-git-read
npm install
npm run build
```

Then configure:

```json
{
  "mcpServers": {
    "git-read": {
      "command": "node",
      "args": [
        "/absolute/path/to/mcp-git-read/dist/index.js"
      ],
      "env": {
        "MCP_ROOT_PATH": "/path/to/your/git/repository"
      }
    }
  }
}
```

## Tools

### `git_status`
Returns the status of the repository (modified, staged, untracked files).

### `git_diff`
Returns the diff of the repository.
- `staged` (boolean, optional): If true, shows cached (staged) changes.
- `target` (string, optional): Target branch/commit to compare.
- `source` (string, optional): Source branch/commit.
- `files` (array of strings, optional): List of files to include in the diff.

### `git_log`
Returns the commit log.
- `max_count` (number, optional): Default 10.

### `git_blame`
Show what revision and author last modified each line.
- `path` (string, required)

### `git_show`
Show objects or file content at a specific revision.
- `object` (string, required): Commit hash or "ref:path".

## Configuration environment variables

- `MCP_ROOT_PATH`: (Required) The absolute path to the git repository you want to read. If omitted, it defaults to the directory where the process is started (which might not be useful for npx).

## Development

```bash
npm install
npm test
```
