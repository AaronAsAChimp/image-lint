/* @flow */

/*::
import type {minimistOptions, minimistOutput} from 'minimist';

export type ExtendedOptions = {
	...minimistOptions,
	'-help-usage': string,
	'-help-options': {
		[name: string]: string
	},
}
*/

/**
 * A helper class for command line arguments.
 */
class ArgsHelper {
	/**
	 * Process the arguments to handle the standard arguments like help
	 * and version.
	 *
	 * @param  { ExtendedOptions } config The minimist config
	 * @param  { object } args            The parsed arguments from minimist.
	 * @return { boolean }                Returns true if the process should exit.
	 */
	static argv(config/*: ExtendedOptions */, args/*: minimistOutput */)/*: boolean */ {
		if (args.help) {
			return this.help(config);
		}

		if (args.version) {
			return this.version(config);
		}

		return false;
	}

	/**
	 * Load the package info JSON file.
	 *
	 * @return {any} The package JSON.
	 */
	static load_package_info()/*: any */ {
		return require('../package.json');
	}

	/**
	 * Print an option for display purposes.
	 *
	 * @param  {ExtendedOptions} config  The argument configuration.
	 * @param  {string} name             The name of the option.
	 * @param  {string} description      A description of the option.
	 */
	static print_option(config/*: ExtendedOptions */, name/*: string */, description/*: string */) {
		let aliases = [name];
		let options = '';
		let default_value = '';

		if (config.alias && name in config.alias) {
			const alias = config.alias[name];

			if (!Array.isArray(alias)) {
				aliases.push(alias);
			} else {
				aliases = aliases.concat(alias);
			}
		}

		options = aliases.map((alias) => {
			let option = '';

			// if the alias has zero length skip it.
			if (alias.length > 1) {
				option += '--' + alias;
			} else if (alias.length == 1) {
				option += '-' + alias;
			}

			return option;
		}).join(', ');

		if (config.default && name in config.default) {
			default_value = ' Default: ' + config.default[name].toString();
		}

		console.log('  ' + options + '\t' + description + default_value);
	}

	/**
	 * Add the help option to the configuration.
	 *
	 * @param  {any} config The argument configuration.
	 * @return {boolean}    True if the process should exit.
	 */
	static help(config/*: ExtendedOptions */)/*: boolean */ {
		const info = this.load_package_info();

		console.log(`${ info.name } - ${ info.description }`);
		console.log(`\nUsage: ${ config['-help-usage'] }`);
		console.log('\nOptions: ');

		if ('-help-options' in config) {
			for (const option in config['-help-options']) {
				if (config['-help-options'].hasOwnProperty(option)) {
					const description = config['-help-options'][option];

					this.print_option(config, option, description);
				}
			}
		}

		return true;
	}

	/**
	 * Add the version option to the configuration.
	 *
	 * @param  {minimistOptions} config The argument configuration.
	 * @return {boolean}                True if the process should exit.
	 */
	static version(config/*: minimistOptions */)/*: boolean */ {
		const info = this.load_package_info();

		console.log(info.name + ' v' + info.version);

		return true;
	}
}


module.exports = {
	'default': ArgsHelper,
};
