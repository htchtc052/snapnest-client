
import type { SanctumClient } from '~/http/sanctum/sanctum-client.type'
import type { AttachImagesInput } from '~/types/image-attach.contract'

export function albumAttachImages(client: SanctumClient, { albumId, imageIds: image_ids }: AttachImagesInput) {
    return client(`/api/account/albums/${albumId}/attach-images`, {
        method: 'POST',
        body: { image_ids },
    })
}
