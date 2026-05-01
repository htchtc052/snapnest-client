import type { Asserts } from 'yup'
import * as yup from 'yup'
import type { AccountAlbum } from '~/types/account-album.model'

export const albumInfoSchema = yup.object({
  name: yup.string().required('Album name is required'),
})

export type AlbumInfoDto = Asserts<typeof albumInfoSchema>

export type AlbumCreateModalResult =
  | { action: 'cancel' }
  | { action: 'confirm'; album: AccountAlbum }

export type AlbumUpdateModalResult =
  | { action: 'cancel' }
  | { action: 'confirm'; album: AccountAlbum }
