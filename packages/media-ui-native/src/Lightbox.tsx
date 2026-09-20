import { Modal, Pressable, View } from "react-native";
import type { ReactNode } from "react";

interface LightboxProps<T> {
  isOpen: boolean;
  item: T | null;
  onClose: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  renderItem: (item: T) => ReactNode;
}

export function Lightbox<T>({
  isOpen,
  item,
  onClose,
  onNext,
  onPrevious,
  renderItem,
}: LightboxProps<T>) {
  if (!item) {
    return null;
  }

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View>
        <Pressable
          onPress={onClose}
          accessibilityLabel="Close lightbox"
        />

        <Pressable
          onPress={onPrevious}
          accessibilityLabel="Previous item"
        />

        {renderItem(item)}

        <Pressable
          onPress={onNext}
          accessibilityLabel="Next item"
        />
      </View>
    </Modal>
  );
}