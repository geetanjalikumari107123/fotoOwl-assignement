import type { ReactNode } from "react";
import { useEffect, useRef } from "react";

interface GridProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  onLoadMore?: () => void;
  hasMore?: boolean;
  loading?: boolean;
}

export function Grid<T>({
  items,
  renderItem,
  onLoadMore,
  hasMore = false,
  loading = false,
}: GridProps<T>) {
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = loadMoreRef.current;

    if (!element || !hasMore || !onLoadMore) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];

        if (firstEntry.isIntersecting && !loading) {
          onLoadMore();
        }
      },
      {
        threshold: 0,
        rootMargin: "300px",
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [hasMore, onLoadMore, loading]);

  return (
    <>
      {items.map((item, index) => (
        <div key={index}>
          {renderItem(item, index)}
        </div>
      ))}

      {hasMore && (
        <div ref={loadMoreRef}>
          {loading && <p>Loading more...</p>}
        </div>
      )}
    </>
  );
}