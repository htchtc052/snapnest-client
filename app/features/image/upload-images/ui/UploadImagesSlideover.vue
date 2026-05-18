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
      content: 'left-auto right-4 h-36 w-[min(34rem,calc(100%-2rem))] max-h-[calc(100%-2rem)]',
      container: 'gap-0 p-0',
      header: 'flex h-20 items-center justify-between border-b border-default px-6',
      body: 'min-h-0 flex-1',
    }"
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
