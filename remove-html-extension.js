import fs from 'fs';
import path from 'path';

const outDir = path.join(process.cwd(), 'out');
const files = fs.readdirSync(outDir);

files.forEach(file => {
  // Only allow renaming files with safe names (alphanumeric, dash, underscore, dot)
  if (
    file.endsWith('.html') &&
    file !== 'index.html' &&
    file !== '404.html' &&
    /^[\w\-\.]+\.html$/.test(file) // Validate file name
  ) {
    const oldPath = path.join(outDir, file);
    const newFileName = file.replace('.html', '');
    const newPath = path.join(outDir, newFileName);

    // Ensure new file name is also safe
    if (/^[\w\-\.]+$/.test(newFileName)) {
      fs.renameSync(oldPath, newPath);
      console.log(`Renamed ${file} to ${newFileName}`);
    } else {
      console.warn(`Skipped unsafe file name: ${newFileName}`);
    }
  }
});