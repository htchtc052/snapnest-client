import type { User } from '~/types/user.model'
import type { SignUpDto } from '../contract/sign-up.contract'

export function useSignUpRequest() {
  const client = useSanctumClient()

  function signUpRequest(data: SignUpDto): Promise<User> {
    return client<User>('/register', {
      method: 'POST',
      body: data,
    })
  }

  return {
    signUpRequest,
  }
}
