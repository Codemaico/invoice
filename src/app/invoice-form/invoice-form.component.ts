// src/app/invoice-form/invoice-form.component.ts

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { InvoiceService } from '../invoice.service';
import { Invoice, InvoiceItem } from '../models/invoice.model';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-invoice-form',
  templateUrl: './invoice-form.component.html',
  styleUrls: ['./invoice-form.component.css']
})
export class InvoiceFormComponent implements OnInit {
  @ViewChild('invoiceSection') invoiceSection: ElementRef | undefined;
  clientName = '';
  items: InvoiceItem[] = [];
  invoice?: Invoice;
  invoiceNumber: number = 0;
  newItem: InvoiceItem = { description: '', quantity: 1, unitPrice: 0, total: 0 };
  

  constructor(private invoiceService: InvoiceService) {}

  ngOnInit() {
    const storedInvoiceNumber = localStorage.getItem('invoiceNumber');
    if (storedInvoiceNumber) {
      this.invoiceNumber = parseInt(storedInvoiceNumber, 10);
    }
  }

  addItem() {
    this.newItem.total = this.invoiceService.calculateItemTotal(this.newItem);
    this.items.push({ ...this.newItem });
    this.newItem = { description: '', quantity: 1, unitPrice: 0, total: 0 };
  }

  updateItemTotal(index: number) {
    const item = this.items[index];
    item.total = this.invoiceService.calculateItemTotal(item);
  }

  deleteItem(index: number) {
    this.items.splice(index, 1);
    this.saveProgress(); // Auto-save when item is deleted
  }

  calculateSubtotal(): number {
    return this.items.reduce((sum, item) => sum + item.total, 0);
  }

  // calculateTax(): number {
  //   return this.calculateSubtotal() * 0.05; // Assume 5% tax
  // }

  calculateTotal(): number {
    return this.calculateSubtotal() 
    //+ this.calculateTax();
  }

  generateInvoice() {
    this.invoice = this.invoiceService.createInvoice(this.clientName, this.items, this.invoiceNumber);
    this.invoice.totalAmount = this.calculateTotal();
    this.saveInvoice(this.invoice);
    this.invoiceNumber++;

    localStorage.setItem('invoiceNumber', this.invoiceNumber.toString());
  }

  saveInvoice(invoice: Invoice) {
    const invoices = JSON.parse(localStorage.getItem('invoices') || '[]');
    invoices.push(invoice);
    localStorage.setItem('invoices', JSON.stringify(invoices));
  }

  printInvoice() {
    window.print();
  }
  // Save the current progress (client name, items, and invoice number) to local storage
  saveProgress() {
    const progressData = {
      clientName: this.clientName,
      items: this.items,
      invoiceNumber: this.invoiceNumber,
    };
    localStorage.setItem('invoiceProgress', JSON.stringify(progressData));
  }

  // Load the saved progress data from local storage
  loadProgress() {
    const savedProgress = localStorage.getItem('invoiceProgress');
    if (savedProgress) {
      const progressData = JSON.parse(savedProgress);
      this.clientName = progressData.clientName || '';
      this.items = progressData.items || [];
      this.invoiceNumber = progressData.invoiceNumber || 1;
    }
  }
  // downloadPDF() {
  //   if (this.invoiceSection) {
  //     const DATA = this.invoiceSection.nativeElement;

  //     html2canvas(DATA, { scale: 2 }).then(canvas => {
  //       // Get canvas dimensions
  //       const imgWidth = 210; // A4 width in mm
  //       const pageHeight = 297; // A4 height in mm
  //       const imgHeight = (canvas.height * imgWidth) / canvas.width;

  //       // Create a new jsPDF instance
  //       const pdf = new jsPDF('p', 'mm', 'a4');

  //       // Adjust the image size to ensure it fits within the page
  //       if (imgHeight > pageHeight) {
  //         const scaleFactor = pageHeight / imgHeight;
  //         const scaledWidth = imgWidth * scaleFactor;
  //         const scaledHeight = pageHeight;

  //         pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, scaledWidth, scaledHeight);
  //       } else {
  //         pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, imgWidth, imgHeight);
  //       }

  //       // Save the PDF with the invoice number
  //       pdf.save(`Invoice_${this.invoiceNumber}.pdf`);
  //     });
  //   }
  // }
}



