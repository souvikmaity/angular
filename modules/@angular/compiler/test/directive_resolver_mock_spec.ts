/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Component, ComponentMetadata, Directive, Injector} from '@angular/core';
import {TestBed, inject} from '@angular/core/testing';

import {ViewMetadata} from '../core_private';
import {MockDirectiveResolver} from '../testing';

export function main() {
  describe('MockDirectiveResolver', () => {
    var dirResolver: MockDirectiveResolver;

    beforeEach(() => {
      TestBed.configureTestingModule(
          {declarations: [SomeDirective, SomeOtherDirective, SomeComponent]});
    });

    beforeEach(inject([Injector], (injector: Injector) => {
      dirResolver = new MockDirectiveResolver(injector);
    }));

    describe('Directive overriding', () => {
      it('should fallback to the default DirectiveResolver when templates are not overridden',
         () => {
           var ngModule = dirResolver.resolve(SomeComponent);
           expect(ngModule.selector).toEqual('cmp');
         });

      it('should allow overriding the @Directive', () => {
        dirResolver.setDirective(
            SomeComponent, new ComponentMetadata({selector: 'someOtherSelector'}));
        var metadata = dirResolver.resolve(SomeComponent);
        expect(metadata.selector).toEqual('someOtherSelector');
      });
    });

    describe('View overriding', () => {
      it('should fallback to the default ViewResolver when templates are not overridden', () => {
        var view = <ComponentMetadata>dirResolver.resolve(SomeComponent);
        expect(view.template).toEqual('template');
      });

      it('should allow overriding the @View', () => {
        dirResolver.setView(SomeComponent, new ViewMetadata({template: 'overridden template'}));
        var view = <ComponentMetadata>dirResolver.resolve(SomeComponent);
        expect(view.template).toEqual('overridden template');
      });

      it('should allow overriding a view after it has been resolved', () => {
        dirResolver.resolve(SomeComponent);
        dirResolver.setView(SomeComponent, new ViewMetadata({template: 'overridden template'}));
        var view = <ComponentMetadata>dirResolver.resolve(SomeComponent);
        expect(view.template).toEqual('overridden template');
      });
    });

    describe('inline template definition overriding', () => {
      it('should allow overriding the default template', () => {
        dirResolver.setInlineTemplate(SomeComponent, 'overridden template');
        var view = <ComponentMetadata>dirResolver.resolve(SomeComponent);
        expect(view.template).toEqual('overridden template');
      });

      it('should allow overriding an overridden @View', () => {
        dirResolver.setView(SomeComponent, new ViewMetadata({template: 'overridden template'}));
        dirResolver.setInlineTemplate(SomeComponent, 'overridden template x 2');
        var view = <ComponentMetadata>dirResolver.resolve(SomeComponent);
        expect(view.template).toEqual('overridden template x 2');
      });

      it('should allow overriding a view after it has been resolved', () => {
        dirResolver.resolve(SomeComponent);
        dirResolver.setInlineTemplate(SomeComponent, 'overridden template');
        var view = <ComponentMetadata>dirResolver.resolve(SomeComponent);
        expect(view.template).toEqual('overridden template');
      });
    });
  });
}

@Directive({selector: 'some-directive'})
class SomeDirective {
}

@Component({selector: 'cmp', template: 'template'})
class SomeComponent {
}

@Directive({selector: 'some-other-directive'})
class SomeOtherDirective {
}
