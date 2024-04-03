import { it, describe, beforeEach, afterEach } from 'node:test';
import assert from 'assert';
import fs from 'fs';
import { execSync } from 'child_process';
import os from 'os';
import path from 'path';

describe('github-repo-to-markdown', () => {
  const tempDir = path.join(os.tmpdir(), 'github-repo-to-markdown-test');
  const fixtureDir = path.join(tempDir, 'fixture');
  const zipPath = path.join(tempDir, 'repo.zip');
  const outputPath = path.join(tempDir, 'output.md');

  beforeEach(() => {
    fs.mkdirSync(tempDir, { recursive: true });
    fs.mkdirSync(fixtureDir, { recursive: true });

    // Create a sample file in the fixture directory
    fs.writeFileSync(path.join(fixtureDir, 'sample.txt'), 'Sample file content');

    // Create a zip file of the fixture directory
    execSync(`zip -r "${zipPath}" "${fixtureDir}"`);
  });

  afterEach(() => {
    fs.rmdirSync(tempDir, { recursive: true });
  });

  it('should create a markdown file with file paths and code', () => {
    execSync(`node index.mjs "${zipPath}" "${outputPath}"`);
    assert.strictEqual(fs.existsSync(outputPath), true);

    const markdownContent = fs.readFileSync(outputPath, 'utf8');
    assert.strictEqual(markdownContent.includes('fixture/sample.txt'), true);
    assert.strictEqual(markdownContent.includes('Sample file content'), true);
  });
});