var JsDis = require('../lib/index');
const assert = require('chai').assert;
describe('input 1 ', function () {
    it('should run the input 1 functions', function (done) {
        jsDis = new JsDis();
        jsDis("SET ex 10");
        assert.equal(jsDis("GET ex"), "10\n");
        jsDis("UNSET ex");
        assert.equal(jsDis("GET ex"), "NULL\n");
        jsDis("END");
        done();
    });
});

describe('input 2 ', function () {
    it('should run the input 2 functions', function (done) {
        jsDis = new JsDis();
        jsDis("SET a 10");
        jsDis("SET b 10");
        assert.equal(jsDis("NUMEQUALTO 10"), "2\n");
        assert.equal(jsDis("NUMEQUALTO 20"), "0\n");
        jsDis("SET b 30");
        assert.equal(jsDis("NUMEQUALTO 10"), "1\n");
        jsDis("END");
        done();
    });
});

describe('input 3 ', function () {
    it('should run the input 3 functions', function (done) {
        jsDis = new JsDis();
        jsDis("BEGIN");
        jsDis("SET a 10");
        assert.equal(jsDis("GET a"), "10\n");
        jsDis("BEGIN");
        jsDis("SET a 20");
        assert.equal(jsDis("GET a"), "20\n");
        jsDis("ROLLBACK");
        assert.equal(jsDis("GET a"), "10\n");
        jsDis("ROLLBACK");
        assert.equal(jsDis("GET a"), "NULL\n");
        jsDis("END");
        done();
    });
});

describe('input 4 ', function () {
    it('should run the input 4 functions', function (done) {
        jsDis = new JsDis();
        jsDis("BEGIN");
        jsDis("SET a 30");
        jsDis("BEGIN");
        jsDis("SET a 40");
        jsDis("COMMIT");
        assert.equal(jsDis("GET a"), "40\n");
        assert.equal(jsDis("ROLLBACK"), "NO TRANSACTION\n");
        assert.equal(jsDis("COMMIT"), "NO TRANSACTION\n");
        jsDis("END");
        done();
    });
});

describe('input 5', function () {
    it('should run the input 5 functions', function (done) {
        jsDis = new JsDis();
        jsDis("SET a 50");
        jsDis("BEGIN");
        assert.equal(jsDis("GET a"), "50\n");
        jsDis("SET a 60");
        jsDis("BEGIN");
        jsDis("UNSET a");
        assert.equal(jsDis("GET a"), "NULL\n");
        jsDis("ROLLBACK");
        assert.equal(jsDis("GET a"), "60\n");
        jsDis("COMMIT");
        assert.equal(jsDis("GET a"), "60\n");
        jsDis("END");
        done();
    });
});

describe('input 6', function () {
    it('should run the input 5 functions', function (done) {
        jsDis = new JsDis();
        jsDis("SET a 10");
        jsDis("BEGIN");
        assert.equal(jsDis("NUMEQUALTO 10"), "1\n");
        jsDis("BEGIN");
        jsDis("UNSET a");
        assert.equal(jsDis("NUMEQUALTO 10"), "0\n");
        jsDis("ROLLBACK");
        assert.equal(jsDis("NUMEQUALTO 10"), "1\n");
        jsDis("COMMIT");
        jsDis("END");
        done();
    });
});

describe('edge cases', function () {
    it('try to run a command that doesnt exist', function (done) {
        jsDis = new JsDis();
        assert.equal(jsDis("BREAKDOWN AND FAIL TERRIBLY"), "COMMAND NOT FOUND\n");
        jsDis("END");
        done();
    });
});