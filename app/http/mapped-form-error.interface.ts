import type {FormError} from "#ui/types";


export interface MappedFormError {
    isValidationError: boolean
    code: number
    bag: FormError[]
}
