<script setup lang="ts">
import { ref } from '#imports'
import { useTestPiniaStore } from '~/stores/testPinia'

const store = useTestPiniaStore()
const newItem = ref('')

function addItem() {
  store.addItem(newItem.value)
  newItem.value = ''
}
</script>

<template>
  <div class="mx-auto w-full max-w-lg space-y-4 p-6">
    <h1 class="text-2xl font-semibold text-foreground">
      Test Pinia
    </h1>

    <UFormField label="New item">
      <UInput v-model="newItem" placeholder="Type and add" @keyup.enter="addItem" />
    </UFormField>

    <div class="flex items-center gap-2">
      <UButton color="primary" @click="addItem">
        Add
      </UButton>
      <UButton color="neutral" variant="ghost" :disabled="store.items.length === 0" @click="store.clear">
        Clear
      </UButton>
    </div>

    <UAlert
      v-if="store.items.length === 0"
      color="neutral"
      variant="soft"
      title="No items yet"
    />

    <ul v-else class="space-y-2">
      <li
        v-for="(item, index) in store.items"
        :key="`${item}-${index}`"
        class="flex items-center justify-between rounded-md border border-muted-200 px-3 py-2"
      >
        <span class="truncate text-sm text-foreground">{{ item }}</span>
        <UButton
          icon="i-lucide-x"
          color="neutral"
          variant="ghost"
          size="xs"
          square
          @click="store.removeItem(index)"
        />
      </li>
    </ul>
  </div>
</template>
