import { computed, ref } from '#imports'
import type { Ref } from 'vue'
import { useApiQuery } from './useApiQuery'

export type ApiPageResponse<TItem> = {
  items: TItem[]
  nextPage: number | null
}

export function usePaginatedApiQuery<TItem>(
  fetchPage: (page?: number | null) => Promise<ApiPageResponse<TItem>>,
) {
  const items = ref<TItem[]>([]) as Ref<TItem[]>
  const nextPage = ref<number | null>(null)

  const initialQuery = useApiQuery(() => fetchPage())
  const nextPageQuery = useApiQuery((page: number) => fetchPage(page))

  const hasMore = computed(() => nextPage.value !== null)

  async function loadInitial() {
    const response = await initialQuery.execute()
    if (!response) return null

    items.value = response.items
    nextPage.value = response.nextPage

    return response
  }

  async function loadMore() {
    if (nextPage.value === null || nextPageQuery.isLoading.value) return null

    const response = await nextPageQuery.execute(nextPage.value)
    if (!response) return null

    items.value = [...items.value, ...response.items]
    nextPage.value = response.nextPage

    return response
  }

  return {
    items,
    isLoading: initialQuery.isLoading,
    isLoadingMore: nextPageQuery.isLoading,
    loadError: initialQuery.error,
    loadMoreError: nextPageQuery.error,
    hasMore,
    loadInitial,
    loadMore,
  }
}