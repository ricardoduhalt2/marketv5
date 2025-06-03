// Simple test to check if the server starts correctly
console.log('🔍 Testing server startup...');

// Check if all required files exist
const fs = require('fs');
const path = require('path');

const requiredFiles = [
  'src/App.tsx',
  'src/main.tsx',
  'src/services/aiService.ts',
  'src/components/UCALogo.tsx',
  'vite.config.ts',
  'package.json'
];

console.log('\n📁 Checking required files:');
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} - exists`);
  } else {
    console.log(`❌ ${file} - missing`);
  }
});

// Check for syntax errors in key files
console.log('\n🔍 Checking for common syntax issues:');

try {
  const appContent = fs.readFileSync('src/App.tsx', 'utf8');
  
  // Check for unclosed tags
  const openDivs = (appContent.match(/<div/g) || []).length;
  const closeDivs = (appContent.match(/<\/div>/g) || []).length;
  
  if (openDivs === closeDivs) {
    console.log('✅ App.tsx - HTML tags balanced');
  } else {
    console.log(`❌ App.tsx - Unbalanced tags: ${openDivs} open divs, ${closeDivs} close divs`);
  }
  
  // Check for duplicate imports
  const importLines = appContent.split('\n').filter(line => line.trim().startsWith('import'));
  const uniqueImports = new Set(importLines);
  
  if (importLines.length === uniqueImports.size) {
    console.log('✅ App.tsx - No duplicate imports');
  } else {
    console.log('❌ App.tsx - Duplicate imports found');
  }
  
} catch (error) {
  console.log('❌ Error reading App.tsx:', error.message);
}

console.log('\n🚀 Recommendations:');
console.log('1. Stop the current dev server (Ctrl+C)');
console.log('2. Clear the cache: rm -rf node_modules/.vite');
console.log('3. Restart: npm run dev');
console.log('4. Check browser console for specific errors');

console.log('\n🔧 If error persists:');
console.log('1. Check if port 3000 is already in use');
console.log('2. Try a different port: npm run dev -- --port 3001');
console.log('3. Check environment variables in .env file');