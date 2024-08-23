import {useRef, useState, type DragEvent, type PropsWithChildren} from 'react';

interface DropZoneProps {
	onDrop: (files: File[]) => void,
	onDragIn?: () => void,
	onDragOut?: () => void
}

/**
 * A component for dropping files on to.
 *
 * @param {PropsWithChildren<DropZoneProps>} The props
 * @returns {JSX.Element} The component
 */
export function DropZone({children, onDrop, onDragIn, onDragOut}: PropsWithChildren<DropZoneProps>) {
	const dropRef = useRef<HTMLDivElement>(null);
	const [active, setActive] = useState(false);

	/**
	 * Get all of the files from a data transfer object.
	 *
	 * @param {DataTransfer} dt The data transfer object.
	 *
	 * @yields {File} The files.
	 */
	function* getFiles(dt: DataTransfer): Generator<File, void, undefined> {
		if (dt.items) {
			for (const i of dt.items) {
				const file = i.getAsFile();

				if (file) {
					yield file;
				}
			}
		} else {
			yield* dt.files;
		}
	}

	/**
	 * Handle the drop event.
	 *
	 * @param  {DragEvent} e The event object.
	 */
	function onDropEvent(e: DragEvent) {
		const dt = e.dataTransfer;

		if (dt === null) {
			return;
		}

		e.preventDefault();

		setActive(false);

		if (onDragOut) {
			onDragOut();
		}

		const files = Array.from(getFiles(dt));

		onDrop(files);

		// this.$emit('update:modelValue', files);
	}

	/**
	 * Handle the drag leav event.
	 *
	 * @param  {DragEvent} e The event object.
	 */
	function onDragLeave(e: DragEvent) {
		if (active && dropRef.current) {
			const size = dropRef.current?.getBoundingClientRect();

			if (!(e.pageX >= size.left && e.pageX <= size.right &&
				e.pageY >= size.top && e.pageY <= size.bottom)) {
				setActive(false);
				if (onDragOut) {
					onDragOut();
				}
			}
		}
	}

	/**
	 * Handle the drag enter event.
	 *
	 * @param  {DragEvent} e The event object.
	 */
	function onDragEnter(e: DragEvent<HTMLDivElement>) {
		if (!active && dropRef.current) {
			const size = dropRef.current?.getBoundingClientRect();

			if (e.pageX >= size.left && e.pageX <= size.right &&
				e.pageY >= size.top && e.pageY <= size.bottom) {
				setActive(true);
				if (onDragIn) {
					onDragIn();
				}
			}
		}
	}

	/**
	 * Handle the drag over event.
	 *
	 * @param  {DragEvent} e The event object.
	 */
	function onDragOver(e: DragEvent) {
		e.preventDefault();
	}

	return 	<div className={'drop-target' + (active ? ' active' : '')}
		style={{'border': active ? '1px solid var(--color-status-good)' : 'none'}}
		ref={dropRef}
		onDrop={onDropEvent}
		onDragEnter={onDragEnter}
		onDragLeave={onDragLeave}
		onDragOver={onDragOver}>
		{children}
	</div>;
}
