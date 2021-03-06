'use strict';
var VERB = 0;
var KEY = 1;
var VALUE = 2;

var JsDis = function () {
    var _this = this;
    _this.ROLLINGBACK = false;
    _this.keyValues = {};
    _this.valueKeyCounts = {};
    _this.transactions = [];

    var runCommand = function(commands) {
        if (typeof _this[commands[VERB]] === "function") {
            var result = _this[commands[VERB]](commands);
            return result;
        } else {
            return "COMMAND NOT FOUND";
        }
    };

    var decrementValueKeyCount = function(value) {
        if (value != null) {
            if (_this.valueKeyCounts[value] > 1) {
                _this.valueKeyCounts[value]--;
            } else {
                delete _this.valueKeyCounts[value];
            }
        }
    };

    var incrementKeyCount = function(value) {
        if (value != null) {
            if (_this.valueKeyCounts[value]) {
                _this.valueKeyCounts[value]++;
            } else  {
                _this.valueKeyCounts[value] = 1;
            }
        }
    };

    _this.SET = function (commands) {
        if (_this.transactions.length > 0 && !_this.ROLLINGBACK) {
            var index  = _this.transactions.length - 1;
            _this.transactions[index].push(["SET",
                commands[KEY],
                _this.GET(commands),
                _this.valueKeyCounts[_this.GET(commands)]
            ])
        }
        decrementValueKeyCount(_this.keyValues[commands[KEY]]);
        _this.keyValues[commands[KEY]] = commands[VALUE];
        incrementKeyCount(_this.keyValues[commands[KEY]]);
        return "";
    };

    _this.GET = function (commands) {
        return _this.keyValues[commands[KEY]];
    };

    _this.NUMEQUALTO = function(commands) {
        var result = _this.valueKeyCounts[commands[KEY]];
        return result ? result : 0;
    };

    _this.END = function () {
        return "";
    };

    _this.BEGIN = function() {
        this.transactions.push([]);
        return "";
    };

    _this.ROLLBACK = function() {
        if (_this.transactions.length > 0) {
            _this.ROLLINGBACK = true;
            var currentRollback = _this.transactions.pop();
            while (currentRollback.length > 0) {
                var commands = currentRollback.pop();
                runCommand(commands);
            }
            _this.ROLLINGBACK = false;
        } else {
            return "NO TRANSACTION";
        }
        return "";
    };

    _this.COMMIT = function() {
        if (_this.transactions.length > 0) {
            _this.transactions = [];
        } else {
            return "NO TRANSACTION";
        }
        return "";
    };

    _this.UNSET = function(commands) {
        return runCommand(["SET",
            commands[KEY],
            null
        ])
    };

    return function (command) {
        var commands = command.split(" ");
        var result = runCommand(commands);
        if (result != null && typeof result != 'undefined') {
            return result.toString();
        } else {
            return "NULL";
        }
    }
};

module.exports = JsDis;