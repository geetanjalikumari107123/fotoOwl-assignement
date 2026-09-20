import type {
  ClientConfig,
  MediaPhoto,
  MediaVideo,
  PhotoSearchResponse,
  VideoSearchResponse,
} from "./types";
import { MediaEventEmitter } from "./events";
import { MemoryCache } from "./cache";

const PEXELS_API_URL = "https://api.pexels.com";

export class MediaClient {
  private apiKey: string;
  private cache = new MemoryCache<unknown>();
  private pendingRequests = new Map<string, Promise<unknown>>();

  public events: MediaEventEmitter;

  constructor(config: ClientConfig) {
    this.apiKey = config.apiKey;
    this.events = new MediaEventEmitter();
  }

  private async request<T>(
    endpoint: string,
    params?: Record<string, string>,
  ): Promise<T> {
    const url = new URL(`${PEXELS_API_URL}${endpoint}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.set(key, value);
      });
    }

    const cacheKey = url.toString();

    // Return cached response
    const cached = this.cache.get(cacheKey);

    if (cached) {
      return cached as T;
    }

    // Return existing request if already in progress
    const pendingRequest = this.pendingRequests.get(cacheKey);

    if (pendingRequest) {
      return pendingRequest as Promise<T>;
    }

    const requestPromise = fetch(url, {
      headers: {
        Authorization: this.apiKey,
      },
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(
            `Pexels API request failed: ${response.status} ${response.statusText}`,
          );
        }

        const data = (await response.json()) as T;

        this.cache.set(cacheKey, data);

        return data;
      })
      .finally(() => {
        this.pendingRequests.delete(cacheKey);
      });

    this.pendingRequests.set(cacheKey, requestPromise);

    return requestPromise;
  }

  async searchPhotos(
    query: string,
    page = 1,
    perPage = 20,
  ): Promise<PhotoSearchResponse> {
    const result = await this.request<{
      page: number;
      per_page: number;
      total_results: number;
      photos: PhotoSearchResponse["photos"];
      next_page?: string;
    }>("/v1/search", {
      query,
      page: String(page),
      per_page: String(perPage),
    });

    return {
      page: result.page,
      perPage: result.per_page,
      totalResults: result.total_results,
      photos: result.photos,
      nextPage: result.next_page,
    };
  }

  async curatedPhotos(page = 1, perPage = 20): Promise<PhotoSearchResponse> {
    return this.request<PhotoSearchResponse>("/v1/curated", {
      page: String(page),
      per_page: String(perPage),
    });
  }

  async getPhotoById(id: number): Promise<MediaPhoto> {
    return this.request<MediaPhoto>(`/v1/photos/${id}`);
  }

  async searchVideos(
    query: string,
    page = 1,
    perPage = 20,
  ): Promise<VideoSearchResponse> {
    const result = await this.request<{
      page: number;
      per_page: number;
      total_results: number;
      videos: Array<{
        id: number;
        width: number;
        height: number;
        duration: number;
        url: string;
        image: string;
        user: {
          name: string;
          url: string;
        };
        video_files: Array<{
          id: number;
          quality: string;
          file_type: string;
          width?: number;
          height?: number;
          link: string;
        }>;
      }>;
      next_page?: string;
    }>("/videos/search", {
      query,
      page: String(page),
      per_page: String(perPage),
    });

    return {
      page: result.page,
      perPage: result.per_page,
      totalResults: result.total_results,
      videos: result.videos.map((video) => ({
        id: video.id,
        width: video.width,
        height: video.height,
        duration: video.duration,
        url: video.url,
        image: video.image,
        user: video.user,
        videoFiles: video.video_files.map((file) => ({
          id: file.id,
          quality: file.quality,
          fileType: file.file_type,
          width: file.width,
          height: file.height,
          link: file.link,
        })),
      })),
      nextPage: result.next_page,
    };
  }

  async curatedVideos(page = 1, perPage = 20): Promise<VideoSearchResponse> {
    return this.request<VideoSearchResponse>("/videos/popular", {
      page: String(page),
      per_page: String(perPage),
    });
  }

  async getVideoById(id: number): Promise<MediaVideo> {
    const video = await this.request<{
      id: number;
      width: number;
      height: number;
      duration: number;
      url: string;
      image: string;
      user: {
        name: string;
        url: string;
      };
      video_files: Array<{
        id: number;
        quality: string;
        file_type: string;
        width?: number;
        height?: number;
        link: string;
      }>;
    }>(`/videos/videos/${id}`);

    return {
      id: video.id,
      width: video.width,
      height: video.height,
      duration: video.duration,
      url: video.url,
      image: video.image,
      user: video.user,
      videoFiles: video.video_files.map((file) => ({
        id: file.id,
        quality: file.quality,
        fileType: file.file_type,
        width: file.width,
        height: file.height,
        link: file.link,
      })),
    };
  }

  trackView(mediaId: number): void {
    this.events.emit("view", mediaId);
  }

  trackDownload(mediaId: number): void {
    this.events.emit("download", mediaId);
  }
}

export function createMediaClient(config: ClientConfig): MediaClient {
  if (!config.apiKey) {
    throw new Error("Pexels API key is required.");
  }

  return new MediaClient(config);
}
