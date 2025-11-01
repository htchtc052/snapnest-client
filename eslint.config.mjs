// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
    rules: {
        // отключаем шум про порядок/разрешение импортов и "лишние зависимости"
        'import/order': 'off',
        'import/no-unresolved': 'off',
        'import/no-extraneous-dependencies': 'off'
    }
})
