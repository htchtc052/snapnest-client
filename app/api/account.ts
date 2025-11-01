import type { User } from '~/models/user'
import type {ProfileUpdateDto} from "~/contracts/profile-edit.contract";


export async function updateAccount(data: ProfileUpdateDto): Promise<User> {
    const client = useSanctumClient()
    return client<User>('/api/account', { method: 'PUT', body: data })
}
