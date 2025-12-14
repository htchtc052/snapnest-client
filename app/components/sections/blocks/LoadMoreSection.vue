<script setup lang="ts">
defineProps<{ loading: boolean }>()
defineEmits<{ (e: 'click'): void }>()
</script>

<template>
    <BaseSection>
        <div class="mt-6 flex justify-center">
            <UButton :loading="loading" @click="$emit('click')">
                Load more
            </UButton>
        </div>
    </BaseSection>
</template>
