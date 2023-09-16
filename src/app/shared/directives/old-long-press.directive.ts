import {
    AfterViewInit,
    Directive,
    ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    Output
  } from '@angular/core';
  
  import { fromEvent, Observable, Subscription } from 'rxjs';
  import { takeUntil, debounceTime, tap } from 'rxjs/operators';
  
  @Directive({
    selector: '[appLongPress]',
    standalone: true
})
  export class OldLongPressDirective implements AfterViewInit, OnDestroy {
    @Input() appLongPress = 1000;
    @Output() longPress = new EventEmitter<MouseEvent>();
  
    sink: Subscription;
  
    mouseDown$: Observable<MouseEvent>;
    mouseUp$: Observable<MouseEvent>;
  
    constructor(private hostElement: ElementRef<HTMLElement>) {
      this.sink = new Subscription();
  
      this.mouseDown$ = this.bindMouseEvent('mousedown');
      this.mouseUp$ = this.bindMouseEvent('mouseup');
    }
  
    ngAfterViewInit() {
      this.sink.add(this.handleMouseDown());
    }
  
    ngOnDestroy() {
      this.sink.unsubscribe()
    }
  
    private bindMouseEvent(eventName: string): Observable<MouseEvent> {
      return fromEvent<MouseEvent>(this.hostElement.nativeElement, eventName);
    }
  
    private handleMouseDown(): Subscription {
      return this.mouseDown$
        .pipe(
          debounceTime(this.appLongPress),
          takeUntil(this.mouseUp$)
        )
        .subscribe({
          next: event => this.longPress.emit(event),
          complete: () => this.handleMouseDown()
        });
    }
  }