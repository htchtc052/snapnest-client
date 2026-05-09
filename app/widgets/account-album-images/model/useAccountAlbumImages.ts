import { computed } from '#imports'
import { usePaginatedApiQuery } from '~/shared/api'
import { useAccountAlbumImagesRequest } from '../api/useAccountAlbumImagesRequest'

export function useAccountAlbumImages(albumId: number) {
  const { getAccountAlbumImages } = useAccountAlbumImagesRequest()

  const query = usePaginatedApiQuery(
    page => getAccountAlbumImages(albumId, page),
    response => response.images,
  )

  const hasLoadError = computed(() => query.loadError.value !== null)

  const isEmpty = computed(() => {
    return !query.isLoading.value
      && !hasLoadError.value
      && query.items.value.length === 0
  })

  return {
    images: query.items,

    isLoading: query.isLoading,
    isLoadingMore: query.isLoadingMore,

    loadError: query.loadError,
    loadMoreError: query.loadMoreError,
    hasLoadError,

    isEmpty,
    hasMore: query.hasMore,

    loadInitial: query.loadInitial,
    loadMore: query.loadMore,
  }
}
