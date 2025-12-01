import type {Album} from "~/models/Album";

export async function useAlbumDelete(id: Album['id']): Promise<void> {
    const client = useSanctumClient()
    return client<void>(`/api/account/albums/${id}`, { method: 'DELETE' })
}
