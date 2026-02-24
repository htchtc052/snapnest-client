import type { SanctumClient } from "~/http/sanctum/sanctum-client.type";
import type { RegistrationDto } from "~/types/registration.contract";
import type { User } from '~/types/user.model';


export function register(client: SanctumClient, data: RegistrationDto): Promise<User> {

    return client<User>('/register', { method: 'POST', body: data })

}
