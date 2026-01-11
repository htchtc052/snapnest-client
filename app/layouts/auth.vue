<script setup lang="ts">
import FooterNote from '~/components/shell/FooterNote.vue';
import Logo from '~/components/shell/Logo.vue';

</script>

<template>
  <div class="min-h-screen flex flex-col bg-muted">
    <header class="border-b border-default bg-elevated">
      <UContainer class="h-16 flex items-center justify-center">
        <Logo />
      </UContainer>
    </header>

    <main class="flex-1">
      <UContainer class="py-10 flex justify-center">
        <div class="w-full max-w-md">
          <slot />
        </div>
      </UContainer>
    </main>

    <footer class="border-t border-default bg-elevated">
      <UContainer class="py-4 flex flex-col items-center gap-3">
        <div class="flex flex-wrap justify-center gap-2">
          <UButton to="#" variant="ghost" size="sm">About</UButton>
          <UButton to="#" variant="ghost" size="sm">Plans</UButton>
          <UButton to="#" variant="ghost" size="sm">Support</UButton>
          <UButton to="#" variant="ghost" size="sm">Privacy</UButton>
          <UButton to="#" variant="ghost" size="sm">Terms</UButton>
        </div>
        <FooterNote />
      </UContainer>
    </footer>
  </div>
</template>
