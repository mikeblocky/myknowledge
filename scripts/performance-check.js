#!/usr/bin/env node

/**
 * Performance Check Script for MyKnowledge
 * Run with: node scripts/performance-check.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 MyKnowledge Performance Check\n');

// Check if required tools are installed
function checkTools() {
  console.log('📋 Checking required tools...');
  
  try {
    // Check if lighthouse is installed
    execSync('lighthouse --version', { stdio: 'ignore' });
    console.log('✅ Lighthouse CLI installed');
  } catch (error) {
    console.log('❌ Lighthouse CLI not found. Install with: npm install -g lighthouse');
    console.log('   Or use: npx lighthouse');
  }
  
  try {
    // Check if webpack-bundle-analyzer is available
    const packagePath = path.join(__dirname, '..', 'node_modules', '.bin', 'webpack-bundle-analyzer');
    if (fs.existsSync(packagePath)) {
      console.log('✅ Webpack Bundle Analyzer available');
    } else {
      console.log('❌ Webpack Bundle Analyzer not found');
    }
  } catch (error) {
    console.log('❌ Webpack Bundle Analyzer not found');
  }
}

// Check bundle size
function checkBundleSize() {
  console.log('\n📦 Checking bundle size...');
  
  try {
    const buildOutput = execSync('npm run build', { 
      cwd: path.join(__dirname, '..'),
      encoding: 'utf8' 
    });
    
    // Extract bundle size information
    const bundleSizeMatch = buildOutput.match(/First Load JS shared by all[^\n]*?(\d+\.?\d*)\s*kB/);
    if (bundleSizeMatch) {
      const size = parseFloat(bundleSizeMatch[1]);
      console.log(`📊 Bundle size: ${size} kB`);
      
      if (size > 500) {
        console.log('⚠️  Bundle size is large. Consider code splitting and tree shaking.');
      } else if (size > 300) {
        console.log('⚠️  Bundle size is moderate. Room for optimization.');
      } else {
        console.log('✅ Bundle size is good!');
      }
    }
  } catch (error) {
    console.log('❌ Failed to build project');
  }
}

// Check dependencies
function checkDependencies() {
  console.log('\n🔍 Checking dependencies...');
  
  try {
    const packageJson = JSON.parse(
      fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8')
    );
    
    const { dependencies, devDependencies } = packageJson;
    const allDeps = { ...dependencies, ...devDependencies };
    
    console.log(`📦 Total dependencies: ${Object.keys(allDeps).length}`);
    
    // Check for large packages
    const largePackages = [
      'framer-motion',
      '@tiptap/react',
      'react-markdown'
    ];
    
    largePackages.forEach(pkg => {
      if (allDeps[pkg]) {
        console.log(`⚠️  Large package detected: ${pkg}`);
      }
    });
    
    // Check for duplicate packages
    const duplicateCheck = execSync('npm ls --depth=0', { 
      cwd: path.join(__dirname, '..'),
      encoding: 'utf8' 
    });
    
    if (duplicateCheck.includes('UNMET PEER DEPENDENCY')) {
      console.log('⚠️  Peer dependency issues detected');
    }
    
  } catch (error) {
    console.log('❌ Failed to check dependencies');
  }
}

// Check performance budget
function checkPerformanceBudget() {
  console.log('\n⏱️  Performance Budget Check...');
  
  const budget = {
    'First Contentful Paint': 1800, // 1.8s
    'Largest Contentful Paint': 2500, // 2.5s
    'First Input Delay': 100, // 100ms
    'Cumulative Layout Shift': 0.1, // 0.1
    'Total Blocking Time': 300, // 300ms
  };
  
  console.log('📊 Performance Budget:');
  Object.entries(budget).forEach(([metric, target]) => {
    console.log(`   ${metric}: ${target}${metric.includes('Time') || metric.includes('Delay') ? 'ms' : metric.includes('Shift') ? '' : 'ms'}`);
  });
  
  console.log('\n💡 To measure actual performance:');
  console.log('   1. Run: npx lighthouse http://localhost:3000 --output=json --output-path=./lighthouse-report.json');
  console.log('   2. Or use Chrome DevTools Performance tab');
  console.log('   3. Or use: npm run analyze');
}

// Main execution
async function main() {
  checkTools();
  checkBundleSize();
  checkDependencies();
  checkPerformanceBudget();
  
  console.log('\n🎯 Performance Optimization Tips:');
  console.log('   • Use React.memo() for expensive components');
  console.log('   • Implement virtual scrolling for long lists');
  console.log('   • Use dynamic imports for code splitting');
  console.log('   • Optimize images with next/image');
  console.log('   • Minimize bundle size with tree shaking');
  console.log('   • Use service worker for caching');
  console.log('   • Implement lazy loading');
  console.log('   • Monitor Core Web Vitals');
  
  console.log('\n✨ Performance check complete!');
}

main().catch(console.error); 