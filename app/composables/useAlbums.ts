import type { Album } from '~/models/Album'

export function useAlbums(): Promise<Album[]> {
    const client = useSanctumClient()
    return client<Album[]>('/api/account/albums')
}
