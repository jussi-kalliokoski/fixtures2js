"use strict";

var fs = require("fs");
var minimatch = require("minimatch");
var _ = require("lodash");
var availablePostProcessors = require("./post-processors");

var getPostProcessor = function (filename, postProcessors) {
    var name = "default";

    _.each(postProcessors, function (postProcessor, pattern) {
        if ( minimatch(filename, pattern) ) {
            name = postProcessor;
            return false;
        }
    });

    if ( !_.has(availablePostProcessors, name) ) {
        throw new Error("Not a post-processor: `" + name + "`");
    }

    return availablePostProcessors[name];
};

module.exports = function (filename, buffer, postProcessors) {
    var postProcess = getPostProcessor(filename, postProcessors);
    return postProcess(buffer);
};
