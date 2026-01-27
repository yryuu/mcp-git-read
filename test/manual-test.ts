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

        console.log('\n--- Changed Files (Working Tree vs main) ---');
        try {
            const files = await git.getChangedFiles('main');
            console.log('Changed files:', files);
        } catch (e) {
            console.log('Error getting changed files:', e);
        }

        console.log('\n--- Git Diff (Working Tree vs main) - src/git.ts ---');
        try {
            const diff = await git.getDiffBase('main', undefined, ['src/git.ts']);
            console.log(diff ? diff : 'No diff');
        } catch (e) { console.log(e); }


    } catch (error) {
        console.error('Error:', error);
    }
}

main();
