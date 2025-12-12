<script setup lang="ts">
import { useDateFormat } from '@vueuse/core'
import { computed } from 'vue'
import EditProfileModal from '~/components/modals/EditProfileModal.vue'
import type { User } from '~/models/User'

const { user, refreshIdentity } = useSanctumAuth<User>()

const u = computed<User>(() => user.value as User)

type Row = { label: string; value: string }

const rows = computed<Row[]>(() => {
  const items: Row[] = [
    { label: 'Name', value: u.value.name },
    { label: 'Email', value: u.value.email },
    { label: 'Created at', value: useDateFormat(u.value.created_at, 'YYYY.MM.DD').value },
  ]

  if (u.value.birth_date) {
    items.push({
      label: 'Birth date',
      value: useDateFormat(u.value.birth_date, 'YYYY.MM.DD').value,
    })
  }

  if (u.value.bio) {
    items.push({ label: 'Bio', value: u.value.bio })
  }

  return items
})

const openEditProfileModal = useOpenModal<typeof EditProfileModal, boolean>(EditProfileModal)

async function openEditModal() {
  const ok = await openEditProfileModal({ user: u.value })
  if (ok) {
    await refreshIdentity()
  }
}
</script>


<template>
  <div>
    <div class="flex items-center justify-between py-6">
      <h1 class="text-3xl font-semibold">Account info</h1>
      <UButton color="primary" @click="openEditModal">
        <Icon name="i-heroicons-pencil-square-solid" class="mr-2" />
        Edit profile
      </UButton>
    </div>

    <UCard>
      <dl class="grid grid-cols-3 gap-y-4">
        <template v-for="row in rows" :key="row.label">
          <dt class="col-span-1 text-muted">{{ row.label }}</dt>
          <dd class="col-span-2">{{ row.value }}</dd>
        </template>
      </dl>
    </UCard>
  </div>
</template>
