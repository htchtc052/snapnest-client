import type { Image } from '~/models/Image'
import type {PaginationPage} from "~/contracts/pagination-contract";

export function useAccountImages() {
    const client = useSanctumClient()

    return (page: number): Promise<PaginationPage<Image>> =>
        client<PaginationPage<Image>>('/api/account/images', {
            params: { page },
        })
}
