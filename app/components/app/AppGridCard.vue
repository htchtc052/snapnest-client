<script setup lang="ts"></script>

<template>
  <UCard
      :ui="{
    root: 'rounded-lg border border-gray-200/70 shadow-sm',
    header: 'px-4 py-3 sm:px-4 sm:py-3 border-b border-gray-200/60',
    body: 'p-4 sm:p-4',
    footer: 'px-3 py-2 sm:px-3 sm:py-2'
  }"
  >
    <template v-if="$slots.header" #header>
      <slot name="header" />
    </template>

    <slot />

    <template v-if="$slots.footer" #footer>
      <slot name="footer" />
    </template>
  </UCard>
</template>
