import { createError } from '#imports'

const pagePattern = /^[1-9]\d*$/

export default defineNuxtRouteMiddleware((to) => {
  const page = typeof to.query.page === 'string' ? to.query.page : null
  if (!page) return

  if (!pagePattern.test(page)) {
    if (import.meta.dev) {
      console.error('[page-validate] Invalid page query', page)
    }
    throw createError({ statusCode: 404, statusMessage: 'Page not found' })
  }
})
