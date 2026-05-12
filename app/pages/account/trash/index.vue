<script setup lang="ts">
import { AccountTrashImagesWidget } from '~/widgets/images/account-trash-images'

definePageMeta({
  layout: 'media',
})
</script>

<template>
  <div class="flex h-full min-h-0 flex-col px-4">
    <div class="flex items-start gap-3 pt-5 pb-4">
      <h1 class="text-4xl font-bold tracking-tight text-highlighted">
        Trash
      </h1>
    </div>

    <AccountTrashImagesWidget />
  </div>
</template>
