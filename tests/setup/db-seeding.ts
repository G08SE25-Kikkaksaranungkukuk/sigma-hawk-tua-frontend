import { Interest } from "@/lib/types/api/interest"
import axios from "axios"

const API_BASE_URL = process.env.TEST_API_URL || "http://localhost:8080/api/v1"

export interface TestUser {
    first_name: string
    middle_name?: string
    last_name: string
    birth_date: string // ISO date format
    sex: string
    interests: string[]
    travel_styles: string[]
    phone: string
    email: string
    password: string
}
export interface Member {
    user_id: number
    first_name: string
    last_name: string
    profile_url?: string | null
    email: string
    birth_date?: Date
}
export interface TestGroup {
    group_id: number
    group_name: string
    group_leader_id: number
    description: string
    profile_url?: string | null
    max_members: number
    created_at: string
    updated_at: string
    leader: Member
    members: Member[]
    interests: Interest[]
}

export const TEST_USERS_DATA: Record<string, TestUser> = {
    testUser1: {
        first_name: "Jo",
        last_name: "Chanah",
        birth_date: "1995-01-15",
        sex: "male",
        interests: ["SEA", "MOUNTAIN", "NATIONAL_PARK"],
        travel_styles: ["BACKPACKER", "BUDGET"],
        phone: "0812345678",
        email: "jotest11@gmail.com",
        password: "TestPass123!",
    },
    testUser2: {
        first_name: "Jane",
        last_name: "Doe",
        birth_date: "1998-05-20",
        sex: "female",
        interests: ["SHOPPING_MALL", "CAFE", "FOOD_STREET"],
        travel_styles: ["LUXURY", "COMFORT"],
        phone: "0887654321",
        email: "janetest@gmail.com",
        password: "TestPass456!",
    },
    testDeleteUser: {
        //this user is for testing account deletion do not use for other tests
        first_name: "Bob",
        last_name: "Smith",
        birth_date: "1990-09-10",
        sex: "male",
        interests: ["SEA", "MOUNTAIN"],
        travel_styles: ["ADVENTURE", "BUDGET"],
        phone: "0891234567",
        email: "bobtest@gmail.com",
        password: "TestPass789!",
    },
}

export const TEST_GROUP_DATA = {
    testGroup1: {
        group_name: "test1",
        description: "A group for testing purposes",
        destination: "Testland",
        max_members: 10,
        profile: "",
        profile_url: "", // For preview purposes
        start_date: new Date("2023-01-01"),
        end_date: new Date("2023-12-31"),
        interest_fields: ["SEA"],
        ownerKey: "testUser1", // Default owner
    },
    testGroup2: {
        group_name: "beach-trip",
        description: "Weekend beach getaway",
        destination: "Samyan",
        max_members: 8,
        profile: "",
        profile_url: "",
        start_date: new Date("2025-11-15"),
        end_date: new Date("2025-11-18"),
        interest_fields: ["SEA", "FOOD_STREET"],
        ownerKey: "testUser2",
    },
    testGroup3: {
        group_name: "city-food-tour",
        description: "Explore the city's best food spots",
        destination: "Bangkok",
        max_members: 12,
        profile: "",
        profile_url: "",
        start_date: new Date("2024-06-10"),
        end_date: new Date("2024-06-12"),
        interest_fields: ["FOOD_STREET", "CAFE"],
        ownerKey: "testUser1",
    },
}

export const TEST_ITINERARY_DATA = [
    {
        title: "Samyan",
        description: "Relaxing day at the beach with water activities",
        start_date: new Date("2023-06-15T09:00:00"),
        end_date: new Date("2023-06-15T18:00:00"),
        place_links: [
            '0x862161157fa89659:0x78257f71872c99de'
        ],
    }
]

interface SeedResults {
    created: string[]
    existing: string[]
    failed: string[]
}

interface UserCreationResult {
    success: boolean
    status: 'created' | 'existing' | 'failed'
}

/**
 * Registers a single test user
 */
async function registerUser(user: TestUser): Promise<UserCreationResult> {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/auth/register`,
            user,
            {
                timeout: 10000,
                validateStatus: (status) => status < 500,
            }
        )

        if (response.status === 200 || response.status === 201) {
            console.log(`✅ Created test user: ${user.email}`)
            return { success: true, status: 'created' }
        } else if (response.status === 409 || response.status === 400) {
            console.log(`ℹ️  Test user already exists: ${user.email}`)
            return { success: true, status: 'existing' }
        } else {
            console.log(`⚠️  Unexpected response for ${user.email}: ${response.status}`)
            return { success: false, status: 'failed' }
        }
    } catch (error: any) {
        return handleRegistrationError(error, user.email)
    }
}

/**
 * Handles registration errors
 */
function handleRegistrationError(error: any, email: string): UserCreationResult {
    if (error.code === "ECONNREFUSED") {
        console.error(`❌ Cannot connect to backend API at ${API_BASE_URL}`)
        console.error(`   Make sure your backend is running on port 8080`)
        throw new Error("Backend API not available. Start backend before running tests.")
    } else if (error.response?.status === 409 || error.response?.status === 400) {
        console.log(`ℹ️  Test user already exists: ${email}`)
        return { success: true, status: 'existing' }
    } else {
        console.error(`❌ Failed to create test user ${email}:`, error.message)
        return { success: false, status: 'failed' }
    }
}

/**
 * Creates an authenticated axios instance for a user
 */
async function createAuthenticatedAxios(user: TestUser): Promise<any> {
    const axiosInstance = axios.create({
        withCredentials: true,
        timeout: 10000,
        validateStatus: (status) => status < 500,
    })

    const loginResponse = await axiosInstance.post(
        `${API_BASE_URL}/auth/login`,
        {
            email: user.email,
            password: user.password,
        }
    )

    if (loginResponse.status !== 200) {
        console.error(`❌ Failed to log in user ${user.email}:`, loginResponse.status)
        return null
    }

    console.log(`✅ Login successful for: ${user.email}`)

    const cookies = loginResponse.headers["set-cookie"]
    if (cookies && cookies.length > 0) {
        axiosInstance.defaults.headers.Cookie = cookies.join("; ")
        console.log(`🍪 Authentication cookies set for: ${user.email}`)
    }

    return axiosInstance
}

/**
 * Creates form data for group creation
 */
function createGroupFormData(group: (typeof TEST_GROUP_DATA)[keyof typeof TEST_GROUP_DATA]): FormData {
    const formData = new FormData()

    formData.append("group_name", group.group_name)
    if (group.description) {
        formData.append("description", group.description)
    }
    if (group.max_members) {
        formData.append("max_members", group.max_members.toString())
    }

    if (group.interest_fields && group.interest_fields.length > 0) {
        group.interest_fields.forEach((interest, index) => {
            formData.append(`interest_fields[${index}]`, interest)
        })
    }

    if (group.profile) {
        formData.append("profile", group.profile)
    }

    return formData
}

/**
 * Creates a test group
 */
async function createTestGroup(
    axiosInstance: any,
    group: (typeof TEST_GROUP_DATA)[keyof typeof TEST_GROUP_DATA],
    userEmail: string
): Promise<number | undefined> {
    try {
        const formData = createGroupFormData(group)

        const createGroupResponse = await axiosInstance.post(
            `${API_BASE_URL}/group`,
            formData,
            {
                withCredentials: true,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        )

        if (createGroupResponse.status === 200 || createGroupResponse.status === 201) {
            console.log(`📋 Group creation response:`, createGroupResponse.data)
            const groupId =
                createGroupResponse.data.data?.group_id ||
                createGroupResponse.data.group_id ||
                createGroupResponse.data.id
            console.log(`✅ Created test group: ${group.group_name} by user: ${userEmail} (Group ID: ${groupId})`)
            return groupId
        } else {
            console.log(`❌ Failed to create test group: ${group.group_name} for user: ${userEmail} - Status: ${createGroupResponse.status}`)
            console.log(`Response data:`, createGroupResponse.data)
            return undefined
        }
    } catch (error: any) {
        console.error("❌ Failed to create test group:", error.response?.data || error.message)
        return undefined
    }
}

/**
 * Creates and assigns an itinerary to a group
 */
async function createAndAssignItinerary(
    axiosInstance: any,
    itineraryData: typeof TEST_ITINERARY_DATA[0],
    groupId: number
): Promise<void> {
    try {
        const createItineraryResponse = await axiosInstance.post(
            `${API_BASE_URL.replace('/v1', '/v2')}/itineraries`,
            itineraryData,
            { withCredentials: true }
        )

        if (createItineraryResponse.status === 200 || createItineraryResponse.status === 201) {
            const itineraryId =
                createItineraryResponse.data.data?.itinerary_id ||
                createItineraryResponse.data.itinerary_id ||
                createItineraryResponse.data.id

            console.log(`✅ Created itinerary: ${itineraryData.title} (ID: ${itineraryId})`)

            if (itineraryId) {
                await assignItineraryToGroup(axiosInstance, itineraryId, groupId, itineraryData.title)
            }
        } else {
            console.log(`⚠️  Failed to create itinerary ${itineraryData.title}: ${createItineraryResponse.status}`)
        }
    } catch (error: any) {
        console.error(
            `❌ Failed to create/assign itinerary ${itineraryData.title}:`,
            error.response?.data || error.message
        )
    }
}

/**
 * Assigns an itinerary to a group
 */
async function assignItineraryToGroup(
    axiosInstance: any,
    itineraryId: number,
    groupId: number,
    itineraryTitle: string
): Promise<void> {
    try {
        const assignResponse = await axiosInstance.post(
            `${API_BASE_URL.replace('/v1', '/v2')}/groups/${groupId}/itineraries/assign`,
            { itinerary_id: itineraryId },
            { withCredentials: true }
        )

        if (assignResponse.status === 200 || assignResponse.status === 201) {
            console.log(`✅ Assigned itinerary ${itineraryTitle} to group ${groupId}`)
        } else {
            console.log(`⚠️  Failed to assign itinerary: ${assignResponse.status}`)
        }
    } catch (error: any) {
        console.error(`❌ Failed to assign itinerary:`, error.response?.data || error.message)
    }
}

/**
 * Creates itineraries for a group
 */
async function createGroupItineraries(axiosInstance: any, groupId: number): Promise<void> {
    for (const itineraryData of TEST_ITINERARY_DATA) {
        await createAndAssignItinerary(axiosInstance, itineraryData, groupId)
    }
}

/**
 * Handles group creation and itinerary setup - creates all groups in TEST_GROUP_DATA
 */
async function setupGroupsAndItineraries(axiosInstance: any, userEmail: string): Promise<number[]> {
    const createdGroupIds: number[] = []
    
    for (const [groupKey, group] of Object.entries(TEST_GROUP_DATA)) {
        console.log(groupKey)
        console.log(`🏗️  Creating group ${group.group_name} for user ${userEmail}...`)
        const groupId = await createTestGroup(axiosInstance, group, userEmail)
        
        if (groupId) {
            await createGroupItineraries(axiosInstance, groupId)
            createdGroupIds.push(groupId)
            console.log(`✅ Successfully created and setup group: ${group.group_name} (ID: ${groupId})`)
        } else {
            console.log(`❌ Failed to create group: ${group.group_name}`)
        }
    }
    
    console.log(`📋 Created ${createdGroupIds.length} groups total: [${createdGroupIds.join(', ')}]`)
    return createdGroupIds
}

/**
 * Joins a user to a group
 */
async function joinGroup(axiosInstance: any, groupId: number, userEmail: string): Promise<void> {
    try {
        const joinGroupResponse = await axiosInstance.put(
            `${API_BASE_URL}/group/${groupId}/member`,
            {},
            { withCredentials: true }
        )

        if (
            joinGroupResponse.status === 200 ||
            joinGroupResponse.status === 201 ||
            joinGroupResponse.status === 409
        ) {
            console.log(`✅ User: ${userEmail} joined group ID: ${groupId}`)
        } else {
            console.log(`❌ Failed to add user: ${userEmail} to group ID: ${groupId} - Status: ${joinGroupResponse.status}`)
            console.log(`Response data:`, joinGroupResponse.data)
        }
    } catch (error: any) {
        console.error(`❌ Failed to join group for user ${userEmail}:`, error.response?.data || error.message)
    }
}

/**
 * Processes a single user (register, login, group operations)
 */
async function processUser(
    user: TestUser,
    results: SeedResults,
    isFirstUser: boolean,
    existingGroupIds: number[] = []
): Promise<number[]> {
    const registrationResult = await registerUser(user)
    results[registrationResult.status].push(user.email)

    const axiosInstance = await createAuthenticatedAxios(user)
    if (!axiosInstance) {
        return existingGroupIds
    }

    let allGroupIds = [...existingGroupIds]
    if (isFirstUser) {
        const newGroupIds = await setupGroupsAndItineraries(axiosInstance, user.email)
        allGroupIds.push(...newGroupIds)
    }

    // Join all existing groups
    for (const groupId of allGroupIds) {
        await joinGroup(axiosInstance, groupId, user.email)
    }

    return allGroupIds
}

/**
 * Prints seeding summary
 */
function printSeedingSummary(results: SeedResults): void {
    console.log(`\n📊 Seeding Summary:`)
    console.log(`   Created: ${results.created.length}`)
    console.log(`   Already exists: ${results.existing.length}`)
    console.log(`   Failed: ${results.failed.length}\n`)

    if (
        results.failed.length > 0 &&
        results.created.length === 0 &&
        results.existing.length === 0
    ) {
        throw new Error("Failed to seed any test users. Check backend connection.")
    }

    console.log("✅ Test data seeding completed\n")
}

/**
 * Seeds the database with test users before tests run
 */
export async function seedTestUsers() {
    console.log("🌱 Seeding test users to database...")

    const results: SeedResults = {
        created: [],
        existing: [],
        failed: [],
    }

    let allGroupIds: number[] = []
    let isFirstUser = true

    for (const user of Object.values(TEST_USERS_DATA)) {
        allGroupIds = await processUser(user, results, isFirstUser, allGroupIds)
        isFirstUser = false
    }

    console.log(`\n📊 Total groups created: ${allGroupIds.length} (IDs: ${allGroupIds.join(', ')})\n`)
    printSeedingSummary(results)
}

interface CleanupStats {
    cleaned: number
    notFound: number
    failed: number
}

/**
 * Attempts to delete a single test user
 */
async function deleteTestUser(user: TestUser, stats: CleanupStats): Promise<boolean> {
    try {
        console.log(`🔑 Attempting login for: ${user.email}`)

        const axiosInstance = axios.create({
            withCredentials: true,
            timeout: 10000,
            validateStatus: (status) => status < 500,
        })

        const loginResponse = await axiosInstance.post(
            `${API_BASE_URL}/auth/login`,
            {
                email: user.email,
                password: user.password,
            }
        )

        if (loginResponse.status !== 200) {
            console.log(`❌ Login failed for ${user.email}: ${loginResponse.status}`)
            stats.notFound++
            return true
        }

        console.log(`✅ Login successful for: ${user.email}`)

        const deleteResult = await performUserDeletion(axiosInstance, user, loginResponse.headers["set-cookie"])
        
        if (deleteResult === 'deleted') {
            stats.cleaned++
        } else if (deleteResult === 'not_found') {
            stats.notFound++
        } else {
            stats.failed++
        }
        
        return true
    } catch (error: any) {
        return handleCleanupError(error, user.email, stats)
    }
}

/**
 * Performs the actual user deletion request
 */
async function performUserDeletion(
    axiosInstance: any,
    user: TestUser,
    cookies?: string[]
): Promise<'deleted' | 'not_found' | 'failed'> {
    const deleteHeaders: any = {
        "Content-Type": "application/json",
    }

    if (cookies && cookies.length > 0) {
        deleteHeaders["Cookie"] = cookies.join("; ")
    }

    const response = await axiosInstance.post(
        `${API_BASE_URL}/user/delete`,
        { password: user.password },
        { headers: deleteHeaders }
    )

    if (response.status === 200 || response.status === 204) {
        console.log(`✅ Deleted test user: ${user.email}`)
        return 'deleted'
    } else if (response.status === 404) {
        console.log(`ℹ️  Test user not found: ${user.email}`)
        return 'not_found'
    } else {
        console.log(`⚠️  Could not delete ${user.email}: ${response.status} - ${response.data}`)
        return 'failed'
    }
}

/**
 * Handles cleanup errors
 */
function handleCleanupError(error: any, email: string, stats: CleanupStats): boolean {
    if (error.response?.status === 404) {
        stats.notFound++
        console.log(`ℹ️  Test user not found: ${email}`)
        return true
    } else if (error.code === "ECONNREFUSED") {
        console.log(`⚠️  Backend not available for cleanup`)
        return false
    } else {
        stats.failed++
        console.error(`⚠️  Failed to cleanup user ${email}:`, error.message)
        return true
    }
}

/**
 * Cleans up test users after tests complete
 * Note: This requires a DELETE endpoint on your backend
 */
export async function cleanupTestUsers() {
    console.log("🧹 Cleaning up test users from database...")

    const stats: CleanupStats = {
        cleaned: 0,
        notFound: 0,
        failed: 0,
    }

    for (const user of Object.values(TEST_USERS_DATA)) {
        const shouldContinue = await deleteTestUser(user, stats)
        if (!shouldContinue) {
            break
        }
    }

    console.log(`\n📊 Cleanup Summary:`)
    console.log(`   Deleted: ${stats.cleaned}`)
    console.log(`   Not found: ${stats.notFound}`)
    console.log(`   Failed: ${stats.failed}\n`)

    console.log("✅ Cleanup completed\n")
}

/**
 * Check if backend is available
 */
export async function checkBackendAvailability(): Promise<boolean> {
    try {
        await axios.get(`${API_BASE_URL}/health`, { timeout: 5000 })
        return true
    } catch (error) {
        try {
            // Try a different endpoint if health endpoint doesn't exist
            await axios.get(API_BASE_URL, {
                timeout: 5000,
                validateStatus: () => true,
            })
            return true
        } catch {
            return false
        }
    }
}
