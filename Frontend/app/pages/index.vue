<template>
    <main class="flex-1 min-h-0 flex">
        <div class="p-10 flex-1 min-h-0 flex flex-col">
            <h1
                class="font-display italic font-thin text-[34px] text-cream mb-10"
            >
                The Ranking Room
                <span
                    class="font-mono font-semibold text-label text-bronze uppercase"
                    >My 2026 watchlist</span
                >
            </h1>

            <Films />
        </div>

        <SearchBlock />
    </main>
</template>

<script setup lang="ts">
import Films from './Films.vue'
</script>
