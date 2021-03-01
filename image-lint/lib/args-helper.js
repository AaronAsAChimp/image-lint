class ArgsHelper {
	/**
	 * Process the arguments to handle the standard arguments like help
	 * and version.
	 *
	 * @param  { object } config The minimist config
	 * @param  { object } args   The parsed arguments from minimist.
	 * @return { boolean }       Returns true if the process should exit.
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

	static load_package_info() {
		return require('../package.json');
	}

	static print_option(config, name, description) {
		let aliases = [name],
			options = '',
			default_value = '';

		if (name in config.alias) {
			let alias = config.alias[name];

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

		if ('default' in config && name in config.default) {
			default_value = ' Default: ' + config.default[name].toString();
		}

		console.log('  ' + options + '\t' + description + default_value);
	}

	static help(config) {
		let info = this.load_package_info();

		console.log(`${ info.name } - ${ info.description }`);
		console.log(`\nUsage: ${ config['-help-usage'] }`);
		console.log('\nOptions: ');

		if ('-help-options' in config) {
			for (let option in config['-help-options']) {
				let description = config['-help-options'][option];

				this.print_option(config, option, description);
			}
		}

		return true;
	}

	static version(config) {
		let info = this.load_package_info();

		console.log(info.name + ' v' + info.version);

		return true;
	}
}


module.exports = {
	'default': ArgsHelper
};
