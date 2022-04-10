import {createApp} from 'vue';
import Multiselect from 'vue-multiselect';

import Dropzone from './dropzone.js';
import ImageLintApp from './app.js';


const body = document.body;
const rootEl = document.createElement('div');
const appEl = document.createElement('image-lint-app');

rootEl.appendChild(appEl);
body.appendChild(rootEl);

createApp({})
	.component('vue-multiselect', Multiselect)
	.component('dropzone', Dropzone)
	.component('image-lint-app', ImageLintApp)
	.mount(rootEl);
