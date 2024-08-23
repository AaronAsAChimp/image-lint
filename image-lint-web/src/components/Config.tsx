import type {LinterOptions} from 'image-lint/lib/linter';
import {useMemo} from 'react';
import Select, {type OnChangeValue, type StylesConfig} from 'react-select';
import classes from './Config.module.css';
import classNames from 'classnames';

interface ConfigProps {
	config: LinterOptions,
	available_color_spaces: string[],
	available_file_types: string[],
	on_config_change: (config: LinterOptions) => void
}

interface LintOption {
  readonly value: string;
  readonly label: string;
}

const styles: StylesConfig<LintOption, true> = {
	option: (styles, {isFocused, isSelected}) => {
		return {
			...styles,
			backgroundColor: isSelected || isFocused ? 'var(--color-status-good)' : undefined,
			color: isSelected || isFocused ? 'var(--color-status-good-contrast)' : 'black',
		};
	},
};

/**
 * A component for editing the configuration of a linter.
 *
 * @param {ConfigProps} config The props
 * @returns {JSX.Element} The component
 */
export function Config({config, available_color_spaces, available_file_types, on_config_change}: ConfigProps) {
	const color_space_options = useMemo(() => {
		return available_color_spaces.map((space) => {
			return {'value': space, 'label': space};
		});
	}, [available_color_spaces]);

	const file_type_options = useMemo(() => {
		return available_file_types.map((type) => {
			return {'value': type, 'label': type};
		});
	}, [available_file_types]);

	return <div>
		<h3 className={classes['lint-options-title']}>
			Options
		</h3>

		<label className={classNames(classes['lint-option'], classes['lint-option-check'])}>
			<input type="checkbox" checked={config.mismatch} onChange={ (e) => on_config_change({...config, mismatch: e.target.checked}) } />
			Find mismatches between file type and file extension.
		</label>

		<label className={classNames(classes['lint-option'], classes['lint-option-check'])}>
			<input type="checkbox" checked={config.duplicate} onChange={ (e) => on_config_change({...config, duplicate: e.target.checked}) } />
			Find files that have been copied.
		</label>

		<label className={classNames(classes['lint-option'], classes['lint-option-number'])}>
			Set the maximum bytes per pixel before giving a warning.
			<input
				value={ config.bytes_per_pixel }
				onChange={ (e) => on_config_change({...config, bytes_per_pixel: parseInt(e.target.value)}) }
				type="number"
				step="0.1"
				min="0"
			/>
		</label>

		<label className={classNames(classes['lint-option'], classes['lint-option-number'])}>
			Set the minimum byte savings before giving a warning.
			<input
				value={ config.byte_savings }
				onChange={ (e) => on_config_change({...config, byte_savings: parseInt(e.target.value)}) }
				type="number"
				min="0" />
		</label>

		<label className={classNames(classes['lint-option'], classes['lint-option-array'])}>
			Set the allowed color spaces.

			<Select
				className={classes['lint-multiselect']}
				styles={styles}
				options={color_space_options}
				isMulti={true}
				value={ config.color_space.map((space) => {
					return {'value': space, 'label': space};
				}) }
				onChange={ (e: OnChangeValue<LintOption, true>) => {
					on_config_change({...config, color_space: e.map((item) => item.value )});
				}}
			/>
		</label>

		<label className={classNames(classes['lint-option'], classes['lint-option-array'])}>
			Set the allowed file types.

			<Select
				className={classes['lint-multiselect']}
				styles={styles}
				options={file_type_options}
				isMulti={true}
				value={ config.file_type ? config.file_type.map((space) => {
					return {'value': space, 'label': space};
				}) : [] }
				onChange={ (e: OnChangeValue<LintOption, true>) => {
					const values = e.length ? e.map((e) => e.value ) : null;
					on_config_change({...config, file_type: values});
				} }
			/>
		</label>
	</div>;
}
