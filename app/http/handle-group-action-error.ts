import { FetchError } from 'ofetch';

const BAD_REQUEST_CODE = 400
const SERVER_ERROR_CODE = 500


export interface MappedGroupActionError {
    isGroupActionError: boolean
    code: number
    message: string | null
}


export function mapGroupActionError(error: unknown): MappedGroupActionError {
    const isFetchError = error instanceof FetchError
    const code =
        isFetchError && error.response?.status
            ? error.response.status
            : SERVER_ERROR_CODE

    const isGroupActionError = code === BAD_REQUEST_CODE


    const message =
        isGroupActionError && isFetchError && typeof error.response?._data === 'string'
            ? error.response?._data
            : null


    return { isGroupActionError, code, message }
}
