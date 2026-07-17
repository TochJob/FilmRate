<script setup lang="ts">
import { ref } from 'vue'
import FilmRow from '@/components/Films/FilmRow.vue'

const abs = ref('qwe')
const items = ref([
    { tier: 'S', label: 'Легенда', colorClass: 'border-tier-s' },
    { tier: 'A', label: 'Отлично', colorClass: 'border-tier-a' },
    { tier: 'B', label: 'Хорошо', colorClass: 'border-tier-b' },
    { tier: 'C', label: 'Средне', colorClass: 'border-tier-c' },
    { tier: 'D', label: 'Плохо', colorClass: 'border-tier-d' },
])
</script>
<template>
    <div class="grid grid-cols-1 gap-5 h-full">
        <FilmRow v-for="item of items" rang="S" :row="item" class="flex-1" />
    </div>
</template>
