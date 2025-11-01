import type { User } from '~/models/user'
import type {RegistrationDto} from "~/contracts/registration.contract";



export async function useRegister(data: RegistrationDto): Promise<void> {

    const client = useSanctumClient()
    const { refreshIdentity } = useSanctumAuth()
    const config = useSanctumConfig()
    const router = useRouter()

    await client<User>('/register', { method: 'POST', body: data })
    await refreshIdentity()
    await router.push(config.redirect.onLogin  || '/account')
}
