export interface MediaPhoto {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographerUrl: string;
  src: {
    original: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
  };
  alt: string;
}

export interface MediaVideoFile {
  id: number;
  quality: string;
  fileType: string;
  width?: number;
  height?: number;
  link: string;
}

export interface MediaVideo {
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
  videoFiles: MediaVideoFile[];
}

export interface PhotoSearchResponse {
  page: number;
  perPage: number;
  totalResults: number;
  photos: MediaPhoto[];
  nextPage?: string;
}

export interface VideoSearchResponse {
  page: number;
  perPage: number;
  totalResults: number;
  videos: MediaVideo[];
  nextPage?: string;
}

export type MediaItem = MediaPhoto | MediaVideo;

export interface SearchOptions {
  query: string;
  page?: number;
  perPage?: number;
}

export interface ClientConfig {
  apiKey: string;
}