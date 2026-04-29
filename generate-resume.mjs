import { spawn } from 'child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'fs';
import os from 'os';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const inputName = process.argv[2] || 'resume.html';
const outputName = process.argv[3] || inputName.replace(/\.html$/i, '.pdf');
const htmlPath = path.join(__dirname, inputName);
const pdfPath = path.join(__dirname, outputName);
const portraitPath = path.join(__dirname, 'public/images/portrait.jpg');
const chromeCandidates = [
  process.env.CHROME_PATH,
  '/mnt/c/Program Files/Google/Chrome/Application/chrome.exe',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium-browser',
  '/usr/bin/chromium',
].filter(Boolean);

const chromePath = chromeCandidates.find((candidate) => existsSync(candidate));

if (!chromePath) {
  throw new Error('No Chrome/Chromium executable found. Set CHROME_PATH to continue.');
}

if (!existsSync(htmlPath)) {
  throw new Error(`Input HTML not found: ${htmlPath}`);
}

const portraitB64 = readFileSync(portraitPath).toString('base64');
const portraitSrc = `data:image/jpeg;base64,${portraitB64}`;
const html = readFileSync(htmlPath, 'utf-8').replace('__PORTRAIT_DATA__', portraitSrc);

function runChrome(args) {
  return new Promise((resolve, reject) => {
    const child = spawn(chromePath, args, { stdio: ['ignore', 'pipe', 'pipe'] });
    let stderr = '';

    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });

    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0 || existsSync(pdfPath)) {
        resolve();
        return;
      }

      reject(new Error(stderr.trim() || `Chrome exited with code ${code}`));
    });
  });
}

const userDataDir = mkdtempSync(path.join(os.tmpdir(), 'resume-pdf-'));
const renderedHtmlPath = path.join(userDataDir, path.basename(inputName));
writeFileSync(renderedHtmlPath, html);

try {
  await runChrome([
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--run-all-compositor-stages-before-draw',
    '--virtual-time-budget=5000',
    '--print-to-pdf-no-header',
    `--user-data-dir=${userDataDir}`,
    `--print-to-pdf=${pdfPath}`,
    `file://${renderedHtmlPath}`,
  ]);
} finally {
  rmSync(userDataDir, { recursive: true, force: true });
}

console.log(`PDF generated: ${pdfPath}`);
