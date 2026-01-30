// Auto-generated test file from stories
// DO NOT EDIT - Regenerate using: npm run convert-stories

import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { Button } from './button';
import * as Stories from './button.stories';
import { within } from '@storybook/test';

describe('Components/Button', () => {
    it('Primary story', async () => {
    // Setup Angular TestBed
    await TestBed.configureTestingModule({
      imports: [Button],
    }).compileComponents();

    const fixture = TestBed.createComponent(Button);
    const component = fixture.componentInstance;

    // Apply story args
    const args = {
          "label": "Button",
          "primary": true
    };
    Object.assign(component, args);

    fixture.detectChanges();

    // Run the story's play function
    const canvasElement = fixture.nativeElement;
    const playFunction = Stories.Primary.play;
    
    if (playFunction) {
      await playFunction({
        canvasElement,
        args,
        component: fixture.componentRef,
      } as any);
    }

    // Test passes if play function didn't throw
    expect(component).toBeDefined();
  });

  it('Secondary story', async () => {
    // Setup Angular TestBed
    await TestBed.configureTestingModule({
      imports: [Button],
    }).compileComponents();

    const fixture = TestBed.createComponent(Button);
    const component = fixture.componentInstance;

    // Apply story args
    const args = {
          "label": "Button",
          "primary": false
    };
    Object.assign(component, args);

    fixture.detectChanges();

    // Run the story's play function
    const canvasElement = fixture.nativeElement;
    const playFunction = Stories.Secondary.play;
    
    if (playFunction) {
      await playFunction({
        canvasElement,
        args,
        component: fixture.componentRef,
      } as any);
    }

    // Test passes if play function didn't throw
    expect(component).toBeDefined();
  });

  it('Large story', async () => {
    // Setup Angular TestBed
    await TestBed.configureTestingModule({
      imports: [Button],
    }).compileComponents();

    const fixture = TestBed.createComponent(Button);
    const component = fixture.componentInstance;

    // Apply story args
    const args = {
          "label": "Button",
          "size": "large"
    };
    Object.assign(component, args);

    fixture.detectChanges();

    // Run the story's play function
    const canvasElement = fixture.nativeElement;
    const playFunction = Stories.Large.play;
    
    if (playFunction) {
      await playFunction({
        canvasElement,
        args,
        component: fixture.componentRef,
      } as any);
    }

    // Test passes if play function didn't throw
    expect(component).toBeDefined();
  });

  it('Small story', async () => {
    // Setup Angular TestBed
    await TestBed.configureTestingModule({
      imports: [Button],
    }).compileComponents();

    const fixture = TestBed.createComponent(Button);
    const component = fixture.componentInstance;

    // Apply story args
    const args = {
          "label": "Button",
          "size": "small"
    };
    Object.assign(component, args);

    fixture.detectChanges();

    // Run the story's play function
    const canvasElement = fixture.nativeElement;
    const playFunction = Stories.Small.play;
    
    if (playFunction) {
      await playFunction({
        canvasElement,
        args,
        component: fixture.componentRef,
      } as any);
    }

    // Test passes if play function didn't throw
    expect(component).toBeDefined();
  });
});
