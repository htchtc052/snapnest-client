import type { AccountAlbum } from '~/entities/album/model'

export function useAlbumVisibilityRequest() {
  const client = useSanctumClient()

  async function updateAlbumVisibilityRequest(albumId: AccountAlbum['id'], isPublic: boolean) {
    return await client<AccountAlbum>(`/api/account/albums/${albumId}/visibility`, {
      method: 'PUT',
      body: {
        is_public: isPublic,
      },
    })
  }

  return {
    updateAlbumVisibilityRequest,
  }
}
