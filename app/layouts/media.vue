<script setup lang="ts">
import { ref } from 'vue'
import MediaSidebar from '~/components/layouts/MediaSidebar.vue'

const isNavOpen = ref(false)
</script>

<template>
  <div class="flex h-dvh bg-muted">
    <aside class="hidden lg:block">
      <MediaSidebar />
    </aside>

    <div class="flex min-h-0 flex-1 flex-col">
      <header class="flex h-12 items-center px-4 lg:hidden">
        <UButton icon="i-heroicons-bars-3" variant="ghost" aria-label="Open menu" @click="isNavOpen = true" />
      </header>

      <main class="min-h-0 flex-1">
        <slot />
      </main>
    </div>

    <UDrawer
      v-model:open="isNavOpen"
      direction="left"
      :ui="{ content: 'p-0 bg-elevated h-dvh', body: 'p-0 overflow-hidden' }"
    >
      <template #body>
        <MediaSidebar />
      </template>
    </UDrawer>
  </div>
</template>
