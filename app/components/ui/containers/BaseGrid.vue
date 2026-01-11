<script setup lang="ts">
const props = defineProps<{ gridClass?: string }>()
</script>

<template>
  <div :class="props.gridClass ?? 'grid gap-6'">
    <slot />
  </div>
</template>
