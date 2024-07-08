image-lint
==========

[![Quality Check](https://github.com/aaronasachimp/image-lint/actions/workflows/quality-check.yml/badge.svg)](https://github.com/AaronAsAChimp/image-lint/actions/workflows/quality-check.yml)
[![npm](https://img.shields.io/npm/v/image-lint)](https://www.npmjs.org/package/image-lint)

Find broken and poorly compressed images.

Installation
------------

```sh
$ npm install -g image-lint
```

Usage
-----

You can specify a list of file paths and URLs to run the checks against. It will attempt to find all the images in directories or used on the specified page.

```sh
$ image-lint ./images/ http://example.com ./logos/logo1.png
```

### Maximum Bytes Per Pixel `-b`, `--bytes-per-pixel` ###

By default `image-lint` will give warnings for any image that exceeds 3 bytes per pixel (bpp). You can adjust this limit using the `-b` or `--bytes-per-pixel` flag.

The value of 3bpp was chosen as a optimistic default. Its common that compressed images are much less-- as little as 0.4bpp. It is recommended that you set this value to the lowest value you can resonably tolerate.

```sh
$ image-lint -b 1 ./images/
```

**Remedy:** This kind of issue can be resolved by using a compression optimizer, or resaving the image using sensible settings.

### Minimum Byte Savings `-s`, `--byte-savings` ###

An image must be at least be this many bytes larger than the optimum size before triggering a file size warning. The optimum size is determined by: max bytes per pixel &times; number of pixels. The default value is 500 bytes.

```sh
$ image-lint -s 1024 ./images/
```

### File Extension Mismatch `--mismatch` ###

This option will check for images whose file extension doesn't match the contents of the file. For example: if a PSD file was renamed to '.png' without it being converted. The default is true.

```sh
$ image-lint --mismatch true ./images/
```

**Remedy:** This kind of issue can be resolved by changing the file extension, or resaving the image using the correct format.

### Duplicate file detection `--duplicate` ###

Duplicate file detection will try to find copies of images. It only checks for identical copies, it will not detect images where the file type was changed or its contents have been modified in some way. This option will use additional memory and cpu. The default is true.

```sh
$ image-lint --duplicate true ./images/
```

**Remedy:** This kind of issue can be resolved by removing the duplicate images, then pointing all references to the one remaining image.

### Color Space Validation `--color-space` ###

Color space validation will check the color space of the image and will issue a warning if it is not in the set of the allowed color spaces. This is useful to find images that have been saved for print but are used on the web. The default set is Grayscale (G), and RGB.

```sh
$ image-lint --color-space CYMK,HSV,G ./images/
```

**Remedy:** This kind of issue can be resolved by saving the image using the appropriate color mode.

Adjusting the behavior of image-lint
------------------------------------

### Maximum warnings `--max-warnings` ###

This flag will emit an error and stop linting when more than the maximum number of warnings are found. The default is to allow all warnings.

```sh
$ image-lint --max-warnings=10 ./images/
```

**Remedy:** Address the warnings to be at or below the maximum.

Other Checks
------------

There are some checks that can't be turned off or adjusted. These issues interfere with the operation `image-lint` so they will always be reported.

### Empty or nearly empty files ###

**Remedy:** This kind of issue can be resolved by removing these images. They are not valid and will not be usable in any image processing or viewing application.

### Truncated files ###

Only part of the file is present. This can happen when a connection is interrupted while transferring the file.

**Remedy:** This kind of issue can be resolved by getting a new copy. There is generally no means for repairing the image. The data is likely lost or unrecoverable.

### Unknown file contents ###

**Remedy:** This kind of issue can be resolved by finding out what the intended format was and renaming it. If you feel that the file format should be supported, you should file an issue.

### Images on the web that return an error code: 404, 500, etc. ###

**Remedy:** This kind of issue can be resolved by removing the references to the image, correcting the file path to the image (404 errors), or by fixing any stability issues the server is having (500 errors).

Usage with lint-staged
----------------------

You can run image-lint prior to committing using [lint-staged](https://github.com/okonet/lint-staged) and [husky](https://github.com/typicode/husky). Assuming you've already setup these tools you can add the following to your lint-staged configuration to run image-lint.

```json
{
    "*.{png,jpeg,jpg,gif}": "image-lint"
}
```

Support
-------

### File Types ###

A number of formats are supported, though most are only for identification purposes. If there is a format you would like supported you can file an issue in the issue tracker.

| Format       | Linted | Identified    |
|:------------:|:------:|:-------------:|
| png          | ☑️️      |               |
| gif          | ☑️️      |               |
| jpg          | ☑️️      |               |
| jxl          | ☑️️      |               |
| avif / heic  | ☑️️      |               |
| bmp          |        |  ☑️️            |
| psd          |        |  ☑️️            |
| ico / cur    |        |  ☑️️            |
| tiff         |        |  ☑️️            |
| webp         |        |  ☑️️            |
| svg          |        |  ☑️️            |
| html         |        |  ☑️️            |

### File Finders ###

There are multiple stratagies that are used to find files to lint. The linter will determine the correct one/ones to use based the format of the path or URL passed in.

| File Finder |
|:-----------:|
| HTTP        |
| HTTPS       |
| Filesystem  |

### Color Spaces ###

When detecting color spaces the following are supported although not all formats use them.

| Color Space |
|:-----------:|
| G           |
| RGB         |
| YCbCr       |
| YCCK        |
| LAB         |
| HSV         |
| CMYK        |
