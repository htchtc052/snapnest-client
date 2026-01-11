<script setup lang="ts">
import { ref, watchEffect } from 'vue';

const props = withDefaults(defineProps<{
    indeterminate?: boolean
    disabled?: boolean
}>(), {
    indeterminate: false,
    disabled: false,
})

const checked = defineModel<boolean>({ default: false })

const inputRef = ref<HTMLInputElement | null>(null)

watchEffect(() => {
    if (!inputRef.value) return
    inputRef.value.indeterminate = !!props.indeterminate && !checked.value
})

function onChange(e: Event) {
    const el = e.target as HTMLInputElement
    checked.value = el.checked
    el.indeterminate = false
}
</script>

<template>
    <input ref="inputRef" type="checkbox" :checked="checked" :disabled="disabled" @click.stop @change.stop="onChange">
</template>
