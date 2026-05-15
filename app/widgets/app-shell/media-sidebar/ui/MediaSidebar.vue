<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
import { computed, ref } from '#imports'
import { useAvatarUpdate } from '~/features/profile/avatar-update'
import { useInfoUpdate } from '~/features/profile/info-update'
import { formatBytes } from '~/shared/format'
import type { User } from '~/entities/user'

const { updateAvatar } = useAvatarUpdate()
const { updateInfo } = useInfoUpdate()
const { user, logout } = useSanctumAuth<User>()
const isLoggingOut = ref(false)

const navItems = [
  { label: 'Photos', to: '/account/images', icon: 'i-heroicons-photo-20-solid', exact: true },
  { label: 'Albums', to: '/account/albums', icon: 'i-heroicons-folder-20-solid', exact: false },
  { label: 'Upload', to: '/account/upload', icon: 'i-heroicons-arrow-up-tray-20-solid', exact: false },
  { label: 'Trash', to: '/account/trash', icon: 'i-heroicons-trash-20-solid', exact: false },
]

const imagesUsage = computed(() => `${user.value?.imagesUsed ?? 0} / ${user.value?.maxImages ?? 0}`)
const storageUsage = computed(() => `${formatBytes(user.value?.bytesUsed)} / ${formatBytes(user.value?.maxTotalBytes)}`)
const profileMenuItems = computed<DropdownMenuItem[][]>(() => [
  [
    {
      label: 'Change avatar',
      icon: 'i-heroicons-camera-20-solid',
      onSelect: () => openAvatarEditor(),
    },
    {
      label: 'Edit info',
      icon: 'i-heroicons-user-circle-20-solid',
      onSelect: () => openProfileEditor(),
    },
  ],
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

async function openAvatarEditor() {
  await updateAvatar()
}

async function openProfileEditor() {
  await updateInfo()
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
  <aside class="flex h-full w-72 shrink-0 flex-col border-r border-default bg-elevated/30 px-5 py-6">
    <NuxtLink to="/account/images" class="mb-8 flex items-center gap-3">
      <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <UIcon name="i-heroicons-cloud-20-solid" class="h-6 w-6" />
      </div>
      <div>
        <div class="text-xl font-semibold text-primary">
          Snapnest
        </div>
        <div class="text-sm text-muted">
          Photo Cloud
        </div>
      </div>
    </NuxtLink>

    <nav class="space-y-2">
      <NuxtLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="flex items-center gap-3 rounded-xl px-4 py-3 text-lg transition-colors"
        :class="$route.path === item.to || (!item.exact && $route.path.startsWith(item.to))
          ? 'bg-secondary/10 text-secondary'
          : 'text-default hover:bg-muted'"
      >
        <UIcon :name="item.icon" class="h-6 w-6" />
        <span>{{ item.label }}</span>
      </NuxtLink>
    </nav>

    <div class="mt-6 space-y-4">
      <div class="border-t border-default pt-4 text-base text-muted">
        <div>Photos: {{ imagesUsage }}</div>
        <div>Storage: {{ storageUsage }}</div>
      </div>

      <UDropdownMenu v-if="user" :items="profileMenuItems">
        <UButton
          variant="ghost"
          color="neutral"
          class="h-auto w-full justify-start rounded-xl p-2 hover:bg-muted"
        >
          <span class="relative shrink-0">
            <UAvatar
              :alt="user.name"
              :src="user.avatarUrl || undefined"
              size="xl"
            />
            <span
              role="button"
              tabindex="0"
              title="Change avatar"
              class="absolute -right-0.5 -bottom-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-inverted ring-2 ring-elevated"
              @click.stop.prevent="openAvatarEditor"
              @keydown.enter.stop.prevent="openAvatarEditor"
              @keydown.space.stop.prevent="openAvatarEditor"
            >
              <UIcon name="i-heroicons-camera-20-solid" class="h-3 w-3" />
            </span>
          </span>
          <div class="min-w-0 flex-1 text-left">
            <div class="truncate text-lg font-medium text-default">
              {{ user.name }}
            </div>
            <div class="truncate text-sm text-muted">
              {{ user.email }}
            </div>
          </div>
          <UIcon name="i-heroicons-chevron-down-20-solid" class="h-5 w-5 text-muted" />
        </UButton>

        <template #content-top>
          <div class="flex items-center gap-3 p-3">
            <UAvatar
              :alt="user.name"
              :src="user.avatarUrl || undefined"
              size="lg"
            />
            <div class="min-w-0">
              <p class="truncate text-sm font-medium text-default">
                {{ user.name }}
              </p>
              <p class="truncate text-xs text-muted">
                {{ user.email }}
              </p>
            </div>
          </div>
          <USeparator />
        </template>
      </UDropdownMenu>
    </div>
  </aside>
</template>
