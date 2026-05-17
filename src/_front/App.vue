<template>
     <!-- wwFront:start -->
    <router-view />
    <SpeedInsights />
    <!-- wwFront:end -->
</template>

<script>
import { reactive, computed, provide, onMounted, watch } from 'vue';
import { SpeedInsights } from '@vercel/speed-insights/vue';

 
export default {
    components: {
        SpeedInsights,
    },
    setup() {
        const wwFrontState = reactive({
            lang: computed(() => wwLib.$store.getters['front/getLang']),
            pageId: computed(() => wwLib.$store.getters['websiteData/getPageId']),
            screenSize: computed(() => wwLib.$store.getters['front/getScreenSize']),
            screenSizes: computed(() => wwLib.$store.getters['front/getScreenSizes']),
        });
        provide('wwFrontState', wwFrontState);

     },
};
</script>

<style>
 </style>
