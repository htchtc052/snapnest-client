import type {Album} from "~/models/Album";

export function useAccountAlbums() {
    const client = useSanctumClient()

    return client<Album[]>('/api/account/albums')
}
