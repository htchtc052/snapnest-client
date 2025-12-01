<script setup lang="ts" generic="T">
const props = defineProps<{
  items: T[]
  isLoading?: boolean
  error?: unknown
}>()

defineSlots<{
  default(props: { item: T; index: number }): void
  empty?: () => void
  error?: (props: { error: unknown }) => void
}>()
</script>

<template>
  <div v-if="props.isLoading" class="py-10 text-center">
    <USkeleton class="w-24 h-24" />
  </div>

  <div v-else-if="props.error" class="py-10 text-center">
    <slot name="error" :error="props.error"><span class="text-red-600">Failed to load</span></slot>
  </div>

  <div v-else-if="!props.items.length" class="py-16 text-center text-lg">
    <slot name="empty">Nothing here</slot>
  </div>

  <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    <slot v-for="(item, i) in props.items" :item="item" :index="i" />
  </div>
</template>
