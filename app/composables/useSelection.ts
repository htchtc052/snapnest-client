import { ref, type Ref } from 'vue'

export interface Selection {
    keys: Ref<number[]>
    isSelected(key: number): boolean
    toggle(key: number): void
    clear(): void
}

export function useSelection(): Selection {
    const keys = ref<number[]>([])

    const isSelected = (key: number): boolean =>
        keys.value.includes(key)

    const toggle = (key: number): void => {
        if (isSelected(key)) {
            keys.value = keys.value.filter(k => k !== key)
        } else {
            keys.value = [...keys.value, key]
        }
    }

    const clear = (): void => {
        keys.value = []
    }

    return { keys, isSelected, toggle, clear }
}
