import { useRef, useState, type DragEvent, type PropsWithChildren } from "react";

interface DropZoneProps {
	onDrop: (files: File[]) => void,
	onDragIn?: () => void,
	onDragOut?: () => void
}

export function DropZone ({children, onDrop, onDragIn, onDragOut}: PropsWithChildren<DropZoneProps>) {
	const dropRef = useRef<HTMLDivElement>(null);
	const [active, setActive] = useState(false);

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

	function onDropEvent(e: DragEvent) {
		const dt = e.dataTransfer;

		if (dt === null) {
			return;
		}

		e.preventDefault();

		setActive(false);

		if (onDragOut) {
			onDragOut()
		}

		const files = Array.from(getFiles(dt));

		onDrop(files)

		// this.$emit('update:modelValue', files);
	}

	function onDragLeave(e: DragEvent) {

		if (active && dropRef.current) {
			const size = dropRef.current?.getBoundingClientRect();

			if (!(e.pageX >= size.left && e.pageX <= size.right
				&& e.pageY >= size.top && e.pageY <= size.bottom)) {
				setActive(false);
				if (onDragOut) {
					onDragOut()
				}
			}
		}
	}


	function onDragEnter(e: DragEvent<HTMLDivElement>) {
		if (!active && dropRef.current) {
			const size = dropRef.current?.getBoundingClientRect();

			if (e.pageX >= size.left && e.pageX <= size.right
				&& e.pageY >= size.top && e.pageY <= size.bottom) {
				setActive(true);
				if (onDragIn) {
					onDragIn()
				}
			}
		}
	}

	function onDragOver(e: DragEvent) {
		e.preventDefault()
	}

	return 	<div className={'drop-target' + (active ? ' active' : '')}
			style={{'border': active ? '1px solid var(--color-status-good)' : 'none'}}
			ref={dropRef}
			onDrop={onDropEvent}
			onDragEnter={onDragEnter}
			onDragLeave={onDragLeave}
			onDragOver={onDragOver}>
		{children}
	</div>
}
