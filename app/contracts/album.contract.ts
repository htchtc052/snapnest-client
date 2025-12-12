import type { Album } from "~/models/Album";
import type { Image } from "~/models/Image";
import type { PaginationPage } from "./pagination-contract";

export type AlbumPage = PaginationPage<Image> & { album: Album }
