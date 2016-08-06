'use strict';

var JsDis = require('../lib/index');
var assert = require('chai').assert;
var fs = require('fs');

function runTest (jsDis, testNumber) {
    var input = fs.readFileSync(__dirname + "/data/input00" + testNumber  + ".txt", 'utf8');
    input = input.split("\n");
    var actualOutput = "";
    for (var i = 0; i < input.length; i++) {
        actualOutput += input[i] + "\n";
        var result = jsDis(input[i]);
        if (result) {
            actualOutput += "> " + result + "\n";
        }
    }
    var expectedOutput = fs.readFileSync(__dirname + "/data/output00" + testNumber + ".txt", 'utf8');
    actualOutput = actualOutput.substr(0, actualOutput.length - 1);
    return {
        actualOutput: actualOutput,
        expectedOutput: expectedOutput

    }
}

describe('input 1 ', function () {
    it('should run the input 1 functions', function (done) {
        var jsDis = new JsDis();
        var testCase = runTest(jsDis, 1);
        assert.equal(testCase.actualOutput, testCase.expectedOutput);
        done();
    });
});

describe('input 2 ', function () {
    it('should run the input 2 functions', function (done) {
        var jsDis = new JsDis();
        var testCase = runTest(jsDis, 2);
        assert.equal(testCase.actualOutput, testCase.expectedOutput);
        done();
    });
});

describe('input 3 ', function () {
    it('should run the input 3 functions', function (done) {
        var jsDis = new JsDis();
        var testCase = runTest(jsDis, 3);
        assert.equal(testCase.actualOutput, testCase.expectedOutput);
        done();
    });
});

describe('input 4 ', function () {
    it('should run the input 4 functions', function (done) {
        var jsDis = new JsDis();
        var testCase = runTest(jsDis, 4);
        assert.equal(testCase.actualOutput, testCase.expectedOutput);
        done();
    });
});

describe('input 5 ', function () {
    it('should run the input 5 functions', function (done) {
        var jsDis = new JsDis();
        var testCase = runTest(jsDis, 5);
        assert.equal(testCase.actualOutput, testCase.expectedOutput);
        done();
    });
});

describe('input 6 ', function () {
    it('should run the input 6 functions', function (done) {
        var jsDis = new JsDis();
        var testCase = runTest(jsDis, 5);
        assert.equal(testCase.actualOutput, testCase.expectedOutput);
        done();
    });
});


describe('edge cases', function () {
    it('try to run a command that doesnt exist', function (done) {
        var jsDis = new JsDis();
        assert.equal(jsDis("BREAKDOWN AND FAIL TERRIBLY"), "COMMAND NOT FOUND");
        jsDis("END");

        jsDis("SET a 10");
        assert.equal(jsDis("NUMEQUALTO 10"), "1");
        assert.equal(jsDis("GET a"), "10");
        jsDis("BEGIN");
        assert.equal(jsDis("NUMEQUALTO 10"), "1");
        jsDis("BEGIN");
        jsDis("UNSET a");
        assert.equal(jsDis("NUMEQUALTO 10"), "0");
        assert.equal(jsDis("GET a"), "NULL");
        jsDis("BEGIN");
        jsDis("SET b 10");
        assert.equal(jsDis("NUMEQUALTO 10"), "1");
        assert.equal(jsDis("GET b"), "10");
        jsDis("BEGIN");
        jsDis("SET c 10");
        assert.equal(jsDis("NUMEQUALTO 10"), "2");
        assert.equal(jsDis("GET c"), "10");
        jsDis("BEGIN");
        jsDis("SET d 10");
        assert.equal(jsDis("NUMEQUALTO 10"), "3");
        assert.equal(jsDis("GET d"), "10");
        jsDis("ROLLBACK");
        assert.equal(jsDis("NUMEQUALTO 10"), "2");
        jsDis("ROLLBACK");
        assert.equal(jsDis("NUMEQUALTO 10"), "1");
        jsDis("ROLLBACK");
        assert.equal(jsDis("NUMEQUALTO 10"), "0");
        jsDis("ROLLBACK");
        assert.equal(jsDis("NUMEQUALTO 10"), "1");
        jsDis("END");


        done();
    });
});