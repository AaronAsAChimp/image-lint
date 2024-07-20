export interface ArgsHelperOpts {
	/**
	 * The usage information for the application
	 */
	'-help-usage': string,
	/**
	 * The descriptions of each option.
	 */
	'-help-options': Record<string, string>
}
