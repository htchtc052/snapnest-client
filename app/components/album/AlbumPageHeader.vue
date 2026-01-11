<script setup lang="ts">
import PageHeader from '~/components/ui/page-header/PageHeader.vue';
import PageHeaderTitle from '~/components/ui/page-header/PageHeaderTitle.vue';
import type { Album } from '~/models/Album';

defineProps<{
    album: Album
}>()
</script>

<template>
    <PageHeader>
        <div class="flex items-center justify-between">
            <div>
                <PageHeaderTitle>
                    Album {{ album.name }}
                </PageHeaderTitle>
                <p class="text-sm text-gray-600">
                    {{ album.imagesCount }} images
                </p>
            </div>
        </div>
    </PageHeader>
</template>
