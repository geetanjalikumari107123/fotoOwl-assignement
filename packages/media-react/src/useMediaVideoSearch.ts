import { useCallback, useState } from "react";
import type { MediaVideo } from "@fotowl/media-core";
import { useMedia } from "./MediaProvider";

interface UseMediaVideoSearchResult {
  data: MediaVideo[];
  loading: boolean;
  error: Error | null;
  search: (query: string) => Promise<void>;
}

export function useMediaVideoSearch(): UseMediaVideoSearchResult {
  const media = useMedia();

  const [data, setData] = useState<MediaVideo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const search = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const result = await media.searchVideos(query, 1);

        setData(result.videos);
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error("Something went wrong")
        );
      } finally {
        setLoading(false);
      }
    },
    [media]
  );

  return {
    data,
    loading,
    error,
    search,
  };
}