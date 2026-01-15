import type { Asserts } from "yup";
import type { Album } from "~/types/album.model";
import type { albumInfoSchema } from "./album-info.contract";

export type AlbumCreateDto = Asserts<typeof albumInfoSchema> & { image_ids?: number[] }

export type AlbumCreateResult = Album | undefined

export type AlbumCreateModalResult =
  | { action: 'cancel' }
  | { action: 'confirm'; album: Album }
