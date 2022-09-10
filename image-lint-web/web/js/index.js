import {createApp} from 'vue';
import Multiselect from 'vue-multiselect';

import Dropzone from '../components/dropzone.vue';
import ImageLintApp from '../components/app.vue';
import ImageCollection from '../components/image-collection.vue';

import "../css/index.css";


const body = document.body;
const rootEl = document.createElement('div');

body.appendChild(rootEl);

createApp(ImageLintApp)
	.component('vue-multiselect', Multiselect)
	.component('dropzone', Dropzone)
	.component('image-lint-app', ImageLintApp)
	.component('image-collection', ImageCollection)
	.mount(rootEl);
