import { albumUpdate } from '~/api/account/albumUpdate'
import { useApiOperation } from '~/shared/operation'
import type { AlbumInfoDto } from '~/types/album-info.contract'

export function useAlbumUpdateOperation() {
  const client = useSanctumClient()

  const {
    execute: updateAlbum,
    isLoading: isUpdating,
  } = useApiOperation((albumId: number, data: AlbumInfoDto) =>
    albumUpdate(client, albumId, data),
  )

  return {
    updateAlbum,
    isUpdating,
  }
}
