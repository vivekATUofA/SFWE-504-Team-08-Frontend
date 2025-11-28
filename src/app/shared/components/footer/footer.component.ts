// src/app/shared/components/footer/footer.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="text-center text-white py-1" [ngStyle]="{'background-color': footerColor}">
      <div class="container">
        &copy; {{ currentYear }} SFWE Scholarship Portal. All rights reserved.
      </div>
    </footer>
  `,
  imports: [CommonModule]
})
export class FooterComponent {
  footerColor = 'rgba(122, 123, 124, 1)'; // navy
  currentYear = new Date().getFullYear();
}
