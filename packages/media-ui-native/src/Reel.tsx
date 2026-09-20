import { FlatList, View } from "react-native";
import type { ReactNode } from "react";

interface ReelProps<T> {
  items: T[];
  renderItem: (
    item: T,
    index: number,
    isActive: boolean
  ) => ReactNode;
  onActiveChange?: (item: T, index: number) => void;
}

export function Reel<T>({
  items,
  renderItem,
  onActiveChange,
}: ReelProps<T>) {
  return (
    <FlatList
      data={items}
      keyExtractor={(_, index) => String(index)}
      pagingEnabled
      showsVerticalScrollIndicator={false}
      renderItem={({ item, index }) => (
        <View>
          {renderItem(item, index, false)}
        </View>
      )}
      onMomentumScrollEnd={(event) => {
        const index = Math.round(
          event.nativeEvent.contentOffset.y /
            event.nativeEvent.layoutMeasurement.height
        );

        const item = items[index];

        if (item) {
          onActiveChange?.(item, index);
        }
      }}
    />
  );
}