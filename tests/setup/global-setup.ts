import { FullConfig } from '@playwright/test';
import { seedTestUsers, checkBackendAvailability } from './db-seeding';

/**
 * Global setup runs once before all tests
 * Seeds test users into the actual database
 */
async function globalSetup(config: FullConfig) {
  console.log('\n🚀 Running global test setup...\n');
  
  try {
    const baseURL = config.projects[0].use.baseURL || 'http://localhost:3000';
    console.log(`📍 Testing against: ${baseURL}`);
    
    // Check if backend is available
    console.log('� Checking backend availability...');
    const isBackendAvailable = await checkBackendAvailability();
    
    if (!isBackendAvailable) {
      console.warn('\n⚠️  WARNING: Backend API appears to be unavailable');
      console.warn('   Make sure your backend is running on http://localhost:8080');
      console.warn('   Tests may fail without a running backend\n');
    }
    
    // Seed test users to the database
    await seedTestUsers();
    
  } catch (error) {
    console.error('❌ Global setup failed:', error);
    throw error;
  }
  
  console.log('✅ Global setup completed\n');
}

export default globalSetup;
