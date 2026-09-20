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

interface MediaProviderProps {
  apiKey: string;
  children: ReactNode;
}

const MediaContext = createContext<MediaClient | null>(null);

export function MediaProvider({
  apiKey,
  children,
}: MediaProviderProps) {
  const client = useMemo(() => {
    return createMediaClient({
      apiKey,
    });
  }, [apiKey]);

  return (
    <MediaContext.Provider value={client}>
      {children}
    </MediaContext.Provider>
  );
}

export function useMedia(): MediaClient {
  const client = useContext(MediaContext);

  if (!client) {
    throw new Error(
      "useMedia must be used inside a MediaProvider."
    );
  }

  return client;
}