<template>
    <div class="flex items-center">
        <wwEditorIcon large name="key" class="mr-2" />
        <span class="caption-m">{{ containerId }}</span>
    </div>
</template>

<script>
export default {
    props: {
        settings: { type: Object, required: true },
    },
    computed: {
        containerId() {
            return this.settings.publicData.containerId || '';
        },
    },
};
</script>
