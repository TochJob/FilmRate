<script setup lang="ts">
const props = defineProps<{
    rang: string
    description?: string
}>()
</script>

<template>
    <div class="flex gap-2 h-full">
        <div class="flex flex-col gap-1 items-center self-center">
            <p class="font-display text-tier-letter text-tier-s">
                {{ props.rang }}
            </p>
            <div
                contenteditable="true"
                class="font-mono text-micro text-bronze uppercase py-1 px-2"
            >
                {{ props.description || 'Masterpice' }}
            </div>
        </div>
        <div class="border-r-2 border-tier-s w-px"></div>

        <div class="flex-1 flex flex-wrap content-start gap-3 p-4">
            <slot />
        </div>
    </div>
</template>

<style scoped></style>
