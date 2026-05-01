import * as yup from 'yup'

export const forgotPasswordSchema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
})

export type ForgotPasswordDto = yup.Asserts<typeof forgotPasswordSchema>
