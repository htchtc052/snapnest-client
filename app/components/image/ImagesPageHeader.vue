<script setup lang="ts">
import PageHeaderTitle from '~/components/ui/page-header/PageHeaderTitle.vue';

defineProps<{
    onUpload: () => void
    class?: string
}>()
</script>

<template>
    <div :class="$props.class">
        <div class="flex items-center justify-between">
            <PageHeaderTitle>
                Images
            </PageHeaderTitle>

            <UButton color="primary" @click="onUpload">
                <Icon name="i-heroicons-arrow-up-tray-20-solid" class="mr-2" />
                Upload images
            </UButton>
        </div>
    </div>
</template>
