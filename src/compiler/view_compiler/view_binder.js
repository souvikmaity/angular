'use strict';"use strict";
var collection_1 = require('angular2/src/facade/collection');
var template_ast_1 = require('../template_ast');
var property_binder_1 = require('./property_binder');
var event_binder_1 = require('./event_binder');
var lifecycle_binder_1 = require('./lifecycle_binder');
function bindView(view, parsedTemplate) {
    var visitor = new ViewBinderVisitor(view);
    template_ast_1.templateVisitAll(visitor, parsedTemplate);
}
exports.bindView = bindView;
var ViewBinderVisitor = (function () {
    function ViewBinderVisitor(view) {
        this.view = view;
        this._nodeIndex = 0;
    }
    ViewBinderVisitor.prototype.visitBoundText = function (ast, parent) {
        var node = this.view.nodes[this._nodeIndex++];
        property_binder_1.bindRenderText(ast, node, this.view);
        return null;
    };
    ViewBinderVisitor.prototype.visitText = function (ast, parent) {
        this._nodeIndex++;
        return null;
    };
    ViewBinderVisitor.prototype.visitNgContent = function (ast, parent) { return null; };
    ViewBinderVisitor.prototype.visitElement = function (ast, parent) {
        var compileElement = this.view.nodes[this._nodeIndex++];
        var eventListeners = event_binder_1.collectEventListeners(ast.outputs, ast.directives, compileElement);
        property_binder_1.bindRenderInputs(ast.inputs, compileElement);
        event_binder_1.bindRenderOutputs(eventListeners);
        collection_1.ListWrapper.forEachWithIndex(ast.directives, function (directiveAst, index) {
            var directiveInstance = compileElement.directiveInstances[index];
            property_binder_1.bindDirectiveInputs(directiveAst, directiveInstance, compileElement);
            lifecycle_binder_1.bindDirectiveDetectChangesLifecycleCallbacks(directiveAst, directiveInstance, compileElement);
            property_binder_1.bindDirectiveHostProps(directiveAst, directiveInstance, compileElement);
            event_binder_1.bindDirectiveOutputs(directiveAst, directiveInstance, eventListeners);
        });
        template_ast_1.templateVisitAll(this, ast.children, compileElement);
        // afterContent and afterView lifecycles need to be called bottom up
        // so that children are notified before parents
        collection_1.ListWrapper.forEachWithIndex(ast.directives, function (directiveAst, index) {
            var directiveInstance = compileElement.directiveInstances[index];
            lifecycle_binder_1.bindDirectiveAfterContentLifecycleCallbacks(directiveAst.directive, directiveInstance, compileElement);
            lifecycle_binder_1.bindDirectiveAfterViewLifecycleCallbacks(directiveAst.directive, directiveInstance, compileElement);
            lifecycle_binder_1.bindDirectiveDestroyLifecycleCallbacks(directiveAst.directive, directiveInstance, compileElement);
        });
        return null;
    };
    ViewBinderVisitor.prototype.visitEmbeddedTemplate = function (ast, parent) {
        var compileElement = this.view.nodes[this._nodeIndex++];
        var eventListeners = event_binder_1.collectEventListeners(ast.outputs, ast.directives, compileElement);
        collection_1.ListWrapper.forEachWithIndex(ast.directives, function (directiveAst, index) {
            var directiveInstance = compileElement.directiveInstances[index];
            property_binder_1.bindDirectiveInputs(directiveAst, directiveInstance, compileElement);
            lifecycle_binder_1.bindDirectiveDetectChangesLifecycleCallbacks(directiveAst, directiveInstance, compileElement);
            event_binder_1.bindDirectiveOutputs(directiveAst, directiveInstance, eventListeners);
            lifecycle_binder_1.bindDirectiveAfterContentLifecycleCallbacks(directiveAst.directive, directiveInstance, compileElement);
            lifecycle_binder_1.bindDirectiveAfterViewLifecycleCallbacks(directiveAst.directive, directiveInstance, compileElement);
            lifecycle_binder_1.bindDirectiveDestroyLifecycleCallbacks(directiveAst.directive, directiveInstance, compileElement);
        });
        bindView(compileElement.embeddedView, ast.children);
        return null;
    };
    ViewBinderVisitor.prototype.visitAttr = function (ast, ctx) { return null; };
    ViewBinderVisitor.prototype.visitDirective = function (ast, ctx) { return null; };
    ViewBinderVisitor.prototype.visitEvent = function (ast, eventTargetAndNames) {
        return null;
    };
    ViewBinderVisitor.prototype.visitVariable = function (ast, ctx) { return null; };
    ViewBinderVisitor.prototype.visitDirectiveProperty = function (ast, context) { return null; };
    ViewBinderVisitor.prototype.visitElementProperty = function (ast, context) { return null; };
    return ViewBinderVisitor;
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlld19iaW5kZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkaWZmaW5nX3BsdWdpbl93cmFwcGVyLW91dHB1dF9wYXRoLWxiN2ZlQnJ6LnRtcC9hbmd1bGFyMi9zcmMvY29tcGlsZXIvdmlld19jb21waWxlci92aWV3X2JpbmRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsMkJBRU8sZ0NBQWdDLENBQUMsQ0FBQTtBQUN4Qyw2QkFpQk8saUJBQWlCLENBQUMsQ0FBQTtBQUN6QixnQ0FLTyxtQkFBbUIsQ0FBQyxDQUFBO0FBQzNCLDZCQUE2RSxnQkFBZ0IsQ0FBQyxDQUFBO0FBQzlGLGlDQU1PLG9CQUFvQixDQUFDLENBQUE7QUFJNUIsa0JBQXlCLElBQWlCLEVBQUUsY0FBNkI7SUFDdkUsSUFBSSxPQUFPLEdBQUcsSUFBSSxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMxQywrQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsY0FBYyxDQUFDLENBQUM7QUFDNUMsQ0FBQztBQUhlLGdCQUFRLFdBR3ZCLENBQUE7QUFFRDtJQUdFLDJCQUFtQixJQUFpQjtRQUFqQixTQUFJLEdBQUosSUFBSSxDQUFhO1FBRjVCLGVBQVUsR0FBVyxDQUFDLENBQUM7SUFFUSxDQUFDO0lBRXhDLDBDQUFjLEdBQWQsVUFBZSxHQUFpQixFQUFFLE1BQXNCO1FBQ3RELElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDO1FBQzlDLGdDQUFjLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDckMsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNkLENBQUM7SUFDRCxxQ0FBUyxHQUFULFVBQVUsR0FBWSxFQUFFLE1BQXNCO1FBQzVDLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUNsQixNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2QsQ0FB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QUFZLENBQUMsU0FBUyxFQUFFLGlCQUFpQixFQUN6QyxjQUFjLENBQUMsQ0FBQztZQUN6RCx5REFBc0MsQ0FBQyxZQUFZLENBQUMsU0FBUyxFQUFFLGlCQUFpQixFQUN6QyxjQUFjLENBQUMsQ0FBQztRQUN6RCxDQUFDLENBQUMsQ0FBQztRQUNILFFBQVEsQ0FBQyxjQUFjLENBQUMsWUFBWSxFQUFFLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNwRCxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVELHFDQUFTLEdBQVQsVUFBVSxHQUFZLEVBQUUsR0FBUSxJQUFTLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ3ZELDBDQUFjLEdBQWQsVUFBZSxHQUFpQixFQUFFLEdBQVEsSUFBUyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUNqRSxzQ0FBVSxHQUFWLFVBQVcsR0FBa0IsRUFBRSxtQkFBK0M7UUFDNUUsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRCx5Q0FBYSxHQUFiLFVBQWMsR0FBZ0IsRUFBRSxHQUFRLElBQVMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDL0Qsa0RBQXNCLEdBQXRCLFVBQXVCLEdBQThCLEVBQUUsT0FBWSxJQUFTLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQzFGLGdEQUFvQixHQUFwQixVQUFxQixHQUE0QixFQUFFLE9BQVksSUFBUyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUN4Rix3QkFBQztBQUFELENBQUMsQUF6RUQsSUF5RUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBMaXN0V3JhcHBlcixcbn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9jb2xsZWN0aW9uJztcbmltcG9ydCB7XG4gIFRlbXBsYXRlQXN0LFxuICBUZW1wbGF0ZUFzdFZpc2l0b3IsXG4gIE5nQ29udGVudEFzdCxcbiAgRW1iZWRkZWRUZW1wbGF0ZUFzdCxcbiAgRWxlbWVudEFzdCxcbiAgVmFyaWFibGVBc3QsXG4gIEJvdW5kRXZlbnRBc3QsXG4gIEJvdW5kRWxlbWVudFByb3BlcnR5QXN0LFxuICBBdHRyQXN0LFxuICBCb3VuZFRleHRBc3QsXG4gIFRleHRBc3QsXG4gIERpcmVjdGl2ZUFzdCxcbiAgQm91bmREaXJlY3RpdmVQcm9wZXJ0eUFzdCxcbiAgdGVtcGxhdGVWaXNpdEFsbCxcbiAgUHJvcGVydHlCaW5kaW5nVHlwZSxcbiAgUHJvdmlkZXJBc3Rcbn0gZnJvbSAnLi4vdGVtcGxhdGVfYXN0JztcbmltcG9ydCB7XG4gIGJpbmRSZW5kZXJUZXh0LFxuICBiaW5kUmVuZGVySW5wdXRzLFxuICBiaW5kRGlyZWN0aXZlSW5wdXRzLFxuICBiaW5kRGlyZWN0aXZlSG9zdFByb3BzXG59IGZyb20gJy4vcHJvcGVydHlfYmluZGVyJztcbmltcG9ydCB7YmluZFJlbmRlck91dHB1dHMsIGNvbGxlY3RFdmVudExpc3RlbmVycywgYmluZERpcmVjdGl2ZU91dHB1dHN9IGZyb20gJy4vZXZlbnRfYmluZGVyJztcbmltcG9ydCB7XG4gIGJpbmREaXJlY3RpdmVBZnRlckNvbnRlbnRMaWZlY3ljbGVDYWxsYmFja3MsXG4gIGJpbmREaXJlY3RpdmVBZnRlclZpZXdMaWZlY3ljbGVDYWxsYmFja3MsXG4gIGJpbmREaXJlY3RpdmVEZXN0cm95TGlmZWN5Y2xlQ2FsbGJhY2tzLFxuICBiaW5kUGlwZURlc3Ryb3lMaWZlY3ljbGVDYWxsYmFja3MsXG4gIGJpbmREaXJlY3RpdmVEZXRlY3RDaGFuZ2VzTGlmZWN5Y2xlQ2FsbGJhY2tzXG59IGZyb20gJy4vbGlmZWN5Y2xlX2JpbmRlcic7XG5pbXBvcnQge0NvbXBpbGVWaWV3fSBmcm9tICcuL2NvbXBpbGVfdmlldyc7XG5pbXBvcnQge0NvbXBpbGVFbGVtZW50LCBDb21waWxlTm9kZX0gZnJvbSAnLi9jb21waWxlX2VsZW1lbnQnO1xuXG5leHBvcnQgZnVuY3Rpb24gYmluZFZpZXcodmlldzogQ29tcGlsZVZpZXcsIHBhcnNlZFRlbXBsYXRlOiBUZW1wbGF0ZUFzdFtdKTogdm9pZCB7XG4gIHZhciB2aXNpdG9yID0gbmV3IFZpZXdCaW5kZXJWaXNpdG9yKHZpZXcpO1xuICB0ZW1wbGF0ZVZpc2l0QWxsKHZpc2l0b3IsIHBhcnNlZFRlbXBsYXRlKTtcbn1cblxuY2xhc3MgVmlld0JpbmRlclZpc2l0b3IgaW1wbGVtZW50cyBUZW1wbGF0ZUFzdFZpc2l0b3Ige1xuICBwcml2YXRlIF9ub2RlSW5kZXg6IG51bWJlciA9IDA7XG5cbiAgY29uc3RydWN0b3IocHVibGljIHZpZXc6IENvbXBpbGVWaWV3KSB7fVxuXG4gIHZpc2l0Qm91bmRUZXh0KGFzdDogQm91bmRUZXh0QXN0LCBwYXJlbnQ6IENvbXBpbGVFbGVtZW50KTogYW55IHtcbiAgICB2YXIgbm9kZSA9IHRoaXMudmlldy5ub2Rlc1t0aGlzLl9ub2RlSW5kZXgrK107XG4gICAgYmluZFJlbmRlclRleHQoYXN0LCBub2RlLCB0aGlzLnZpZXcpO1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHZpc2l0VGV4dChhc3Q6IFRleHRBc3QsIHBhcmVudDogQ29tcGlsZUVsZW1lbnQpOiBhbnkge1xuICAgIHRoaXMuX25vZGVJbmRleCsrO1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgdmlzaXROZ0NvbnRlbnQoYXN0OiBOZ0NvbnRlbnRBc3QsIHBhcmVudDogQ29tcGlsZUVsZW1lbnQpOiBhbnkgeyByZXR1cm4gbnVsbDsgfVxuXG4gIHZpc2l0RWxlbWVudChhc3Q6IEVsZW1lbnRBc3QsIHBhcmVudDogQ29tcGlsZUVsZW1lbnQpOiBhbnkge1xuICAgIHZhciBjb21waWxlRWxlbWVudCA9IDxDb21waWxlRWxlbWVudD50aGlzLnZpZXcubm9kZXNbdGhpcy5fbm9kZUluZGV4KytdO1xuICAgIHZhciBldmVudExpc3RlbmVycyA9IGNvbGxlY3RFdmVudExpc3RlbmVycyhhc3Qub3V0cHV0cywgYXN0LmRpcmVjdGl2ZXMsIGNvbXBpbGVFbGVtZW50KTtcbiAgICBiaW5kUmVuZGVySW5wdXRzKGFzdC5pbnB1dHMsIGNvbXBpbGVFbGVtZW50KTtcbiAgICBiaW5kUmVuZGVyT3V0cHV0cyhldmVudExpc3RlbmVycyk7XG4gICAgTGlzdFdyYXBwZXIuZm9yRWFjaFdpdGhJbmRleChhc3QuZGlyZWN0aXZlcywgKGRpcmVjdGl2ZUFzdCwgaW5kZXgpID0+IHtcbiAgICAgIHZhciBkaXJlY3RpdmVJbnN0YW5jZSA9IGNvbXBpbGVFbGVtZW50LmRpcmVjdGl2ZUluc3RhbmNlc1tpbmRleF07XG4gICAgICBiaW5kRGlyZWN0aXZlSW5wdXRzKGRpcmVjdGl2ZUFzdCwgZGlyZWN0aXZlSW5zdGFuY2UsIGNvbXBpbGVFbGVtZW50KTtcbiAgICAgIGJpbmREaXJlY3RpdmVEZXRlY3RDaGFuZ2VzTGlmZWN5Y2xlQ2FsbGJhY2tzKGRpcmVjdGl2ZUFzdCwgZGlyZWN0aXZlSW5zdGFuY2UsIGNvbXBpbGVFbGVtZW50KTtcblxuICAgICAgYmluZERpcmVjdGl2ZUhvc3RQcm9wcyhkaXJlY3RpdmVBc3QsIGRpcmVjdGl2ZUluc3RhbmNlLCBjb21waWxlRWxlbWVudCk7XG4gICAgICBiaW5kRGlyZWN0aXZlT3V0cHV0cyhkaXJlY3RpdmVBc3QsIGRpcmVjdGl2ZUluc3RhbmNlLCBldmVudExpc3RlbmVycyk7XG4gICAgfSk7XG4gICAgdGVtcGxhdGVWaXNpdEFsbCh0aGlzLCBhc3QuY2hpbGRyZW4sIGNvbXBpbGVFbGVtZW50KTtcbiAgICAvLyBhZnRlckNvbnRlbnQgYW5kIGFmdGVyVmlldyBsaWZlY3ljbGVzIG5lZWQgdG8gYmUgY2FsbGVkIGJvdHRvbSB1cFxuICAgIC8vIHNvIHRoYXQgY2hpbGRyZW4gYXJlIG5vdGlmaWVkIGJlZm9yZSBwYXJlbnRzXG4gICAgTGlzdFdyYXBwZXIuZm9yRWFjaFdpdGhJbmRleChhc3QuZGlyZWN0aXZlcywgKGRpcmVjdGl2ZUFzdCwgaW5kZXgpID0+IHtcbiAgICAgIHZhciBkaXJlY3RpdmVJbnN0YW5jZSA9IGNvbXBpbGVFbGVtZW50LmRpcmVjdGl2ZUluc3RhbmNlc1tpbmRleF07XG4gICAgICBiaW5kRGlyZWN0aXZlQWZ0ZXJDb250ZW50TGlmZWN5Y2xlQ2FsbGJhY2tzKGRpcmVjdGl2ZUFzdC5kaXJlY3RpdmUsIGRpcmVjdGl2ZUluc3RhbmNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21waWxlRWxlbWVudCk7XG4gICAgICBiaW5kRGlyZWN0aXZlQWZ0ZXJWaWV3TGlmZWN5Y2xlQ2FsbGJhY2tzKGRpcmVjdGl2ZUFzdC5kaXJlY3RpdmUsIGRpcmVjdGl2ZUluc3RhbmNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21waWxlRWxlbWVudCk7XG4gICAgICBiaW5kRGlyZWN0aXZlRGVzdHJveUxpZmVjeWNsZUNhbGxiYWNrcyhkaXJlY3RpdmVBc3QuZGlyZWN0aXZlLCBkaXJlY3RpdmVJbnN0YW5jZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBpbGVFbGVtZW50KTtcbiAgICB9KTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHZpc2l0RW1iZWRkZWRUZW1wbGF0ZShhc3Q6IEVtYmVkZGVkVGVtcGxhdGVBc3QsIHBhcmVudDogQ29tcGlsZUVsZW1lbnQpOiBhbnkge1xuICAgIHZhciBjb21waWxlRWxlbWVudCA9IDxDb21waWxlRWxlbWVudD50aGlzLnZpZXcubm9kZXNbdGhpcy5fbm9kZUluZGV4KytdO1xuICAgIHZhciBldmVudExpc3RlbmVycyA9IGNvbGxlY3RFdmVudExpc3RlbmVycyhhc3Qub3V0cHV0cywgYXN0LmRpcmVjdGl2ZXMsIGNvbXBpbGVFbGVtZW50KTtcbiAgICBMaXN0V3JhcHBlci5mb3JFYWNoV2l0aEluZGV4KGFzdC5kaXJlY3RpdmVzLCAoZGlyZWN0aXZlQXN0LCBpbmRleCkgPT4ge1xuICAgICAgdmFyIGRpcmVjdGl2ZUluc3RhbmNlID0gY29tcGlsZUVsZW1lbnQuZGlyZWN0aXZlSW5zdGFuY2VzW2luZGV4XTtcbiAgICAgIGJpbmREaXJlY3RpdmVJbnB1dHMoZGlyZWN0aXZlQXN0LCBkaXJlY3RpdmVJbnN0YW5jZSwgY29tcGlsZUVsZW1lbnQpO1xuICAgICAgYmluZERpcmVjdGl2ZURldGVjdENoYW5nZXNMaWZlY3ljbGVDYWxsYmFja3MoZGlyZWN0aXZlQXN0LCBkaXJlY3RpdmVJbnN0YW5jZSwgY29tcGlsZUVsZW1lbnQpO1xuICAgICAgYmluZERpcmVjdGl2ZU91dHB1dHMoZGlyZWN0aXZlQXN0LCBkaXJlY3RpdmVJbnN0YW5jZSwgZXZlbnRMaXN0ZW5lcnMpO1xuICAgICAgYmluZERpcmVjdGl2ZUFmdGVyQ29udGVudExpZmVjeWNsZUNhbGxiYWNrcyhkaXJlY3RpdmVBc3QuZGlyZWN0aXZlLCBkaXJlY3RpdmVJbnN0YW5jZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcGlsZUVsZW1lbnQpO1xuICAgICAgYmluZERpcmVjdGl2ZUFmdGVyVmlld0xpZmVjeWNsZUNhbGxiYWNrcyhkaXJlY3RpdmVBc3QuZGlyZWN0aXZlLCBkaXJlY3RpdmVJbnN0YW5jZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcGlsZUVsZW1lbnQpO1xuICAgICAgYmluZERpcmVjdGl2ZURlc3Ryb3lMaWZlY3ljbGVDYWxsYmFja3MoZGlyZWN0aXZlQXN0LmRpcmVjdGl2ZSwgZGlyZWN0aXZlSW5zdGFuY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21waWxlRWxlbWVudCk7XG4gICAgfSk7XG4gICAgYmluZFZpZXcoY29tcGlsZUVsZW1lbnQuZW1iZWRkZWRWaWV3LCBhc3QuY2hpbGRyZW4pO1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgdmlzaXRBdHRyKGFzdDogQXR0ckFzdCwgY3R4OiBhbnkpOiBhbnkgeyByZXR1cm4gbnVsbDsgfVxuICB2aXNpdERpcmVjdGl2ZShhc3Q6IERpcmVjdGl2ZUFzdCwgY3R4OiBhbnkpOiBhbnkgeyByZXR1cm4gbnVsbDsgfVxuICB2aXNpdEV2ZW50KGFzdDogQm91bmRFdmVudEFzdCwgZXZlbnRUYXJnZXRBbmROYW1lczogTWFwPHN0cmluZywgQm91bmRFdmVudEFzdD4pOiBhbnkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgdmlzaXRWYXJpYWJsZShhc3Q6IFZhcmlhYmxlQXN0LCBjdHg6IGFueSk6IGFueSB7IHJldHVybiBudWxsOyB9XG4gIHZpc2l0RGlyZWN0aXZlUHJvcGVydHkoYXN0OiBCb3VuZERpcmVjdGl2ZVByb3BlcnR5QXN0LCBjb250ZXh0OiBhbnkpOiBhbnkgeyByZXR1cm4gbnVsbDsgfVxuICB2aXNpdEVsZW1lbnRQcm9wZXJ0eShhc3Q6IEJvdW5kRWxlbWVudFByb3BlcnR5QXN0LCBjb250ZXh0OiBhbnkpOiBhbnkgeyByZXR1cm4gbnVsbDsgfVxufVxuIl19