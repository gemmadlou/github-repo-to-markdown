// index.mjs

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import os from 'os';

// Function to extract the zip file
function extractZip(zipPath, extractPath) {
  // Use the appropriate command based on the operating system
  const command = process.platform === 'win32' ? `powershell -Command "Expand-Archive -Path '${zipPath}' -DestinationPath '${extractPath}'"` : `unzip -q "${zipPath}" -d "${extractPath}"`;
  execSync(command);
}

// Function to convert the repository to markdown
function repoToMarkdown(repoPath, outputPath) {
  const markdown = [];

  // Recursive function to process files and directories
  function processPath(currentPath) {
    const files = fs.readdirSync(currentPath);
    for (const file of files) {
      const filePath = path.join(currentPath, file);
      const relativeFilePath = path.relative(repoPath, filePath);
      const stats = fs.statSync(filePath);

      if (stats.isDirectory()) {
        processPath(filePath); // Recursively process subdirectories
      } else {
        const fileExtension = path.extname(file).toLowerCase();
        let dontInclude = [
            ".png",
            '.jpg',
            '.jpeg',
            '.gif',
            '.lockb',
            '.ico',
            '.db',
            '.dev'
        ]
        if (!dontInclude.includes(fileExtension)) {
          const fileContent = fs.readFileSync(filePath, 'utf8');
          markdown.push(`\`\`\`\n// ${relativeFilePath}\n\n${fileContent}\n\`\`\`\n`);
        } else {
          markdown.push(`\n// ${relativeFilePath}\n\n[Binary file: ${file}]\n`);
        }
      }
    }
  }

  processPath(repoPath);

  // Write the markdown content to the output file
  fs.writeFileSync(outputPath, markdown.join('\n'));
}

// Main function
function main() {
  const zipPath = process.argv[2];
  const outputPath = process.argv[3];

  if (!zipPath || !outputPath) {
    console.log('Usage: node index.mjs <zip_path> <output_path>');
    process.exit(1);
  }

  const tempDir = path.join(os.tmpdir(), 'github-repo-to-markdown');
  fs.mkdirSync(tempDir, { recursive: true });

  try {
    extractZip(zipPath, tempDir);
    const repoPath = path.join(tempDir, fs.readdirSync(tempDir)[0]);
    repoToMarkdown(repoPath, outputPath);
    console.log(`Markdown file created at ${outputPath}`);
  } catch (error) {
    console.error('An error occurred:', error);
  } finally {
    fs.rmdirSync(tempDir, { recursive: true });
  }
}

main();