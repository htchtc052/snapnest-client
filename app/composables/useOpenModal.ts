import type { Component } from 'vue'
import type { ComponentProps } from 'vue-component-type-helpers'


export function useOpenModal() {
    const overlay = useOverlay()

    return async function open<C extends Component>(
        component: C,
        props?: ComponentProps<C>
    ): Promise<boolean> {
        const modal = overlay.create<C>(component)
        const instance = modal.open(props)
        const result = await instance.result

        return Boolean(result)
    }
}
