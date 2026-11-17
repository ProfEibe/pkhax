import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `<div class="layout-footer">
    <span>PkHax</span>
    by
    <a
      href="https://www.buymeacoffee.com/jakobschade"
      target="_blank"
      rel="noopener noreferrer"
      class="text-primary font-bold hover:underline"
      >Jakob Schade</a
    >
  </div>`,
})
export class AppFooter {}
