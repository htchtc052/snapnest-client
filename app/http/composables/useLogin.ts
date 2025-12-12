import type {LoginDto} from "~/contracts/login.contract";


export async function useLogin(data: LoginDto): Promise<void> {
    const { login } = useSanctumAuth()
    await login(data)
}
