import type { FormError } from '#ui/types'

type BackendErrors = Record<string, string[]>

export function mapValidationErrors (errors: BackendErrors): FormError[] {
    return Object.entries(errors).map(([name, messages]) => ({
        name,
        message: messages[0] ?? '',
    }))
}
