import { Blog } from "@/lib/types/api";
import axios, {AxiosResponse} from "axios";
import { apiClient } from "@/lib/api";


export const blogService = {
  // Blog service methods would go here
  getAllBlogs: async (): Promise<Blog[]> => {
    const response = await apiClient.get<Blog[]>("/api/v1/blog/search");
    return response.data;
  },

  getBlogBanner: async (blogId: string): Promise<Blob> => {
    // First, get the banner URL from the API
    const response = await apiClient.get<{ success: boolean; data: string; message: string }>(`/api/v2/blogs/${blogId}/banner`);
    const imageUrl = response.data.data;

    // Then fetch the actual image from the URL
    const imageResponse = await axios.get(imageUrl, {
      responseType: 'blob'
    });

    return imageResponse.data;
  }
};