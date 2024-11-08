// src/app/invoice.service.ts

import { Injectable } from '@angular/core';
import { Invoice, InvoiceItem } from './models/invoice.model';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  calculateItemTotal(item: InvoiceItem): number {
    return item.quantity * item.unitPrice;
  }

  calculateTotalAmount(items: InvoiceItem[]): number {
    return items.reduce((sum, item) => sum + this.calculateItemTotal(item), 0);
  }

  createInvoice(clientName: string, items: InvoiceItem[], invoiceNumber: number): Invoice {
    const totalAmount = this.calculateTotalAmount(items);
    return {
      invoiceNumber,
      clientName,
      date: new Date(),
      items,
      totalAmount,
    };
  }
}
