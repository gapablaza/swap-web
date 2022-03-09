import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListResaltedCollectionsComponent } from './list-resalted-collections.component';

describe('ListResaltedCollectionsComponent', () => {
  let component: ListResaltedCollectionsComponent;
  let fixture: ComponentFixture<ListResaltedCollectionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListResaltedCollectionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListResaltedCollectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
