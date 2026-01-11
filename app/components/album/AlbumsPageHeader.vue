<script setup lang="ts">
import PageHeader from '~/components/ui/page-header/PageHeader.vue';
import PageHeaderTitle from '~/components/ui/page-header/PageHeaderTitle.vue';

defineProps<{
    openCreateAlbumModal: () => void
}>()
</script>

<template>
    <PageHeader>
        <div class="flex items-center justify-between ">
            <PageHeaderTitle>
                Albums
            </PageHeaderTitle>
            <UButton color="primary" @click="openCreateAlbumModal">
                <Icon name="i-heroicons-arrow-up-tray-20-solid" class="mr-2" />
                Add album
            </UButton>
        </div>
    </PageHeader>
</template>
