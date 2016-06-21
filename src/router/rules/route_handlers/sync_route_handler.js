'use strict';"use strict";
var async_1 = require('angular2/src/facade/async');
var lang_1 = require('angular2/src/facade/lang');
var instruction_1 = require('../../instruction');
var SyncRouteHandler = (function () {
    function SyncRouteHandler(componentType /*Type | ComponentFactory*/, data) {
        this.componentType = componentType;
        /** @internal */
        this._resolvedComponent = null;
        this._resolvedComponent = async_1.PromiseWrapper.resolve(componentType);
        this.data = lang_1.isPresent(data) ? new instruction_1.RouteData(data) : instruction_1.BLANK_ROUTE_DATA;
    }
    SyncRouteHandler.prototype.resolveComponentType = function () { return this._resolvedComponent; };
    return SyncRouteHandler;
}());
exports.SyncRouteHandler = SyncRouteHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3luY19yb3V0ZV9oYW5kbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGlmZmluZ19wbHVnaW5fd3JhcHBlci1vdXRwdXRfcGF0aC1sYjdmZUJyei50bXAvYW5ndWxhcjIvc3JjL3JvdXRlci9ydWxlcy9yb3V0ZV9oYW5kbGVycy9zeW5jX3JvdXRlX2hhbmRsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHNCQUE2QiwyQkFBMkIsQ0FBQyxDQUFBO0FBQ3pELHFCQUF3QiwwQkFBMEIsQ0FBQyxDQUFBO0FBR25ELDRCQUEwQyxtQkFBbUIsQ0FBQyxDQUFBO0FBRTlEO0lBTUUsMEJBQW1CLGFBQWtCLENBQUMsMkJBQTJCLEVBQUUsSUFBMkI7UUFBM0Usa0JBQWEsR0FBYixhQUFhLENBQUs7UUFIckMsZ0JBQWdCO1FBQ2hCLHVCQUFrQixHQUFpQixJQUFJLENBQUM7UUFHdEMsSUFBSSxDQUFDLGtCQUFrQixHQUFHLHNCQUFjLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ2hFLElBQUksQ0FBQyxJQUFJLEdBQUcsZ0JBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLHVCQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsOEJBQWdCLENBQUM7SUFDdkUsQ0FBQztJQUVELCtDQUFvQixHQUFwQixjQUF1QyxNQUFNLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQztJQUMxRSx1QkFBQztBQUFELENBQUMsQUFaRCxJQVlDO0FBWlksd0JBQWdCLG1CQVk1QixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtQcm9taXNlV3JhcHBlcn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9hc3luYyc7XG5pbXBvcnQge2lzUHJlc2VudH0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9sYW5nJztcblxuaW1wb3J0IHtSb3V0ZUhhbmRsZXJ9IGZyb20gJy4vcm91dGVfaGFuZGxlcic7XG5pbXBvcnQge1JvdXRlRGF0YSwgQkxBTktfUk9VVEVfREFUQX0gZnJvbSAnLi4vLi4vaW5zdHJ1Y3Rpb24nO1xuXG5leHBvcnQgY2xhc3MgU3luY1JvdXRlSGFuZGxlciBpbXBsZW1lbnRzIFJvdXRlSGFuZGxlciB7XG4gIHB1YmxpYyBkYXRhOiBSb3V0ZURhdGE7XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfcmVzb2x2ZWRDb21wb25lbnQ6IFByb21pc2U8YW55PiA9IG51bGw7XG5cbiAgY29uc3RydWN0b3IocHVibGljIGNvbXBvbmVudFR5cGU6IGFueSAvKlR5cGUgfCBDb21wb25lbnRGYWN0b3J5Ki8sIGRhdGE/OiB7W2tleTogc3RyaW5nXTogYW55fSkge1xuICAgIHRoaXMuX3Jlc29sdmVkQ29tcG9uZW50ID0gUHJvbWlzZVdyYXBwZXIucmVzb2x2ZShjb21wb25lbnRUeXBlKTtcbiAgICB0aGlzLmRhdGEgPSBpc1ByZXNlbnQoZGF0YSkgPyBuZXcgUm91dGVEYXRhKGRhdGEpIDogQkxBTktfUk9VVEVfREFUQTtcbiAgfVxuXG4gIHJlc29sdmVDb21wb25lbnRUeXBlKCk6IFByb21pc2U8YW55PiB7IHJldHVybiB0aGlzLl9yZXNvbHZlZENvbXBvbmVudDsgfVxufVxuIl19