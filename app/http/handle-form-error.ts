import type { FormError } from "#ui/types";
import { FetchError } from 'ofetch';


const VALIDATION_ERROR_CODE = 422
const SERVER_ERROR_CODE = 500


export interface MappedFormError {
    isValidationError: boolean
    code: number
    bag: FormError[]
}

type BackendErrors = Record<string, string[]>


function mapValidationErrors(errors: BackendErrors): FormError[] {
    return Object.entries(errors).map(([name, messages]) => ({
        name,
        message: messages[0] ?? '',
    }))
}


export function mapFormError(error: unknown): MappedFormError {
    const isFetchError = error instanceof FetchError
    const code =
        isFetchError && error.response?.status
            ? error.response.status
            : SERVER_ERROR_CODE

    const isValidationError = code === VALIDATION_ERROR_CODE

    const bag =
        isValidationError && isFetchError && error.response?._data?.errors
            ? mapValidationErrors(error.response._data.errors)
            : []

    return { isValidationError, code, bag }
}


