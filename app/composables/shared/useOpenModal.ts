import type { Component } from 'vue'
import type { ComponentProps } from 'vue-component-type-helpers'

export function useOpenModal<C extends Component, R = unknown>(component: C) {
    const overlay = useOverlay()

    return async function open(props?: ComponentProps<C>): Promise<R> {
        const modal = overlay.create<C>(component)
        const { result } = modal.open(props)
        return await result as R
    }
}
