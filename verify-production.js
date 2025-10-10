#!/usr/bin/env node

/**
 * Production Environment Verification Script
 * 
 * Run this before deploying to check if everything is configured correctly
 * Usage: node verify-production.js
 */

console.log('\n🔍 PetCare Pro - Production Verification\n');
console.log('=' .repeat(50));

let errors = [];
let warnings = [];
let success = [];

// Check Node version
console.log('\n📦 Checking Node.js version...');
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
if (majorVersion >= 18) {
  success.push(`✅ Node.js version: ${nodeVersion} (Good!)`);
} else {
  errors.push(`❌ Node.js version: ${nodeVersion} (Need 18 or higher)`);
}

// Check environment variables
console.log('\n🔐 Checking environment variables...');

const requiredVars = [
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
  'ENCRYPTION_KEY',
  'SESSION_SECRET'
];

const optionalVars = [
  'GEMINI_API_KEY',
  'DATABASE_URL',
  'PORT'
];

// Check required variables
requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (!value || value.includes('your-') || value.includes('here')) {
    errors.push(`❌ ${varName} is missing or not configured`);
  } else {
    // Check specific formats
    if (varName === 'SUPABASE_URL' && !value.includes('supabase.co')) {
      warnings.push(`⚠️  ${varName} might not be a valid Supabase URL`);
    } else if (varName === 'ENCRYPTION_KEY' && value.length !== 64) {
      errors.push(`❌ ${varName} must be exactly 64 hex characters (got ${value.length})`);
    } else if (varName === 'SESSION_SECRET' && value.length < 32) {
      warnings.push(`⚠️  ${varName} should be at least 32 characters for security`);
    } else {
      success.push(`✅ ${varName} is configured`);
    }
  }
});

// Check optional variables
optionalVars.forEach(varName => {
  const value = process.env[varName];
  if (!value || value.includes('your-') || value.includes('here')) {
    warnings.push(`⚠️  ${varName} is not configured (optional)`);
  } else {
    success.push(`✅ ${varName} is configured`);
  }
});

// Check NODE_ENV
console.log('\n🌍 Checking environment...');
const nodeEnv = process.env.NODE_ENV || 'development';
if (nodeEnv === 'production') {
  success.push(`✅ NODE_ENV is set to 'production'`);
} else {
  warnings.push(`⚠️  NODE_ENV is '${nodeEnv}' (should be 'production' for deployment)`);
}

// Check dependencies
console.log('\n📚 Checking critical dependencies...');
const criticalPackages = [
  '@supabase/supabase-js',
  'crypto-js',
  'express',
  'react',
  'drizzle-orm'
];

let packageJson;
try {
  packageJson = require('./package.json');
  success.push(`✅ package.json found`);
  
  criticalPackages.forEach(pkg => {
    if (packageJson.dependencies[pkg] || packageJson.devDependencies[pkg]) {
      success.push(`✅ ${pkg} is installed`);
    } else {
      errors.push(`❌ ${pkg} is missing from package.json`);
    }
  });
} catch (e) {
  errors.push(`❌ package.json not found or invalid`);
}

// Check for encryption key format
console.log('\n🔒 Validating encryption configuration...');
const encryptionKey = process.env.ENCRYPTION_KEY;
if (encryptionKey) {
  const hexRegex = /^[0-9a-fA-F]{64}$/;
  if (hexRegex.test(encryptionKey)) {
    success.push(`✅ ENCRYPTION_KEY format is correct (64 hex characters)`);
  } else {
    errors.push(`❌ ENCRYPTION_KEY must be 64 hexadecimal characters`);
    console.log(`   Current length: ${encryptionKey.length}`);
    console.log(`   Generate new key: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`);
  }
}

// Check Supabase configuration
console.log('\n🗄️  Validating Supabase configuration...');
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (supabaseUrl && supabaseKey) {
  if (supabaseUrl.startsWith('https://') && supabaseUrl.endsWith('.supabase.co')) {
    success.push(`✅ Supabase URL format looks correct`);
  } else {
    warnings.push(`⚠️  Supabase URL might be incorrect`);
  }
  
  if (supabaseKey.length > 100) {
    success.push(`✅ Supabase anon key looks valid`);
  } else {
    warnings.push(`⚠️  Supabase anon key seems too short`);
  }
}

// Check for sensitive files in git (if .git exists)
console.log('\n🔒 Checking for security issues...');
const fs = require('fs');
const path = require('path');

if (fs.existsSync('.git')) {
  if (fs.existsSync('.gitignore')) {
    const gitignore = fs.readFileSync('.gitignore', 'utf8');
    if (gitignore.includes('.env')) {
      success.push(`✅ .env is in .gitignore`);
    } else {
      errors.push(`❌ .env is NOT in .gitignore - SECURITY RISK!`);
    }
    
    if (gitignore.includes('node_modules')) {
      success.push(`✅ node_modules is in .gitignore`);
    } else {
      warnings.push(`⚠️  node_modules should be in .gitignore`);
    }
  } else {
    warnings.push(`⚠️  .gitignore not found`);
  }
  
  // Check if .env is tracked by git
  if (fs.existsSync('.env')) {
    const { execSync } = require('child_process');
    try {
      execSync('git ls-files --error-unmatch .env', { stdio: 'pipe' });
      errors.push(`❌ .env is tracked by Git - SECURITY RISK! Run: git rm --cached .env`);
    } catch (e) {
      success.push(`✅ .env is not tracked by Git`);
    }
  }
}

// Summary
console.log('\n' + '='.repeat(50));
console.log('\n📊 VERIFICATION SUMMARY\n');

if (success.length > 0) {
  console.log('✅ Success:');
  success.forEach(msg => console.log(`   ${msg}`));
}

if (warnings.length > 0) {
  console.log('\n⚠️  Warnings:');
  warnings.forEach(msg => console.log(`   ${msg}`));
}

if (errors.length > 0) {
  console.log('\n❌ Errors:');
  errors.forEach(msg => console.log(`   ${msg}`));
}

console.log('\n' + '='.repeat(50));

// Final verdict
if (errors.length === 0 && warnings.length === 0) {
  console.log('\n🎉 PERFECT! Your environment is production-ready!\n');
  process.exit(0);
} else if (errors.length === 0) {
  console.log(`\n✅ GOOD! ${warnings.length} warning(s) to review, but you can deploy.\n`);
  process.exit(0);
} else {
  console.log(`\n❌ NOT READY! Fix ${errors.length} error(s) before deploying.\n`);
  console.log('💡 Tips:');
  console.log('   1. Copy ENV_TEMPLATE.txt to .env');
  console.log('   2. Fill in all required values');
  console.log('   3. Generate keys: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"');
  console.log('   4. Set up Supabase: See SUPABASE_QUICKSTART.md');
  console.log('   5. Run this script again: node verify-production.js\n');
  process.exit(1);
}

