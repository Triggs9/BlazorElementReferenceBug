var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
export function Sleep(ms) {
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
}
export function WaitForSession() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Waiting for OriClientSession to be established...");
                    return [4, Sleep(500)];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    if (globalThis.CurrentOriSession == undefined) return [3, 0];
                    _a.label = 3;
                case 3: return [2, true];
            }
        });
    });
}
export function WaitForConnection() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, WaitForSession()];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    console.log("Waiting for OriClientSession to Connect...");
                    return [4, Sleep(500)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    if (globalThis.CurrentOriSession.CheckConnection == false) return [3, 2];
                    _a.label = 5;
                case 5: return [2, true];
            }
        });
    });
}
var InvalidPropertyException = (function (_super) {
    __extends(InvalidPropertyException, _super);
    function InvalidPropertyException(exceptionInfo) {
        var _this = _super.call(this, exceptionInfo.message) || this;
        _this.name = "InvalidPropertyException";
        _this.exceptionInfo = exceptionInfo;
        _this.message = _this.exceptionInfo.message;
        console.error(exceptionInfo.message);
        Object.setPrototypeOf(_this, InvalidPropertyException.prototype);
        return _this;
    }
    return InvalidPropertyException;
}(Error));
export { InvalidPropertyException };
var LineInfo = (function () {
    function LineInfo() {
        var newError = new Error();
        if (newError)
            if (newError.stack) {
                var stackLine = newError.stack.split("\n")[2];
                var caller_line = stackLine.slice(stackLine.lastIndexOf('/'), stackLine.lastIndexOf(')'));
                if (caller_line.length == 0) {
                    caller_line = stackLine.slice(stackLine.lastIndexOf('('), stackLine.lastIndexOf(')'));
                }
                var filename_base = caller_line.slice(0 + 1, caller_line.indexOf(':'));
                var line_no = caller_line.slice(caller_line.indexOf(':') + 1, caller_line.lastIndexOf(':'));
                var line_pos = caller_line.slice(caller_line.lastIndexOf(':') + 1);
                this.fileName = filename_base;
                this.lineNumber = Number(line_no);
                this.columnNumber = Number(line_pos);
            }
    }
    LineInfo.prototype.toString = function () {
        return this.fileName + " " + this.lineNumber + " " + this.columnNumber;
    };
    return LineInfo;
}());
export { LineInfo };
function getElementByCaptureId(referenceCaptureId) {
    var selector = "[" + getCaptureIdAttributeName(referenceCaptureId) + "]";
    return document.querySelector(selector);
}
function getCaptureIdAttributeName(referenceCaptureId) {
    return "_bl_" + referenceCaptureId;
}
export function BlazorIDToElement(incomingObject) {
    var elementRefKey = '__internalId';
    var setValue = function (path, value) {
        var schema = incomingObject;
        var pList = path.split('.');
        var len = pList.length;
        for (var i = 0; i < len - 1; i++) {
            var elem = pList[i];
            if (!schema[elem])
                schema[elem] = {};
            schema = schema[elem];
        }
        schema[pList[len - 1]] = value;
    };
    var iterateObject = function (obj, stack) {
        if (stack === void 0) { stack = null; }
        for (var property in obj) {
            if (obj.hasOwnProperty(property)) {
                if (typeof obj[property] == "object") {
                    if (stack === null)
                        stack = property;
                    else
                        stack = stack + "." + property;
                    iterateObject(obj[property], stack);
                }
                else {
                    if ((property === elementRefKey) && typeof obj[property] === 'string') {
                        if (stack !== null)
                            setValue(stack, getElementByCaptureId(obj[property]));
                    }
                }
            }
        }
    };
    iterateObject(incomingObject);
    return incomingObject;
}
//# sourceMappingURL=Client.Helpers.js.map