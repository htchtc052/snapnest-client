import type { SanctumClient } from "~/http/sanctum/sanctum-client.type";
import type { ProfileUpdateDto } from "~/types/profile-update.contract";
import type { User } from '~/types/user.model';


export async function profileUpdate(client: SanctumClient, data: ProfileUpdateDto): Promise<User> {
    const { birthDate, ...rest } = data
    return client<User>('/api/account', {
        method: 'PUT',
        body: {
            ...rest,
            birth_date: birthDate,
        },
    })
}
