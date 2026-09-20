import {
  MediaProvider,
  useMediaSearch,
  useMediaVideoSearch,
} from "@fotowl/media-react";
import type { MediaPhoto } from "@fotowl/media-core";
import { Grid, Lightbox, Reel } from "../packages/media-ui-react/src";
import { useState } from "react";

const apiKey = import.meta.env.VITE_PEXELS_API_KEY;

function MediaSearch() {
  const { data, loading, error, search, loadMore, hasMore } = useMediaSearch();
  const [activeTab, setActiveTab] = useState<"photos" | "videos">("photos");
  const {
    data: videos,
    loading: videosLoading,
    error: videosError,
    search: searchVideos,
  } = useMediaVideoSearch();

  const [query, setQuery] = useState("");

  const [selectedPhoto, setSelectedPhoto] = useState<MediaPhoto | null>(null);

  const handleSearch = () => {
    if (!query.trim()) {
      return;
    }

    search(query);
  };

  const selectedIndex = selectedPhoto
    ? data.findIndex((photo) => photo.id === selectedPhoto.id)
    : -1;

  const handleNext = () => {
    if (selectedIndex === -1) {
      return;
    }

    const nextIndex = selectedIndex + 1;

    if (nextIndex < data.length) {
      setSelectedPhoto(data[nextIndex]);
    }
  };

  const handlePrevious = () => {
    if (selectedIndex === -1) {
      return;
    }

    const previousIndex = selectedIndex - 1;

    if (previousIndex >= 0) {
      setSelectedPhoto(data[previousIndex]);
    }
  };

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <div className="brand">
            <div className="brand-mark">✦</div>

            <div>
              <h2 className="brand-name">FotoOwl</h2>
              <p className="brand-subtitle">Media discovery platform</p>
            </div>
          </div>
        </header>

        <section className="hero">
          <h1>
            Discover something <span>beautiful.</span>
          </h1>

          <p>
            Explore stunning photography and immersive videos powered by the
            FotoOwl Media SDK.
          </p>

          <div className="search-wrapper">
            <div className="search-box">
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    setActiveTab("photos");
                    handleSearch();
                  }
                }}
                placeholder="Search photos..."
              />

              <button
                className="search-button"
                onClick={() => {
                  setActiveTab("photos");
                  handleSearch();
                }}
              >
                Search
              </button>
            </div>
          </div>

          <div className="tabs">
            <button
              className={`tab ${activeTab === "photos" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("photos");
                handleSearch();
              }}
            >
              Photos
            </button>

            <button
              className={`tab ${activeTab === "videos" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("videos");
                searchVideos(query.trim() || "nature");
              }}
            >
              Videos
            </button>
          </div>
        </section>

        {loading && <div className="status">Loading photos...</div>}

        {error && <div className="error">{error.message}</div>}

        {/* PHOTOS */}
        {activeTab === "photos" && data.length > 0 && (
          <section>
            <div className="section-header">
              <div>
                <h2>Photos</h2>
                <p>Explore {data.length} images</p>
              </div>
            </div>

            <div className="photo-grid">
              <Grid
                items={data}
                hasMore={hasMore}
                loading={loading}
                onLoadMore={loadMore}
                renderItem={(photo) => (
                  <div
                    className="photo-card"
                    onClick={() => setSelectedPhoto(photo)}
                  >
                    <img src={photo.src.large} alt={photo.alt} />

                    <div className="photo-overlay">
                      <p>{photo.photographer}</p>
                    </div>
                  </div>
                )}
              />
            </div>
          </section>
        )}

        {/* LIGHTBOX */}
        {selectedPhoto && (
          <div className="lightbox-overlay">
            <Lightbox
              className="lightbox"
              isOpen={true}
              item={selectedPhoto}
              onClose={() => setSelectedPhoto(null)}
              onNext={handleNext}
              onPrevious={handlePrevious}
              renderItem={(photo) => (
                <img
                  src={photo.src.large}
                  alt={photo.alt}
                />
              )}
            />
          </div>
        )}

        {/* VIDEOS */}
        {activeTab === "videos" && (
          <section>
            <div className="section-header">
              <div>
                <h2>Video Reels</h2>
                <p>Immersive vertical video experience</p>
              </div>
            </div>

            {videosLoading && <div className="status">Loading videos...</div>}

            {videosError && <div className="error">{videosError.message}</div>}

            {videos.length > 0 && (
              <div className="reel-container">
                <Reel
                  items={videos}
                  containerStyle={{
                    height: "100%",
                    overflowY: "auto",
                    scrollSnapType: "y mandatory",
                  }}
                  itemStyle={{
                    height: "100%",
                    scrollSnapAlign: "start",
                  }}
                  renderItem={(video, _, isActive) => {
                    const videoFile = video.videoFiles.find(
                      (file) => file.fileType === "video/mp4",
                    );

                    if (!videoFile) {
                      return (
                        <div className="status">No playable video found.</div>
                      );
                    }

                    return (
                      <video
                        src={videoFile.link}
                        poster={video.image}
                        controls
                        muted
                        autoPlay={isActive}
                        loop
                        playsInline
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    );
                  }}
                />
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <MediaProvider apiKey={apiKey}>
      <MediaSearch />
    </MediaProvider>
  );
}

export default App;
