import type { Component } from 'vue'
import { markRaw } from 'vue'
import type { ComponentProps } from 'vue-component-type-helpers'
import { usePersistentOverlay } from './usePersistentOverlay'
import PersistentDrawerContent from './ui/PersistentDrawerContent.vue'

type PersistentDrawerContentOptions<C extends Component> = {
  component: C
  title?: string
}

export function useOpenPersistentDrawerContent<C extends Component>(
  options: PersistentDrawerContentOptions<C>,
) {
  const drawer = usePersistentOverlay(PersistentDrawerContent)

  function open(componentProps?: ComponentProps<C>) {
    return drawer.open({
      component: markRaw(options.component),
      componentProps,
      title: options.title,
    })
  }

  function close() {
    return drawer.close()
  }

  function unmount() {
    drawer.unmount()
  }

  return {
    open,
    close,
    unmount,
  }
}
