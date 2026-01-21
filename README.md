# MCP Git Read Server

A Model Context Protocol (MCP) server for reading git status, diffs, logs, and checking file history. This server provides read-only access to git repositories, optimized for code review agents.

## Installation

```bash
npm install
npm run build
```

## Tools

### `git_status`
Returns the status of the repository (modified, staged, untracked files).
- **Arguments**: None

### `git_diff`
Returns the diff of the repository.
- **Arguments**:
  - `staged` (boolean, optional): If true, shows cached (staged) changes.
  - `target` (string, optional): Target branch/commit to compare.
  - `source` (string, optional): Source branch/commit to compare against target.

### `git_log`
Returns the commit log.
- **Arguments**:
  - `max_count` (number, optional): Number of commits to show. Default is 10.

### `git_blame`
Show what revision and author last modified each line of a file.
- **Arguments**:
  - `path` (string, required): Path to the file to blame.

### `git_show`
Show various types of objects (commits, tags, etc.) or file content at a specific revision.
- **Arguments**:
  - `object` (string, required): The object to show (e.g., commit hash, "HEAD:path/to/file").

## Usage Examples

- **Check status**: `git_status`
- **Review unstaged changes**: `git_diff`
- **Review PR changes (feature vs main)**: `git_diff` (target="main", source="feature-branch") or `git_diff` (target="main") (if checked out)
- **Investigate a file's history**: `git_blame` (path="src/index.ts")
- **View specific commit**: `git_show` (object="abc1234")
- **View file from previous commit**: `git_show` (object="HEAD~1:src/index.ts")

## Configuration

The server uses the `MCP_ROOT_PATH` environment variable to determine the root directory of the git repository. If not set, it defaults to the current working directory.
