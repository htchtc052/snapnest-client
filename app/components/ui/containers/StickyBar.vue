<script setup lang="ts">
defineProps<{
    class?: string
}>()
</script>

<template>
    <div :class="['sticky top-12 z-20 bg-white/90 backdrop-blur', $props.class]">
        <slot />
    </div>
</template>
