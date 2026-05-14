import type { Component } from 'vue'
import type { ComponentProps } from 'vue-component-type-helpers'
import ModalContentAdapter from './ModalContentAdapter.vue'

type ModalContentOptions<C extends Component> = {
  component: C
  title?: string
}

export function useOpenModalContent<C extends Component, R = unknown>(options: ModalContentOptions<C>) {
  const overlay = useOverlay()

  return async function open(componentProps?: ComponentProps<C>): Promise<R> {
    const modal = overlay.create(ModalContentAdapter)
    const { result } = modal.open({
      component: options.component,
      componentProps,
      title: options.title,
    })

    return await result as R
  }
}
