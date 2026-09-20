import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

interface ReelProps<T> {
  items: T[];
  renderItem: (item: T, index: number, isActive: boolean) => ReactNode;
  onActiveChange?: (item: T, index: number) => void;
  containerStyle?: React.CSSProperties;
  itemStyle?: React.CSSProperties;
}

export function Reel<T>({
  items,
  renderItem,
  onActiveChange,
  containerStyle,
  itemStyle,
}: ReelProps<T>) {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries.find((entry) => entry.isIntersecting);

        if (!visibleEntry) {
          return;
        }

        const index = Number(
          (visibleEntry.target as HTMLElement).dataset.index,
        );

        setActiveIndex(index);
        onActiveChange?.(items[index], index);
      },
      {
        root: container,
        threshold: 0.7,
      },
    );

    const elements = container.querySelectorAll("[data-reel-item]");

    elements.forEach((element) => {
      observer.observe(element);
    });

    return () => {
      observer.disconnect();
    };
  }, [items, onActiveChange]);

  return (
    <div ref={containerRef} style={containerStyle}>
      {items.map((item, index) => (
        <div key={index} data-reel-item data-index={index} style={itemStyle}>
          {renderItem(item, index, index === activeIndex)}
        </div>
      ))}
    </div>
  );
}
