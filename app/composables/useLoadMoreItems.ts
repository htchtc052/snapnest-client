import { computed, ref, type Ref } from 'vue'
import type { PaginationMeta } from '~/contracts/pagination-contract'

type PageResult<T> = {
    data: T[]
    meta: PaginationMeta
}

export function useLoadMoreItems<T>(
    items: Ref<T[]>,
    initialMeta: PaginationMeta,
    fetchPage: (page: number) => Promise<PageResult<T>>,
) {
    const isLoadingMore = ref(false)

    const currentPage = ref<number>(initialMeta.current_page)
    const lastPage = ref<number>(initialMeta.last_page)

    const hasMore = computed(() => currentPage.value < lastPage.value)
    const nextPage = computed(() => currentPage.value + 1)

    async function loadMore() {
        if (isLoadingMore.value) return

        isLoadingMore.value = true
        try {
            const res = await fetchPage(nextPage.value)
            items.value.push(...res.data)

            currentPage.value = res.meta.current_page
            lastPage.value = res.meta.last_page
        } finally {
            isLoadingMore.value = false
        }
    }

    return { isLoadingMore, hasMore, currentPage, lastPage, nextPage, loadMore }
}
