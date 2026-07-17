<script setup lang="ts">
interface Props {
    label?: string
    placeholder?: string
    type?: 'text' | 'email' | 'password' | 'number' | 'tel'
    size?: 'sm' | 'md' | 'lg'
    disabled?: boolean
    readonly?: boolean
    required?: boolean
    clearable?: boolean
    error?: string
    hint?: string
    maxlength?: number
    id?: string
    name?: string
    autofocus?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    type: 'text',
    size: 'md',
})

const emit = defineEmits<{
    focus: [e: FocusEvent]
    blur: [e: FocusEvent]
    clear: []
    enter: [e: KeyboardEvent]
}>()

const model = defineModel<string>()

const inputId = crypto.randomUUID()

function handleClear() {
    model.value = ''
    emit('clear')
}
</script>

<template>
    <div
        class="c-input"
        :class="{ 'opacity-50 pointer-events-none': disabled }"
    >
        <label
            v-if="label"
            :for="inputId"
            class="block font-mono text-xs uppercase tracking-wide text-faded mb-2"
        >
            {{ label }}
            <span v-if="required" class="text-gold">*</span>
        </label>

        <div class="relative flex items-center">
            <span v-if="$slots.prefix" class="absolute left-4 text-faded">
                <slot name="prefix" />
            </span>

            <input
                :id="inputId"
                v-model="model"
                :type="type"
                :placeholder="placeholder"
                :disabled="disabled"
                :readonly="readonly"
                :maxlength="maxlength"
                :name="name"
                :autofocus="autofocus"
                :aria-invalid="!!error"
                class="w-full bg-field border border-edge rounded-input text-cream placeholder:text-faded px-3 py-2 font-mono text-sm outline-none transition-colors duration-150 focus:border-gold focus:shadow-focus-gold disabled:cursor-not-allowed"
                :class="[
                    $slots.prefix && 'pl-10',
                    ($slots.suffix || clearable) && 'pr-10',
                    error &&
                        'border-red-500 focus:border-red-500 focus:shadow-none',
                ]"
                @focus="emit('focus', $event)"
                @blur="emit('blur', $event)"
                @keydown.enter="emit('enter', $event)"
            />

            <button
                v-if="clearable && model"
                type="button"
                class="absolute right-4 text-faded hover:text-cream transition-colors"
                @click="handleClear"
            >
                ×
            </button>

            <span v-else-if="$slots.suffix" class="absolute right-4 text-faded">
                <slot name="suffix" />
            </span>
        </div>

        <p v-if="error" class="mt-2 font-mono text-xs text-red-500">
            {{ error }}
        </p>
        <p v-else-if="hint" class="mt-2 font-mono text-xs text-faded">
            {{ hint }}
        </p>
    </div>
</template>
