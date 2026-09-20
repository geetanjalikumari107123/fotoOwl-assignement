# FotoOwl Media SDK

A headless media SDK ecosystem built with TypeScript, React, and React Native concepts using the Pexels API.

The project separates media data access, framework wrappers, and UI behavior into independent packages.

## Architecture

```text
                    ┌─────────────────────┐
                    │      Pexels API     │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │    media-core       │
                    │  TypeScript SDK     │
                    │                     │
                    │ • API client        │
                    │ • Types             │
                    │ • Cache             │
                    │ • Request dedupe    │
                    │ • Events            │
                    └──────────┬──────────┘
                               │
                 ┌─────────────┴─────────────┐
                 ▼                           ▼
        ┌─────────────────┐         ┌─────────────────┐
        │   media-react   │         │  media-native   │
        │ React wrapper   │         │ RN wrapper      │
        └────────┬────────┘         └─────────────────┘
                 │
                 ▼
        ┌─────────────────┐
        │   Web App       │
        │                 │
        │ data + UI       │
        └────────┬────────┘
                 │
                 ▼
        ┌─────────────────┐
        │ media-ui-react  │
        │                 │
        │ Grid            │
        │ Lightbox        │
        │ Reel            │
        └─────────────────┘

        media-ui-native
        provides native
        UI equivalents