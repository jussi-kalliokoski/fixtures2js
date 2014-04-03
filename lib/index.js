"use strict";

module.exports = function (options) {
    var _ = require("lodash");
    var Buffer = require("buffer").Buffer;
    var stringify = require("./stringify");
    var process = require("./process");

    options = _.extend({
        postProcessors: {},
        head: "window.FIXTURES = ",
        tail: ";"
    }, options);

    var fixtures = {};

    var addFixture = function (filename, buffer) {
        fixtures[filename] = process(filename, buffer, options.postProcessors);
        return this;
    };

    var finish = function () {
        return new Buffer(options.head + stringify(fixtures) + options.tail);
    };

    return {
        addFixture: addFixture,
        finish: finish
    };
};
