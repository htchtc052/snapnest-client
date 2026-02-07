import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useSelectionStore } from '~/composables/useSelection'

describe('useSelection', () => {
  let warnSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const store = useSelectionStore()
    store.clearSelection()
  })

  afterEach(() => {
    warnSpy.mockRestore()
  })

  it('computes selection label and actions for a single item', () => {
    // Single selection should show the name and enable rename.
    const store = useSelectionStore()
    store.selectImages([{ id: 1, name: 'One' }])

    expect(store.selectionLabel.value).toBe('One')
    expect(store.canRename.value).toBe(true)
    expect(store.showClearToggle.value).toBe(false)
  })

  it('updates label and toggles for multiple items', () => {
    // Multiple selections should switch to count label and disable rename.
    const store = useSelectionStore()
    store.selectImages([{ id: 1, name: 'One' }])
    store.selectImages([{ id: 2, name: 'Two' }])

    expect(store.selectionLabel.value).toBe('2 selected')
    expect(store.canRename.value).toBe(false)
    expect(store.showClearToggle.value).toBe(true)
  })

  it('reports indeterminate group selection and toggles as expected', () => {
    // A partially selected group should be indeterminate.
    const store = useSelectionStore()
    const group = [
      { id: 1, name: 'One' },
      { id: 2, name: 'Two' },
    ]

    store.selectImages([{ id: 1, name: 'One' }])
    expect(store.groupSelectionValue(group)).toBe('indeterminate')

    store.toggleGroupSelection(group)
    expect(store.groupSelectionValue(group)).toBe(true)

    store.toggleGroupSelection(group)
    expect(store.groupSelectionValue(group)).toBe(false)
  })
})
