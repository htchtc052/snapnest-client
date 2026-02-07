import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { vi } from 'vitest'

mockNuxtImport('useSanctumClient', () => () => vi.fn())
mockNuxtImport('useToast', () => () => ({ add: vi.fn() }))
