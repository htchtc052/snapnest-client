# Snapnest Client

Nuxt 3 client for Snapnest: private photo library with albums and public share links.

## Stack
- Nuxt 3 + Vue 3
- @nuxt/ui for UI components
- Pinia for state
- nuxt-auth-sanctum for auth

## Environments
- `NUXT_PUBLIC_API_BASE` — API base URL (default: `http://localhost:8000`)
- `NUXT_PUBLIC_SITE_URL` — public site base URL for share links (default: `http://localhost:3000`)

## Routes and Features

### Public / Guest
- `/`
  - Guest landing page with CTA to sign up or sign in.
- `/login`
  - Sign-in form (Nuxt UI form + validation).
- `/register`
  - Sign-up form (Nuxt UI form + validation).

### Account (Authenticated)
- `/account`
  - Main photo timeline.
  - Grouping by day/month/year.
  - Infinite scroll on timeline using `useImagesGet()`.
  - Virtualized scroll area for large grids.
  - Multi-select with actions: add to album, share, rename, delete.
  - Upload completion auto-refresh via uploads store.

- `/account/albums`
  - Albums list with create/rename/delete.
  - Album cards with cover preview.

- `/account/albums/:id`
  - Album detail with images grid (virtualized scroll area).
  - Multi-select images and remove from album.

### Public Share
- `/albums/:token`
  - Public album page by share token.
  - Read-only grid with virtualized scroll area.
  - Uses public layout.

### Utility / Dev
- `/testPinia`
  - Local test page for Pinia store.

## Sharing
- Share links are generated from the account timeline via the Share modal.
- Share modal uses `NUXT_PUBLIC_SITE_URL` + `/albums/:token` to build public URL.

## Notes for Agents
- The account timeline (`/account`) is the only place that uses infinite scroll.
- Album pages use a scroll area + virtualization, without infinite scroll.
- Public share pages use the public layout.
