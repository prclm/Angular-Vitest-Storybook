import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'lib-button',
  imports: [],
  template: `
    <button 
      [class.primary]="primary"
      [disabled]="disabled"
      (click)="onClick()">
      {{ label }}
    </button>
  `,
  styles: [`
    button {
      padding: 8px 16px;
      border: 1px solid #ccc;
      border-radius: 4px;
      background-color: #fff;
      cursor: pointer;
      font-size: 14px;
    }

    button.primary {
      background-color: #007bff;
      color: #fff;
      border-color: #007bff;
    }

    button:hover:not([disabled]) {
      opacity: 0.8;
    }

    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `],
})
export class Button {
  @Input() label: string = 'Button';
  @Input() primary: boolean = false;
  @Input() disabled: boolean = false;
  @Output() clicked = new EventEmitter<void>();

  onClick() {
    if (!this.disabled) {
      this.clicked.emit();
    }
  }
}
