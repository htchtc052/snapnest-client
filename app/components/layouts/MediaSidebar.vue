<script setup lang="ts">
import { ref } from 'vue'
import type { User } from '~/models/User'
import EditProfileModal from '~/components/modals/user/EditProfileModal.vue'
import { useOpenModal } from '~/composables/useOpenModal'
import Logo from '~/components/shell/Logo.vue'
import FooterNote from '~/components/shell/FooterNote.vue'
import UserAvatar from '~/components/user/UserAvatar.vue'

const route = useRoute()

const links = [
  { label: 'Photos', to: '/account' },
  { label: 'Albums', to: '/account/albums' },
] as const

const isActive = (to: string) => {
  if (to === '/account/albums') {
    return route.path.startsWith('/account/albums')
  }
  return route.path === to
}

const { user, logout, refreshIdentity } = useSanctumAuth<User>()

const isLoggingOut = ref(false)

const userMenuItems = [
  [
    {
      label: 'Edit profile',
      icon: 'i-heroicons-pencil-square',
      onSelect: () => openEditModal(),
    },
    {
      label: 'Upload avatar',
      icon: 'i-heroicons-camera',
      onSelect: () => {
        // TODO: implement avatar upload
      },
    },
  ],
  [
    {
      label: 'Logout',
      icon: 'i-heroicons-arrow-right-on-rectangle',
      color: 'error',
      onSelect: () => handleLogout(),
    },
  ],
]
const openEditProfileModal = useOpenModal<typeof EditProfileModal, boolean>(EditProfileModal)

async function openEditModal() {
  const ok = await openEditProfileModal({ user: user.value! })
  if (ok) {
    await refreshIdentity()
  }
}

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
  <div class="flex h-dvh w-56 flex-col gap-6 bg-elevated px-5 py-6">
    <Logo />

    <div class="flex flex-col gap-2">
      <UButton
        v-for="link in links"
        :key="link.to"
        :to="link.to"
        :variant="isActive(link.to) ? 'solid' : 'ghost'"
        color="primary"
        block
      >
        {{ link.label }}
      </UButton>
    </div>

    <USeparator class="my-2" />

    <template v-if="user">
      <UDropdownMenu :items="userMenuItems" :content="{ class: 'w-64' }">
        <UButton variant="ghost" class="w-full justify-between gap-3 px-2 py-2">
          <span class="flex min-w-0 items-center gap-3">
            <UserAvatar />
            <span class="truncate text-sm font-medium">{{ user.name }}</span>
          </span>
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
    </template>

    <div class="mt-auto">
      <FooterNote />
    </div>
  </div>
</template>
