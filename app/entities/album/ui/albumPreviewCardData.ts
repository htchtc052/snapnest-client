import type { AlbumDisplayData } from './albumDisplayData'

export type AlbumPreviewCardData = AlbumDisplayData & {
  isShared: boolean
  emptyLabel: string
}
