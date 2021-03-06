/**
 * NOTE: RUNS IN THE CASPER ENVIRONMENT
 *
 * - wait for the page to load
 * - find something interesting
 * - take a screenshot
 *
 * `this` is the casper object
 * id: the id of a problem_type
 */

try {
    var getInterestingBox = require('./client/get-interesting-box.js');
} catch (e) { // freaking cross platformity
    var getInterestingBox = require('./lib/capture/client/get-interesting-box.js');
}

function casperPerseus(id, dest) {
    this.then(function() {
        this.waitForSelector('#workarea');
    });
    this.then(function () {
        var box = this.evaluate(getInterestingBox, 256, 256);
        this.echo('Capturing perseus ' + id);
        var filename = dest + '/' + id + '.png';
        try {
            if (box) {
                this.capture(filename, box);
            } else {
                this.captureSelector(filename, "#workarea");
            }
        } catch (e) {
            this.die("Failed to take a screenshot for " + id + " : " + e.message);
        }
    });
}

module.exports = casperPerseus;
