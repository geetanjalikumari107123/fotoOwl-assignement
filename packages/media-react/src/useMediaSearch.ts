import { useCallback, useState } from "react";
import type { MediaPhoto } from "@fotowl/media-core";
import { useMedia } from "./MediaProvider";

interface UseMediaSearchResult {
  data: MediaPhoto[];
  loading: boolean;
  error: Error | null;
  search: (query: string) => Promise<void>;
  loadMore: () => Promise<void>;
  hasMore: boolean;
}

export function useMediaSearch(): UseMediaSearchResult {
  const media = useMedia();

  const [data, setData] = useState<MediaPhoto[]>([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const search = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const result = await media.searchPhotos(searchQuery, 1);
        setQuery(searchQuery);
        setPage(1);
        setData(result.photos);
        setHasMore(result.page * result.perPage < result.totalResults);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Something went wrong"),
        );
      } finally {
        setLoading(false);
      }
    },
    [media],
  );

  const loadMore = useCallback(async () => {
    if (!query || loading || !hasMore) {
      return;
    }

    setLoading(true);

    try {
      const nextPage = page + 1;

      const result = await media.searchPhotos(query, nextPage);

      setData((current) => [...current, ...result.photos]);

      setPage(nextPage);
      setHasMore(result.page * result.perPage < result.totalResults);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Something went wrong"));
    } finally {
      setLoading(false);
    }
  }, [media, query, page, loading, hasMore]);

  return {
    data,
    loading,
    error,
    search,
    loadMore,
    hasMore,
  };
}
