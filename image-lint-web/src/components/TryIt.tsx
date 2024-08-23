import {animated, useSpring} from '@react-spring/web';
import classNames from 'classnames';
import {BufferArrayFinder, defaults, ImageIdentifierRegistry, Linter} from 'image-lint';
import {to_config} from 'image-lint/lib/defaults';
import type {LinterOptions} from 'image-lint/lib/linter';
import type {Log} from 'image-lint/lib/logger';
import {useEffect, useMemo, useState, type PropsWithChildren} from 'react';
import {Config} from './Config';
import {DropZone} from './DropZone';
import classes from './TryIt.module.css';

const DEFAULT_OPTS = to_config(defaults);

/**
 * Reformat the log for display on web.
 *
 * @param  {string} log The log to reformat.
 *
 * @returns {string}     The reformatted log.
 */
function reformat_log(log: string) {
	const log_parts = log.trim().split('\n');

	return log_parts.map((line) => {
		return line.trim();
	}).join('\n');
}

interface TryItAggregateProps {
	infos: number,
	errors: number,
	warnings: number
}

/**
 * The component that shows the aggregated results.
 *
 * @param {TryItAggregateProps} config The props
 * @returns {JSX.Element} The component
 */
function TryItAggregate({infos, errors, warnings}: TryItAggregateProps) {
	return <span>
		{ infos > 0 ?
			<span> Info: { infos }{ warnings || errors ? <span>, </span> : null }</span> :
			null }
		{ warnings > 0 ?
			<span> Warnings: { warnings }{ errors ? <span>, </span> : null }</span> :
			null }
		{ errors > 0 ?
			<span> Errors: { errors }</span> :
			null }
	</span>;
}

interface TryItResultProps {
	filename: string,
	log: string,
	infos: number,
	errors: number,
	warnings: number
}

/**
 * The component for an individual Try It result.
 *
 * @param {TryItResultProps} config The props
 * @returns {JSX.Element} The component
 */
function TryItResult({filename, infos, errors, warnings, log}: TryItResultProps) {
	return <details open={true} className={
		classNames(classes['lint-result'], {[classes['has-results']]: log.length > 0})}
	>
		<summary
			className={
				classNames(classes['lint-result-summary'], {[classes['lint-error']]: errors > 0, [classes['lint-warn']]: warnings > 0})
			}
		>
			{ filename } - <TryItAggregate infos={infos} errors={errors} warnings={warnings} />
		</summary>
		<output
			v-if="has_results"
			className={ classes['lint-result-output'] }
			v-html="reformat_log(result.log)"
		>
			{ reformat_log(log) }
		</output>
	</details>;
}

interface AggregatedResults {
	info: number,
	warn: number,
	error: number
}

type TryItProps = object;

/**
 * The component for the whole Try It feature.
 *
 * @param {PropsWithChildren<TryItProps>} config The props
 * @returns {JSX.Element} The component
 */
export function TryIt({children}: PropsWithChildren<TryItProps>) {
	const [options, set_options] = useState(DEFAULT_OPTS);
	const [files, set_files] = useState<File[]>([]);
	const [results, set_results] = useState<Log[]>([]);
	const [agg_results, set_agg_results] = useState<AggregatedResults | null>(null);
	const [try_it_shown, set_try_it_shown] = useState(false);

	const available_color_spaces = useMemo(() => {
		return ['G', 'RGB', 'CMYK', 'YCbCr', 'YCCK', 'LAB', 'HSV'];
	}, []);

	const available_file_types = useMemo(() => {
		return ImageIdentifierRegistry.get_all_extensions();
	}, []);

	const [springs, api] = useSpring(() => {
		return {
			x: -200,
			right: '35em',
			opacity: 0,
		};
	});

	const linter = useMemo(() => {
		const finder = new BufferArrayFinder(
			ImageIdentifierRegistry.get_all_extensions(),
			ImageIdentifierRegistry.get_all_mimes(),
		);

		return new Linter(finder);
	}, []);

	/**
	 * Run the linter on the list of files
	 *
	 * @param  {File[]} files    The files to lint
	 * @param  {LinterOptions} options  The linter options.
	 */
	function lintFiles(files: File[], options: LinterOptions) {
		const result_list: Log[] = [];
		const agg_results = {
			'info': 0,
			'warn': 0,
			'error': 0,
		};

		linter.lint(files, options)
				.on('file.completed', (logger: Log) => {
					result_list.push(logger);
					agg_results.info += logger.count.info;
					agg_results.warn += logger.count.warn;
					agg_results.error += logger.count.error;
				})
				.on('linter.completed', () => {
					result_list.sort((a, b) => a.filename.localeCompare(b.filename));
					set_results(result_list);
					set_agg_results(agg_results);
				});
	}

	useEffect(() => {
		if (try_it_shown || results.length > 0) {
			api.start({right: '30em', opacity: 1});
		} else {
			api.start({right: '35em', opacity: 0});
		}
	}, [try_it_shown, results]);

	useEffect(() => {
		lintFiles(files, options);
	}, [files, options]);

	/**
	 * Reset the results from the linter.
	 */
	function reset() {
		set_results([]);
		set_agg_results(null);
	}

	/**
	 * Animate the config component in.
	 */
	function animIn() {
		set_try_it_shown(true);
	}

	/**
	 * Animate the config component out.
	 */
	function animOut() {
		set_try_it_shown(false);
	}

	return <DropZone onDrop={(files) => set_files(files)} onDragIn={ animIn } onDragOut={ animOut }>
		{ (!(try_it_shown || results.length > 0)) ?
			children :
			<div className={classes['lint-results']}>
				<animated.div style={{...springs, 'position': 'absolute', 'width': '12em'}}>
					<Config
						config={options}
						on_config_change={(options) => {
							set_options(options);
						}}
						available_color_spaces={available_color_spaces}
						available_file_types={available_file_types} />
				</animated.div>
				{ results.length > 0 ?
					<>
						<div className={classes['lint-results-bar']}>
							{ agg_results ?
								<TryItAggregate infos={agg_results.info} warnings={agg_results.warn} errors={agg_results.error} /> :
								null }
							<button className={classes['lint-results-clear']} onClick={() => reset() }>Clear Results</button>
						</div>
						{ results.map((result) => <TryItResult
							key={result.filename}
							filename={ result.filename }
							log={ result.log }
							infos={ result.count.info }
							warnings={ result.count.warn }
							errors={ result.count.error }
						>
						</TryItResult>) }
					</> :
					<div className={classes['lint-drop-target']}>
						Drop files here
					</div>}
			</div>
		}
	</DropZone>;
}
