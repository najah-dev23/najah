<template>
    <div class="mb-2 label-md">
        Container ID
        <a class="ww-editor-link ml-2" href="https://support.google.com/tagmanager/answer/6103696?hl=en#:~:text=In%20Tag%20Manager%2C%20click%20Workspace,as%20%22GTM%2DXXXXXX%22" target="_blank">
            Find it here
        </a>
    </div>
    <div class="mb-3 label-sm text-blue-500 flex items-center">
        <wwEditorIcon class="mr-1" name="information-circle" small />
        You can configure a different container id for each environment.
    </div>
    <wwEditorInputRow
        type="query"
        placeholder="GTM-XXXXXXXX"
        :model-value="settings.publicData.containerIdProd"
        label="In production"
        @update:modelValue="setConfig('containerIdProd', $event)"
        large
        required
    />
    <wwEditorInputRow
        type="query"
        placeholder="GTM-XXXXXXXX"
        :model-value="settings.publicData.containerIdStaging"
        label="In staging"
        @update:modelValue="setConfig('containerIdStaging', $event)"
        large
    />
    <wwEditorInputRow
        type="query"
        placeholder="GTM-XXXXXXXX"
        :model-value="settings.publicData.containerIdEditor"
        label="In editor"
        @update:modelValue="setConfig('containerIdEditor', $event)"
        large
    />
</template>

<script>
export default {
    props: {
        plugin: { type: Object, required: true },
        settings: { type: Object, required: true },
    },
    emits: ['update:settings'],
    methods: {
        setConfig(key, containerId) {
            this.$emit('update:settings', { ...this.settings, publicData: { ...this.settings.publicData, [key]: containerId } });
        },
    },
};
</script>
