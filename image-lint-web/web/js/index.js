import {createApp} from 'vue';
import Multiselect from 'vue-multiselect';
import {createRouter, createWebHistory} from 'vue-router';

import App from '../components/app.vue';
import PageTryIt from '../components/page-try-it.vue';
import PageDocs from '../md/docs.md';
import PageGettingStarted from '../md/getting-started.md';
import ImlImageCollection from '../components/iml-image-collection.vue';
import ImlDropzone from '../components/iml-dropzone.vue';

import '../css/index.css';


const body = document.body;
const rootEl = document.createElement('div');

body.appendChild(rootEl);

const router = createRouter({
	history: createWebHistory(process.env.BASE_PATH),
	routes: [
		{
			path: '/',
			component: PageTryIt,
		}, {
			path: '/docs',
			component: PageDocs,
		}, {
			path: '/getting-started',
			component: PageGettingStarted,
		},
	],
});

createApp(App)
	.component('vue-multiselect', Multiselect)
	.component('iml-image-collection', ImlImageCollection)
	.component('iml-dropzone', ImlDropzone)
	.use(router)
	.mount(rootEl);

// console.log(md);
