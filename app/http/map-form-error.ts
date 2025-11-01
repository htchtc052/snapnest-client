import { FetchError } from 'ofetch'

import type { MappedFormError } from './mapped-form-error.interface'
import {mapValidationErrors} from "~/http/map-validation-errors";

const VALIDATION_ERROR_CODE = 422
const SERVER_ERROR_CODE = 500

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
