<script setup lang="ts">
import { computed } from 'vue'
import type { User } from '~/types/user.model'
import { getUserInitials } from '~/utils/getUserInitials'

const { user } = useSanctumAuth<User>()

const text = computed(() => getUserInitials(user.value!.name))
</script>

<template>
  <UAvatar v-if="user" :text="text" :alt="user.name" size="md"
    class="bg-primary/10 text-primary ring-2 ring-primary/40" />
</template>
