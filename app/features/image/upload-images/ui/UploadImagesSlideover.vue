<script setup lang="ts">
const emit = defineEmits<{
  close: []
}>()
</script>

<template>
  <UDrawer
    direction="bottom"
    :modal="false"
    :overlay="false"
    :dismissible="false"
    :handle="false"
    inset
  >
    <template #header>
      <h2 class="text-lg font-semibold text-highlighted">
        Uploads
      </h2>

      <UButton
        icon="i-lucide-x"
        color="neutral"
        variant="ghost"
        aria-label="Close"
        @click="emit('close')"
      />
    </template>
  </UDrawer>
</template>
