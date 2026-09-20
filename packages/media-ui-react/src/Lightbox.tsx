import { useEffect } from "react";
import type { ReactNode } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface LightboxProps<T> {
  isOpen: boolean;
  item: T | null;
  onClose: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  renderItem: (item: T) => ReactNode;
  className?: string; 
}

export function Lightbox<T>({
  isOpen,
  item,
  onClose,
  onNext,
  onPrevious,
  renderItem,
  className,
}: LightboxProps<T>) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }

      if (event.key === "ArrowRight") {
        onNext?.();
      }

      if (event.key === "ArrowLeft") {
        onPrevious?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, onNext, onPrevious]);

  if (!isOpen || !item) {
    return null;
  }

  return (
    <div className={className}>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close lightbox"
      >
        <X size={28} />
      </button>

      <button
        type="button"
        onClick={onPrevious}
        aria-label="Previous image"
      >
        <ChevronLeft size={36} />
      </button>

      {renderItem(item)}

      <button
        type="button"
        onClick={onNext}
        aria-label="Next image"
      >
        <ChevronRight size={36} />
      </button>
    </div>
  );
}