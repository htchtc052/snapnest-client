import type { SanctumClient } from '~/http/sanctum/sanctum-client.type'
import type { ImageUpdateDto } from '~/types/image-update.contract'
import type { Image } from '~/types/image.model'

export async function imageUpdate(client: SanctumClient, id: Image['id'], data: ImageUpdateDto): Promise<Image> {

    return client<Image>(`/api/account/images/${id}`, {
        method: 'PUT',
        body: data,
    })
}
