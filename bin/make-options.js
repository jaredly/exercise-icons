/**
 * Given a list of process.argv, construct an options dictionary, validating
 * it along the way.
 *
 * See usage.txt for options
 */

var fs = require('fs');
var subarg = require('subarg')
var debug = require('debug')('exicons:cli');

function makeOptions(args) {
    args = subarg(args);
    debug('args', args);

    if (args.h || args.help) {
        console.log(fs.readFileSync(__dirname + '/usage.txt').toString());
        process.exit(0);
    }

    var o = {
        all:        args.a || args.all || false,
        file:       args.f || args.file || false,
        image:      args.i || args.image || false,
        khan:       args.k || args.khan || false,
        manifest:   args.m || args.manifest || false,
        perseus:    args.p || args.perseus || false,
        upload:     args.u || args.upload || false,
    }

    o.shoot = !o.image && !o.manifest;

    if (o.khan + o.perseus + o.all > 1 ||
        (o.khan + o.perseus + o.all === 1 && o.file)) {
        console.error('You can only select *one* of khan, perseus, all, and file');
        process.exit(1);
    }

    if (o.shoot && o.khan + o.perseus + o.all === 0 && !o.file) {
        console.log('Must specify what to shoot');
        console.log(fs.readFileSync(__dirname + '/usage.txt').toString());
        process.exit(1);
    }

    var s3 = {};

    if (o.upload) {
        var key = process.env.S3_KEY;
        var secret = process.env.S3_SECRET;
        var bucket = process.env.S3_BUCKET;
        if (!key || !secret || !bucket) {
            console.error("S3 Env variables not set up correctly. S3_KEY and S3_SECRET and S3_BUCKET");
            process.exit(1);
        }
        s3 = {
            key: key,
            secret: secret,
            bucket: bucket
        };
    }
    o.s3 = s3;
    return o;
}

module.exports = makeOptions;
