const esbuild = require('esbuild');
const { execSync } = require('child_process');
require('dotenv').config();

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';

esbuild.build({
    entryPoints: ['src/content.ts', 'src/background.ts', 'src/popup.ts'],
    bundle: true,
    outdir: 'dist',
    define: {
        'process.env.BACKEND_URL': `"${BACKEND_URL}"`
    }
}).then(() => {
    execSync('copyfiles -u 0 manifest.json dist', { stdio: 'inherit' });
    execSync('copyfiles -u 1 src/popup.html dist', { stdio: 'inherit' });
    console.log('Build complete!');
}).catch(() => process.exit(1));
