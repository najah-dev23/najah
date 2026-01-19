import { createRouter, createWebHistory } from 'vue-router';

import wwPage from './views/wwPage.vue';

import { initializeData, initializePlugins, onPageUnload } from '@/_common/helpers/data';

let router;
const routes = [];

function scrollBehavior(to) {
    if (to.hash) {
        return {
            el: to.hash,
            behavior: 'smooth',
        };
    } else {
        return { top: 0 };
    }
}

 
/* wwFront:start */
import pluginsSettings from '../../plugins-settings.json';

// eslint-disable-next-line no-undef
window.wwg_designInfo = {"id":"53c8f9d9-8637-49b9-b63a-d8ac55a61a0f","homePageId":"8209b37d-4fc2-46ef-9b86-e30667103ab8","authPluginId":"1fa0dd68-5069-436c-9a7d-3b54c340f1fa","baseTag":null,"defaultTheme":"light","langs":[{"lang":"en","default":true}],"background":{},"workflows":[],"pages":[{"id":"8209b37d-4fc2-46ef-9b86-e30667103ab8","linkId":"8209b37d-4fc2-46ef-9b86-e30667103ab8","name":"Home","folder":null,"paths":{"en":"home","default":"home"},"langs":["en"],"cmsDataSetPath":null,"sections":[{"uid":"d590aadd-d1f7-4bb1-9ce4-d2dc85fb7b7e","sectionTitle":"Top Nav","linkId":"91840dda-a511-481b-b8c0-576a2f5d0499"},{"uid":"96f74881-efeb-4abd-b5e4-8f49d3cb67b1","sectionTitle":"HERO","linkId":"68cf8b76-c7d7-4bfb-bdd1-c3ae5040a2a2"},{"uid":"c94d8baf-1286-4713-883f-2559c2c28cf7","sectionTitle":"Section promesses","linkId":"08fe3512-cfe9-45a9-bf06-544a0d78f6d7"},{"uid":"06868aa1-a95c-4522-bb00-c2f02de04d47","sectionTitle":"Few Steps","linkId":"0a7db2b2-63ea-4f96-8c37-6526ef5aed6f"},{"uid":"23b66f62-f210-4d53-94d6-9c8875e4887a","sectionTitle":"With/Without Najah","linkId":"7528a06c-35a7-4913-af9b-c826bd7e5f83"}],"pageUserGroups":[],"title":{"en":"","fr":"Vide | Commencer à partir de zéro"},"meta":{"desc":{},"keywords":{},"socialDesc":{},"socialTitle":{},"structuredData":{}},"metaImage":""},{"id":"e6b8f398-0a56-4b18-8b50-014b80fb7394","linkId":"e6b8f398-0a56-4b18-8b50-014b80fb7394","name":"Email confirmation","folder":"Auth/","paths":{"en":"email-confirmation","default":"email-confirmation"},"langs":["en"],"cmsDataSetPath":null,"sections":[{"uid":"aa3c7ad5-f9e2-4d4c-a74d-7f772a5a6dd3","sectionTitle":"Email verification","linkId":"0171d1c0-bb83-4411-8027-4a63640b7c66"}],"pageUserGroups":[],"title":{},"meta":{"desc":{},"keywords":{},"socialDesc":{},"socialTitle":{},"structuredData":{}},"metaImage":""},{"id":"43ae4921-b43e-4016-a2fd-666ae8ed84d7","linkId":"43ae4921-b43e-4016-a2fd-666ae8ed84d7","name":"Aide","folder":"CORE SAAS/","paths":{"en":"aide","default":"aide"},"langs":["en"],"cmsDataSetPath":null,"sections":[{"uid":"293bc7a0-e9e7-4c52-9e23-a6726ea8fbdd","sectionTitle":"Section","linkId":"e996db62-0c2e-434c-a177-841944d08639"},{"uid":"8747a889-1bfd-4af5-8073-7ac595f2c323","sectionTitle":"Container","linkId":"23910846-586f-4d39-8be9-8475f1888623"},{"uid":"692c9a03-23ef-45a9-888c-824f7fbc7e3e","sectionTitle":"Sidemenu","linkId":"54e01c5d-4eae-4fb2-b84a-dc191a28d91b"}],"pageUserGroups":[{}],"title":{},"meta":{"desc":{},"keywords":{},"socialDesc":{},"socialTitle":{},"structuredData":{}},"metaImage":""},{"id":"07d9d335-2758-4e4a-a57d-30576fdae241","linkId":"07d9d335-2758-4e4a-a57d-30576fdae241","name":"CGU","folder":null,"paths":{"en":"cgu","default":"cgu"},"langs":["en"],"cmsDataSetPath":null,"sections":[],"pageUserGroups":[],"title":{},"meta":{"desc":{},"keywords":{},"socialDesc":{},"socialTitle":{},"structuredData":{}},"metaImage":""},{"id":"def3ea99-37ce-43cf-9696-bf20be87bd40","linkId":"def3ea99-37ce-43cf-9696-bf20be87bd40","name":"logout","folder":null,"paths":{"en":"logout","default":"logout"},"langs":["en"],"cmsDataSetPath":null,"sections":[{"uid":"672b202b-100f-4ef0-942a-6bb677151b28","sectionTitle":"Section","linkId":"6a4a9b24-4a4e-4c49-9566-3a9d15d38cf0"}],"pageUserGroups":[{}],"title":{},"meta":{"desc":{},"keywords":{},"socialDesc":{},"socialTitle":{},"structuredData":{}},"metaImage":""},{"id":"4d9adb8d-3310-46fe-a877-8b466df1b77f","linkId":"4d9adb8d-3310-46fe-a877-8b466df1b77f","name":"Exam session","folder":"CORE SAAS/","paths":{"en":"exam-session","default":"exam-session"},"langs":["en"],"cmsDataSetPath":null,"sections":[{"uid":"e0312bfc-aea7-4584-b9e9-8f45490b9020","sectionTitle":"Section","linkId":"b9938ce9-c78f-40e8-8b71-cc892bd77775"},{"uid":"a1d0cb57-1c6b-4425-9895-b37204170ad1","sectionTitle":"Section","linkId":"0b33105d-a1cf-4eaa-9013-0ceca6122b6b"},{"uid":"7f4e837c-f523-40fe-b65b-11ddc635155a","sectionTitle":"Bottom Nav","linkId":"3d3cc90c-4229-4aa5-a69a-1e60c1d3392e"}],"pageUserGroups":[{}],"title":{},"meta":{"desc":{},"keywords":{},"socialDesc":{},"socialTitle":{},"structuredData":{}},"metaImage":""},{"id":"566789c5-6930-45dc-86d1-7abdaee3139b","linkId":"566789c5-6930-45dc-86d1-7abdaee3139b","name":"Sign up","folder":"Auth/","paths":{"en":"sign-up","default":"sign-up"},"langs":["en"],"cmsDataSetPath":null,"sections":[{"uid":"67af6c60-c97d-49d2-a31e-8d52daa9f141","sectionTitle":"Sign up","linkId":"a9cd3698-940d-48aa-934a-67a7c63cccb6"}],"pageUserGroups":[],"title":{},"meta":{"desc":{},"keywords":{},"socialDesc":{},"socialTitle":{},"structuredData":{}},"metaImage":""},{"id":"044bcc88-8aed-4305-95ae-0c2df0783e84","linkId":"044bcc88-8aed-4305-95ae-0c2df0783e84","name":"Dashbord","folder":"CORE SAAS/","paths":{"en":"dashboard","default":"dashboard"},"langs":["en"],"cmsDataSetPath":null,"sections":[{"uid":"293bc7a0-e9e7-4c52-9e23-a6726ea8fbdd","sectionTitle":"Section","linkId":"e996db62-0c2e-434c-a177-841944d08639"},{"uid":"06d204dc-dd6a-45ab-9501-83a61c9d446b","sectionTitle":"Section","linkId":"565575f9-47a9-4214-a91c-0b249328c183"},{"uid":"0c5ccc56-66bd-48d4-a234-53fa10e345d8","sectionTitle":"Section","linkId":"fcda72bc-17c4-41f0-950b-c493e10bed57"},{"uid":"4279f2e9-2214-4011-9be9-e199bda441ab","sectionTitle":"Container","linkId":"5093241a-0c95-408f-bb8d-fd499634ef7c"},{"uid":"692c9a03-23ef-45a9-888c-824f7fbc7e3e","sectionTitle":"Sidemenu","linkId":"54e01c5d-4eae-4fb2-b84a-dc191a28d91b"}],"pageUserGroups":[{}],"title":{},"meta":{"desc":{},"keywords":{},"socialDesc":{},"socialTitle":{},"structuredData":{}},"metaImage":""},{"id":"7251ea1c-ff90-46a9-8777-5b04233dc7be","linkId":"7251ea1c-ff90-46a9-8777-5b04233dc7be","name":"Choix plan","folder":"Onboarding/","paths":{"en":"choix-plan","default":"choix-plan"},"langs":["en"],"cmsDataSetPath":null,"sections":[{"uid":"e1692a90-aaac-4c6e-b459-9e7a0fa0d74f","sectionTitle":"Section","linkId":"5d40f445-7e8e-4f7e-8c43-ca555c2c0037"}],"pageUserGroups":[{}],"title":{},"meta":{"desc":{},"keywords":{},"socialDesc":{},"socialTitle":{},"structuredData":{}},"metaImage":""},{"id":"190e5897-b368-45c3-8727-db226a738f23","linkId":"190e5897-b368-45c3-8727-db226a738f23","name":"Log in","folder":"Auth/","paths":{"en":"log-in","default":"log-in"},"langs":["en"],"cmsDataSetPath":null,"sections":[{"uid":"6e5e79ad-839e-4e2d-998c-34dcc33b264b","sectionTitle":"Login","linkId":"f7960cb5-5055-4bbe-b923-10531092a7a3"}],"pageUserGroups":[],"title":{},"meta":{"desc":{},"keywords":{},"socialDesc":{},"socialTitle":{},"structuredData":{}},"metaImage":""},{"id":"aee14e9e-0d93-41da-b2bf-135491b291ba","linkId":"aee14e9e-0d93-41da-b2bf-135491b291ba","name":"Paiement","folder":"Onboarding/","paths":{"en":"paiement","default":"paiement"},"langs":["en"],"cmsDataSetPath":null,"sections":[{"uid":"00539c07-3a17-4fce-9575-3e2af4a6cf81","sectionTitle":"Section","linkId":"8d6c5c5c-1f90-4d61-ac12-70aa79254e1e"}],"pageUserGroups":[{}],"title":{},"meta":{"desc":{},"keywords":{},"socialDesc":{},"socialTitle":{},"structuredData":{}},"metaImage":""},{"id":"8d89055e-c61c-4f54-b842-913287727325","linkId":"8d89055e-c61c-4f54-b842-913287727325","name":"Choix des écoles","folder":"Onboarding/","paths":{"en":"choix-ecoles","default":"choix-ecoles"},"langs":["en"],"cmsDataSetPath":null,"sections":[{"uid":"da3dd57c-875e-4fcc-95a8-717ba28b61de","sectionTitle":"Section","linkId":"2464a395-41ad-415d-8ec8-a83824d53804"}],"pageUserGroups":[{}],"title":{},"meta":{"desc":{},"keywords":{},"socialDesc":{},"socialTitle":{},"structuredData":{}},"metaImage":""},{"id":"876f5411-59c1-441f-adce-8a6e69dfc63e","linkId":"876f5411-59c1-441f-adce-8a6e69dfc63e","name":"Paiement pending","folder":"Onboarding/","paths":{"en":"paiement-pending","default":"paiement-pending"},"langs":["en"],"cmsDataSetPath":null,"sections":[{"uid":"267de8d8-f71c-40f8-915b-45a01bf10dc5","sectionTitle":"Section","linkId":"fe7ea3ec-2f35-4e53-a29e-08d65f639d9f"}],"pageUserGroups":[{}],"title":{},"meta":{"desc":{},"keywords":{},"socialDesc":{},"socialTitle":{},"structuredData":{}},"metaImage":""},{"id":"d09dcd68-3675-4861-b6a8-48fbcc061653","linkId":"d09dcd68-3675-4861-b6a8-48fbcc061653","name":"Paramètres","folder":"CORE SAAS/","paths":{"en":"parametres","default":"parametres"},"langs":["en"],"cmsDataSetPath":null,"sections":[{"uid":"293bc7a0-e9e7-4c52-9e23-a6726ea8fbdd","sectionTitle":"Section","linkId":"e996db62-0c2e-434c-a177-841944d08639"},{"uid":"944d81c3-85ec-4c3c-ac75-199ac6508bf7","sectionTitle":"Container","linkId":"5e27fcfa-3e4a-4cf4-b3e6-fbabab28cfd0"},{"uid":"692c9a03-23ef-45a9-888c-824f7fbc7e3e","sectionTitle":"Sidemenu","linkId":"54e01c5d-4eae-4fb2-b84a-dc191a28d91b"}],"pageUserGroups":[{}],"title":{},"meta":{"desc":{},"keywords":{},"socialDesc":{},"socialTitle":{},"structuredData":{}},"metaImage":""},{"id":"531e1d23-5bb4-4663-9548-6ef24fbe2c7a","linkId":"531e1d23-5bb4-4663-9548-6ef24fbe2c7a","name":"Pre-exam","folder":"CORE SAAS/","paths":{"en":"pre-exam","default":"pre-exam"},"langs":["en"],"cmsDataSetPath":null,"sections":[{"uid":"293bc7a0-e9e7-4c52-9e23-a6726ea8fbdd","sectionTitle":"Section","linkId":"e996db62-0c2e-434c-a177-841944d08639"},{"uid":"8e5f313b-6a52-4b0c-8437-edb886f2c217","sectionTitle":"Container","linkId":"fd670afd-372a-4013-863a-1556dbd0aa8c"},{"uid":"692c9a03-23ef-45a9-888c-824f7fbc7e3e","sectionTitle":"Sidemenu","linkId":"54e01c5d-4eae-4fb2-b84a-dc191a28d91b"}],"pageUserGroups":[{}],"title":{},"meta":{"desc":{},"keywords":{},"socialDesc":{},"socialTitle":{},"structuredData":{}},"metaImage":""},{"id":"a814dee1-5feb-463f-a49a-a9a685bcc457","linkId":"a814dee1-5feb-463f-a49a-a9a685bcc457","name":"Entraînement","folder":"CORE SAAS/","paths":{"en":"entrainement","default":"entrainement"},"langs":["en"],"cmsDataSetPath":null,"sections":[{"uid":"293bc7a0-e9e7-4c52-9e23-a6726ea8fbdd","sectionTitle":"Section","linkId":"e996db62-0c2e-434c-a177-841944d08639"},{"uid":"0c5ccc56-66bd-48d4-a234-53fa10e345d8","sectionTitle":"Section","linkId":"fcda72bc-17c4-41f0-950b-c493e10bed57"},{"uid":"d6a11a6d-537d-4657-8919-746083810352","sectionTitle":"Container","linkId":"df1f6344-709a-4f79-a78b-454a2c8c4bdd"},{"uid":"692c9a03-23ef-45a9-888c-824f7fbc7e3e","sectionTitle":"Sidemenu","linkId":"54e01c5d-4eae-4fb2-b84a-dc191a28d91b"},{"uid":"5e918c6a-a96a-4681-9e3c-90e586beb1b4","sectionTitle":"Section","linkId":"ce187f2f-6337-4564-9e15-76c29cb892f8"}],"pageUserGroups":[{}],"title":{},"meta":{"desc":{},"keywords":{},"socialDesc":{},"socialTitle":{},"structuredData":{}},"metaImage":""},{"id":"aef7a8bf-146e-45b2-9fff-775812fcf09f","linkId":"aef7a8bf-146e-45b2-9fff-775812fcf09f","name":"Ressources","folder":"CORE SAAS/","paths":{"en":"ressources","default":"ressources"},"langs":["en"],"cmsDataSetPath":null,"sections":[{"uid":"293bc7a0-e9e7-4c52-9e23-a6726ea8fbdd","sectionTitle":"Section","linkId":"e996db62-0c2e-434c-a177-841944d08639"},{"uid":"0c5ccc56-66bd-48d4-a234-53fa10e345d8","sectionTitle":"Section","linkId":"fcda72bc-17c4-41f0-950b-c493e10bed57"},{"uid":"523a13ea-257a-4a4f-bc68-d909604f6a03","sectionTitle":"Container","linkId":"100be2fa-b4c7-4afe-8283-4e48bc2236da"},{"uid":"692c9a03-23ef-45a9-888c-824f7fbc7e3e","sectionTitle":"Sidemenu","linkId":"54e01c5d-4eae-4fb2-b84a-dc191a28d91b"}],"pageUserGroups":[{}],"title":{},"meta":{"desc":{},"keywords":{},"socialDesc":{},"socialTitle":{},"structuredData":{}},"metaImage":""}],"plugins":[{"id":"f9ef41c3-1c53-4857-855b-f2f6a40b7186","name":"Supabase","namespace":"supabase"},{"id":"1fa0dd68-5069-436c-9a7d-3b54c340f1fa","name":"Supabase Auth","namespace":"supabaseAuth"},{"id":"832d6f7a-42c3-43f1-a3ce-9a678272f811","name":"Date","namespace":"dayjs"},{"id":"2bd1c688-31c5-443e-ae25-59aa5b6431fb","name":"REST API","namespace":"restApi"}]};
// eslint-disable-next-line no-undef
window.wwg_cacheVersion = 60;
// eslint-disable-next-line no-undef
window.wwg_pluginsSettings = pluginsSettings;
// eslint-disable-next-line no-undef
window.wwg_disableManifest = false;

const defaultLang = window.wwg_designInfo.langs.find(({ default: isDefault }) => isDefault) || {};

const registerRoute = (page, lang, forcedPath) => {
    const langSlug = !lang.default || lang.isDefaultPath ? `/${lang.lang}` : '';
    let path =
        forcedPath ||
        (page.id === window.wwg_designInfo.homePageId ? '/' : `/${page.paths[lang.lang] || page.paths.default}`);

    //Replace params
    path = path.replace(/{{([\w]+)\|([^/]+)?}}/g, ':$1');

    routes.push({
        path: langSlug + path,
        component: wwPage,
        name: `page-${page.id}-${lang.lang}`,
        meta: {
            pageId: page.id,
            lang,
            isPrivate: !!page.pageUserGroups?.length,
        },
        async beforeEnter(to, from) {
            if (to.name === from.name) return;
            //Set page lang
            wwLib.wwLang.defaultLang = defaultLang.lang;
            wwLib.$store.dispatch('front/setLang', lang.lang);

            //Init plugins
            await initializePlugins();

            //Check if private page
            if (page.pageUserGroups?.length) {
                // cancel navigation if no plugin
                if (!wwLib.wwAuth.plugin) {
                    return false;
                }

                await wwLib.wwAuth.init();

                // Redirect to not sign in page if not logged
                if (!wwLib.wwAuth.getIsAuthenticated()) {
                    window.location.href = `${wwLib.wwPageHelper.getPagePath(
                        wwLib.wwAuth.getUnauthenticatedPageId()
                    )}?_source=${to.path}`;

                    return null;
                }

                //Check roles are required
                if (
                    page.pageUserGroups.length > 1 &&
                    !wwLib.wwAuth.matchUserGroups(page.pageUserGroups.map(({ userGroup }) => userGroup))
                ) {
                    window.location.href = `${wwLib.wwPageHelper.getPagePath(
                        wwLib.wwAuth.getUnauthorizedPageId()
                    )}?_source=${to.path}`;

                    return null;
                }
            }

            try {
                await import(`@/pages/${page.id.split('_')[0]}.js`);
                await wwLib.wwWebsiteData.fetchPage(page.id);

                //Scroll to section or on top after page change
                if (to.hash) {
                    const targetElement = document.getElementById(to.hash.replace('#', ''));
                    if (targetElement) targetElement.scrollIntoView();
                } else {
                    document.body.scrollTop = document.documentElement.scrollTop = 0;
                }

                return;
            } catch (err) {
                wwLib.$store.dispatch('front/showPageLoadProgress', false);

                if (err.redirectUrl) {
                    return { path: err.redirectUrl || '404' };
                } else {
                    //Any other error: go to target page using window.location
                    window.location = to.fullPath;
                }
            }
        },
    });
};

for (const page of window.wwg_designInfo.pages) {
    for (const lang of window.wwg_designInfo.langs) {
        if (!page.langs.includes(lang.lang)) continue;
        registerRoute(page, lang);
    }
}

const page404 = window.wwg_designInfo.pages.find(page => page.paths.default === '404');
if (page404) {
    for (const lang of window.wwg_designInfo.langs) {
        // Create routes /:lang/:pathMatch(.*)* etc for all langs of the 404 page
        if (!page404.langs.includes(lang.lang)) continue;
        registerRoute(
            page404,
            {
                default: false,
                lang: lang.lang,
            },
            '/:pathMatch(.*)*'
        );
    }
    // Create route /:pathMatch(.*)* using default project lang
    registerRoute(page404, { default: true, isDefaultPath: false, lang: defaultLang.lang }, '/:pathMatch(.*)*');
} else {
    routes.push({
        path: '/:pathMatch(.*)*',
        async beforeEnter() {
            window.location.href = '/404';
        },
    });
}

let routerOptions = {};

const isProd =
    !window.location.host.includes(
        // TODO: add staging2 ?
        '-staging.' + (process.env.WW_ENV === 'staging' ? import.meta.env.VITE_APP_PREVIEW_URL : '')
    ) && !window.location.host.includes(import.meta.env.VITE_APP_PREVIEW_URL);

if (isProd && window.wwg_designInfo.baseTag?.href) {
    let baseTag = window.wwg_designInfo.baseTag.href;
    if (!baseTag.startsWith('/')) {
        baseTag = '/' + baseTag;
    }
    if (!baseTag.endsWith('/')) {
        baseTag += '/';
    }

    routerOptions = {
        base: baseTag,
        history: createWebHistory(baseTag),
        routes,
    };
} else {
    routerOptions = {
        history: createWebHistory(),
        routes,
    };
}

router = createRouter({
    ...routerOptions,
    scrollBehavior,
});

//Trigger on page unload
let isFirstNavigation = true;
router.beforeEach(async (to, from) => {
    if (to.name === from.name) return;
    if (!isFirstNavigation) await onPageUnload();
    isFirstNavigation = false;
    wwLib.globalVariables._navigationId++;
    return;
});

//Init page
router.afterEach((to, from, failure) => {
    wwLib.$store.dispatch('front/showPageLoadProgress', false);
    let fromPath = from.path;
    let toPath = to.path;
    if (!fromPath.endsWith('/')) fromPath = fromPath + '/';
    if (!toPath.endsWith('/')) toPath = toPath + '/';
    if (failure || (from.name && toPath === fromPath)) return;
    initializeData(to);
});
/* wwFront:end */

export default router;
