<!-- app/components/app/Fancybox.vue -->
<script setup lang="ts">
import { onMounted, onUpdated, onUnmounted, ref } from 'vue'
import { Fancybox } from '@fancyapps/ui'
import '@fancyapps/ui/dist/fancybox/fancybox.css'
import escapeHtml from 'escape-html' // npm i escape-html

const container = ref<HTMLElement | null>(null)
const selector = "[data-fancybox='app']"

function buildCaption(el: HTMLElement): string {
  const title       = escapeHtml(el.dataset.captionTitle ?? '')
  const description = escapeHtml(el.dataset.captionDesc ?? '')
  const date        = escapeHtml(el.dataset.captionDate ?? '')
  const originalUrl = escapeHtml(el.dataset.original ?? '')
  const downloadUrl = escapeHtml(el.dataset.download ?? '')

  return `
    <div class="space-y-1">
      ${title ? `<div class="font-semibold">${title}</div>` : ''}
      ${description ? `<div class="text-sm opacity-80">${description}</div>` : ''}
      ${date ? `<div class="text-xs opacity-60">${date}</div>` : ''}
      <div class="mt-2 flex gap-4 text-sm">
        ${originalUrl ? `<a href="${originalUrl}" target="_blank" rel="noopener noreferrer" class="underline">Open original</a>` : ''}
        ${downloadUrl ? `<a href="${downloadUrl}" class="underline" download>Download</a>` : ''}
      </div>
    </div>
  `
}

function prepareCaptions(root: HTMLElement): void {
  root.querySelectorAll<HTMLElement>(selector).forEach((el) => {
    el.setAttribute('data-caption', buildCaption(el)) // v6: Fancybox читает подпись из data-caption
  })
}

function bind(): void {
  if (!container.value) return
  prepareCaptions(container.value)
  Fancybox.bind(container.value, selector) // без опций и типов либы
}

function unbind(): void {
  if (container.value) Fancybox.unbind(container.value)
  Fancybox.close()
}

onMounted(bind)
onUpdated(() => { unbind(); bind() })
onUnmounted(unbind)
</script>

<template>
  <div ref="container">
    <slot />
  </div>
</template>
