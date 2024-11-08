// src/app/invoice/invoice.component.ts

import { Component, Input } from '@angular/core';
import { Invoice } from '../models/invoice.model';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent {
  @Input() invoice?: Invoice;

  printInvoice() {
    const printContent = document.getElementById('print-section');
    const originalContent = document.body.innerHTML;

    if (printContent) {
      document.body.innerHTML = printContent.innerHTML;
      window.print();
      document.body.innerHTML = originalContent;
      location.reload(); // Reload the page to restore the original view
    }
  }
}
