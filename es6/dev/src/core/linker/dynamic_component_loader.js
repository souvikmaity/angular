var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from 'angular2/src/core/di';
import { ComponentResolver } from './component_resolver';
import { isPresent } from 'angular2/src/facade/lang';
/**
 * Service for instantiating a Component and attaching it to a View at a specified location.
 */
export class DynamicComponentLoader {
}
export let DynamicComponentLoader_ = class DynamicComponentLoader_ extends DynamicComponentLoader {
    constructor(_compiler) {
        super();
        this._compiler = _compiler;
    }
    loadAsRoot(type, overrideSelectorOrNode, injector, onDispose, projectableNodes) {
        return this._compiler.resolveComponent(type).then(componentFactory => {
            var componentRef = componentFactory.create(injector, projectableNodes, isPresent(overrideSelectorOrNode) ? overrideSelectorOrNode : componentFactory.selector);
            if (isPresent(onDispose)) {
                componentRef.onDestroy(onDispose);
            }
            return componentRef;
        });
    }
    loadNextToLocation(type, location, injector = null, projectableNodes = null) {
        return this._compiler.resolveComponent(type).then(componentFactory => {
            return location.createComponent(componentFactory, location.length, injector, projectableNodes);
        });
    }
};
DynamicComponentLoader_ = __decorate([
    Injectable(), 
    __metadata('design:paramtypes', [ComponentResolver])
], DynamicComponentLoader_);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHluYW1pY19jb21wb25lbnRfbG9hZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGlmZmluZ19wbHVnaW5fd3JhcHBlci1vdXRwdXRfcGF0aC1XNnNIQU9IVC50bXAvYW5ndWxhcjIvc3JjL2NvcmUvbGlua2VyL2R5bmFtaWNfY29tcG9uZW50X2xvYWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7T0FBTyxFQUFXLFVBQVUsRUFBQyxNQUFNLHNCQUFzQjtPQUNsRCxFQUFDLGlCQUFpQixFQUFDLE1BQU0sc0JBQXNCO09BQy9DLEVBQTBCLFNBQVMsRUFBQyxNQUFNLDBCQUEwQjtBQUkzRTs7R0FFRztBQUNIO0FBZ0dBLENBQUM7QUFHRCwyRUFBNkMsc0JBQXNCO0lBQ2pFLFlBQW9CLFNBQTRCO1FBQUksT0FBTyxDQUFDO1FBQXhDLGNBQVMsR0FBVCxTQUFTLENBQW1CO0lBQWEsQ0FBQztJQUU5RCxVQUFVLENBQUMsSUFBVSxFQUFFLHNCQUFvQyxFQUFFLFFBQWtCLEVBQ3BFLFNBQXNCLEVBQUUsZ0JBQTBCO1FBQzNELE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxnQkFBZ0I7WUFDaEUsSUFBSSxZQUFZLEdBQUcsZ0JBQWdCLENBQUMsTUFBTSxDQUN0QyxRQUFRLEVBQUUsZ0JBQWdCLEVBQzFCLFNBQVMsQ0FBQyxzQkFBc0IsQ0FBQyxHQUFHLHNCQUFzQixHQUFHLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzVGLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3pCLFlBQVksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDcEMsQ0FBQztZQUNELE1BQU0sQ0FBQyxZQUFZLENBQUM7UUFDdEIsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsa0JBQWtCLENBQUMsSUFBVSxFQUFFLFFBQTBCLEVBQUUsUUFBUSxHQUFhLElBQUksRUFDakUsZ0JBQWdCLEdBQVksSUFBSTtRQUNqRCxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCO1lBQ2hFLE1BQU0sQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLGdCQUFnQixFQUFFLFFBQVEsQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUMzQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBQ3BELENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztBQUNILENBQUM7QUF4QkQ7SUFBQyxVQUFVLEVBQUU7OzJCQUFBO0FBd0JaIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtJbmplY3RvciwgSW5qZWN0YWJsZX0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvZGknO1xuaW1wb3J0IHtDb21wb25lbnRSZXNvbHZlcn0gZnJvbSAnLi9jb21wb25lbnRfcmVzb2x2ZXInO1xuaW1wb3J0IHtpc1R5cGUsIFR5cGUsIHN0cmluZ2lmeSwgaXNQcmVzZW50fSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2xhbmcnO1xuaW1wb3J0IHtDb21wb25lbnRSZWZ9IGZyb20gJy4vY29tcG9uZW50X2ZhY3RvcnknO1xuaW1wb3J0IHtWaWV3Q29udGFpbmVyUmVmfSBmcm9tICcuL3ZpZXdfY29udGFpbmVyX3JlZic7XG5cbi8qKlxuICogU2VydmljZSBmb3IgaW5zdGFudGlhdGluZyBhIENvbXBvbmVudCBhbmQgYXR0YWNoaW5nIGl0IHRvIGEgVmlldyBhdCBhIHNwZWNpZmllZCBsb2NhdGlvbi5cbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIER5bmFtaWNDb21wb25lbnRMb2FkZXIge1xuICAvKipcbiAgICogQ3JlYXRlcyBhbiBpbnN0YW5jZSBvZiBhIENvbXBvbmVudCBgdHlwZWAgYW5kIGF0dGFjaGVzIGl0IHRvIHRoZSBmaXJzdCBlbGVtZW50IGluIHRoZVxuICAgKiBwbGF0Zm9ybS1zcGVjaWZpYyBnbG9iYWwgdmlldyB0aGF0IG1hdGNoZXMgdGhlIGNvbXBvbmVudCdzIHNlbGVjdG9yLlxuICAgKlxuICAgKiBJbiBhIGJyb3dzZXIgdGhlIHBsYXRmb3JtLXNwZWNpZmljIGdsb2JhbCB2aWV3IGlzIHRoZSBtYWluIERPTSBEb2N1bWVudC5cbiAgICpcbiAgICogSWYgbmVlZGVkLCB0aGUgY29tcG9uZW50J3Mgc2VsZWN0b3IgY2FuIGJlIG92ZXJyaWRkZW4gdmlhIGBvdmVycmlkZVNlbGVjdG9yYC5cbiAgICpcbiAgICogWW91IGNhbiBvcHRpb25hbGx5IHByb3ZpZGUgYGluamVjdG9yYCBhbmQgdGhpcyB7QGxpbmsgSW5qZWN0b3J9IHdpbGwgYmUgdXNlZCB0byBpbnN0YW50aWF0ZSB0aGVcbiAgICogQ29tcG9uZW50LlxuICAgKlxuICAgKiBUbyBiZSBub3RpZmllZCB3aGVuIHRoaXMgQ29tcG9uZW50IGluc3RhbmNlIGlzIGRlc3Ryb3llZCwgeW91IGNhbiBhbHNvIG9wdGlvbmFsbHkgcHJvdmlkZVxuICAgKiBgb25EaXNwb3NlYCBjYWxsYmFjay5cbiAgICpcbiAgICogUmV0dXJucyBhIHByb21pc2UgZm9yIHRoZSB7QGxpbmsgQ29tcG9uZW50UmVmfSByZXByZXNlbnRpbmcgdGhlIG5ld2x5IGNyZWF0ZWQgQ29tcG9uZW50LlxuICAgKlxuICAgKiAjIyMgRXhhbXBsZVxuICAgKlxuICAgKiBgYGBcbiAgICogQENvbXBvbmVudCh7XG4gICAqICAgc2VsZWN0b3I6ICdjaGlsZC1jb21wb25lbnQnLFxuICAgKiAgIHRlbXBsYXRlOiAnQ2hpbGQnXG4gICAqIH0pXG4gICAqIGNsYXNzIENoaWxkQ29tcG9uZW50IHtcbiAgICogfVxuICAgKlxuICAgKiBAQ29tcG9uZW50KHtcbiAgICogICBzZWxlY3RvcjogJ215LWFwcCcsXG4gICAqICAgdGVtcGxhdGU6ICdQYXJlbnQgKDxjaGlsZCBpZD1cImNoaWxkXCI+PC9jaGlsZD4pJ1xuICAgKiB9KVxuICAgKiBjbGFzcyBNeUFwcCB7XG4gICAqICAgY29uc3RydWN0b3IoZGNsOiBEeW5hbWljQ29tcG9uZW50TG9hZGVyLCBpbmplY3RvcjogSW5qZWN0b3IpIHtcbiAgICogICAgIGRjbC5sb2FkQXNSb290KENoaWxkQ29tcG9uZW50LCAnI2NoaWxkJywgaW5qZWN0b3IpO1xuICAgKiAgIH1cbiAgICogfVxuICAgKlxuICAgKiBib290c3RyYXAoTXlBcHApO1xuICAgKiBgYGBcbiAgICpcbiAgICogUmVzdWx0aW5nIERPTTpcbiAgICpcbiAgICogYGBgXG4gICAqIDxteS1hcHA+XG4gICAqICAgUGFyZW50IChcbiAgICogICAgIDxjaGlsZCBpZD1cImNoaWxkXCI+Q2hpbGQ8L2NoaWxkPlxuICAgKiAgIClcbiAgICogPC9teS1hcHA+XG4gICAqIGBgYFxuICAgKi9cbiAgYWJzdHJhY3QgbG9hZEFzUm9vdCh0eXBlOiBUeXBlLCBvdmVycmlkZVNlbGVjdG9yT3JOb2RlOiBzdHJpbmcgfCBhbnksIGluamVjdG9yOiBJbmplY3RvcixcbiAgICAgICAgICAgICAgICAgICAgICBvbkRpc3Bvc2U/OiAoKSA9PiB2b2lkLCBwcm9qZWN0YWJsZU5vZGVzPzogYW55W11bXSk6IFByb21pc2U8Q29tcG9uZW50UmVmPjtcblxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuIGluc3RhbmNlIG9mIGEgQ29tcG9uZW50IGFuZCBhdHRhY2hlcyBpdCB0byB0aGUgVmlldyBDb250YWluZXIgZm91bmQgYXQgdGhlXG4gICAqIGBsb2NhdGlvbmAgc3BlY2lmaWVkIGFzIHtAbGluayBWaWV3Q29udGFpbmVyUmVmfS5cbiAgICpcbiAgICogWW91IGNhbiBvcHRpb25hbGx5IHByb3ZpZGUgYHByb3ZpZGVyc2AgdG8gY29uZmlndXJlIHRoZSB7QGxpbmsgSW5qZWN0b3J9IHByb3Zpc2lvbmVkIGZvciB0aGlzXG4gICAqIENvbXBvbmVudCBJbnN0YW5jZS5cbiAgICpcbiAgICogUmV0dXJucyBhIHByb21pc2UgZm9yIHRoZSB7QGxpbmsgQ29tcG9uZW50UmVmfSByZXByZXNlbnRpbmcgdGhlIG5ld2x5IGNyZWF0ZWQgQ29tcG9uZW50LlxuICAgKlxuICAgKlxuICAgKiAjIyMgRXhhbXBsZVxuICAgKlxuICAgKiBgYGBcbiAgICogQENvbXBvbmVudCh7XG4gICAqICAgc2VsZWN0b3I6ICdjaGlsZC1jb21wb25lbnQnLFxuICAgKiAgIHRlbXBsYXRlOiAnQ2hpbGQnXG4gICAqIH0pXG4gICAqIGNsYXNzIENoaWxkQ29tcG9uZW50IHtcbiAgICogfVxuICAgKlxuICAgKiBAQ29tcG9uZW50KHtcbiAgICogICBzZWxlY3RvcjogJ215LWFwcCcsXG4gICAqICAgdGVtcGxhdGU6ICdQYXJlbnQnXG4gICAqIH0pXG4gICAqIGNsYXNzIE15QXBwIHtcbiAgICogICBjb25zdHJ1Y3RvcihkY2w6IER5bmFtaWNDb21wb25lbnRMb2FkZXIsIHZpZXdDb250YWluZXJSZWY6IFZpZXdDb250YWluZXJSZWYpIHtcbiAgICogICAgIGRjbC5sb2FkTmV4dFRvTG9jYXRpb24oQ2hpbGRDb21wb25lbnQsIHZpZXdDb250YWluZXJSZWYpO1xuICAgKiAgIH1cbiAgICogfVxuICAgKlxuICAgKiBib290c3RyYXAoTXlBcHApO1xuICAgKiBgYGBcbiAgICpcbiAgICogUmVzdWx0aW5nIERPTTpcbiAgICpcbiAgICogYGBgXG4gICAqIDxteS1hcHA+UGFyZW50PC9teS1hcHA+XG4gICAqIDxjaGlsZC1jb21wb25lbnQ+Q2hpbGQ8L2NoaWxkLWNvbXBvbmVudD5cbiAgICogYGBgXG4gICAqL1xuICBhYnN0cmFjdCBsb2FkTmV4dFRvTG9jYXRpb24odHlwZTogVHlwZSwgbG9jYXRpb246IFZpZXdDb250YWluZXJSZWYsIGluamVjdG9yPzogSW5qZWN0b3IsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9qZWN0YWJsZU5vZGVzPzogYW55W11bXSk6IFByb21pc2U8Q29tcG9uZW50UmVmPjtcbn1cblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIER5bmFtaWNDb21wb25lbnRMb2FkZXJfIGV4dGVuZHMgRHluYW1pY0NvbXBvbmVudExvYWRlciB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX2NvbXBpbGVyOiBDb21wb25lbnRSZXNvbHZlcikgeyBzdXBlcigpOyB9XG5cbiAgbG9hZEFzUm9vdCh0eXBlOiBUeXBlLCBvdmVycmlkZVNlbGVjdG9yT3JOb2RlOiBzdHJpbmcgfCBhbnksIGluamVjdG9yOiBJbmplY3RvcixcbiAgICAgICAgICAgICBvbkRpc3Bvc2U/OiAoKSA9PiB2b2lkLCBwcm9qZWN0YWJsZU5vZGVzPzogYW55W11bXSk6IFByb21pc2U8Q29tcG9uZW50UmVmPiB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbXBpbGVyLnJlc29sdmVDb21wb25lbnQodHlwZSkudGhlbihjb21wb25lbnRGYWN0b3J5ID0+IHtcbiAgICAgIHZhciBjb21wb25lbnRSZWYgPSBjb21wb25lbnRGYWN0b3J5LmNyZWF0ZShcbiAgICAgICAgICBpbmplY3RvciwgcHJvamVjdGFibGVOb2RlcyxcbiAgICAgICAgICBpc1ByZXNlbnQob3ZlcnJpZGVTZWxlY3Rvck9yTm9kZSkgPyBvdmVycmlkZVNlbGVjdG9yT3JOb2RlIDogY29tcG9uZW50RmFjdG9yeS5zZWxlY3Rvcik7XG4gICAgICBpZiAoaXNQcmVzZW50KG9uRGlzcG9zZSkpIHtcbiAgICAgICAgY29tcG9uZW50UmVmLm9uRGVzdHJveShvbkRpc3Bvc2UpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbXBvbmVudFJlZjtcbiAgICB9KTtcbiAgfVxuXG4gIGxvYWROZXh0VG9Mb2NhdGlvbih0eXBlOiBUeXBlLCBsb2NhdGlvbjogVmlld0NvbnRhaW5lclJlZiwgaW5qZWN0b3I6IEluamVjdG9yID0gbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgIHByb2plY3RhYmxlTm9kZXM6IGFueVtdW10gPSBudWxsKTogUHJvbWlzZTxDb21wb25lbnRSZWY+IHtcbiAgICByZXR1cm4gdGhpcy5fY29tcGlsZXIucmVzb2x2ZUNvbXBvbmVudCh0eXBlKS50aGVuKGNvbXBvbmVudEZhY3RvcnkgPT4ge1xuICAgICAgcmV0dXJuIGxvY2F0aW9uLmNyZWF0ZUNvbXBvbmVudChjb21wb25lbnRGYWN0b3J5LCBsb2NhdGlvbi5sZW5ndGgsIGluamVjdG9yLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9qZWN0YWJsZU5vZGVzKTtcbiAgICB9KTtcbiAgfVxufVxuIl19