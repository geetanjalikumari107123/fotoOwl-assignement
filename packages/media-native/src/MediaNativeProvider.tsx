import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";

import {
  createMediaClient,
  type MediaClient,
} from "@fotowl/media-core";

interface MediaNativeProviderProps {
  apiKey: string;
  children: ReactNode;
}

const MediaNativeContext = createContext<MediaClient | null>(null);

export function MediaNativeProvider({
  apiKey,
  children,
}: MediaNativeProviderProps) {
  const client = useMemo(() => {
    return createMediaClient({
      apiKey,
    });
  }, [apiKey]);

  return (
    <MediaNativeContext.Provider value={client}>
      {children}
    </MediaNativeContext.Provider>
  );
}

export function useMediaNative(): MediaClient {
  const client = useContext(MediaNativeContext);

  if (!client) {
    throw new Error(
      "useMediaNative must be used inside a MediaNativeProvider."
    );
  }

  return client;
}