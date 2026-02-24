<script setup lang="ts">
import { computed, ref } from 'vue'
import Logo from '~/components/shell/Logo.vue'
import UserAvatar from '~/components/account/UserAvatar.vue'
import type { User } from '~/types/user.model'

const { user, logout } = useSanctumAuth<User>()
const isLoggingOut = ref(false)

const headerClass = computed(() =>
  user.value ? 'h-16 flex items-center justify-between' : 'h-16 flex items-center justify-center'
)

const userMenuItems = computed(() => [
  [
    {
      label: 'Logout',
      icon: 'i-heroicons-arrow-right-on-rectangle',
      color: 'error',
      disabled: isLoggingOut.value,
      onSelect: () => handleLogout(),
    },
  ],
])

async function handleLogout() {
  try {
    isLoggingOut.value = true
    await logout()
  } finally {
    isLoggingOut.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-muted">
    <header class="border-b border-default bg-elevated">
      <UContainer :class="headerClass">
        <Logo />

        <UDropdownMenu v-if="user" :items="userMenuItems">
          <UButton variant="ghost" class="flex items-center gap-2">
            <UserAvatar />
            <span class="text-sm font-medium text-foreground">{{ user.name }}</span>
            <UIcon name="i-heroicons-chevron-down" class="h-4 w-4 text-muted" />
          </UButton>

          <template #content-top>
            <div class="flex items-center gap-3 p-3">
              <UserAvatar />
              <div class="min-w-0">
                <p class="truncate text-sm font-medium">{{ user.name }}</p>
                <p class="truncate text-xs text-muted">{{ user.email }}</p>
              </div>
            </div>
            <USeparator />
          </template>
        </UDropdownMenu>
      </UContainer>
    </header>

    <main class="flex-1">
      <UContainer class="py-6">
        <slot />
      </UContainer>
    </main>
  </div>
</template>
