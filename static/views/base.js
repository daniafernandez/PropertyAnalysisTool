import { header_nav } from '/static/components/header.js'

const base = {
    el: '#base',
    components: {
        'header_nav': header_nav,
    },
    template: `
        <header_nav></header_nav>
        <router-view>

        </router-view>
    `

};

import { home } from './home.js';
import { error } from './error.js';
import { dashboard } from './dashboard.js';


const routes = [
    {path: '/', component: home},
    {path: '/error', component: error},
    {path: '/dashboard', component: dashboard}
]

const router = VueRouter.createRouter({
    history: VueRouter.createWebHistory(),
    routes,
})

const app = Vue.createApp(base);
app.use(router);
app.mount('#base');