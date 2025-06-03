// Simple debug script to test chatbot functionality
console.log('🔍 Debugging Chatbot Issues...');

// Test 1: Check if aiService exports are working
try {
  const aiService = require('./src/services/aiService.ts');
  console.log('✅ aiService imports successfully');
  
  // Test getEnhancedKnowledgeBase function
  if (typeof aiService.getEnhancedKnowledgeBase === 'function') {
    const kb = aiService.getEnhancedKnowledgeBase();
    console.log('✅ getEnhancedKnowledgeBase function works');
    console.log('📊 Knowledge base contains:', Object.keys(kb));
    console.log('🎨 NFTs count:', kb.nfts?.length || 0);
  } else {
    console.log('❌ getEnhancedKnowledgeBase function not found');
  }
} catch (error) {
  console.log('❌ aiService import failed:', error.message);
}

// Test 2: Check if all required files exist
const fs = require('fs');
const path = require('path');

const requiredFiles = [
  'src/services/aiService.ts',
  'src/services/analyticsService.ts',
  'src/services/suggestionService.ts',
  'src/hooks/useChatbot.ts',
  'src/components/Chatbot.tsx',
  'src/components/ChatSuggestions.tsx',
  'src/components/Chatbot.css',
  'src/App.tsx'
];

console.log('\n📁 Checking required files:');
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
  }
});

// Test 3: Check package.json dependencies
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const requiredDeps = [
    '@google/generative-ai',
    'react',
    'react-dom',
    'thirdweb'
  ];
  
  console.log('\n📦 Checking dependencies:');
  requiredDeps.forEach(dep => {
    if (packageJson.dependencies[dep]) {
      console.log(`✅ ${dep}: ${packageJson.dependencies[dep]}`);
    } else {
      console.log(`❌ ${dep} - MISSING`);
    }
  });
} catch (error) {
  console.log('❌ Could not read package.json:', error.message);
}

console.log('\n🎯 Debug Summary:');
console.log('- All TypeScript files should be syntactically correct');
console.log('- All imports should be properly structured');
console.log('- The chatbot should now work without 500 errors');
console.log('\n🚀 To test: npm run dev');