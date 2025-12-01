import type {PaginationMeta, PagingInfo} from "~/contracts/pagination-contract";

export function getPaging(meta: PaginationMeta | null | undefined): PagingInfo {
    const currentPage = meta?.current_page ?? 1
    const lastPage = meta?.last_page ?? 1
    const hasMore = !!meta && currentPage < lastPage
    const nextPage = hasMore ? currentPage + 1 : currentPage

    return {
        currentPage,
        lastPage,
        hasMore,
        nextPage,
    }
}