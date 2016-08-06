const VERB = 0;
const KEY = 1;
const VALUE = 2;

var JsDis = function () {
    var _this = this;
    _this.ROLLINGBACK = false;
    _this.keyValues = {};
    _this.valueKeyCounts = {};

    _this.transactions = [];

    var decrementValueKeyCount = function(value) {
        if (value != null) {
            if (_this.valueKeyCounts["hash_" + value] > 1) {
                _this.valueKeyCounts["hash_" + value]--;
            } else {
                delete _this.valueKeyCounts["hash_" + value];
            }
        }
    };

    var incrementKeyCount = function(value) {
        if (value != null) {
            if (_this.valueKeyCounts["hash_" + value]) {
                _this.valueKeyCounts["hash_" + value]++;
            } else  {
                _this.valueKeyCounts["hash_" + value] = 1;
            }
        }
    };

    _this.SET = function (commands) {
        if (_this.transactions.length > 0 && !_this.ROLLINGBACK) {
            var index  = _this.transactions.length - 1;
            _this.transactions[index].push(["SET",
                commands[KEY],
                _this.GET(commands),
                _this.valueKeyCounts["hash_" + _this.GET(commands)]
            ])
        }
        decrementValueKeyCount(_this.keyValues[commands[KEY]]);
        _this.keyValues[commands[KEY]] = commands[VALUE];
        incrementKeyCount(_this.keyValues[commands[KEY]]);
    };

    _this.GET = function (commands) {
        return _this.keyValues[commands[KEY]];
    };

    _this.NUMEQUALTO = function(commands) {
        var result = _this.valueKeyCounts["hash_" + commands[KEY]];
        return result ? result : 0;
    };

    _this.END = function () {
        console.log("Exit Program\n");
    };

    _this.BEGIN = function() {
        this.transactions.push([]);
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
    };

    _this.COMMIT = function() {
        if (_this.transactions.length > 0) {
            _this.transactions = [];
        } else {
            return "NO TRANSACTION";
        }
    };

    _this.UNSET = function(commands) {
        return runCommand(["SET",
            commands[KEY],
            null
        ])
    };
    var runCommand = function(commands) {
        if (typeof _this[commands[VERB]] === "function") {
            var result = _this[commands[VERB]](commands);
            return result;
        } else {
            return "COMMAND NOT FOUND";
        }
    };

    return function (command) {
        var commands = command.split(" ");
        var result = runCommand(commands);
        if (result != null && typeof result != 'undefined') {
            return result.toString() + "\n";
        } else {
            return "NULL\n";
        }
    }
};

module.exports = JsDis;