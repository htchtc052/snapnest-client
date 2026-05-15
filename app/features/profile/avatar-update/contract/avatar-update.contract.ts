import * as yup from 'yup'

export type AvatarUpdateDto = {
  avatar: File | null
}

export const avatarUpdateSchema: yup.ObjectSchema<AvatarUpdateDto> = yup.object({
  avatar: yup
    .mixed<File>()
    .nullable()
    .defined()
    .test('required', 'Avatar image is required', (avatar) => {
      return typeof File !== 'undefined' && avatar instanceof File
    })
    .test('is-image', 'Avatar must be an image file', (avatar) => {
      return typeof File !== 'undefined'
        && avatar instanceof File
        && avatar.type.startsWith('image/')
    })
    .test('max-size', 'Avatar image must be 5 MB or smaller', (avatar) => {
      return typeof File !== 'undefined'
        && avatar instanceof File
        && avatar.size <= 5 * 1024 * 1024
    }),
})
