<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'

type TimelineGroup = {
  key: string
  label: string
  timelineLabel?: string
}

const props = defineProps<{
  groups: TimelineGroup[]
  activeIndex: number
}>()

const emit = defineEmits<{ (e: 'select', index: number): void }>()

function handleSelect(index: number) {
  emit('select', index)
}

const listRef = ref<HTMLElement | null>(null)

function scrollActiveIntoView() {
  const container = listRef.value
  if (!container) return
  const active = container.querySelector(
    `[data-timeline-index="${props.activeIndex}"]`,
  ) as HTMLElement | null
  active?.scrollIntoView({ block: 'nearest' })
}

watch(
  () => props.activeIndex,
  async () => {
    await nextTick()
    scrollActiveIntoView()
  },
)

watch(
  () => props.groups.length,
  async () => {
    await nextTick()
    scrollActiveIntoView()
  },
)
</script>

<template>
  <div
    ref="listRef"
    class="hidden h-full min-h-0 w-24 shrink-0 flex-col items-end gap-2 overflow-y-auto py-3 pr-4 text-xs text-muted-500 lg:flex"
  >
    <button
      v-for="(group, index) in groups"
      :key="group.key"
      type="button"
      class="w-full truncate text-right transition hover:text-foreground"
      :class="index === activeIndex ? 'text-primary font-semibold' : ''"
      :data-timeline-index="index"
      @click="handleSelect(index)"
    >
      {{ group.timelineLabel ?? group.label }}
    </button>
  </div>
</template>
