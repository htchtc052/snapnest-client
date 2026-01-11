<script setup lang="ts">
definePageMeta({
  layout: 'auth',
  sanctum: {
    guestOnly: true,
  }
})
</script>

<template>
  <div class="text-center space-y-6">
    <div class="space-y-2">
      <h1 class="text-3xl font-semibold">Your photo space.</h1>
      <p class="text-muted">Store, organize, and share in minutes.</p>
    </div>

    <div class="flex items-center justify-center gap-3">
      <UButton to="/register" color="primary">Sign up</UButton>
      <UButton to="/login" variant="outline">Sign in</UButton>
    </div>
  </div>
</template>
