import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { provideSelectionStore } from '~/composables/useSelection'

function makeStore() {
  const Host = defineComponent({
    setup() {
      const store = provideSelectionStore()
      return { store }
    },
    template: '<div />',
  })

  const wrapper = mount(Host)
  return wrapper.vm.store
}

describe('useSelection', () => {
  it('computes selection label and actions for a single item', () => {
    const store = makeStore()

    store.toggleSelection({ id: 1, name: 'One' })

    expect(store.selectionLabel.value).toBe('One')
    expect(store.canRename.value).toBe(true)
    expect(store.showClearToggle.value).toBe(false)
    expect(store.selectionMode.value).toBe(true)
  })

  it('updates label and toggles for multiple items', () => {
    const store = makeStore()

    store.toggleSelection({ id: 1, name: 'One' })
    store.toggleSelection({ id: 2, name: 'Two' })

    expect(store.selectionLabel.value).toBe('2 selected')
    expect(store.canRename.value).toBe(false)
    expect(store.showClearToggle.value).toBe(true)
  })

  it('clears and toggles selected image ids', () => {
    const store = makeStore()

    store.toggleSelection({ id: 1, name: 'One' })
    store.toggleSelection({ id: 1, name: 'One' })
    expect(store.selectedIds.value).toEqual([])

    store.toggleSelection({ id: 2, name: 'Two' })
    store.clearSelection()
    expect(store.selectedIds.value).toEqual([])
    expect(store.selectionMode.value).toBe(false)
  })

  it('selects and deselects many images at once', () => {
    const store = makeStore()

    store.selectImages([
      { id: 1, name: 'One' },
      { id: 2, name: 'Two' },
      { id: 3, name: 'Three' },
    ])

    expect(store.selectedIds.value).toEqual([1, 2, 3])

    store.deselectImages([1, 3])
    expect(store.selectedIds.value).toEqual([2])
  })
})
