import { simpleGit, SimpleGit, StatusResult } from 'simple-git';

export class GitManager {
    private git: SimpleGit;

    constructor(baseDir: string) {
        this.git = simpleGit(baseDir);
    }

    async getStatus(): Promise<StatusResult> {
        return this.git.status();
    }

    async getDiff(staged: boolean = false, files: string[] = []): Promise<string> {
        const options = staged ? ['--staged'] : [];
        if (files.length > 0) {
            options.push('--', ...files);
        }
        return this.git.diff(options);
    }

    async getLog(maxCount: number = 10): Promise<string> {
        // Using raw log for flexibility or ListLogSummary
        const log = await this.git.log(['-n', maxCount.toString()]);
        return JSON.stringify(log.all, null, 2);
    }

    async getBlame(path: string): Promise<string> {
        // Returns raw blame output
        return this.git.raw(['blame', path]);
    }

    async getShow(target: string): Promise<string> {
        // target can be a commit hash or "rev:path"
        return this.git.show([target]);
    }

    async getDiffBase(target: string, source?: string, files: string[] = [], useThreeDot: boolean = false): Promise<string> {
        // usage: diff base..target or simply diff target (against working tree/index depending on usage)
        // strict diff: git diff target source
        const args = [];
        if (source && useThreeDot) {
            args.push(`${target}...${source}`);
        } else {
            args.push(target);
            if (source) {
                args.push(source);
            }
        }
        if (files.length > 0) {
            args.push('--', ...files);
        }
        return this.git.diff(args);
    }

    async getChangedFiles(target: string, source?: string): Promise<string[]> {
        const args = ['--name-only'];
        // For changed files in a PR, we almost always want triple-dot comparison if a source is provided
        if (source) {
            args.push(`${target}...${source}`);
        } else {
            args.push(target);
        }
        const result = await this.git.diff(args);
        return result.split('\n').filter(line => line.length > 0);
    }
}
