export interface PaginationMeta {
    current_page: number
    last_page: number
}

export interface PaginationPage<T> {
    data: T[]
    meta: PaginationMeta
}

export interface PagingInfo {
    currentPage: number
    lastPage: number
    hasMore: boolean
    nextPage: number
}
