#!/usr/bin/env node

/**
 * Automated Vercel Project Setup Script
 * This script creates a Vercel project and sets up environment variables via API
 * 
 * Usage:
 *   1. Get a Vercel token from: https://vercel.com/account/tokens
 *   2. Run: VERCEL_TOKEN=your_token node setup-vercel-api.js
 */

const https = require('https');

const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
const TEAM_ID = 'team_Y73SM9FdcHEQ9T7KYWoz9zmE'; // daniel's projects
const PROJECT_NAME = 'site-2024';

const SUPABASE_URL = 'https://qmwfpdwbzmxitclvjsus.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFtd2ZwZHdiem14aXRjbHZqc3VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwODg2MjYsImV4cCI6MjA3OTY2NDYyNn0.D236yhOGX62ZcFXOsCRmH-HTG_lm78JdRGn-OQB822Y';

if (!VERCEL_TOKEN) {
  console.error('❌ VERCEL_TOKEN environment variable is required');
  console.log('\n📝 To get a token:');
  console.log('   1. Go to https://vercel.com/account/tokens');
  console.log('   2. Create a new token');
  console.log('   3. Run: VERCEL_TOKEN=your_token node setup-vercel-api.js');
  process.exit(1);
}

function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.vercel.com',
      path: path + (path.includes('?') ? '&' : '?') + `teamId=${TEAM_ID}`,
      method: method,
      headers: {
        'Authorization': `Bearer ${VERCEL_TOKEN}`,
        'Content-Type': 'application/json',
      },
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        try {
          const parsed = body ? JSON.parse(body) : {};
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsed);
          } else {
            reject(new Error(`API Error ${res.statusCode}: ${JSON.stringify(parsed)}`));
          }
        } catch (e) {
          reject(new Error(`Parse error: ${e.message}`));
        }
      });
    });

    req.on('error', reject);
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function createProject() {
  console.log('🚀 Creating Vercel project...');
  
  try {
    const result = await makeRequest('POST', '/v9/projects', {
      name: PROJECT_NAME,
      framework: 'nextjs',
    });
    
    console.log('✅ Project created:', result.name);
    console.log('   Project ID:', result.id);
    return result;
  } catch (error) {
    if (error.message.includes('already exists')) {
      console.log('ℹ️  Project already exists, fetching details...');
      const projects = await makeRequest('GET', '/v9/projects');
      const project = projects.projects.find(p => p.name === PROJECT_NAME);
      if (project) {
        console.log('✅ Found existing project:', project.name);
        return project;
      }
    }
    throw error;
  }
}

async function setEnvironmentVariable(projectId, key, value, target = ['production', 'preview', 'development']) {
  console.log(`📝 Setting ${key}...`);
  
  for (const env of target) {
    try {
      await makeRequest('POST', `/v10/projects/${projectId}/env`, {
        key,
        value,
        target: [env],
        type: 'encrypted',
      });
      console.log(`   ✅ Set for ${env}`);
    } catch (error) {
      console.log(`   ⚠️  ${env}: ${error.message}`);
    }
  }
}

async function main() {
  try {
    console.log('🔧 Setting up Vercel project: site-2024\n');
    
    const project = await createProject();
    console.log('');
    
    await setEnvironmentVariable(project.id, 'NEXT_PUBLIC_SUPABASE_URL', SUPABASE_URL);
    await setEnvironmentVariable(project.id, 'NEXT_PUBLIC_SUPABASE_ANON_KEY', SUPABASE_ANON_KEY);
    
    console.log('\n✅ Setup complete!');
    console.log('\n📋 Next steps:');
    console.log('   1. Link your local project: vercel link');
    console.log('   2. Deploy: vercel --prod');
    console.log(`\n🌐 Project URL: https://vercel.com/${TEAM_ID}/${PROJECT_NAME}`);
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

main();

