export default {
    editor: {
        settings: {
            edit: () => import('./src/components/SettingsEdit.vue'),
            summary: () => import('./src/components/SettingsSummary.vue'),
            getIsValid(settings) {
                return !!settings.publicData.containerIdProd;
            },
            onSave: 'onLoad'
        },
    },
    actions: [
        {
            name: 'Push Event',
            code: 'pushEvent',
            getIsValid({ event }) {
                return !!event;
            },
        },
    ],
};
