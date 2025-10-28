import axios from 'axios';

const API_BASE_URL = process.env.TEST_API_URL || 'http://localhost:8080/api/v1';

export interface TestUser {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export const TEST_USERS = {
  testUser1: {
    email: 'jo@gmail.com',
    password: 'Gu#yi7tu007',
    firstName: 'Jo',
    lastName: 'Chanah',
  },
} as const;

/**
 * Seeds the database with test users for E2E testing
 */
export async function seedTestUsers() {
  console.log('🌱 Seeding test users...');
  
  for (const [key, user] of Object.entries(TEST_USERS)) {
    try {
      // Try to register the test user
      const response = await axios.post(`${API_BASE_URL}/auth/register`, {
        email: user.email,
        password: user.password,
        firstName: user.firstName,
        lastName: user.lastName,
      });
      
      console.log(`✅ Created test user: ${user.email}`);
    } catch (error: any) {
      // If user already exists, that's fine - we can use the existing one
      if (error.response?.status === 409 || error.response?.status === 400) {
        console.log(`ℹ️  Test user already exists: ${user.email}`);
      } else {
        console.error(`❌ Failed to create test user ${user.email}:`, error.message);
        // Don't throw - continue with other users
      }
    }
  }
  
  console.log('✅ Test data seeding completed\n');
}

/**
 * Cleans up test users after testing (optional)
 */
export async function cleanupTestUsers() {
  console.log('🧹 Cleaning up test users...');
  
  for (const [key, user] of Object.entries(TEST_USERS)) {
    try {
      // This would require a delete endpoint on your backend
      // await axios.delete(`${API_BASE_URL}/users/${user.email}`);
      console.log(`ℹ️  Cleanup for ${user.email} (implement delete endpoint if needed)`);
    } catch (error: any) {
      console.error(`Failed to cleanup user ${user.email}:`, error.message);
    }
  }
  
  console.log('✅ Cleanup completed\n');
}
