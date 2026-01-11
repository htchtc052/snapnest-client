<script setup lang="ts">

import Footer from '~/components/shell/Footer.vue';
import Header from '~/components/shell/Header.vue';
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <Header />
    def layout
    <main class="flex-1 overflow-hidden py-6">
      <slot />
    </main>
    <Footer />
  </div>
</template>
