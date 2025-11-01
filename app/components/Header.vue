<script setup lang="ts">
import type { User } from '~/models/user'

const { user, logout, isAuthenticated } = useSanctumAuth<User>()

const pending = ref(false)
const handleLogout = async () => {
  try {
    pending.value = true
    await logout()
  } finally {
    pending.value = false
  }
}
</script>

<template>
  <header class="border-b border-default bg-elevated sticky top-0 z-20">
    <UContainer class="h-16 flex items-center justify-between">
      <NuxtLink to="/" class="text-xl font-bold text-primary">
        Snapnest Webapp
      </NuxtLink>

      <nav class="flex items-center gap-4">
        <template v-if="isAuthenticated">
          <NuxtLink to="#">
            {{ user?.name }}
          </NuxtLink>

          <UButton
              variant="outline"
              color="error"
              :loading="pending"
              :disabled="pending"
              @click="handleLogout"
          >
            Logout
          </UButton>
        </template>

        <template v-else>
          <UButton to="/register" variant="outline">
            Register
          </UButton>
          <UButton to="/login" variant="outline">
            Login
          </UButton>
        </template>
      </nav>
    </UContainer>
  </header>
</template>
