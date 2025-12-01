import type { Image } from '~/models/Image'

export async function useImageDelete(id: Image['id']): Promise<void> {
    const client = useSanctumClient()
    return client<void>(`/api/account/images/${id}`, { method: 'DELETE' })
}
