import type { Component } from 'vue'
import { markRaw } from 'vue'
import type { ComponentProps } from 'vue-component-type-helpers'

export function usePersistentOverlay<C extends Component>(component: C) {
  const overlay = useOverlay()

  let instance: ReturnType<typeof overlay.create<C>> | null = null

  function getInstance() {
    if (!instance) {
      instance = overlay.create<C>(markRaw(component), {
        destroyOnClose: false,
      })
    }

    return instance
  }

  function open(props?: ComponentProps<C>) {
    return getInstance().open(props)
  }

  function close() {
    return getInstance().close()
  }

  function patch(props: Partial<ComponentProps<C>>) {
    return getInstance().patch(props)
  }

  function unmount() {
    overlay.unmount(getInstance().id)
    instance = null
  }

  return {
    open,
    close,
    patch,
    unmount,
  }
}
