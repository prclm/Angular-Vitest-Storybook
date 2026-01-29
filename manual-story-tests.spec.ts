/**
 * Manual story test approach (Option 2)
 * 
 * This approach doesn't rely on Storybook's story composition at all.
 * Instead, it directly tests the Angular component using Angular's TestBed
 * and applies the story args manually.
 * 
 * This bypasses the renderToCanvas context issue entirely by using
 * Angular's native testing approach.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { within } from '@storybook/test';
import { Button } from './projects/shared-lib/src/lib/button/button';
import * as ButtonStories from './projects/shared-lib/src/lib/button/button.stories';

describe('Button Stories - Direct Component Testing', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [Button],
    });
  });

  it('Primary story - should render button with correct text', async () => {
    // Get the story args
    const primaryArgs = ButtonStories.Primary.args || {};
    
    // Create component with story args
    const fixture = TestBed.createComponent(Button);
    const component = fixture.componentInstance;
    
    // Apply story args as component inputs
    Object.assign(component, primaryArgs);
    
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    
    // Run the play function assertions if they exist
    if (ButtonStories.Primary.play) {
      // The play function expects canvasElement
      await ButtonStories.Primary.play({ 
        canvasElement: compiled,
        args: primaryArgs,
      } as any);
    } else {
      // Manual assertions matching what the play function would test
      const canvas = within(compiled);
      const button = canvas.getByRole('button');
      expect(button).toBeTruthy();
      expect(button.textContent).toContain(primaryArgs.label || 'Button');
    }
  });

  it('Secondary story - should render button', async () => {
    const secondaryArgs = ButtonStories.Secondary.args || {};
    
    const fixture = TestBed.createComponent(Button);
    const component = fixture.componentInstance;
    Object.assign(component, secondaryArgs);
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    
    if (ButtonStories.Secondary.play) {
      await ButtonStories.Secondary.play({ 
        canvasElement: compiled,
        args: secondaryArgs,
      } as any);
    } else {
      const canvas = within(compiled);
      const button = canvas.getByRole('button');
      expect(button).toBeTruthy();
    }
  });

  it('Large story - should render large button', async () => {
    const largeArgs = ButtonStories.Large.args || {};
    
    const fixture = TestBed.createComponent(Button);
    const component = fixture.componentInstance;
    Object.assign(component, largeArgs);
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    
    if (ButtonStories.Large.play) {
      await ButtonStories.Large.play({ 
        canvasElement: compiled,
        args: largeArgs,
      } as any);
    } else {
      const canvas = within(compiled);
      const button = canvas.getByRole('button');
      expect(button).toBeTruthy();
    }
  });

  it('Small story - should render small button', async () => {
    const smallArgs = ButtonStories.Small.args || {};
    
    const fixture = TestBed.createComponent(Button);
    const component = fixture.componentInstance;
    Object.assign(component, smallArgs);
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    
    if (ButtonStories.Small.play) {
      await ButtonStories.Small.play({ 
        canvasElement: compiled,
        args: smallArgs,
      } as any);
    } else {
      const canvas = within(compiled);
      const button = canvas.getByRole('button');
      expect(button).toBeTruthy();
    }
  });
});
