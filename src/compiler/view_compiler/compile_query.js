'use strict';"use strict";
var lang_1 = require('angular2/src/facade/lang');
var collection_1 = require('angular2/src/facade/collection');
var o = require('../output/output_ast');
var identifiers_1 = require('../identifiers');
var util_1 = require('./util');
var ViewQueryValues = (function () {
    function ViewQueryValues(view, values) {
        this.view = view;
        this.values = values;
    }
    return ViewQueryValues;
}());
var CompileQuery = (function () {
    function CompileQuery(meta, queryList, ownerDirectiveExpression, view) {
        this.meta = meta;
        this.queryList = queryList;
        this.ownerDirectiveExpression = ownerDirectiveExpression;
        this.view = view;
        this._values = new ViewQueryValues(view, []);
    }
    CompileQuery.prototype.addValue = function (value, view) {
        var currentView = view;
        var elPath = [];
        var viewPath = [];
        while (lang_1.isPresent(currentView) && currentView !== this.view) {
            var parentEl = currentView.declarationElement;
            elPath.unshift(parentEl);
            currentView = parentEl.view;
            viewPath.push(currentView);
        }
        var queryListForDirtyExpr = util_1.getPropertyInView(this.queryList, viewPath);
        var viewValues = this._values;
        elPath.forEach(function (el) {
            var last = viewValues.values.length > 0 ? viewValues.values[viewValues.values.length - 1] : null;
            if (last instanceof ViewQueryValues && last.view === el.embeddedView) {
                viewValues = last;
            }
            else {
                var newViewValues = new ViewQueryValues(el.embeddedView, []);
                viewValues.values.push(newViewValues);
                viewValues = newViewValues;
            }
        });
        viewValues.values.push(value);
        if (elPath.length > 0) {
            view.dirtyParentQueriesMethod.addStmt(queryListForDirtyExpr.callMethod('setDirty', []).toStmt());
        }
    };
    CompileQuery.prototype._isStatic = function () {
        var isStatic = true;
        this._values.values.forEach(function (value) {
            if (value instanceof ViewQueryValues) {
                // querying a nested view makes the query content dynamic
                isStatic = false;
            }
        });
        return isStatic;
    };
    CompileQuery.prototype.afterChildren = function (targetStaticMethod, targetDynamicMethod) {
        var values = createQueryValues(this._values);
        var updateStmts = [this.queryList.callMethod('reset', [o.literalArr(values)]).toStmt()];
        if (lang_1.isPresent(this.ownerDirectiveExpression)) {
            var valueExpr = this.meta.first ? this.queryList.prop('first') : this.queryList;
            updateStmts.push(this.ownerDirectiveExpression.prop(this.meta.propertyName).set(valueExpr).toStmt());
        }
        if (!this.meta.first) {
            updateStmts.push(this.queryList.callMethod('notifyOnChanges', []).toStmt());
        }
        if (this.meta.first && this._isStatic()) {
            // for queries that don't change and the user asked for a single element,
            // set it immediately. That is e.g. needed for querying for ViewContainerRefs, ...
            // we don't do this for QueryLists for now as this would break the timing when
            // we call QueryList listeners...
            targetStaticMethod.addStmts(updateStmts);
        }
        else {
            targetDynamicMethod.addStmt(new o.IfStmt(this.queryList.prop('dirty'), updateStmts));
        }
    };
    return CompileQuery;
}());
exports.CompileQuery = CompileQuery;
function createQueryValues(viewValues) {
    return collection_1.ListWrapper.flatten(viewValues.values.map(function (entry) {
        if (entry instanceof ViewQueryValues) {
            return mapNestedViews(entry.view.declarationElement.appElement, entry.view, createQueryValues(entry));
        }
        else {
            return entry;
        }
    }));
}
function mapNestedViews(declarationAppElement, view, expressions) {
    var adjustedExpressions = expressions.map(function (expr) {
        return o.replaceVarInExpression(o.THIS_EXPR.name, o.variable('nestedView'), expr);
    });
    return declarationAppElement.callMethod('mapNestedViews', [
        o.variable(view.className),
        o.fn([new o.FnParam('nestedView', view.classType)], [new o.ReturnStatement(o.literalArr(adjustedExpressions))])
    ]);
}
function createQueryList(query, directiveInstance, propertyName, compileView) {
    compileView.fields.push(new o.ClassField(propertyName, o.importType(identifiers_1.Identifiers.QueryList), [o.StmtModifier.Private]));
    var expr = o.THIS_EXPR.prop(propertyName);
    compileView.createMethod.addStmt(o.THIS_EXPR.prop(propertyName)
        .set(o.importExpr(identifiers_1.Identifiers.QueryList).instantiate([]))
        .toStmt());
    return expr;
}
exports.createQueryList = createQueryList;
function addQueryToTokenMap(map, query) {
    query.meta.selectors.forEach(function (selector) {
        var entry = map.get(selector);
        if (lang_1.isBlank(entry)) {
            entry = [];
            map.add(selector, entry);
        }
        entry.push(query);
    });
}
exports.addQueryToTokenMap = addQueryToTokenMap;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsZV9xdWVyeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtbGI3ZmVCcnoudG1wL2FuZ3VsYXIyL3NyYy9jb21waWxlci92aWV3X2NvbXBpbGVyL2NvbXBpbGVfcXVlcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHFCQUFpQywwQkFBMEIsQ0FBQyxDQUFBO0FBQzVELDJCQUEwQixnQ0FBZ0MsQ0FBQyxDQUFBO0FBRTNELElBQVksQ0FBQyxXQUFNLHNCQUFzQixDQUFDLENBQUE7QUFDMUMsNEJBQTBCLGdCQUFnQixDQUFDLENBQUE7QUFXM0MscUJBQWdDLFFBQVEsQ0FBQyxDQUFBO0FBRXpDO0lBQ0UseUJBQW1CLElBQWlCLEVBQVMsTUFBNkM7UUFBdkUsU0FBSSxHQUFKLElBQUksQ0FBYTtRQUFTLFdBQU0sR0FBTixNQUFNLENBQXVDO0lBQUcsQ0FBQztJQUNoRyxzQkFBQztBQUFELENBQUMsQUFGRCxJQUVDO0FBRUQ7SUFHRSxzQkFBbUIsSUFBMEIsRUFBUyxTQUF1QixFQUMxRCx3QkFBc0MsRUFBUyxJQUFpQjtRQURoRSxTQUFJLEdBQUosSUFBSSxDQUFzQjtRQUFTLGNBQVMsR0FBVCxTQUFTLENBQWM7UUFDMUQsNkJBQXdCLEdBQXhCLHdCQUF3QixDQUFjO1FBQVMsU0FBSSxHQUFKLElBQUksQ0FBYTtRQUNqRixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksZUFBZSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztJQUMvQyxDQUFDO0lBRUQsK0JBQVEsR0FBUixVQUFTLEtBQW1CLEVBQUUsSUFBaUI7UUFDN0MsSUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDO1FBQ3ZCLElBQUksTUFBTSxHQUFxQixFQUFFLENBQUM7UUFDbEMsSUFBSSxRQUFRLEdBQWtCLEVBQUUsQ0FBQztRQUNqQyxPQUFPLGdCQUFTLENBQUMsV0FBVyxDQUFDLElBQUksV0FBVyxLQUFLLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUMzRCxJQUFJLFFBQVEsR0FBRyxXQUFXLENBQUMsa0JBQWtCLENBQUM7WUFDOUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUN6QixXQUFXLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQztZQUM1QixRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQzdCLENBQUM7UUFDRCxJQUFJLHFCQUFxQixHQUFHLHdCQUFpQixDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFFeEUsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUM5QixNQUFNLENBQUMsT0FBTyxDQUFDLFVBQUMsRUFBRTtZQUNoQixJQUFJLElBQUksR0FDSixVQUFVLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7WUFDMUYsRUFBRSxDQUFDLENBQUMsSUFBSSxZQUFZLGVBQWUsSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLEVBQUUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO2dCQUNyRSxVQUFVLEdBQUcsSUFBSSxDQUFDO1lBQ3BCLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDTixJQUFJLGFBQWEsR0FBRyxJQUFJLGVBQWUsQ0FBQyxFQUFFLENBQUMsWUFBWSxFQUFFLEVBQUUsQ0FBQyxDQUFDO2dCQUM3RCxVQUFVLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztnQkFDdEMsVUFBVSxHQUFHLGFBQWEsQ0FBQztZQUM3QixDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFDSCxVQUFVLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUU5QixFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdEIsSUFBSSxDQUFDLHdCQUF3QixDQUFDLE9BQU8sQ0FDakMscUJBQXFCLENBQUMsVUFBVSxDQUFDLFVBQVUsRUFBRSxFQUFFLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO1FBQ2pFLENBQUM7SUFDSCxDQUFDO0lBRU8sZ0NBQVMsR0FBakI7UUFDRSxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUM7UUFDcEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQUMsS0FBSztZQUNoQyxFQUFFLENBQUMsQ0FBQyxLQUFLLFlBQVksZUFBZSxDQUFDLENBQUMsQ0FBQztnQkFDckMseURBQXlEO2dCQUN6RCxRQUFRLEdBQUcsS0FBSyxDQUFDO1lBQ25CLENBQUM7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUNILE1BQU0sQ0FBQyxRQUFRLENBQUM7SUFDbEIsQ0FBQztJQUVELG9DQUFhLEdBQWIsVUFBYyxrQkFBaUMsRUFBRSxtQkFBa0M7UUFDakYsSUFBSSxNQUFNLEdBQUcsaUJBQWlCLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzdDLElBQUksV0FBVyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztRQUN4RixFQUFFLENBQUMsQ0FBQyxnQkFBUyxDQUFDLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM3QyxJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO1lBQ2hGLFdBQVcsQ0FBQyxJQUFJLENBQ1osSUFBSSxDQUFDLHdCQUF3QixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO1FBQzFGLENBQUM7UUFDRCxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUNyQixXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLGlCQUFpQixFQUFFLEVBQUUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7UUFDOUUsQ0FBQztRQUNELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDeEMseUVBQXlFO1lBQ3pFLGtGQUFrRjtZQUNsRiw4RUFBOEU7WUFDOUUsaUNBQWlDO1lBQ2pDLGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUMzQyxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixtQkFBbUIsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLFdBQVcsQ0FBQyxDQUFDLENBQUM7UUFDdkYsQ0FBQztJQUNILENBQUM7SUFDSCxtQkFBQztBQUFELENBQUMsQUF4RUQsSUF3RUM7QUF4RVksb0JBQVksZUF3RXhCLENBQUE7QUFFRCwyQkFBMkIsVUFBMkI7SUFDcEQsTUFBTSxDQUFDLHdCQUFXLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFVBQUMsS0FBSztRQUNyRCxFQUFFLENBQUMsQ0FBQyxLQUFLLFlBQVksZUFBZSxDQUFDLENBQUMsQ0FBQztZQUNyQyxNQUFNLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxJQUFJLEVBQ3BELGlCQUFpQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDbEQsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sTUFBTSxDQUFlLEtBQUssQ0FBQztRQUM3QixDQUFDO0lBQ0gsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNOLENBQUM7QUFFRCx3QkFBd0IscUJBQW1DLEVBQUUsSUFBaUIsRUFDdEQsV0FBMkI7SUFDakQsSUFBSSxtQkFBbUIsR0FBbUIsV0FBVyxDQUFDLEdBQUcsQ0FBQyxVQUFDLElBQUk7UUFDN0QsTUFBTSxDQUFDLENBQUMsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3BGLENBQUMsQ0FBQyxDQUFDO0lBQ0gsTUFBTSxDQUFDLHFCQUFxQixDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsRUFBRTtRQUN4RCxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7UUFDMUIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQzdDLENBQUMsSUFBSSxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDakUsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUVELHlCQUFnQyxLQUEyQixFQUFFLGlCQUErQixFQUM1RCxZQUFvQixFQUFFLFdBQXdCO0lBQzVFLFdBQVcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLFVBQVUsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyx5QkFBVyxDQUFDLFNBQVMsQ0FBQyxFQUNqRCxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3BFLElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQzFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQztTQUN6QixHQUFHLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyx5QkFBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQztTQUN4RCxNQUFNLEVBQUUsQ0FBQyxDQUFDO0lBQ2hELE1BQU0sQ0FBQyxJQUFJLENBQUM7QUFDZCxDQUFDO0FBVGUsdUJBQWUsa0JBUzlCLENBQUE7QUFFRCw0QkFBbUMsR0FBb0MsRUFBRSxLQUFtQjtJQUMxRixLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsVUFBQyxRQUFRO1FBQ3BDLElBQUksS0FBSyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDOUIsRUFBRSxDQUFDLENBQUMsY0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNuQixLQUFLLEdBQUcsRUFBRSxDQUFDO1lBQ1gsR0FBRyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDM0IsQ0FBQztRQUNELEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDcEIsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBVGUsMEJBQWtCLHFCQVNqQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtpc1ByZXNlbnQsIGlzQmxhbmt9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZyc7XG5pbXBvcnQge0xpc3RXcmFwcGVyfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2NvbGxlY3Rpb24nO1xuXG5pbXBvcnQgKiBhcyBvIGZyb20gJy4uL291dHB1dC9vdXRwdXRfYXN0JztcbmltcG9ydCB7SWRlbnRpZmllcnN9IGZyb20gJy4uL2lkZW50aWZpZXJzJztcblxuaW1wb3J0IHtcbiAgQ29tcGlsZVF1ZXJ5TWV0YWRhdGEsXG4gIENvbXBpbGVJZGVudGlmaWVyTWV0YWRhdGEsXG4gIENvbXBpbGVUb2tlbk1hcFxufSBmcm9tICcuLi9jb21waWxlX21ldGFkYXRhJztcblxuaW1wb3J0IHtDb21waWxlVmlld30gZnJvbSAnLi9jb21waWxlX3ZpZXcnO1xuaW1wb3J0IHtDb21waWxlRWxlbWVudH0gZnJvbSAnLi9jb21waWxlX2VsZW1lbnQnO1xuaW1wb3J0IHtDb21waWxlTWV0aG9kfSBmcm9tICcuL2NvbXBpbGVfbWV0aG9kJztcbmltcG9ydCB7Z2V0UHJvcGVydHlJblZpZXd9IGZyb20gJy4vdXRpbCc7XG5cbmNsYXNzIFZpZXdRdWVyeVZhbHVlcyB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyB2aWV3OiBDb21waWxlVmlldywgcHVibGljIHZhbHVlczogQXJyYXk8by5FeHByZXNzaW9uIHwgVmlld1F1ZXJ5VmFsdWVzPikge31cbn1cblxuZXhwb3J0IGNsYXNzIENvbXBpbGVRdWVyeSB7XG4gIHByaXZhdGUgX3ZhbHVlczogVmlld1F1ZXJ5VmFsdWVzO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBtZXRhOiBDb21waWxlUXVlcnlNZXRhZGF0YSwgcHVibGljIHF1ZXJ5TGlzdDogby5FeHByZXNzaW9uLFxuICAgICAgICAgICAgICBwdWJsaWMgb3duZXJEaXJlY3RpdmVFeHByZXNzaW9uOiBvLkV4cHJlc3Npb24sIHB1YmxpYyB2aWV3OiBDb21waWxlVmlldykge1xuICAgIHRoaXMuX3ZhbHVlcyA9IG5ldyBWaWV3UXVlcnlWYWx1ZXModmlldywgW10pO1xuICB9XG5cbiAgYWRkVmFsdWUodmFsdWU6IG8uRXhwcmVzc2lvbiwgdmlldzogQ29tcGlsZVZpZXcpIHtcbiAgICB2YXIgY3VycmVudFZpZXcgPSB2aWV3O1xuICAgIHZhciBlbFBhdGg6IENvbXBpbGVFbGVtZW50W10gPSBbXTtcbiAgICB2YXIgdmlld1BhdGg6IENvbXBpbGVWaWV3W10gPSBbXTtcbiAgICB3aGlsZSAoaXNQcmVzZW50KGN1cnJlbnRWaWV3KSAmJiBjdXJyZW50VmlldyAhPT0gdGhpcy52aWV3KSB7XG4gICAgICB2YXIgcGFyZW50RWwgPSBjdXJyZW50Vmlldy5kZWNsYXJhdGlvbkVsZW1lbnQ7XG4gICAgICBlbFBhdGgudW5zaGlmdChwYXJlbnRFbCk7XG4gICAgICBjdXJyZW50VmlldyA9IHBhcmVudEVsLnZpZXc7XG4gICAgICB2aWV3UGF0aC5wdXNoKGN1cnJlbnRWaWV3KTtcbiAgICB9XG4gICAgdmFyIHF1ZXJ5TGlzdEZvckRpcnR5RXhwciA9IGdldFByb3BlcnR5SW5WaWV3KHRoaXMucXVlcnlMaXN0LCB2aWV3UGF0aCk7XG5cbiAgICB2YXIgdmlld1ZhbHVlcyA9IHRoaXMuX3ZhbHVlcztcbiAgICBlbFBhdGguZm9yRWFjaCgoZWwpID0+IHtcbiAgICAgIHZhciBsYXN0ID1cbiAgICAgICAgICB2aWV3VmFsdWVzLnZhbHVlcy5sZW5ndGggPiAwID8gdmlld1ZhbHVlcy52YWx1ZXNbdmlld1ZhbHVlcy52YWx1ZXMubGVuZ3RoIC0gMV0gOiBudWxsO1xuICAgICAgaWYgKGxhc3QgaW5zdGFuY2VvZiBWaWV3UXVlcnlWYWx1ZXMgJiYgbGFzdC52aWV3ID09PSBlbC5lbWJlZGRlZFZpZXcpIHtcbiAgICAgICAgdmlld1ZhbHVlcyA9IGxhc3Q7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgbmV3Vmlld1ZhbHVlcyA9IG5ldyBWaWV3UXVlcnlWYWx1ZXMoZWwuZW1iZWRkZWRWaWV3LCBbXSk7XG4gICAgICAgIHZpZXdWYWx1ZXMudmFsdWVzLnB1c2gobmV3Vmlld1ZhbHVlcyk7XG4gICAgICAgIHZpZXdWYWx1ZXMgPSBuZXdWaWV3VmFsdWVzO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHZpZXdWYWx1ZXMudmFsdWVzLnB1c2godmFsdWUpO1xuXG4gICAgaWYgKGVsUGF0aC5sZW5ndGggPiAwKSB7XG4gICAgICB2aWV3LmRpcnR5UGFyZW50UXVlcmllc01ldGhvZC5hZGRTdG10KFxuICAgICAgICAgIHF1ZXJ5TGlzdEZvckRpcnR5RXhwci5jYWxsTWV0aG9kKCdzZXREaXJ0eScsIFtdKS50b1N0bXQoKSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfaXNTdGF0aWMoKTogYm9vbGVhbiB7XG4gICAgdmFyIGlzU3RhdGljID0gdHJ1ZTtcbiAgICB0aGlzLl92YWx1ZXMudmFsdWVzLmZvckVhY2goKHZhbHVlKSA9PiB7XG4gICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBWaWV3UXVlcnlWYWx1ZXMpIHtcbiAgICAgICAgLy8gcXVlcnlpbmcgYSBuZXN0ZWQgdmlldyBtYWtlcyB0aGUgcXVlcnkgY29udGVudCBkeW5hbWljXG4gICAgICAgIGlzU3RhdGljID0gZmFsc2U7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGlzU3RhdGljO1xuICB9XG5cbiAgYWZ0ZXJDaGlsZHJlbih0YXJnZXRTdGF0aWNNZXRob2Q6IENvbXBpbGVNZXRob2QsIHRhcmdldER5bmFtaWNNZXRob2Q6IENvbXBpbGVNZXRob2QpIHtcbiAgICB2YXIgdmFsdWVzID0gY3JlYXRlUXVlcnlWYWx1ZXModGhpcy5fdmFsdWVzKTtcbiAgICB2YXIgdXBkYXRlU3RtdHMgPSBbdGhpcy5xdWVyeUxpc3QuY2FsbE1ldGhvZCgncmVzZXQnLCBbby5saXRlcmFsQXJyKHZhbHVlcyldKS50b1N0bXQoKV07XG4gICAgaWYgKGlzUHJlc2VudCh0aGlzLm93bmVyRGlyZWN0aXZlRXhwcmVzc2lvbikpIHtcbiAgICAgIHZhciB2YWx1ZUV4cHIgPSB0aGlzLm1ldGEuZmlyc3QgPyB0aGlzLnF1ZXJ5TGlzdC5wcm9wKCdmaXJzdCcpIDogdGhpcy5xdWVyeUxpc3Q7XG4gICAgICB1cGRhdGVTdG10cy5wdXNoKFxuICAgICAgICAgIHRoaXMub3duZXJEaXJlY3RpdmVFeHByZXNzaW9uLnByb3AodGhpcy5tZXRhLnByb3BlcnR5TmFtZSkuc2V0KHZhbHVlRXhwcikudG9TdG10KCkpO1xuICAgIH1cbiAgICBpZiAoIXRoaXMubWV0YS5maXJzdCkge1xuICAgICAgdXBkYXRlU3RtdHMucHVzaCh0aGlzLnF1ZXJ5TGlzdC5jYWxsTWV0aG9kKCdub3RpZnlPbkNoYW5nZXMnLCBbXSkudG9TdG10KCkpO1xuICAgIH1cbiAgICBpZiAodGhpcy5tZXRhLmZpcnN0ICYmIHRoaXMuX2lzU3RhdGljKCkpIHtcbiAgICAgIC8vIGZvciBxdWVyaWVzIHRoYXQgZG9uJ3QgY2hhbmdlIGFuZCB0aGUgdXNlciBhc2tlZCBmb3IgYSBzaW5nbGUgZWxlbWVudCxcbiAgICAgIC8vIHNldCBpdCBpbW1lZGlhdGVseS4gVGhhdCBpcyBlLmcuIG5lZWRlZCBmb3IgcXVlcnlpbmcgZm9yIFZpZXdDb250YWluZXJSZWZzLCAuLi5cbiAgICAgIC8vIHdlIGRvbid0IGRvIHRoaXMgZm9yIFF1ZXJ5TGlzdHMgZm9yIG5vdyBhcyB0aGlzIHdvdWxkIGJyZWFrIHRoZSB0aW1pbmcgd2hlblxuICAgICAgLy8gd2UgY2FsbCBRdWVyeUxpc3QgbGlzdGVuZXJzLi4uXG4gICAgICB0YXJnZXRTdGF0aWNNZXRob2QuYWRkU3RtdHModXBkYXRlU3RtdHMpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0YXJnZXREeW5hbWljTWV0aG9kLmFkZFN0bXQobmV3IG8uSWZTdG10KHRoaXMucXVlcnlMaXN0LnByb3AoJ2RpcnR5JyksIHVwZGF0ZVN0bXRzKSk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVF1ZXJ5VmFsdWVzKHZpZXdWYWx1ZXM6IFZpZXdRdWVyeVZhbHVlcyk6IG8uRXhwcmVzc2lvbltdIHtcbiAgcmV0dXJuIExpc3RXcmFwcGVyLmZsYXR0ZW4odmlld1ZhbHVlcy52YWx1ZXMubWFwKChlbnRyeSkgPT4ge1xuICAgIGlmIChlbnRyeSBpbnN0YW5jZW9mIFZpZXdRdWVyeVZhbHVlcykge1xuICAgICAgcmV0dXJuIG1hcE5lc3RlZFZpZXdzKGVudHJ5LnZpZXcuZGVjbGFyYXRpb25FbGVtZW50LmFwcEVsZW1lbnQsIGVudHJ5LnZpZXcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3JlYXRlUXVlcnlWYWx1ZXMoZW50cnkpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIDxvLkV4cHJlc3Npb24+ZW50cnk7XG4gICAgfVxuICB9KSk7XG59XG5cbmZ1bmN0aW9uIG1hcE5lc3RlZFZpZXdzKGRlY2xhcmF0aW9uQXBwRWxlbWVudDogby5FeHByZXNzaW9uLCB2aWV3OiBDb21waWxlVmlldyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGV4cHJlc3Npb25zOiBvLkV4cHJlc3Npb25bXSk6IG8uRXhwcmVzc2lvbiB7XG4gIHZhciBhZGp1c3RlZEV4cHJlc3Npb25zOiBvLkV4cHJlc3Npb25bXSA9IGV4cHJlc3Npb25zLm1hcCgoZXhwcikgPT4ge1xuICAgIHJldHVybiBvLnJlcGxhY2VWYXJJbkV4cHJlc3Npb24oby5USElTX0VYUFIubmFtZSwgby52YXJpYWJsZSgnbmVzdGVkVmlldycpLCBleHByKTtcbiAgfSk7XG4gIHJldHVybiBkZWNsYXJhdGlvbkFwcEVsZW1lbnQuY2FsbE1ldGhvZCgnbWFwTmVzdGVkVmlld3MnLCBbXG4gICAgby52YXJpYWJsZSh2aWV3LmNsYXNzTmFtZSksXG4gICAgby5mbihbbmV3IG8uRm5QYXJhbSgnbmVzdGVkVmlldycsIHZpZXcuY2xhc3NUeXBlKV0sXG4gICAgICAgICBbbmV3IG8uUmV0dXJuU3RhdGVtZW50KG8ubGl0ZXJhbEFycihhZGp1c3RlZEV4cHJlc3Npb25zKSldKVxuICBdKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVF1ZXJ5TGlzdChxdWVyeTogQ29tcGlsZVF1ZXJ5TWV0YWRhdGEsIGRpcmVjdGl2ZUluc3RhbmNlOiBvLkV4cHJlc3Npb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnR5TmFtZTogc3RyaW5nLCBjb21waWxlVmlldzogQ29tcGlsZVZpZXcpOiBvLkV4cHJlc3Npb24ge1xuICBjb21waWxlVmlldy5maWVsZHMucHVzaChuZXcgby5DbGFzc0ZpZWxkKHByb3BlcnR5TmFtZSwgby5pbXBvcnRUeXBlKElkZW50aWZpZXJzLlF1ZXJ5TGlzdCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW28uU3RtdE1vZGlmaWVyLlByaXZhdGVdKSk7XG4gIHZhciBleHByID0gby5USElTX0VYUFIucHJvcChwcm9wZXJ0eU5hbWUpO1xuICBjb21waWxlVmlldy5jcmVhdGVNZXRob2QuYWRkU3RtdChvLlRISVNfRVhQUi5wcm9wKHByb3BlcnR5TmFtZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zZXQoby5pbXBvcnRFeHByKElkZW50aWZpZXJzLlF1ZXJ5TGlzdCkuaW5zdGFudGlhdGUoW10pKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRvU3RtdCgpKTtcbiAgcmV0dXJuIGV4cHI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhZGRRdWVyeVRvVG9rZW5NYXAobWFwOiBDb21waWxlVG9rZW5NYXA8Q29tcGlsZVF1ZXJ5W10+LCBxdWVyeTogQ29tcGlsZVF1ZXJ5KSB7XG4gIHF1ZXJ5Lm1ldGEuc2VsZWN0b3JzLmZvckVhY2goKHNlbGVjdG9yKSA9PiB7XG4gICAgdmFyIGVudHJ5ID0gbWFwLmdldChzZWxlY3Rvcik7XG4gICAgaWYgKGlzQmxhbmsoZW50cnkpKSB7XG4gICAgICBlbnRyeSA9IFtdO1xuICAgICAgbWFwLmFkZChzZWxlY3RvciwgZW50cnkpO1xuICAgIH1cbiAgICBlbnRyeS5wdXNoKHF1ZXJ5KTtcbiAgfSk7XG59XG4iXX0=