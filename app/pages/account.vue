<script setup lang="ts">

const route = useRoute();

const links = [
  { label: 'Info', to: '/account' },
  { label: 'Images', to: '/account/images' },
  { label: 'Albums', to: '/account/albums' },
] as const

const isActive = (to: string) => route.path === to

</script>

<template>
  <UContainer class="py-4">
    <nav class="flex gap-3 justify-start mb-5">
      <UButton
          v-for="l in links" :key="l.to"
          :to="l.to"
          size="lg"
          color="primary"
          :variant="isActive(l.to) ? 'solid' : 'outline'"
          :aria-current="isActive(l.to) ? 'page' : undefined"
      >
        {{ l.label }}
      </UButton>
    </nav>

    <NuxtPage />
  </UContainer>
</template>
