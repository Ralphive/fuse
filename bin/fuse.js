#!/usr/bin/env node

"use strict";

var colors = require('colors');
var _ = require('underscore');
var argv = require('optimist').usage('\nFuse JavaScript or HTML files.\n\nUsage: $0 -i [input-file.(js|html)] -o [output-file.(js|html)] (-w) (-c) (-m) (-l)').demand(['i', 'o']).describe('i', 'Input file').describe('o', 'Output file').describe('w', 'Watch the input file for changes.').describe('c', 'Compress the output using UglifyJS2 (JavaScript only).').describe('m', 'Mangle the output using UglifyJS2. (JavaScript only)').describe('l', 'Lint the JavaScript using JSHint (JavaScript only)').argv;
var fuse = require('../lib/fuse');
var path = require('path');

if (argv.w) {
	
	// let's grab each file that we need to watch
	var a = fuse.getReferencedFiles(fuse.getFileContent(argv.i));
	var relativePath = path.dirname(argv.i) + '/';
	
	// loop through an setup a watch on each referenced file
	_(a).each(function (path) {

		fuse.watchSrcFile(relativePath + path.path, argv.i, argv.o, argv.c, argv.m, argv.l);
		console.log('Watching ' + colors.cyan(relativePath + path.path) + ' for changes.');
	});
	
	// we also need to watch the input file
	fuse.watchFile(argv.i, argv.o, argv.c, argv.m, argv.l);
	console.log('Watching ' + colors.cyan(argv.i) + ' for changes.\nCTRL + C to stop.\n');

	// now what we've finished watching, let's fuse immediately too
	fuse.fuseFile(argv.i, argv.o, argv.c, argv.m, argv.l, false);
	
} else {

	// assume we're not watching a file, let's just package!
	fuse.fuseFile(argv.i, argv.o, argv.c, argv.m, argv.l);

}
