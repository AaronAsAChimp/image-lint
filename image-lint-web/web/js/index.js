import {createApp} from 'vue';
import Multiselect from 'vue-multiselect';

import ImageLintApp from '../components/app.vue';
import ImlImageCollection from '../components/iml-image-collection.vue';
import ImlDropzone from '../components/iml-dropzone.vue';

import '../css/index.css';


const body = document.body;
const rootEl = document.createElement('div');

body.appendChild(rootEl);

createApp(ImageLintApp)
	.component('vue-multiselect', Multiselect)
	.component('image-lint-app', ImageLintApp)
	.component('iml-image-collection', ImlImageCollection)
	.component('iml-dropzone', ImlDropzone)
	.mount(rootEl);
