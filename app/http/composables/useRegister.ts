import type { RegistrationDto } from "~/contracts/registration.contract";
import type { User } from '~/models/User';



export async function useRegister(data: RegistrationDto): Promise<void> {

    const client = useSanctumClient()
    const { refreshIdentity } = useSanctumAuth()
    const config = useSanctumConfig()
    const router = useRouter()

    await client<User>('/register', { method: 'POST', body: data })
    await refreshIdentity()
    await router.push(config.redirect.onLogin || '/account')
}
