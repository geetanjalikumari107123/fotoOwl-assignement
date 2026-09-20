# Media Data Wiring

## Purpose

Use this skill when connecting application data to the FotoOwl media SDK.

## Rules

- Use `@fotowl/media-react` for React data access.
- Use `useMediaSearch()` for photo search.
- Use `useMediaVideoSearch()` for video search.
- Keep API and data-fetching logic outside UI components.
- Pass fetched data into UI components through props.
- Do not call the Pexels API directly from application UI components.
- Use `loadMore()` for photo pagination.
- Respect the `loading`, `error`, and `hasMore` states.
- Use `@fotowl/media-core` types for media data.

## Example

```tsx
const {
  data,
  loading,
  error,
  search,
  loadMore,
  hasMore,
} = useMediaSearch();

<Grid
  items={data}
  loading={loading}
  hasMore={hasMore}
  onLoadMore={loadMore}
  renderItem={(photo) => (
    <img
      src={photo.src.medium}
      alt={photo.alt}
    />
  )}
/>