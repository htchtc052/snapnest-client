<script setup lang="ts">

import Footer from '~/components/layouts/Footer.vue'
import Header from '~/components/layouts/Header.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <Header />
    <main class="flex-1 py-6">
      <slot />
    </main>

    <Footer />
  </div>
</template>
