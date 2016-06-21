'use strict';"use strict";
var lang_1 = require('angular2/src/facade/lang');
var ParseLocation = (function () {
    function ParseLocation(file, offset, line, col) {
        this.file = file;
        this.offset = offset;
        this.line = line;
        this.col = col;
    }
    ParseLocation.prototype.toString = function () {
        return lang_1.isPresent(this.offset) ? this.file.url + "@" + this.line + ":" + this.col : this.file.url;
    };
    return ParseLocation;
}());
exports.ParseLocation = ParseLocation;
var ParseSourceFile = (function () {
    function ParseSourceFile(content, url) {
        this.content = content;
        this.url = url;
    }
    return ParseSourceFile;
}());
exports.ParseSourceFile = ParseSourceFile;
var ParseSourceSpan = (function () {
    function ParseSourceSpan(start, end) {
        this.start = start;
        this.end = end;
    }
    ParseSourceSpan.prototype.toString = function () {
        return this.start.file.content.substring(this.start.offset, this.end.offset);
    };
    return ParseSourceSpan;
}());
exports.ParseSourceSpan = ParseSourceSpan;
var ParseError = (function () {
    function ParseError(span, msg) {
        this.span = span;
        this.msg = msg;
    }
    ParseError.prototype.toString = function () {
        var source = this.span.start.file.content;
        var ctxStart = this.span.start.offset;
        var contextStr = '';
        if (lang_1.isPresent(ctxStart)) {
            if (ctxStart > source.length - 1) {
                ctxStart = source.length - 1;
            }
            var ctxEnd = ctxStart;
            var ctxLen = 0;
            var ctxLines = 0;
            while (ctxLen < 100 && ctxStart > 0) {
                ctxStart--;
                ctxLen++;
                if (source[ctxStart] == "\n") {
                    if (++ctxLines == 3) {
                        break;
                    }
                }
            }
            ctxLen = 0;
            ctxLines = 0;
            while (ctxLen < 100 && ctxEnd < source.length - 1) {
                ctxEnd++;
                ctxLen++;
                if (source[ctxEnd] == "\n") {
                    if (++ctxLines == 3) {
                        break;
                    }
                }
            }
            var context = source.substring(ctxStart, this.span.start.offset) + '[ERROR ->]' +
                source.substring(this.span.start.offset, ctxEnd + 1);
            contextStr = " (\"" + context + "\")";
        }
        return "" + this.msg + contextStr + ": " + this.span.start;
    };
    return ParseError;
}());
exports.ParseError = ParseError;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2VfdXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtbGI3ZmVCcnoudG1wL2FuZ3VsYXIyL3NyYy9jb21waWxlci9wYXJzZV91dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxxQkFBd0IsMEJBQTBCLENBQUMsQ0FBQTtBQUVuRDtJQUNFLHVCQUFtQixJQUFxQixFQUFTLE1BQWMsRUFBUyxJQUFZLEVBQ2pFLEdBQVc7UUFEWCxTQUFJLEdBQUosSUFBSSxDQUFpQjtRQUFTLFdBQU0sR0FBTixNQUFNLENBQVE7UUFBUyxTQUFJLEdBQUosSUFBSSxDQUFRO1FBQ2pFLFFBQUcsR0FBSCxHQUFHLENBQVE7SUFBRyxDQUFDO0lBRWxDLGdDQUFRLEdBQVI7UUFDRSxNQUFNLENBQUMsZ0JBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLFNBQUksSUFBSSxDQUFDLElBQUksU0FBSSxJQUFJLENBQUMsR0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO0lBQzlGLENBQUM7SUFDSCxvQkFBQztBQUFELENBQUMsQUFQRCxJQU9DO0FBUFkscUJBQWEsZ0JBT3pCLENBQUE7QUFFRDtJQUNFLHlCQUFtQixPQUFlLEVBQVMsR0FBVztRQUFuQyxZQUFPLEdBQVAsT0FBTyxDQUFRO1FBQVMsUUFBRyxHQUFILEdBQUcsQ0FBUTtJQUFHLENBQUM7SUFDNUQsc0JBQUM7QUFBRCxDQUFDLEFBRkQsSUFFQztBQUZZLHVCQUFlLGtCQUUzQixDQUFBO0FBRUQ7SUFDRSx5QkFBbUIsS0FBb0IsRUFBUyxHQUFrQjtRQUEvQyxVQUFLLEdBQUwsS0FBSyxDQUFlO1FBQVMsUUFBRyxHQUFILEdBQUcsQ0FBZTtJQUFHLENBQUM7SUFFdEUsa0NBQVEsR0FBUjtRQUNFLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDL0UsQ0FBQztJQUNILHNCQUFDO0FBQUQsQ0FBQyxBQU5ELElBTUM7QUFOWSx1QkFBZSxrQkFNM0IsQ0FBQTtBQUVEO0lBQ0Usb0JBQW1CLElBQXFCLEVBQVMsR0FBVztRQUF6QyxTQUFJLEdBQUosSUFBSSxDQUFpQjtRQUFTLFFBQUcsR0FBSCxHQUFHLENBQVE7SUFBRyxDQUFDO0lBRWhFLDZCQUFRLEdBQVI7UUFDRSxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDO1FBQzFDLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQztRQUN0QyxJQUFJLFVBQVUsR0FBRyxFQUFFLENBQUM7UUFDcEIsRUFBRSxDQUFDLENBQUMsZ0JBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDeEIsRUFBRSxDQUFDLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDakMsUUFBUSxHQUFHLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1lBQy9CLENBQUM7WUFDRCxJQUFJLE1BQU0sR0FBRyxRQUFRLENBQUM7WUFDdEIsSUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDO1lBQ2YsSUFBSSxRQUFRLEdBQUcsQ0FBQyxDQUFDO1lBRWpCLE9BQU8sTUFBTSxHQUFHLEdBQUcsSUFBSSxRQUFRLEdBQUcsQ0FBQyxFQUFFLENBQUM7Z0JBQ3BDLFFBQVEsRUFBRSxDQUFDO2dCQUNYLE1BQU0sRUFBRSxDQUFDO2dCQUNULEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO29CQUM3QixFQUFFLENBQUMsQ0FBQyxFQUFFLFFBQVEsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUNwQixLQUFLLENBQUM7b0JBQ1IsQ0FBQztnQkFDSCxDQUFDO1lBQ0gsQ0FBQztZQUVELE1BQU0sR0FBRyxDQUFDLENBQUM7WUFDWCxRQUFRLEdBQUcsQ0FBQyxDQUFDO1lBQ2IsT0FBTyxNQUFNLEdBQUcsR0FBRyxJQUFJLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDO2dCQUNsRCxNQUFNLEVBQUUsQ0FBQztnQkFDVCxNQUFNLEVBQUUsQ0FBQztnQkFDVCxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztvQkFDM0IsRUFBRSxDQUFDLENBQUMsRUFBRSxRQUFRLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDcEIsS0FBSyxDQUFDO29CQUNSLENBQUM7Z0JBQ0gsQ0FBQztZQUNILENBQUM7WUFDRCxJQUFJLE9BQU8sR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxZQUFZO2dCQUNqRSxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDbkUsVUFBVSxHQUFHLFNBQU0sT0FBTyxRQUFJLENBQUM7UUFDakMsQ0FBQztRQUNELE1BQU0sQ0FBQyxLQUFHLElBQUksQ0FBQyxHQUFHLEdBQUcsVUFBVSxVQUFLLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBTyxDQUFDO0lBQ3hELENBQUM7SUFDSCxpQkFBQztBQUFELENBQUMsQUExQ0QsSUEwQ0M7QUExQ3FCLGtCQUFVLGFBMEMvQixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtpc1ByZXNlbnR9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZyc7XG5cbmV4cG9ydCBjbGFzcyBQYXJzZUxvY2F0aW9uIHtcbiAgY29uc3RydWN0b3IocHVibGljIGZpbGU6IFBhcnNlU291cmNlRmlsZSwgcHVibGljIG9mZnNldDogbnVtYmVyLCBwdWJsaWMgbGluZTogbnVtYmVyLFxuICAgICAgICAgICAgICBwdWJsaWMgY29sOiBudW1iZXIpIHt9XG5cbiAgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gaXNQcmVzZW50KHRoaXMub2Zmc2V0KSA/IGAke3RoaXMuZmlsZS51cmx9QCR7dGhpcy5saW5lfToke3RoaXMuY29sfWAgOiB0aGlzLmZpbGUudXJsO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBQYXJzZVNvdXJjZUZpbGUge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgY29udGVudDogc3RyaW5nLCBwdWJsaWMgdXJsOiBzdHJpbmcpIHt9XG59XG5cbmV4cG9ydCBjbGFzcyBQYXJzZVNvdXJjZVNwYW4ge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgc3RhcnQ6IFBhcnNlTG9jYXRpb24sIHB1YmxpYyBlbmQ6IFBhcnNlTG9jYXRpb24pIHt9XG5cbiAgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5zdGFydC5maWxlLmNvbnRlbnQuc3Vic3RyaW5nKHRoaXMuc3RhcnQub2Zmc2V0LCB0aGlzLmVuZC5vZmZzZXQpO1xuICB9XG59XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBQYXJzZUVycm9yIHtcbiAgY29uc3RydWN0b3IocHVibGljIHNwYW46IFBhcnNlU291cmNlU3BhbiwgcHVibGljIG1zZzogc3RyaW5nKSB7fVxuXG4gIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgdmFyIHNvdXJjZSA9IHRoaXMuc3Bhbi5zdGFydC5maWxlLmNvbnRlbnQ7XG4gICAgdmFyIGN0eFN0YXJ0ID0gdGhpcy5zcGFuLnN0YXJ0Lm9mZnNldDtcbiAgICB2YXIgY29udGV4dFN0ciA9ICcnO1xuICAgIGlmIChpc1ByZXNlbnQoY3R4U3RhcnQpKSB7XG4gICAgICBpZiAoY3R4U3RhcnQgPiBzb3VyY2UubGVuZ3RoIC0gMSkge1xuICAgICAgICBjdHhTdGFydCA9IHNvdXJjZS5sZW5ndGggLSAxO1xuICAgICAgfVxuICAgICAgdmFyIGN0eEVuZCA9IGN0eFN0YXJ0O1xuICAgICAgdmFyIGN0eExlbiA9IDA7XG4gICAgICB2YXIgY3R4TGluZXMgPSAwO1xuXG4gICAgICB3aGlsZSAoY3R4TGVuIDwgMTAwICYmIGN0eFN0YXJ0ID4gMCkge1xuICAgICAgICBjdHhTdGFydC0tO1xuICAgICAgICBjdHhMZW4rKztcbiAgICAgICAgaWYgKHNvdXJjZVtjdHhTdGFydF0gPT0gXCJcXG5cIikge1xuICAgICAgICAgIGlmICgrK2N0eExpbmVzID09IDMpIHtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjdHhMZW4gPSAwO1xuICAgICAgY3R4TGluZXMgPSAwO1xuICAgICAgd2hpbGUgKGN0eExlbiA8IDEwMCAmJiBjdHhFbmQgPCBzb3VyY2UubGVuZ3RoIC0gMSkge1xuICAgICAgICBjdHhFbmQrKztcbiAgICAgICAgY3R4TGVuKys7XG4gICAgICAgIGlmIChzb3VyY2VbY3R4RW5kXSA9PSBcIlxcblwiKSB7XG4gICAgICAgICAgaWYgKCsrY3R4TGluZXMgPT0gMykge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBsZXQgY29udGV4dCA9IHNvdXJjZS5zdWJzdHJpbmcoY3R4U3RhcnQsIHRoaXMuc3Bhbi5zdGFydC5vZmZzZXQpICsgJ1tFUlJPUiAtPl0nICtcbiAgICAgICAgICAgICAgICAgICAgc291cmNlLnN1YnN0cmluZyh0aGlzLnNwYW4uc3RhcnQub2Zmc2V0LCBjdHhFbmQgKyAxKTtcbiAgICAgIGNvbnRleHRTdHIgPSBgIChcIiR7Y29udGV4dH1cIilgO1xuICAgIH1cbiAgICByZXR1cm4gYCR7dGhpcy5tc2d9JHtjb250ZXh0U3RyfTogJHt0aGlzLnNwYW4uc3RhcnR9YDtcbiAgfVxufVxuIl19