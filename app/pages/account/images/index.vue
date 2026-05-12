<script setup lang="ts">
import { AccountImagesWidget } from '~/widgets/image-lists/account-images'

definePageMeta({
  layout: 'media',
})
</script>

<template>
  <div class="flex h-full min-h-0 flex-col overflow-hidden px-4">
    <div class="flex items-start gap-3 pt-5 pb-4">
      <h1 class="text-4xl font-bold tracking-tight text-highlighted">
        Photos
      </h1>
    </div>

    <AccountImagesWidget />
  </div>
</template>
