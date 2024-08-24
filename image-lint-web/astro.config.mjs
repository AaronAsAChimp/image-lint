import {defineConfig} from 'astro/config';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import inject from '@rollup/plugin-inject';
import stdLibBrowser from 'node-stdlib-browser';


// https://astro.build/config
export default defineConfig({
	site: 'https://aaronasachimp.github.io',
	base: 'image-lint',
	integrations: [
		sitemap(),
		react(),
	],
	vite: {
		// build: {
		//   commonjsOptions: {
		//     include: [
		//       stdLibBrowser.crypto
		//     ]
		//   }
		// },
		resolve: {
			alias: {
				'crypto': stdLibBrowser.crypto,
			},
		},
		optimizeDeps: {
			include: ['image-lint > node-stdlib-browser > buffer', 'process'],
		},
		plugins: [
			{
				...inject({
					global: [
						import.meta.resolve('node-stdlib-browser/helpers/esbuild/shim'),
						'global',
					],
					process: [
						import.meta.resolve('node-stdlib-browser/helpers/esbuild/shim'),
						'process',
					],
					Buffer: [
						import.meta.resolve('node-stdlib-browser/helpers/esbuild/shim'),
						'Buffer',
					],
				}),
				enforce: 'post',
			},
		],
	},
});
