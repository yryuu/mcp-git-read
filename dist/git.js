import { simpleGit } from 'simple-git';
export class GitManager {
    git;
    constructor(baseDir) {
        this.git = simpleGit(baseDir);
    }
    async getStatus() {
        return this.git.status();
    }
    async getDiff(staged = false, files = []) {
        const options = staged ? ['--staged'] : [];
        if (files.length > 0) {
            options.push('--', ...files);
        }
        return this.git.diff(options);
    }
    async getLog(maxCount = 10) {
        // Using raw log for flexibility or ListLogSummary
        const log = await this.git.log(['-n', maxCount.toString()]);
        return JSON.stringify(log.all, null, 2);
    }
    async getBlame(path) {
        // Returns raw blame output
        return this.git.raw(['blame', path]);
    }
    async getShow(target) {
        // target can be a commit hash or "rev:path"
        return this.git.show([target]);
    }
    async getDiffBase(target, source, files = []) {
        // usage: diff base..target or simply diff target (against working tree/index depending on usage)
        // strict diff: git diff target source
        const args = [target];
        if (source) {
            args.push(source);
        }
        if (files.length > 0) {
            args.push('--', ...files);
        }
        return this.git.diff(args);
    }
}
