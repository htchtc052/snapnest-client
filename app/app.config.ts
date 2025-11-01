export default defineAppConfig({
    ui: {
        colors: {
            primary: 'blue'
        },
        modal: {
        },
        container: {
            base: 'max-w-5xl mx-auto px-6'
        },
        card: {
            variants: {
                variant: {
                    surface: 'bg-muted rounded-lg'
                }
            },
            defaultVariants: { variant: 'surface' }
        },

    }
})
