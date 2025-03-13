import * as esbuild from 'esbuild';
import { promises as fs } from 'fs'; // Use promises API for better async handling

await esbuild
  .build({
    entryPoints: ['./src/index.ts'],
    bundle: true,
    minify: true,
    outdir: 'dist',
    platform: 'node',
    format: 'cjs',
    external: ['sqlite3'], // Mark sqlite3 as external,
    define: {
      'process.env.DEBUG': JSON.stringify('tplt-node-server:*'),
    },
  })
  .then(async () => {
    try {
      await fs.copyFile('./.env', './dist/.env');
    } catch {
      console.log('No .env file found in build, skipping...');
    }
    console.log('project built');
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
