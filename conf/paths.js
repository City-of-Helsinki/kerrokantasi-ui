const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.resolve(ROOT, 'src');
const ASSETS = path.resolve(ROOT, 'assets');

module.exports = {
  ROOT,
  SRC,
  ASSETS,
  ENTRY: './src/index.js',
  OUTPUT: path.resolve(ROOT, 'dist'),
};
