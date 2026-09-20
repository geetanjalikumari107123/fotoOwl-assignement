export type MediaEventType = "view" | "download";

export interface MediaEvent {
  type: MediaEventType;
  mediaId: number;
  timestamp: number;
}

type EventListener = (event: MediaEvent) => void;

export class MediaEventEmitter {
  private listeners: Record<MediaEventType, Set<EventListener>> = {
    view: new Set(),
    download: new Set(),
  };

  subscribe(type: MediaEventType, listener: EventListener) {
    this.listeners[type].add(listener);

    return () => {
      this.listeners[type].delete(listener);
    };
  }

  emit(type: MediaEventType, mediaId: number) {
    const event: MediaEvent = {
      type,
      mediaId,
      timestamp: Date.now(),
    };

    this.listeners[type].forEach((listener) => {
      listener(event);
    });

    console.log(`[media-core] ${type}`, event);
  }
}