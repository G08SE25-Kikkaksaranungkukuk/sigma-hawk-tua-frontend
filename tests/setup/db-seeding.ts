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

/**
 * Seeds the database with test users before tests run
 */
export async function seedTestUsers() {
    console.log("🌱 Seeding test users to database...")

    const results = {
        created: [] as string[],
        existing: [] as string[],
        failed: [] as string[],
    }
    var groupId: number | undefined
    let isFirstUser = true

    for (const [key, user] of Object.entries(TEST_USERS_DATA)) {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/auth/register`,
                user,
                {
                    timeout: 10000,
                    validateStatus: (status) => status < 500, // Don't throw on 4xx errors
                }
            )

            if (response.status === 200 || response.status === 201) {
                results.created.push(user.email)
                console.log(`✅ Created test user: ${user.email}`)
            } else if (response.status === 409 || response.status === 400) {
                results.existing.push(user.email)
                console.log(`ℹ️  Test user already exists: ${user.email}`)
            } else {
                results.failed.push(user.email)
                console.log(
                    `⚠️  Unexpected response for ${user.email}: ${response.status}`
                )
            }
        } catch (error: any) {
            if (error.code === "ECONNREFUSED") {
                console.error(
                    `❌ Cannot connect to backend API at ${API_BASE_URL}`
                )
                console.error(
                    `   Make sure your backend is running on port 8080`
                )
                throw new Error(
                    "Backend API not available. Start backend before running tests."
                )
            } else if (
                error.response?.status === 409 ||
                error.response?.status === 400
            ) {
                results.existing.push(user.email)
                console.log(`ℹ️  Test user already exists: ${user.email}`)
            } else {
                results.failed.push(user.email)
                console.error(
                    `❌ Failed to create test user ${user.email}:`,
                    error.message
                )
            }
        }
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
        if (loginResponse.status === 200) {
            console.log(`✅ Login successful for: ${user.email}`)

            // Extract cookies from login response for subsequent requests
            const cookies = loginResponse.headers["set-cookie"]
            if (cookies && cookies.length > 0) {
                // Set the cookies for all subsequent requests
                axiosInstance.defaults.headers.Cookie = cookies.join("; ")
                console.log(`🍪 Authentication cookies set for: ${user.email}`)
            }
        } else if (loginResponse.status !== 200) {
            console.error(
                `❌ Failed to log in user ${user.email}:`,
                loginResponse.status
            )
            continue
        }

        // Only create group for the first user, others will join
        if (isFirstUser) {
            for (const [key, group] of Object.entries(TEST_GROUP_DATA)) {
                try {
                    const formData = new FormData()

                    // Append text fields
                    formData.append("group_name", group.group_name)
                    if (group.description) {
                        formData.append("description", group.description)
                    }
                    if (group.max_members) {
                        formData.append(
                            "max_members",
                            group.max_members.toString()
                        )
                    }

                    // Append interest fields as JSON string or individual entries
                    if (
                        group.interest_fields &&
                        group.interest_fields.length > 0
                    ) {
                        group.interest_fields.forEach((interest, index) => {
                            formData.append(
                                `interest_fields[${index}]`,
                                interest
                            )
                        })
                    }

                    // Append file if provided
                    if (group.profile) {
                        formData.append("profile", group.profile)
                    }

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
                    if (
                        createGroupResponse.status === 200 ||
                        createGroupResponse.status === 201
                    ) {
                        console.log(
                            `📋 Group creation response:`,
                            createGroupResponse.data
                        )
                        groupId =
                            createGroupResponse.data.data?.group_id ||
                            createGroupResponse.data.group_id ||
                            createGroupResponse.data.id
                        console.log(
                            `✅ Created test group: ${group.group_name} by user: ${user.email} (Group ID: ${groupId})`
                        )

                        // Create and assign itineraries to the group
                        if (groupId) {
                            for (const itineraryData of TEST_ITINERARY_DATA) {
                                try {
                                    // Create itinerary
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

                                        // Assign itinerary to group
                                        if (itineraryId) {
                                            const assignResponse = await axiosInstance.post(
                                                `${API_BASE_URL.replace('/v1', '/v2')}/groups/${groupId}/itineraries/assign`,
                                                { itinerary_id: itineraryId },
                                                { withCredentials: true }
                                            )

                                            if (assignResponse.status === 200 || assignResponse.status === 201) {
                                                console.log(`✅ Assigned itinerary ${itineraryData.title} to group ${groupId}`)
                                            } else {
                                                console.log(`⚠️  Failed to assign itinerary: ${assignResponse.status}`)
                                            }
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
                        }
                    } else {
                        console.log(
                            `❌ Failed to create test group: ${group.group_name} for user: ${user.email} - Status: ${createGroupResponse.status}`
                        )
                        console.log(`Response data:`, createGroupResponse.data)
                    }
                } catch (error: any) {
                    console.error(
                        "❌ Failed to create test group:",
                        error.response?.data || error.message
                    )
                }
            }
            isFirstUser = false
        }

        // Join the group (both creator and other users)
        if (groupId) {
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
                    console.log(
                        `✅ User: ${user.email} joined group ID: ${groupId}`
                    )
                } else {
                    console.log(
                        `❌ Failed to add user: ${user.email} to group ID: ${groupId} - Status: ${joinGroupResponse.status}`
                    )
                    console.log(`Response data:`, joinGroupResponse.data)
                }
            } catch (error: any) {
                console.error(
                    `❌ Failed to join group for user ${user.email}:`,
                    error.response?.data || error.message
                )
            }
        }
    }

    console.log(`\n📊 Seeding Summary:`)
    console.log(`   Created: ${results.created.length}`)
    console.log(`   Already exists: ${results.existing.length}`)
    console.log(`   Failed: ${results.failed.length}\n`)

    if (
        results.failed.length > 0 &&
        results.created.length === 0 &&
        results.existing.length === 0
    ) {
        throw new Error(
            "Failed to seed any test users. Check backend connection."
        )
    }

    console.log("✅ Test data seeding completed\n")
}
/**
 * Cleans up test users after tests complete
 * Note: This requires a DELETE endpoint on your backend
 */
export async function cleanupTestUsers() {
    console.log("🧹 Cleaning up test users from database...")

    let cleaned = 0
    let notFound = 0
    let failed = 0

    for (const [key, user] of Object.entries(TEST_USERS_DATA)) {
        try {
            console.log(`🔑 Attempting login for: ${user.email}`)

            // Create axios instance with cookie jar for session management
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
                console.log(
                    `❌ Login failed for ${user.email}: ${loginResponse.status}`
                )
                notFound++
                continue
            }

            console.log(`✅ Login successful for: ${user.email}`)

            // Extract cookies from login response
            const cookies = loginResponse.headers["set-cookie"]
            // console.log(`🍪 Cookies received:`, cookies)

            // Now attempt to delete the authenticated user with explicit cookie headers
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
                cleaned++
                console.log(`✅ Deleted test user: ${user.email}`)
            } else if (response.status === 404) {
                notFound++
                console.log(`ℹ️  Test user not found: ${user.email}`)
            } else {
                failed++
                console.log(
                    `⚠️  Could not delete ${user.email}: ${response.status} - ${response.data}`
                )
            }
        } catch (error: any) {
            if (error.response?.status === 404) {
                notFound++
                console.log(`ℹ️  Test user not found: ${user.email}`)
            } else if (error.code === "ECONNREFUSED") {
                console.log(`⚠️  Backend not available for cleanup`)
                break
            } else {
                failed++
                console.error(
                    `⚠️  Failed to cleanup user ${user.email}:`,
                    error.message
                )
            }
        }
    }

    console.log(`\n📊 Cleanup Summary:`)
    console.log(`   Deleted: ${cleaned}`)
    console.log(`   Not found: ${notFound}`)
    console.log(`   Failed: ${failed}\n`)

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
