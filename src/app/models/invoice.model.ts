// src/app/models/invoice.model.ts

export interface InvoiceItem {
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }
  
  export interface Invoice {
    invoiceNumber: number;
    clientName: string;
    date: Date;
    items: InvoiceItem[];
    totalAmount: number;
  }
  