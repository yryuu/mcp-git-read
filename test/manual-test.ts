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
        console.log(diff ? diff.slice(0, 100) + '...' : 'No unstaged changes');

        console.log('\n--- Git Diff (Unstaged) - Filtered to .gitignore ---');
        const diffFiltered = await git.getDiff(false, ['.gitignore']);
        console.log(diffFiltered ? diffFiltered : 'No changes in .gitignore');

        console.log('\n--- Git Diff (HEAD~1..HEAD) - Filtered to package.json ---');
        try {
            const diffBase = await git.getDiffBase('HEAD', 'HEAD~1', ['package.json']);
            console.log(diffBase.slice(0, 100) + '...');
        } catch (e) {
            console.log('Could not diff HEAD~1');
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

main();
