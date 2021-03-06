import { Injectable, ReflectiveInjector, Injector, ViewContainerRef, Directive, Input, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { LayerService } from './layer.service';

export interface LayerAttributes {
  [key: string]: any;
}

export class LayerResult<T> extends Observable<T> {
  constructor(public source: Observable<any>, private layerRef: LayerRef) {
    super();
  }

  close(data?: any) {
    this.layerRef.close();
  }

  closeWithError(data?: any) {
    this.layerRef.closeWithError();
  }
}

export abstract class LayerRef {

  visible: boolean;
  attrs: LayerAttributes | undefined;

  private stateChange = new Subject<{attrs?: LayerAttributes, visible: boolean}>();
  state$ = this.stateChange.asObservable();

  protected results: Subject<any> | undefined;

  open(attrs?: LayerAttributes): LayerResult<any> {
    this.visible = true;
    this.attrs = attrs;

    this.stateChange.next({attrs, visible: true});

    if (this.results) {
      this.results.complete();
    }
    this.results = new Subject<any>();
    return new LayerResult(this.results, this);
  }

  close(data?: any) {
    this.visible = false;
    this.stateChange.next({visible: false});
    if (this.results) {
      if (data !== undefined) {
        this.results.next(data);
      }
      this.results.complete();
      this.results = undefined;
    }
  }

  closeWithError(data?: any) {
    this.visible = false;
    this.stateChange.next({visible: false});
    if (this.results) {
      this.results.error(data);
      this.results = undefined;
    }
  }

  send(data: any) {
    if (data !== undefined && this.results) {
      this.results.next(data);
    }
  }
}

export class DynamicLayerRef extends LayerRef {
  constructor(private register: {(): void}, private unregister: {(): void}) { super(); }

  open(attrs?: LayerAttributes): LayerResult<any> {
    this.register();
    return super.open(attrs);
  }

  close(data?: any) {
    super.close(data);
    this.unregister();
  }

  closeWithError(data?: any) {
    super.closeWithError(data);
    this.unregister();
  }
}
