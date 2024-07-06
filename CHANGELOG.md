Next
---

- Detect files with the Acropalypse vulnerability.
- Add validation for file type.
- Bump puppeteer version to v22.12.1

3.1.0
-----
- Add a `--max_warnings` option that emits an error if there are too many warnings.
- Enforce the minimum node version of v16
- Prevent printing stack traces for linter errors.
- Fix error when printing help.


3.0.0
----

- Now sets an error code of 1 when any errors or warnings are issued.
- Experimental JPEG XL support
- Experimental AVIF / HEIC support

2.1.0
-----

- Replace Phantom JS with Puppeteer in the web finder.
- Replace request with got.
- Refactoring and clean up.

2.0.0
-----

- Bumped depencencies
- Fix warnings with Buffers.
- Disable git finder

1.1.0
-----

- Fix upper case file extensions.
- Add validation for color spaces.
- Prototype folder exclusion.
- Add support for XML based files, SVG and HTML.
- Add color to the logger.
- Add truncated file detection for PNG, JPEG, GIF.

1.0.2
-----

- Add support for searching Git repositories.
- Default to the current directory when running without params.
- Spelling fixes.
- Add options for help and version.

1.0.1
-----

- Add script to bin.

1.0.0
-----

- Inagural release of image-lint.
