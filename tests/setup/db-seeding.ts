import axios from 'axios';

const API_BASE_URL = process.env.TEST_API_URL || 'http://localhost:8080/api/v1';

export interface TestUser {
  first_name: string;
  middle_name?: string;
  last_name: string;
  birth_date: string; // ISO date format
  sex: string;
  interests: string[];
  travel_styles: string[];
  phone: string;
  email: string;
  password: string;
}

export const TEST_USERS_DATA: Record<string, TestUser> = {
  testUser1: {
    first_name: 'Jo',
    last_name: 'Chanah',
    birth_date: '1995-01-15',
    sex: 'male',
    interests: ['SEA', 'MOUNTAIN', 'NATIONAL_PARK'],
    travel_styles: ['BACKPACKER', 'BUDGET'],
    phone: '0812345678',
    email: 'jotest11@gmail.com',
    password: 'TestPass123!',
  },
  testUser2: {
    first_name: 'Jane',
    last_name: 'Doe',
    birth_date: '1998-05-20',
    sex: 'female',
    interests: ['SHOPPING_MALL', 'CAFE', 'FOOD_STREET'],
    travel_styles: ['LUXURY', 'COMFORT'],
    phone: '0887654321',
    email: 'janetest@gmail.com',
    password: 'TestPass456!',
  },
  testUser3: {
    first_name: 'bob',
    last_name: 'smith',
    birth_date: '1998-05-20',
    sex: 'male',
    interests: ['SHOPPING_MALL', 'CAFE', 'FOOD_STREET'],
    travel_styles: ['LUXURY', 'COMFORT'],
    phone: '0887654321',
    email: 'bobsmith@gmail.com',
    password: 'TestPass456!',
  },
};

/**
 * Seeds the database with test users before tests run
 */
export async function seedTestUsers() {
  console.log('🌱 Seeding test users to database...');
  
  const results = {
    created: [] as string[],
    existing: [] as string[],
    failed: [] as string[],
  };
  
  for (const [key, user] of Object.entries(TEST_USERS_DATA)) {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, user, {
        timeout: 10000,
        validateStatus: (status) => status < 500, // Don't throw on 4xx errors
      });
      
      if (response.status === 200 || response.status === 201) {
        results.created.push(user.email);
        console.log(`✅ Created test user: ${user.email}`);
      } else if (response.status === 409 || response.status === 400) {
        results.existing.push(user.email);
        console.log(`ℹ️  Test user already exists: ${user.email}`);
      } else {
        results.failed.push(user.email);
        console.log(`⚠️  Unexpected response for ${user.email}: ${response.status}`);
      }
    } catch (error: any) {
      if (error.code === 'ECONNREFUSED') {
        console.error(`❌ Cannot connect to backend API at ${API_BASE_URL}`);
        console.error(`   Make sure your backend is running on port 8080`);
        throw new Error('Backend API not available. Start backend before running tests.');
      } else if (error.response?.status === 409 || error.response?.status === 400) {
        results.existing.push(user.email);
        console.log(`ℹ️  Test user already exists: ${user.email}`);
      } else {
        results.failed.push(user.email);
        console.error(`❌ Failed to create test user ${user.email}:`, error.message);
      }
    }
  }
  
  console.log(`\n📊 Seeding Summary:`);
  console.log(`   Created: ${results.created.length}`);
  console.log(`   Already exists: ${results.existing.length}`);
  console.log(`   Failed: ${results.failed.length}\n`);
  
  if (results.failed.length > 0 && results.created.length === 0 && results.existing.length === 0) {
    throw new Error('Failed to seed any test users. Check backend connection.');
  }
  
  console.log('✅ Test data seeding completed\n');
}

/**
 * Cleans up test users after tests complete
 * Note: This requires a DELETE endpoint on your backend
 */
export async function cleanupTestUsers() {
  console.log('🧹 Cleaning up test users from database...');
  
  let cleaned = 0;
  let notFound = 0;
  let failed = 0;
  
  for (const [key, user] of Object.entries(TEST_USERS_DATA)) {
    try {
      // Attempt to delete user - your backend needs to implement this endpoint
      const response = await axios.delete(`${API_BASE_URL}/users/${user.email}`, {
        timeout: 10000,
        validateStatus: (status) => status < 500,
      });
      
      if (response.status === 200 || response.status === 204) {
        cleaned++;
        console.log(`✅ Deleted test user: ${user.email}`);
      } else if (response.status === 404) {
        notFound++;
        console.log(`ℹ️  Test user not found: ${user.email}`);
      } else {
        failed++;
        console.log(`⚠️  Could not delete ${user.email}: ${response.status}`);
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        notFound++;
        console.log(`ℹ️  Test user not found: ${user.email}`);
      } else if (error.code === 'ECONNREFUSED') {
        console.log(`⚠️  Backend not available for cleanup`);
        break;
      } else {
        failed++;
        console.error(`⚠️  Failed to cleanup user ${user.email}:`, error.message);
      }
    }
  }
  
  console.log(`\n📊 Cleanup Summary:`);
  console.log(`   Deleted: ${cleaned}`);
  console.log(`   Not found: ${notFound}`);
  console.log(`   Failed: ${failed}\n`);
  
  console.log('✅ Cleanup completed\n');
}

/**
 * Check if backend is available
 */
export async function checkBackendAvailability(): Promise<boolean> {
  try {
    await axios.get(`${API_BASE_URL}/health`, { timeout: 5000 });
    return true;
  } catch (error) {
    try {
      // Try a different endpoint if health endpoint doesn't exist
      await axios.get(API_BASE_URL, { timeout: 5000, validateStatus: () => true });
      return true;
    } catch {
      return false;
    }
  }
}
