image-lint
==========
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

### Maximum Bytes Per Pixel `-b`, `--bytes_per_pixel` ###

By default `image-lint` will give warnings for any image that exceeds 3 bytes per pixel (bpp). You can adjust this limit using the `-b` or `--bytes_per_pixel` flag.

The value of 3bpp was chosen as a optimistic default. Its common that compressed images are much less-- as little as 0.4bpp. It is recommended that you set this value to the lowest value you can resonably tolerate.

```sh
$ image-lint -b 1 ./images/
```

**Remedy:** This kind of issue can be resolved by using a compression optimizer, or resaving the image using sensible settings.

### Minimum Byte Savings `-s`, `--byte_savings` ###

An image must be at least be this many bytes larger than the optimum size before triggering a file size warning. The optimum size is determined by: max bytes per pixel &times; number of pixels. The default value is 500 bytes.

```sh
$ image-lint -s 1024 ./images/
```

### File Extension Mismatch `--mismatch` ###

This option will check for images whose file extension doesn't match the contents of the file. For example: if a PSD file was renamed to '.png' without it be converted. The default is true.

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

Other Checks
------------

There are some checks that can't be turned off or adjusted. These issues interfere with the operation `image-lint` so they will always be reported.

### Empty or nearly empty files. ###

**Remedy:** This kind of issue can be resolved by removing these images. They are not valid and will not be usable in any image processing or viewing application.

### Unknown file contents ###

**Remedy:** This kind of issue can be resolved by finding out what the intended format was and renaming it. If you feel that the file format should be supported, you should file an issue.

### Images on the web that return an error code: 404, 500, etc. ###

**Remedy:** This kind of issue can be resolved by removing the references to the missing image or correcting the path to the correct image (404 errors) or by fixing any stability issues the server is having (500 errors).
