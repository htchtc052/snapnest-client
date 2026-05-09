import { computed, ref } from '#imports'
import type { Ref } from 'vue'
import { ApiQueryStatus, useApiQuery } from './useApiQuery'

type ApiPageMeta = {
  nextPage: number | null
}

export function usePaginatedApiQuery<TResponse extends ApiPageMeta, TItem>(
  fetchPage: (page?: number | null) => Promise<TResponse>,
  getItems: (response: TResponse) => TItem[],
) {
  const items = ref<TItem[]>([]) as Ref<TItem[]>
  const nextPage = ref<number | null>(null)

  const initialQuery = useApiQuery(() => fetchPage())
  const nextPageQuery = useApiQuery((page: number) => fetchPage(page))

  const isLoading = computed(() => {
    return initialQuery.status.value === ApiQueryStatus.Idle
      || initialQuery.isLoading.value
  })
  const hasMore = computed(() => nextPage.value !== null)

  async function loadInitial() {
    const response = await initialQuery.execute()
    if (!response) return null

    items.value = getItems(response)
    nextPage.value = response.nextPage

    return response
  }

  async function loadMore() {
    if (nextPage.value === null || nextPageQuery.isLoading.value) return null

    const response = await nextPageQuery.execute(nextPage.value)
    if (!response) return null

    items.value = [...items.value, ...getItems(response)]
    nextPage.value = response.nextPage

    return response
  }

  return {
    items,
    isLoading,
    isLoadingMore: nextPageQuery.isLoading,
    loadError: initialQuery.error,
    loadMoreError: nextPageQuery.error,
    hasMore,
    loadInitial,
    loadMore,
  }
}
