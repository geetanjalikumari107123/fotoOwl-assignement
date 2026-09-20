import { FlatList, View } from "react-native";
import type { ReactNode } from "react";

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
  return (
    <FlatList
      data={items}
      keyExtractor={(_, index) => String(index)}
      renderItem={({ item, index }) => (
        <View>
          {renderItem(item, index)}
        </View>
      )}
      onEndReached={() => {
        if (hasMore && !loading) {
          onLoadMore?.();
        }
      }}
      onEndReachedThreshold={0.7}
    />
  );
}