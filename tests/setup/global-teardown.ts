import { FullConfig } from '@playwright/test';
import { cleanupTestUsers } from './db-seeding';

/**
 * Global teardown runs once after all tests complete
 * Cleans up test users from the database
 */
async function globalTeardown(config: FullConfig) {
  console.log('\n🧹 Running global test teardown...\n');
  
  try {
    // Clean up test users from the database
    await cleanupTestUsers();
    
    console.log('✅ Global teardown completed\n');
  } catch (error) {
    console.error('❌ Global teardown failed:', error);
    // Don't throw - allow tests to complete even if cleanup fails
    console.log('⚠️  Cleanup failed but continuing...\n');
  }
}

export default globalTeardown;
