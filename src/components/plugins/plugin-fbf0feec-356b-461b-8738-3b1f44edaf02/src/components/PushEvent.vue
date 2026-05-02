<template>
    <wwEditorInputRow
        label="Event variables"
        type="array"
        :model-value="event"
        bindable
        @update:modelValue="setEvent"
        @add-item="setEvent([...event, {}])"
    >
        <template #default="{ item, setItem }">
            <wwEditorInputRow
                type="query"
                :model-value="item.key"
                label="Key"
                placeholder="Enter a key"
                bindable
                small
                @update:modelValue="setItem({ ...item, key: $event })"
            />
            <wwEditorInputRow
                type="query"
                :model-value="item.value"
                label="Value"
                placeholder="Enter a value"
                bindable
                small
                @update:modelValue="setItem({ ...item, value: $event })"
            />
        </template>
    </wwEditorInputRow>
</template>

<script>
export default {
    props: {
        plugin: { type: Object, required: true },
        args: { type: Object, required: true },
    },
    emits: ['update:args'],
    computed: {
        event() {
            return this.args.event || [];
        },
    },
    methods: {
        setEvent(event) {
            this.$emit('update:args', { ...this.args, event });
        },
    },
};
</script>
