import type { Album } from "~/types/album.model";

export type AlbumUpdateResult = Album | undefined

export type AlbumUpdateModalResult =
  | { action: 'cancel' }
  | { action: 'confirm'; album: Album }
