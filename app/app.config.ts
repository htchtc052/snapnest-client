export default defineAppConfig({
  ui: {
    colors: {
      primary: 'blue',
      secondary: 'indigo',
    },
    modal: {
      slots: {
        content: 'bg-default rounded-lg divide-none px-6 py-4',
      },
    },
    container: {
      base: 'max-w-5xl mx-auto px-6',
    },
    card: {
      variants: {
        variant: {
          surface: 'bg-muted rounded-lg',
        },
      },
      defaultVariants: { variant: 'surface' },
    },
  },
  upload: {
    maxFilesPerSelection: 500,
    maxQueueItems: 1000,
  },
})
