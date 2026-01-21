import { simpleGit, SimpleGit, StatusResult } from 'simple-git';

export class GitManager {
    private git: SimpleGit;

    constructor(baseDir: string) {
        this.git = simpleGit(baseDir);
    }

    async getStatus(): Promise<StatusResult> {
        return this.git.status();
    }

    async getDiff(staged: boolean = false): Promise<string> {
        const options = staged ? ['--staged'] : [];
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

    async getDiffBase(target: string, source?: string): Promise<string> {
        // usage: diff base..target or simply diff target (against working tree/index depending on usage)
        // strict diff: git diff target source
        if (source) {
            return this.git.diff([target, source]);
        }
        return this.git.diff([target]);
    }
}
