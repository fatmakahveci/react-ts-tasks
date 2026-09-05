import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';

const require = createRequire(import.meta.url);
let cliInstalled = true;
try {
  require.resolve('firebase-tools/package.json');
} catch (error) {
  if (error.code !== 'MODULE_NOT_FOUND') throw error;
  cliInstalled = false; // Production-only installs do not include the CLI.
}

if (cliInstalled) {
  const result = spawnSync(process.execPath, [require.resolve('patch-package'), '--error-on-fail'], {
    stdio: 'inherit',
  });
  if (result.error) throw result.error;
  process.exitCode = result.status ?? 1;
}
