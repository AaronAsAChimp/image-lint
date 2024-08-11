import { useEffect, useMemo, useState, type PropsWithChildren } from "react";
import { animated, useSpring } from '@react-spring/web';
import { DropZone } from "./DropZone";
import {Linter, BufferArrayFinder, defaults, ImageIdentifierRegistry} from 'image-lint';
import classNames from "classnames";
import classes from "./TryIt.module.css";
import {Config} from './Config';
import { to_config } from "image-lint/lib/defaults";
import type { LinterOptions } from "image-lint/lib/linter";

const DEFAULT_OPTS = to_config(defaults);

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

function TryItAggregate({infos, errors, warnings}: TryItAggregateProps) {
	return <span>
		{ infos > 0
			? <span> Info: { infos }{ warnings || errors ? <span>, </span> : null }</span>
			: null }
		{ warnings > 0
			? <span> Warnings: { warnings }{ errors ? <span>, </span> : null }</span>
			: null }
		{ errors > 0
			? <span> Errors: { errors }</span>
			: null }
	</span>
}

interface TryItResultProps {
	filename: string,
	log: string,
	infos: number,
	errors: number,
	warnings: number
}

function TryItResult({filename, infos, errors, warnings, log}: TryItResultProps) {
	return <details open={true} className={
			classNames(classes['lint-result'], {/*[classes['has-error']]: result.count.error > 0,*/ [classes['has-results']]: log.length > 0})}
		>
		<summary
			className={
				classNames(classes['lint-result-summary'], { [classes['lint-error']]: errors > 0, [classes['lint-warn']]: warnings > 0 })
			}
		>
			{ filename } - 
			<TryItAggregate infos={infos} errors={errors} warnings={warnings} />
		</summary>
		<output
			v-if="has_results"
			className={ classes['lint-result-output'] }
			v-html="reformat_log(result.log)"
		>
			{ reformat_log(log) }
		</output>
	</details>
}

interface TryItProps {
}

export function TryIt({children}: PropsWithChildren<TryItProps>) {
	const [options, set_options] = useState(DEFAULT_OPTS);
	const [files, set_files] = useState<File[]>([]);
	const [results, set_results] = useState<any[]>([]);
	const [agg_results, set_agg_results] = useState<any | null>(null);
	const [try_it_shown, set_try_it_shown] = useState(false)

	const available_color_spaces = useMemo(() => {
		return ['G', 'RGB', 'CMYK', 'YCbCr', 'YCCK', 'LAB', 'HSV']
	}, []);

	const available_file_types = useMemo(() => {
		return ImageIdentifierRegistry.get_all_extensions()
	}, [])

	const [springs, api] = useSpring(() => {
		x: -200
	})

	const linter = useMemo(() => {
		const finder = new BufferArrayFinder(
			ImageIdentifierRegistry.get_all_extensions(),
			ImageIdentifierRegistry.get_all_mimes(),
		);

		return new Linter(finder);
	}, [])

	function lintFiles(files: File[], options: LinterOptions) {
		const result_list: any[] = [];
		const agg_results = {
			'info': 0,
			'warn': 0,
			'error': 0
		}

		linter.lint(files, options)
			.on('file.completed', (logger) => {
				result_list.push(logger);
				agg_results.info += logger.count.info
				agg_results.warn += logger.count.warn
				agg_results.error += logger.count.error
			})
			.on('linter.completed', () => {
				result_list.sort((a, b) => a.filename.localeCompare(b.filename))
				set_results(result_list);
				set_agg_results(agg_results)
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
		lintFiles(files, options)
	}, [files, options])

	function reset() {
		set_results([])
		set_agg_results(null)
	}

	function animIn() {
		set_try_it_shown(true);
	}

	function animOut() {
		set_try_it_shown(false);
	}

	return <DropZone onDrop={(files) => set_files(files)} onDragIn={ animIn } onDragOut={ animOut }>
		{ (!(try_it_shown || results.length > 0))
			? children
			: <div className={classes['lint-results']}>
				<animated.div style={{...springs, 'position': 'absolute', 'width': '12em'}}>
					<Config config={options} on_config_change={(options) => {set_options(options)}} available_color_spaces={available_color_spaces} available_file_types={available_file_types} />
				</animated.div>
				{ results.length > 0
					? <>
						<div className={classes['lint-results-bar']}>
							{ agg_results
								? <TryItAggregate infos={agg_results.info} warnings={agg_results.warn} errors={agg_results.error} />
								: null}
							<button className={classes['lint-results-clear']} onClick={() => reset() }>Clear Results</button>
						</div>
						{ results.map(result => <TryItResult
								key={result.filename}
								filename={ result.filename }
								log={ result.log }
								infos={ result.count.info }
								warnings={ result.count.warn }
								errors={ result.count.error }
							>
							</TryItResult>) }
					</>
					: <div className={classes['lint-drop-target']}>
						Drop files here
					</div>}
			</div>
		} 
	</DropZone>
}