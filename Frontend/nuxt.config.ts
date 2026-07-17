import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: { enabled: true },
    modules: ['@nuxt/eslint'],
    css: ['@/assets/main.css', '@/assets/tailwind.css'],
    vite: {
        plugins: [tailwindcss()],
    },
    eslint: {
        config: {
            stylistic: false,
        },
    },
})
