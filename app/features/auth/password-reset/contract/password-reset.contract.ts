import * as yup from 'yup'

export const passwordResetSchema = yup.object({
  token: yup.string().required('Reset token is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
  password_confirmation: yup
    .string()
    .required('Please confirm password')
    .oneOf([yup.ref('password')], 'Passwords must match'),
})

export type PasswordResetDto = yup.Asserts<typeof passwordResetSchema>
