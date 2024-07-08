import fs from 'fs';


/**
 * A helper class for command line arguments.
 */
export class ArgsHelper {
	/**
	 * Process the arguments to handle the standard arguments like help
	 * and version.
	 *
	 * @param  { import('minimist').Opts & ArgsHelperOpts } config The minimist config
	 * @param  { any } args               The parsed arguments from minimist.
	 * @returns { boolean }               Returns true if the process should exit.
	 */
	static argv(config, args) {
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
	 * @returns {any} The package JSON.
	 */
	static load_package_info() {
		// Importing JSON files doesn't work in node v16 and gives warnings in
		// later versions.
		const package_location = new URL('../package.json', import.meta.url);

		return JSON.parse(fs.readFileSync(package_location, 'utf8'));
	}

	/**
	 * Print an option for display purposes.
	 *
	 * @param  {import('minimist').Opts & ArgsHelperOpts} config  The argument configuration.
	 * @param  {string} name             The name of the option.
	 * @param  {string} description      A description of the option.
	 */
	static print_option(config, name, description) {
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
	 * @param  {import('minimist').Opts & ArgsHelperOpts} config
	 *   The argument configuration.
	 * @returns {boolean}   True if the process should exit.
	 */
	static help(config) {
		const info = this.load_package_info();

		console.log(`${ info.name } - ${ info.description }`);
		console.log(`\nUsage: ${ config['-help-usage'] }`);

		if ('-help-options' in config && Object.keys(config['-help-options']).length > 0) {
			console.log('\nOptions: ');

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
	 * @param  {import('minimist').Opts} config The argument configuration.
	 * @returns {boolean}               True if the process should exit.
	 */
	static version(config) {
		const info = this.load_package_info();

		console.log(info.name + ' v' + info.version);

		return true;
	}
}
