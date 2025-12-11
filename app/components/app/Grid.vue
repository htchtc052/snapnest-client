<script setup lang="ts">
const props = defineProps<{
  gap?: string
}>()

const classes = computed(
    () => `grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ${props.gap ?? 'gap-6'}`
)
</script>

<template>
  <div :class="classes">
    <slot />
  </div>
</template>
