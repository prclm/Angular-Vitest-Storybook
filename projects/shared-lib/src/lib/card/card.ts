import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-card',
  imports: [CommonModule],
  template: `
    <div [class]="cardClasses">
      <div class="card-header" *ngIf="title">
        <h3>{{ title }}</h3>
      </div>
      <div class="card-body">
        <p>{{ content }}</p>
      </div>
      <div class="card-footer" *ngIf="footer">
        <small>{{ footer }}</small>
      </div>
    </div>
  `,
  styles: [`
    .card {
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 16px;
      background: white;
    }
    .card--elevated {
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .card-header h3 {
      margin: 0 0 12px 0;
      font-size: 1.25rem;
    }
    .card-body {
      margin: 12px 0;
    }
    .card-footer {
      margin-top: 12px;
      color: #666;
    }
  `]
})
export class Card {
  @Input() title?: string;
  @Input() content: string = '';
  @Input() footer?: string;
  @Input() elevated: boolean = false;

  public get cardClasses(): string {
    return this.elevated ? 'card card--elevated' : 'card';
  }
}
