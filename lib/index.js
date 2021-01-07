"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveExchangeServers = exports.verifyExistence = exports.verify = void 0;
var Config_1 = require("./@types/Config");
var dns_1 = require("dns");
var net_1 = require("net");
function verify(params) {
    return __awaiter(this, void 0, void 0, function () {
        var email, domain, addresses;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    email = __assign(__assign({}, Config_1.DefaultConfig), params).email;
                    domain = email.split('@')[1];
                    return [4 /*yield*/, resolveExchangeServers(domain)];
                case 1:
                    addresses = _a.sent();
                    return [2 /*return*/, checkEmail(__assign(__assign({}, params), { addresses: addresses }))];
            }
        });
    });
}
exports.verify = verify;
function verifyExistence(email) {
    return __awaiter(this, void 0, void 0, function () {
        var params;
        return __generator(this, function (_a) {
            params = __assign(__assign({}, Config_1.DefaultConfig), { email: email });
            return [2 /*return*/, verify(params)];
        });
    });
}
exports.verifyExistence = verifyExistence;
function resolveExchangeServers(domain) {
    return new Promise(function (resolve, reject) {
        dns_1.resolveMx(domain, function (err, addresses) {
            if (err || addresses.length === 0)
                reject(err || "No host found for domain: " + domain);
            else
                resolve(addresses);
        });
    });
}
exports.resolveExchangeServers = resolveExchangeServers;
function checkEmail(params) {
    return new Promise(function (resolve, reject) {
        var CARRIGE_RETURN = '\r\n';
        var defaultMxRecord = { exchange: 'no exchange server', priority: 0 };
        var addresses = params.addresses, email = params.email, fromErmail = params.fromErmail, timeout = params.timeout;
        var fromHost = fromErmail.split('@')[1];
        var smtpHost = (addresses === null || addresses === void 0 ? void 0 : addresses.sort(function (first, second) { return first.priority - second.priority; })[0]) || defaultMxRecord;
        var commands = [
            { cmd: "HELO " + fromHost, executed: false },
            { cmd: "MAIL FROM:<" + fromErmail + ">", executed: false },
            { cmd: "RCPT TO:<" + email + ">", executed: false },
            { cmd: "QUIT", executed: false }
        ].map(function (x) {
            x.cmd += CARRIGE_RETURN;
            return x;
        });
        var socket = new net_1.Socket();
        var commandState = { current: null };
        var errorHandler = function (errorType) { return function (error) {
            reject({ error: error, errorType: errorType });
        }; };
        var writeNextCommand = function () {
            var command = commands.find(function (x) { return !x.executed; }) || { cmd: 'No command', executed: false };
            if (command) {
                socket.write(command.cmd);
                command.executed = true;
                commandState.current = command;
            }
        };
        var quit = function (success, error) {
            var quitCommand = commands[commands.length - 1];
            socket.write(quitCommand.cmd);
            socket.end();
            socket.destroy();
            resolve({ success: success, error: error });
        };
        var onDataRecieved = function (data) {
            var _a;
            if (data.toString()[0] !== '2')
                quit(false, [(_a = commandState.current) === null || _a === void 0 ? void 0 : _a.cmd, data].join('\n'));
            else if (commands.filter(function (x) { return x.executed; }).length === 3)
                quit(true, '');
            writeNextCommand();
        };
        // socket.setEncoding('utf8'); // should be ascii or utf8 in order to recieve data as string
        socket.setTimeout(timeout || 5000);
        socket.on('error', errorHandler('error'));
        socket.on('timeout', errorHandler('timeout'));
        // socket.on('connect', writeNextCommand);
        socket.on('data', onDataRecieved);
        socket.connect(25, smtpHost.exchange);
    });
}
