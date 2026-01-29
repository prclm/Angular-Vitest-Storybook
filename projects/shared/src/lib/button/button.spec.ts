import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Button } from './button';

describe('Button', () => {
  let component: Button;
  let fixture: ComponentFixture<Button>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Button]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Button);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render label', () => {
    component.label = 'Click Me';
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button');
    expect(button.textContent.trim()).toBe('Click Me');
  });

  it('should emit clicked event when clicked', () => {
    const spy = vi.fn();
    component.clicked.subscribe(spy);
    component.onClick();
    expect(spy).toHaveBeenCalled();
  });

  it('should not emit clicked event when disabled', () => {
    const spy = vi.fn();
    component.clicked.subscribe(spy);
    component.disabled = true;
    component.onClick();
    expect(spy).not.toHaveBeenCalled();
  });
});
