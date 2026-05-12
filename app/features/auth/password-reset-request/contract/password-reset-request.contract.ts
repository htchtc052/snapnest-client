import * as yup from 'yup'

export const passwordResetRequestSchema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
})

export type PasswordResetRequestDto = yup.Asserts<typeof passwordResetRequestSchema>
