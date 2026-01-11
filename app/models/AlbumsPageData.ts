import type { Album } from '~/models/Album'
import type { Image } from '~/models/Image'
import type { PaginationPage } from '~/utils/types/pagination'

export type AlbumsPageData = PaginationPage<Image> & { album: Album }
