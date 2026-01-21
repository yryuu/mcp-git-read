import { GitManager } from '../src/git.js';
import path from 'path';

async function main() {
    const rootPath = path.resolve(process.cwd());
    const git = new GitManager(rootPath);

    console.log('Testing GitManager in:', rootPath);

    try {
        console.log('--- Git Status ---');
        const status = await git.getStatus();
        console.log(`Modified: ${status.modified.length}, Staged: ${status.staged.length}`);

        console.log('\n--- Git Diff (Unstaged) ---');
        const diff = await git.getDiff();
        console.log(diff ? diff.slice(0, 200) + '...' : 'No unstaged changes');

        console.log('\n--- Git Log (Last 1) ---');
        const logStr = await git.getLog(1);
        const log = JSON.parse(logStr);
        console.log(log[0]);
        const latestHash = log[0].hash;

        console.log('\n--- Git Show (Latest Commit) ---');
        const show = await git.getShow(latestHash);
        console.log(show.slice(0, 200) + '...');

        console.log('\n--- Git Blame (package.json) ---');
        const blame = await git.getBlame('package.json');
        console.log(blame.slice(0, 200) + '...');

        console.log('\n--- Git Diff (HEAD~1..HEAD) ---');
        try {
            const diffBase = await git.getDiffBase('HEAD', 'HEAD~1');
            console.log(diffBase.slice(0, 200) + '...');
        } catch (e) {
            console.log('Could not diff HEAD~1 (maybe shallow clone or not enough history)');
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

main();
