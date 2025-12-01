import type { Image } from '~/models/Image'
import type { ImageUpdateDto } from '~/contracts/image-update.contract'

export async function useImageUpdate(id: Image['id'], data: ImageUpdateDto): Promise<Image> {
    const client = useSanctumClient()
    return client<Image>(`/api/account/images/${id}`, {
        method: 'PUT',
        body: data,
    })
}
