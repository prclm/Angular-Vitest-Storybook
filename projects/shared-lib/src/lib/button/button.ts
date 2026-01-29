import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-button',
  imports: [CommonModule],
  templateUrl: './button.html',
  styleUrl: './button.css',
})
export class Button {
  @Input() label: string = 'Button';
  @Input() primary: boolean = false;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Output() onClick = new EventEmitter<Event>();

  public get classes(): string[] {
    const mode = this.primary ? 'button--primary' : 'button--secondary';
    return ['button', `button--${this.size}`, mode];
  }

  public handleClick(event: Event): void {
    this.onClick.emit(event);
  }
}
