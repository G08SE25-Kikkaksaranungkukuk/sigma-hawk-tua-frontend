import { Place, PlacePhoto } from "@/lib/types";
import axios from "axios";

// Common photo structure used in API responses
interface APIPhoto {
  photo_id: string;
  photo_url: string;
  photo_url_large: string | null;
  video_thumbnail_url: string | null;
  latitude: number;
  longitude: number;
  type: string;
  photo_datetime_utc: string;
  photo_timestamp: number;
}

// Common business data structure
interface APIBusinessData {
  business_id: string;
  name: string;
  full_address: string;
  rating: number;
  timezone: string;
  opening_status: string | null;
  place_link: string;
  photos_sample?: APIPhoto[];
  about?: {
    summary: string;
    details?: Record<string, Record<string, boolean | string>> | null;
  };
}

// Base API response structure
interface APIResponse<T> {
  status: string;
  request_id: string;
  data: T[];
}

// RapidAPI configuration
const RAPIDAPI_CONFIG = {
  baseURL: 'https://local-business-data.p.rapidapi.com',
  headers: {
    'x-rapidapi-key': process.env.NEXT_PUBLIC_RAPIDAPI_API_KEY || 'd75cab7673msh63fb0e4eb9242f3p19ab01jsn33ae73d9230b',
    'x-rapidapi-host': 'local-business-data.p.rapidapi.com'
  }
} as const;

/**
 * Maps API photos to PlacePhoto format
 * @param photos - Array of photos from API
 * @param limit - Maximum number of photos to return
 * @returns Array of PlacePhoto objects
 */
const mapPhotos = (photos: APIPhoto[] | null | undefined = [], limit: number = 10): PlacePhoto[] => {
  if (!photos) {
    return [];
  }
  
  return photos
    .filter(photo => photo.type === 'photo' && photo.photo_url && photo.photo_url_large)
    .slice(0, limit)
    .map(photo => ({
      photo_id: photo.photo_id,
      photo_url: photo.photo_url,
      photo_url_large: photo.photo_url_large as string,
      video_thumbnail_url: photo.video_thumbnail_url,
      latitude: photo.latitude,
      longitude: photo.longitude,
      type: photo.type,
      photo_datetime_utc: photo.photo_datetime_utc,
      photo_timestamp: photo.photo_timestamp
    }));
};

/**
 * Maps API business data to Place format
 * @param data - Business data from API
 * @returns Place object
 */
const mapToPlace = (data: APIBusinessData): Place => {
  return {
    name: data.name,
    full_address: data.full_address,
    bussiness_id: data.business_id,
    timezone: data.timezone,
    rating: data.rating,
    opening_status: data.opening_status || 'Unknown',
    place_link: data.place_link,
    photos_sample: mapPhotos(data.photos_sample),
    summary: data.about?.summary || ''
  };
};

/**
 * Makes a request to RapidAPI
 * @param endpoint - API endpoint
 * @param params - Query parameters
 * @returns API response data
 */
const makeAPIRequest = async <T extends APIBusinessData>(
  endpoint: string,
  params: Record<string, string>
): Promise<T[]> => {
  try {
    const response = await axios.request<APIResponse<T>>({
      method: 'GET',
      url: `${RAPIDAPI_CONFIG.baseURL}${endpoint}`,
      params,
      headers: RAPIDAPI_CONFIG.headers
    });

    if (response.data.status !== 'OK') {
      throw new Error(`RapidAPI returned status: ${response.data.status}`);
    }

    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`API request failed: ${error.response?.data?.message || error.message}`);
    }
    throw error;
  }
};

/**
 * Fetches place data from RapidAPI Local Business Data API
 * @param query - The search query (e.g., place name)
 * @param extractEmailsAndContacts - Whether to extract emails and contacts (default: true)
 * @returns Array of Place objects
 */
const searchPlaces = async (
  query: string,
  extractEmailsAndContacts: boolean = true
): Promise<Place[]> => {
  const data = await makeAPIRequest<APIBusinessData>('/search', {
    query,
    extract_emails_and_contacts: extractEmailsAndContacts.toString(),
    limit: '5'
  });

  return data.map(mapToPlace);
};

/**
 * Fetches a single place by name
 * @param placeName - The name of the place to search for
 * @returns The first matching Place or null if not found
 */
const getPlaceByName = async (placeName: string): Promise<Place | null> => {
  const places = await searchPlaces(placeName);
  return places.length > 0 ? places[0] : null;
};

/**
 * Fetches detailed business information by business ID
 * @param businessId - The business ID from Google Maps (e.g., '0x808580e35111d5f7:0x34b0de1453599ed0')
 * @param extractEmailsAndContacts - Whether to extract emails and contacts (default: true)
 * @param extractShareLink - Whether to extract the share link (default: true)
 * @returns Place object with detailed business information or null if not found
 */
const getBusinessDetails = async (
  businessId: string,
  extractEmailsAndContacts: boolean = true,
  extractShareLink: boolean = true
): Promise<Place | null> => {
  const data = await makeAPIRequest<APIBusinessData>('/business-details', {
    business_id: businessId,
    extract_emails_and_contacts: extractEmailsAndContacts.toString(),
    extract_share_link: extractShareLink.toString()
  });

  return data.length > 0 ? mapToPlace(data[0]) : null;
};

export const placeService = {
  searchPlaces,
  getPlaceByName,
  getBusinessDetails
};