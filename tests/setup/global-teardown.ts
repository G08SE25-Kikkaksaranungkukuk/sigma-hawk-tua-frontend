import { FullConfig } from '@playwright/test';
import { cleanupTestUsers } from './seed-test-data';

/**
 * Global teardown runs once after all tests complete
 * Optional: Clean up test data if needed
 */
async function globalTeardown(config: FullConfig) {
  console.log('\n🧹 Running global test teardown...\n');
  
  try {
    // Optionally cleanup test users
    // Uncomment if you want to remove test users after tests
    // await cleanupTestUsers();
    
    console.log('✅ Global teardown completed\n');
  } catch (error) {
    console.error('❌ Global teardown failed:', error);
    // Don't throw - allow tests to complete even if cleanup fails
  }
}

export default globalTeardown;
