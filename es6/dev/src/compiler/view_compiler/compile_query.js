import { isPresent, isBlank } from 'angular2/src/facade/lang';
import { ListWrapper } from 'angular2/src/facade/collection';
import * as o from '../output/output_ast';
import { Identifiers } from '../identifiers';
import { getPropertyInView } from './util';
class ViewQueryValues {
    constructor(view, values) {
        this.view = view;
        this.values = values;
    }
}
export class CompileQuery {
    constructor(meta, queryList, ownerDirectiveExpression, view) {
        this.meta = meta;
        this.queryList = queryList;
        this.ownerDirectiveExpression = ownerDirectiveExpression;
        this.view = view;
        this._values = new ViewQueryValues(view, []);
    }
    addValue(value, view) {
        var currentView = view;
        var elPath = [];
        var viewPath = [];
        while (isPresent(currentView) && currentView !== this.view) {
            var parentEl = currentView.declarationElement;
            elPath.unshift(parentEl);
            currentView = parentEl.view;
            viewPath.push(currentView);
        }
        var queryListForDirtyExpr = getPropertyInView(this.queryList, viewPath);
        var viewValues = this._values;
        elPath.forEach((el) => {
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
    }
    _isStatic() {
        var isStatic = true;
        this._values.values.forEach((value) => {
            if (value instanceof ViewQueryValues) {
                // querying a nested view makes the query content dynamic
                isStatic = false;
            }
        });
        return isStatic;
    }
    afterChildren(targetStaticMethod, targetDynamicMethod) {
        var values = createQueryValues(this._values);
        var updateStmts = [this.queryList.callMethod('reset', [o.literalArr(values)]).toStmt()];
        if (isPresent(this.ownerDirectiveExpression)) {
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
    }
}
function createQueryValues(viewValues) {
    return ListWrapper.flatten(viewValues.values.map((entry) => {
        if (entry instanceof ViewQueryValues) {
            return mapNestedViews(entry.view.declarationElement.appElement, entry.view, createQueryValues(entry));
        }
        else {
            return entry;
        }
    }));
}
function mapNestedViews(declarationAppElement, view, expressions) {
    var adjustedExpressions = expressions.map((expr) => {
        return o.replaceVarInExpression(o.THIS_EXPR.name, o.variable('nestedView'), expr);
    });
    return declarationAppElement.callMethod('mapNestedViews', [
        o.variable(view.className),
        o.fn([new o.FnParam('nestedView', view.classType)], [new o.ReturnStatement(o.literalArr(adjustedExpressions))])
    ]);
}
export function createQueryList(query, directiveInstance, propertyName, compileView) {
    compileView.fields.push(new o.ClassField(propertyName, o.importType(Identifiers.QueryList), [o.StmtModifier.Private]));
    var expr = o.THIS_EXPR.prop(propertyName);
    compileView.createMethod.addStmt(o.THIS_EXPR.prop(propertyName)
        .set(o.importExpr(Identifiers.QueryList).instantiate([]))
        .toStmt());
    return expr;
}
export function addQueryToTokenMap(map, query) {
    query.meta.selectors.forEach((selector) => {
        var entry = map.get(selector);
        if (isBlank(entry)) {
            entry = [];
            map.add(selector, entry);
        }
        entry.push(query);
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsZV9xdWVyeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtVzZzSEFPSFQudG1wL2FuZ3VsYXIyL3NyYy9jb21waWxlci92aWV3X2NvbXBpbGVyL2NvbXBpbGVfcXVlcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ik9BQU8sRUFBQyxTQUFTLEVBQUUsT0FBTyxFQUFDLE1BQU0sMEJBQTBCO09BQ3BELEVBQUMsV0FBVyxFQUFDLE1BQU0sZ0NBQWdDO09BRW5ELEtBQUssQ0FBQyxNQUFNLHNCQUFzQjtPQUNsQyxFQUFDLFdBQVcsRUFBQyxNQUFNLGdCQUFnQjtPQVduQyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sUUFBUTtBQUV4QztJQUNFLFlBQW1CLElBQWlCLEVBQVMsTUFBNkM7UUFBdkUsU0FBSSxHQUFKLElBQUksQ0FBYTtRQUFTLFdBQU0sR0FBTixNQUFNLENBQXVDO0lBQUcsQ0FBQztBQUNoRyxDQUFDO0FBRUQ7SUFHRSxZQUFtQixJQUEwQixFQUFTLFNBQXVCLEVBQzFELHdCQUFzQyxFQUFTLElBQWlCO1FBRGhFLFNBQUksR0FBSixJQUFJLENBQXNCO1FBQVMsY0FBUyxHQUFULFNBQVMsQ0FBYztRQUMxRCw2QkFBd0IsR0FBeEIsd0JBQXdCLENBQWM7UUFBUyxTQUFJLEdBQUosSUFBSSxDQUFhO1FBQ2pGLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxlQUFlLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQy9DLENBQUM7SUFFRCxRQUFRLENBQUMsS0FBbUIsRUFBRSxJQUFpQjtRQUM3QyxJQUFJLFdBQVcsR0FBRyxJQUFJLENBQUM7UUFDdkIsSUFBSSxNQUFNLEdBQXFCLEVBQUUsQ0FBQztRQUNsQyxJQUFJLFFBQVEsR0FBa0IsRUFBRSxDQUFDO1FBQ2pDLE9BQU8sU0FBUyxDQUFDLFdBQVcsQ0FBQyxJQUFJLFdBQVcsS0FBSyxJQUFJLENBQUMsSUFBSSxF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Q0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUM7U0FDekIsR0FBRyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQztTQUN4RCxNQUFNLEVBQUUsQ0FBQyxDQUFDO0lBQ2hELE1BQU0sQ0FBQyxJQUFJLENBQUM7QUFDZCxDQUFDO0FBRUQsbUNBQW1DLEdBQW9DLEVBQUUsS0FBbUI7SUFDMUYsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsUUFBUTtRQUNwQyxJQUFJLEtBQUssR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzlCLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbkIsS0FBSyxHQUFHLEVBQUUsQ0FBQztZQUNYLEdBQUcsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQzNCLENBQUM7UUFDRCxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3BCLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7aXNQcmVzZW50LCBpc0JsYW5rfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2xhbmcnO1xuaW1wb3J0IHtMaXN0V3JhcHBlcn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9jb2xsZWN0aW9uJztcblxuaW1wb3J0ICogYXMgbyBmcm9tICcuLi9vdXRwdXQvb3V0cHV0X2FzdCc7XG5pbXBvcnQge0lkZW50aWZpZXJzfSBmcm9tICcuLi9pZGVudGlmaWVycyc7XG5cbmltcG9ydCB7XG4gIENvbXBpbGVRdWVyeU1ldGFkYXRhLFxuICBDb21waWxlSWRlbnRpZmllck1ldGFkYXRhLFxuICBDb21waWxlVG9rZW5NYXBcbn0gZnJvbSAnLi4vY29tcGlsZV9tZXRhZGF0YSc7XG5cbmltcG9ydCB7Q29tcGlsZVZpZXd9IGZyb20gJy4vY29tcGlsZV92aWV3JztcbmltcG9ydCB7Q29tcGlsZUVsZW1lbnR9IGZyb20gJy4vY29tcGlsZV9lbGVtZW50JztcbmltcG9ydCB7Q29tcGlsZU1ldGhvZH0gZnJvbSAnLi9jb21waWxlX21ldGhvZCc7XG5pbXBvcnQge2dldFByb3BlcnR5SW5WaWV3fSBmcm9tICcuL3V0aWwnO1xuXG5jbGFzcyBWaWV3UXVlcnlWYWx1ZXMge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgdmlldzogQ29tcGlsZVZpZXcsIHB1YmxpYyB2YWx1ZXM6IEFycmF5PG8uRXhwcmVzc2lvbiB8IFZpZXdRdWVyeVZhbHVlcz4pIHt9XG59XG5cbmV4cG9ydCBjbGFzcyBDb21waWxlUXVlcnkge1xuICBwcml2YXRlIF92YWx1ZXM6IFZpZXdRdWVyeVZhbHVlcztcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgbWV0YTogQ29tcGlsZVF1ZXJ5TWV0YWRhdGEsIHB1YmxpYyBxdWVyeUxpc3Q6IG8uRXhwcmVzc2lvbixcbiAgICAgICAgICAgICAgcHVibGljIG93bmVyRGlyZWN0aXZlRXhwcmVzc2lvbjogby5FeHByZXNzaW9uLCBwdWJsaWMgdmlldzogQ29tcGlsZVZpZXcpIHtcbiAgICB0aGlzLl92YWx1ZXMgPSBuZXcgVmlld1F1ZXJ5VmFsdWVzKHZpZXcsIFtdKTtcbiAgfVxuXG4gIGFkZFZhbHVlKHZhbHVlOiBvLkV4cHJlc3Npb24sIHZpZXc6IENvbXBpbGVWaWV3KSB7XG4gICAgdmFyIGN1cnJlbnRWaWV3ID0gdmlldztcbiAgICB2YXIgZWxQYXRoOiBDb21waWxlRWxlbWVudFtdID0gW107XG4gICAgdmFyIHZpZXdQYXRoOiBDb21waWxlVmlld1tdID0gW107XG4gICAgd2hpbGUgKGlzUHJlc2VudChjdXJyZW50VmlldykgJiYgY3VycmVudFZpZXcgIT09IHRoaXMudmlldykge1xuICAgICAgdmFyIHBhcmVudEVsID0gY3VycmVudFZpZXcuZGVjbGFyYXRpb25FbGVtZW50O1xuICAgICAgZWxQYXRoLnVuc2hpZnQocGFyZW50RWwpO1xuICAgICAgY3VycmVudFZpZXcgPSBwYXJlbnRFbC52aWV3O1xuICAgICAgdmlld1BhdGgucHVzaChjdXJyZW50Vmlldyk7XG4gICAgfVxuICAgIHZhciBxdWVyeUxpc3RGb3JEaXJ0eUV4cHIgPSBnZXRQcm9wZXJ0eUluVmlldyh0aGlzLnF1ZXJ5TGlzdCwgdmlld1BhdGgpO1xuXG4gICAgdmFyIHZpZXdWYWx1ZXMgPSB0aGlzLl92YWx1ZXM7XG4gICAgZWxQYXRoLmZvckVhY2goKGVsKSA9PiB7XG4gICAgICB2YXIgbGFzdCA9XG4gICAgICAgICAgdmlld1ZhbHVlcy52YWx1ZXMubGVuZ3RoID4gMCA/IHZpZXdWYWx1ZXMudmFsdWVzW3ZpZXdWYWx1ZXMudmFsdWVzLmxlbmd0aCAtIDFdIDogbnVsbDtcbiAgICAgIGlmIChsYXN0IGluc3RhbmNlb2YgVmlld1F1ZXJ5VmFsdWVzICYmIGxhc3QudmlldyA9PT0gZWwuZW1iZWRkZWRWaWV3KSB7XG4gICAgICAgIHZpZXdWYWx1ZXMgPSBsYXN0O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIG5ld1ZpZXdWYWx1ZXMgPSBuZXcgVmlld1F1ZXJ5VmFsdWVzKGVsLmVtYmVkZGVkVmlldywgW10pO1xuICAgICAgICB2aWV3VmFsdWVzLnZhbHVlcy5wdXNoKG5ld1ZpZXdWYWx1ZXMpO1xuICAgICAgICB2aWV3VmFsdWVzID0gbmV3Vmlld1ZhbHVlcztcbiAgICAgIH1cbiAgICB9KTtcbiAgICB2aWV3VmFsdWVzLnZhbHVlcy5wdXNoKHZhbHVlKTtcblxuICAgIGlmIChlbFBhdGgubGVuZ3RoID4gMCkge1xuICAgICAgdmlldy5kaXJ0eVBhcmVudFF1ZXJpZXNNZXRob2QuYWRkU3RtdChcbiAgICAgICAgICBxdWVyeUxpc3RGb3JEaXJ0eUV4cHIuY2FsbE1ldGhvZCgnc2V0RGlydHknLCBbXSkudG9TdG10KCkpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX2lzU3RhdGljKCk6IGJvb2xlYW4ge1xuICAgIHZhciBpc1N0YXRpYyA9IHRydWU7XG4gICAgdGhpcy5fdmFsdWVzLnZhbHVlcy5mb3JFYWNoKCh2YWx1ZSkgPT4ge1xuICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgVmlld1F1ZXJ5VmFsdWVzKSB7XG4gICAgICAgIC8vIHF1ZXJ5aW5nIGEgbmVzdGVkIHZpZXcgbWFrZXMgdGhlIHF1ZXJ5IGNvbnRlbnQgZHluYW1pY1xuICAgICAgICBpc1N0YXRpYyA9IGZhbHNlO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBpc1N0YXRpYztcbiAgfVxuXG4gIGFmdGVyQ2hpbGRyZW4odGFyZ2V0U3RhdGljTWV0aG9kOiBDb21waWxlTWV0aG9kLCB0YXJnZXREeW5hbWljTWV0aG9kOiBDb21waWxlTWV0aG9kKSB7XG4gICAgdmFyIHZhbHVlcyA9IGNyZWF0ZVF1ZXJ5VmFsdWVzKHRoaXMuX3ZhbHVlcyk7XG4gICAgdmFyIHVwZGF0ZVN0bXRzID0gW3RoaXMucXVlcnlMaXN0LmNhbGxNZXRob2QoJ3Jlc2V0JywgW28ubGl0ZXJhbEFycih2YWx1ZXMpXSkudG9TdG10KCldO1xuICAgIGlmIChpc1ByZXNlbnQodGhpcy5vd25lckRpcmVjdGl2ZUV4cHJlc3Npb24pKSB7XG4gICAgICB2YXIgdmFsdWVFeHByID0gdGhpcy5tZXRhLmZpcnN0ID8gdGhpcy5xdWVyeUxpc3QucHJvcCgnZmlyc3QnKSA6IHRoaXMucXVlcnlMaXN0O1xuICAgICAgdXBkYXRlU3RtdHMucHVzaChcbiAgICAgICAgICB0aGlzLm93bmVyRGlyZWN0aXZlRXhwcmVzc2lvbi5wcm9wKHRoaXMubWV0YS5wcm9wZXJ0eU5hbWUpLnNldCh2YWx1ZUV4cHIpLnRvU3RtdCgpKTtcbiAgICB9XG4gICAgaWYgKCF0aGlzLm1ldGEuZmlyc3QpIHtcbiAgICAgIHVwZGF0ZVN0bXRzLnB1c2godGhpcy5xdWVyeUxpc3QuY2FsbE1ldGhvZCgnbm90aWZ5T25DaGFuZ2VzJywgW10pLnRvU3RtdCgpKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubWV0YS5maXJzdCAmJiB0aGlzLl9pc1N0YXRpYygpKSB7XG4gICAgICAvLyBmb3IgcXVlcmllcyB0aGF0IGRvbid0IGNoYW5nZSBhbmQgdGhlIHVzZXIgYXNrZWQgZm9yIGEgc2luZ2xlIGVsZW1lbnQsXG4gICAgICAvLyBzZXQgaXQgaW1tZWRpYXRlbHkuIFRoYXQgaXMgZS5nLiBuZWVkZWQgZm9yIHF1ZXJ5aW5nIGZvciBWaWV3Q29udGFpbmVyUmVmcywgLi4uXG4gICAgICAvLyB3ZSBkb24ndCBkbyB0aGlzIGZvciBRdWVyeUxpc3RzIGZvciBub3cgYXMgdGhpcyB3b3VsZCBicmVhayB0aGUgdGltaW5nIHdoZW5cbiAgICAgIC8vIHdlIGNhbGwgUXVlcnlMaXN0IGxpc3RlbmVycy4uLlxuICAgICAgdGFyZ2V0U3RhdGljTWV0aG9kLmFkZFN0bXRzKHVwZGF0ZVN0bXRzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGFyZ2V0RHluYW1pY01ldGhvZC5hZGRTdG10KG5ldyBvLklmU3RtdCh0aGlzLnF1ZXJ5TGlzdC5wcm9wKCdkaXJ0eScpLCB1cGRhdGVTdG10cykpO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBjcmVhdGVRdWVyeVZhbHVlcyh2aWV3VmFsdWVzOiBWaWV3UXVlcnlWYWx1ZXMpOiBvLkV4cHJlc3Npb25bXSB7XG4gIHJldHVybiBMaXN0V3JhcHBlci5mbGF0dGVuKHZpZXdWYWx1ZXMudmFsdWVzLm1hcCgoZW50cnkpID0+IHtcbiAgICBpZiAoZW50cnkgaW5zdGFuY2VvZiBWaWV3UXVlcnlWYWx1ZXMpIHtcbiAgICAgIHJldHVybiBtYXBOZXN0ZWRWaWV3cyhlbnRyeS52aWV3LmRlY2xhcmF0aW9uRWxlbWVudC5hcHBFbGVtZW50LCBlbnRyeS52aWV3LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNyZWF0ZVF1ZXJ5VmFsdWVzKGVudHJ5KSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiA8by5FeHByZXNzaW9uPmVudHJ5O1xuICAgIH1cbiAgfSkpO1xufVxuXG5mdW5jdGlvbiBtYXBOZXN0ZWRWaWV3cyhkZWNsYXJhdGlvbkFwcEVsZW1lbnQ6IG8uRXhwcmVzc2lvbiwgdmlldzogQ29tcGlsZVZpZXcsXG4gICAgICAgICAgICAgICAgICAgICAgICBleHByZXNzaW9uczogby5FeHByZXNzaW9uW10pOiBvLkV4cHJlc3Npb24ge1xuICB2YXIgYWRqdXN0ZWRFeHByZXNzaW9uczogby5FeHByZXNzaW9uW10gPSBleHByZXNzaW9ucy5tYXAoKGV4cHIpID0+IHtcbiAgICByZXR1cm4gby5yZXBsYWNlVmFySW5FeHByZXNzaW9uKG8uVEhJU19FWFBSLm5hbWUsIG8udmFyaWFibGUoJ25lc3RlZFZpZXcnKSwgZXhwcik7XG4gIH0pO1xuICByZXR1cm4gZGVjbGFyYXRpb25BcHBFbGVtZW50LmNhbGxNZXRob2QoJ21hcE5lc3RlZFZpZXdzJywgW1xuICAgIG8udmFyaWFibGUodmlldy5jbGFzc05hbWUpLFxuICAgIG8uZm4oW25ldyBvLkZuUGFyYW0oJ25lc3RlZFZpZXcnLCB2aWV3LmNsYXNzVHlwZSldLFxuICAgICAgICAgW25ldyBvLlJldHVyblN0YXRlbWVudChvLmxpdGVyYWxBcnIoYWRqdXN0ZWRFeHByZXNzaW9ucykpXSlcbiAgXSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVRdWVyeUxpc3QocXVlcnk6IENvbXBpbGVRdWVyeU1ldGFkYXRhLCBkaXJlY3RpdmVJbnN0YW5jZTogby5FeHByZXNzaW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eU5hbWU6IHN0cmluZywgY29tcGlsZVZpZXc6IENvbXBpbGVWaWV3KTogby5FeHByZXNzaW9uIHtcbiAgY29tcGlsZVZpZXcuZmllbGRzLnB1c2gobmV3IG8uQ2xhc3NGaWVsZChwcm9wZXJ0eU5hbWUsIG8uaW1wb3J0VHlwZShJZGVudGlmaWVycy5RdWVyeUxpc3QpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtvLlN0bXRNb2RpZmllci5Qcml2YXRlXSkpO1xuICB2YXIgZXhwciA9IG8uVEhJU19FWFBSLnByb3AocHJvcGVydHlOYW1lKTtcbiAgY29tcGlsZVZpZXcuY3JlYXRlTWV0aG9kLmFkZFN0bXQoby5USElTX0VYUFIucHJvcChwcm9wZXJ0eU5hbWUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc2V0KG8uaW1wb3J0RXhwcihJZGVudGlmaWVycy5RdWVyeUxpc3QpLmluc3RhbnRpYXRlKFtdKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50b1N0bXQoKSk7XG4gIHJldHVybiBleHByO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYWRkUXVlcnlUb1Rva2VuTWFwKG1hcDogQ29tcGlsZVRva2VuTWFwPENvbXBpbGVRdWVyeVtdPiwgcXVlcnk6IENvbXBpbGVRdWVyeSkge1xuICBxdWVyeS5tZXRhLnNlbGVjdG9ycy5mb3JFYWNoKChzZWxlY3RvcikgPT4ge1xuICAgIHZhciBlbnRyeSA9IG1hcC5nZXQoc2VsZWN0b3IpO1xuICAgIGlmIChpc0JsYW5rKGVudHJ5KSkge1xuICAgICAgZW50cnkgPSBbXTtcbiAgICAgIG1hcC5hZGQoc2VsZWN0b3IsIGVudHJ5KTtcbiAgICB9XG4gICAgZW50cnkucHVzaChxdWVyeSk7XG4gIH0pO1xufVxuIl19