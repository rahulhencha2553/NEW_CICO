import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompilerLoaderComponent } from './compiler-loader.component';

describe('CompilerLoaderComponent', () => {
  let component: CompilerLoaderComponent;
  let fixture: ComponentFixture<CompilerLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompilerLoaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompilerLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
