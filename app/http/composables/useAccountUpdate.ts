import type { ProfileUpdateDto } from "~/contracts/profile-update.contract";
import type { User } from '~/models/User';


export async function useAccountUpdate(data: ProfileUpdateDto): Promise<User> {

    const client = useSanctumClient()
    return client<User>('/api/account', { method: 'PUT', body: data })
}
