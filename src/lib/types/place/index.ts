export interface PlacePhoto {
    photo_id: string;
    photo_url: string;
    photo_url_large: string;
    video_thumbnail_url: string | null;
    latitude: number;
    longitude: number;
    type: string;
    photo_datetime_utc: string;
    photo_timestamp: number;
}

export interface Place {
    name: string;
    full_address: string;
    bussiness_id: string;
    timezone: string;
    rating: number;
    opening_status: string;
    place_link: string;
    photos_sample: PlacePhoto[];
    summary: string;
}