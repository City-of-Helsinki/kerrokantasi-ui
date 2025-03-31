import fs from 'fs';
import path from 'path';

import { glob } from 'glob';

/**
 * Creates an empty baseline coverage file that includes all source files
 */
function createBaselineCoverage() {

  // Clean up existing nyc_output directory in a platform-independent way
  const nycOutput = path.join(process.cwd(), 'coverage-temp');
  if (fs.existsSync(nycOutput)) {
    try {
      // Remove all files in the directory
      const files = fs.readdirSync(nycOutput);
      for (const file of files) {
        const filePath = path.join(nycOutput, file);
        if (fs.lstatSync(filePath).isDirectory()) {
          // Recursively remove directories
          fs.rmSync(filePath, { recursive: true, force: true });
        } else {
          // Remove files
          fs.unlinkSync(filePath);
        }
      }
      console.log('Cleaned up coverage-temp directory');
    } catch (err) {
      console.error('Error cleaning coverage-temp directory:', err);
    }
  } else {
    // Create directory if it doesn't exist
    fs.mkdirSync(nycOutput, { recursive: true });
    console.log('Created coverage-temp directory');
  }

  // Get all source files
  const srcFiles = glob.sync('src/**/*.{js,jsx}', {
    ignore: [
      'node_modules/**',
      '**/__mocks__/**',
      '**/__tests__/**',
      '**/setupTests.js',
      '**/*.test.{js,jsx}',
      '**/*.spec.{js,jsx}'
    ],
    cwd: process.cwd()
  });

  // Create empty coverage object
  const coverage = {};

  // Add each file with empty coverage data
  srcFiles.forEach(file => {
    const absPath = path.resolve(process.cwd(), file);
    coverage[absPath] = {
      path: absPath,
      statementMap: {},
      fnMap: {},
      branchMap: {},
      s: {},
      f: {},
      b: {}
    };
  });

  // Ensure directory exists
  if (!fs.existsSync(nycOutput)) {
    fs.mkdirSync(nycOutput, { recursive: true });
  }

  // Write the baseline coverage file
  fs.writeFileSync(
    path.join(nycOutput, 'baseline-coverage.json'),
    JSON.stringify(coverage)
  );

  console.log('Created baseline coverage file with all source files');
}

createBaselineCoverage();
