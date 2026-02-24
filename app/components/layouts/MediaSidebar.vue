<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import ProfileEditModal from '~/components/account/ProfileEditModal.vue'
import UserAvatar from '~/components/account/UserAvatar.vue'
import FooterNote from '~/components/shell/FooterNote.vue'
import Logo from '~/components/shell/Logo.vue'
import { useUploadsStore } from '~/stores/uploadsStore'
import { useOpenModal } from '~/composables/useOpenModal'
import { uploadErrorMessage } from '~/types/upload-error-code'
import { formatBytes } from '~/utils/format-bytes'
import type { User } from '~/types/user.model'

const route = useRoute()

const links = [
  { label: 'Albums', to: '/account/albums', icon: 'i-heroicons-folder-20-solid', exact: false },
  { label: 'Photos', to: '/account', icon: 'i-heroicons-photo-20-solid', exact: true },
  { label: 'Trash', to: '/account/trash', icon: 'i-heroicons-trash-20-solid', exact: false },
] as const

const isActive = (link: typeof links[number]) => {
  if (link.exact) return route.path === link.to
  return route.path === link.to || route.path.startsWith(`${link.to}/`)
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
const openEditProfileModal = useOpenModal<typeof ProfileEditModal, boolean>(ProfileEditModal)
const uploadsStore = useUploadsStore()
const fileInput = ref<HTMLInputElement | null>(null)
const isUploadBlocked = computed(() => user.value?.isUploadBlocked === true)

watch(
  () => user.value,
  (value) => {
    console.log('[MediaSidebar] sanctum user', value)
  },
  { immediate: true },
)

async function openEditModal() {
  const ok = await openEditProfileModal({ user: user.value! })
  if (ok) {
    await refreshIdentity()
  }
}

function openUploadDialog() {
  if (isUploadBlocked.value) return
  fileInput.value?.click()
}

function handleFileSelect(event: Event) {
  if (isUploadBlocked.value) return
  const input = event.target as HTMLInputElement
  const files = Array.from(input.files ?? [])
  if (!files.length) return
  uploadsStore.uploadFiles(files)
  input.value = ''
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
        :variant="isActive(link) ? 'solid' : 'ghost'"
        color="primary"
        class="justify-start"
        block
      >
        <span class="mr-2 inline-flex h-4 w-4 items-center justify-center">
          <UIcon :name="link.icon" class="h-4 w-4" />
        </span>
        {{ link.label }}
      </UButton>
    </div>

    <template v-if="!isUploadBlocked">
      <input
        ref="fileInput"
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp"
        class="hidden"
        @change="handleFileSelect"
      >
      <UButton color="primary" variant="outline" size="sm" block @click="openUploadDialog">
        <UIcon name="i-heroicons-arrow-up-tray-20-solid" class="mr-2 h-4 w-4" />
        Upload images
      </UButton>
    </template>
    <template v-if="user">
      <div class="space-y-1 text-xs text-muted">
        <p>Photos: {{ user.imagesUsed }} / {{ user.maxImages }}</p>
        <p>Storage: {{ formatBytes(user.bytesUsed) }} / {{ formatBytes(user.maxTotalBytes) }}</p>
        <p v-if="isUploadBlocked" class="pt-1 text-xs font-medium tracking-tight text-error">
          Upload blocked: {{ uploadErrorMessage(user.uploadBlockedReason) }}
        </p>
      </div>
    </template>

    <USeparator class="my-2" />

    <template v-if="user">
      <UDropdownMenu :items="userMenuItems">
        <UButton variant="ghost" class="w-full justify-between gap-3 px-2 py-2">
          <div class="flex min-w-0 items-center gap-3">
            <UserAvatar />
            <div class="min-w-0 text-left">
              <p class="truncate text-sm font-medium">{{ user.name }}</p>
              <p class="truncate text-xs text-muted">{{ user.email }}</p>
            </div>
          </div>
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
