import { chromium, FullConfig } from '@playwright/test';
import { seedTestUsers } from './seed-test-data';

/**
 * Global setup runs once before all tests
 * This is where we seed test data and prepare the test environment
 */
async function globalSetup(config: FullConfig) {
  console.log('\n🚀 Running global test setup...\n');
  
  try {
    // Seed test users before running any tests
    await seedTestUsers();
    
    // Optional: You can also check if the backend is ready
    const baseURL = config.projects[0].use.baseURL || 'http://localhost:3000';
    console.log(`📍 Testing against: ${baseURL}\n`);
    
  } catch (error) {
    console.error('❌ Global setup failed:', error);
    throw error;
  }
  
  console.log('✅ Global setup completed\n');
}

export default globalSetup;
