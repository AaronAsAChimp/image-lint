import {Finder} from '../finder.js';
import {HttpLoader} from '../loader/http.js';
import url from 'url';
import path from 'path';
import puppeteer from 'puppeteer';

/**
 * Find files on a webpage. This uses Puppeteer to load the page and extract
 * the files.
 */
export class WebFinder extends Finder {
	/**
	 * @inheritdoc
	 */
	async get_files(urls) {
		// console.log('getting urls');
		// console.log('spinnig up phantom');
		const found = [];
		const browser = await puppeteer.launch();

		for (const page_url of urls) {
			const page = await browser.newPage();
			page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.110 Safari/537.36');

			const urls_seen = new Set();

			// const timeout = setTimeout(() => {
			// 	console.log('timeout');
			// }, 10000);

			page.on('request', (req) => {
				const found_url = req.url();

				// Check that we haven't seen this URL before to save us
				// from doing work we've already done
				if (found_url.length && !urls_seen.has(found_url)) {
					const url_parts = url.parse(found_url);

					// The pathname can be null if the url is malformed.
					if (url_parts.pathname) {
						const ext = path.extname(url_parts.pathname);

						if (this.is_image_extension(ext)) {
							urls_seen.add(found_url);
							found.push({
								'path': found_url,
								'extension': ext,
								'loader': new HttpLoader(found_url),
							});
						}
					}
				}
			});

			// page.on('console', (msg) => {
			// 	console.log('BROWSER: ' + msg.test());
			// });

			// page.on('domcontentloaded', () => {
			// 	console.log('contentloaded');
			//
			// 	clearTimeout(timeout);
			// });

			await page.goto(page_url);

			await page.close();
		}

		await browser.close();

		return found[Symbol.iterator].bind(found);
	}
}
