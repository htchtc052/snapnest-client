import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { ref } from 'vue'
import { vi } from 'vitest'

export const refreshIdentityMock = vi.fn(async () => {})
export const sanctumUserMock = ref<unknown | null>(null)
export const sanctumIsAuthenticatedMock = ref(false)

mockNuxtImport('useSanctumClient', () => () => vi.fn())
mockNuxtImport('useToast', () => () => ({ add: vi.fn() }))
mockNuxtImport('useSanctumAuth', () => () => ({
  user: sanctumUserMock,
  isAuthenticated: sanctumIsAuthenticatedMock,
  refreshIdentity: refreshIdentityMock,
  login: vi.fn(),
  logout: vi.fn(),
}))
