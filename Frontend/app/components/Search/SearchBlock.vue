<script setup lang="ts">
import { ref } from 'vue'
import * as _ from 'lodash'
import CInput from '~/composebles/CInput.vue'

const search = ref('')

const debouncedSearch = _.debounce((value: string) => {
    console.log('Search value changed:', value)
}, 500)

watch(search, (newValue) => {
    debouncedSearch(newValue)
})
</script>

<template>
    <div class="bg-panel py-5 px-6 gap-4 flex flex-col border-l border-line">
        <h3 class="font-mono text-label text-bronze uppercase">Find a film</h3>

        <CInput
            v-model="search"
            placeholder="Search for a film..."
            class="w-full"
        />

        <p>
            Results appear here with posters from TMDB. Drag a poster straight
            into any tier.
        </p>
    </div>
</template>
