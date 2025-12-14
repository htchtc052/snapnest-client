<script setup lang="ts">
const props = defineProps<{ id: number }>()
const model = defineModel<number[]>({ default: () => [] })
</script>

<template>
  <button
    type="button"
    aria-label="Toggle selection"
    @click.stop="
      model = model.includes(props.id)
        ? model.filter(x => x !== props.id)
        : [...model, props.id]
    "
  >
    <Icon
      :name="model.includes(props.id)
        ? 'i-heroicons-check-circle-20-solid'
        : 'i-heroicons-circle-20-solid'"
      class="w-5 h-5"
    />
  </button>
</template>
