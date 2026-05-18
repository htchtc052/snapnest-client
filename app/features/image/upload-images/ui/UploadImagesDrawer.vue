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
    :ui="{
      content: 'sm:left-auto sm:w-full sm:max-w-xl',
    }"
  >
    <template #header>
      <div class="flex w-full items-center justify-between gap-3">
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
      </div>
    </template>
  </UDrawer>
</template>
