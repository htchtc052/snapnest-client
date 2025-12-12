<script setup lang="ts">
</script>

<template>
  <UCard
      :ui="{
      root: 'rounded-lg border border-gray-200/70 shadow-sm',
      body: 'p-4 sm:p-4',
    }"
  >
    <slot />
  </UCard>
</template>
