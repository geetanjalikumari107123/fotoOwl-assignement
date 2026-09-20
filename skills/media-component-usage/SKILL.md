# Media Component Usage

## Purpose

Use this skill when building interfaces with the FotoOwl headless media UI components.

## Components

### Grid

Use `Grid` for media collections and infinite scrolling.

```tsx
<Grid
  items={items}
  hasMore={hasMore}
  loading={loading}
  onLoadMore={loadMore}
  renderItem={(item) => (
    // application-owned UI
  )}
/>