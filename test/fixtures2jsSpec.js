"use strict";

var fs = require("fs");
var path = require("path");
var fixtures2js = require("../lib");

var read = function (filename) {
    return fs.readFileSync(path.join(__dirname, "expected", filename), "utf8").trim();
};

describe("fixtures2js", function () {
    it("should provide default options", function () {
        fixtures2js()
            .addFixture("fixtures/bar.txt", new Buffer("cat"))
            .addFixture("fixtures/foo.txt", new Buffer("dog"))
            .finish().toString().should.equal(read("default-options.js"));
    });

    it("should use the `head` and `tail` parameters if specified", function () {
        fixtures2js({
            head: "foobar(",
            tail: ")"
        })
            .addFixture("fixtures/bar.txt", new Buffer("cat"))
            .addFixture("fixtures/foo.txt", new Buffer("dog"))
            .finish().toString().should.equal(read("head-and-tail.js"));
    });

    it("should use the correct post-processors if specified", function () {
        fixtures2js({
            postProcessors: {
                "**/*.txt": "default",
                "**/*.wav": "arraybuffer",
                "**/*.json": "json",
                "**/*": "base64"
            }
        })
            .addFixture("fixtures/moo.wav", new Buffer([1,2,35]))
            .addFixture("fixtures/foo.json", new Buffer("[]"))
            .addFixture("fixtures/cow.png", new Buffer([5,7,1]))
            .addFixture("fixtures/bar.txt", new Buffer("cat"))
            .addFixture("fixtures/something", new Buffer([9,1,6]))
            .finish().toString().should.equal(read("post-processors.js"));
    });

    describe(".addFixture()", function () {
        it("should throw if the file is set to an unsupported post-processor", function () {
            void function () {
                fixtures2js({
                    postProcessors: {
                        "**/*": "foo"
                    }
                }).addFixture("fixtures/bar.txt", new Buffer("cat"));
            }.should.throw("Not a post-processor: `foo`");
        });
    });
});
