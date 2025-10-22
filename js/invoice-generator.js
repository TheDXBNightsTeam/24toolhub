// Invoice Generator Tool
class InvoiceGenerator {
    constructor() {
        this.templates = {
            'web-design': {
                items: [
                    { description: 'Website Design & Development', quantity: 1, rate: 2500 },
                    { description: 'Responsive Design Implementation', quantity: 1, rate: 800 },
                    { description: 'SEO Optimization', quantity: 1, rate: 500 }
                ],
                taxRate: 10,
                paymentTerms: 'Payment is due within 15 days of invoice date.'
            },
            'consulting': {
                items: [
                    { description: 'Business Strategy Consultation', quantity: 8, rate: 150 },
                    { description: 'Market Analysis Report', quantity: 1, rate: 800 },
                    { description: 'Implementation Planning', quantity: 4, rate: 200 }
                ],
                taxRate: 8,
                paymentTerms: 'Payment is due within 30 days of invoice date.'
            },
            'development': {
                items: [
                    { description: 'Custom Web Application Development', quantity: 1, rate: 5000 },
                    { description: 'Database Design & Implementation', quantity: 1, rate: 1200 },
                    { description: 'Testing & Quality Assurance', quantity: 1, rate: 800 }
                ],
                taxRate: 12,
                paymentTerms: 'Payment is due within 20 days of invoice date.'
            },
            'marketing': {
                items: [
                    { description: 'Digital Marketing Campaign', quantity: 1, rate: 2000 },
                    { description: 'Social Media Management (Monthly)', quantity: 3, rate: 500 },
                    { description: 'Content Creation & Strategy', quantity: 1, rate: 1000 }
                ],
                taxRate: 10,
                paymentTerms: 'Payment is due within 14 days of invoice date.'
            },
            'maintenance': {
                items: [
                    { description: 'Website Maintenance (Monthly)', quantity: 6, rate: 300 },
                    { description: 'Security Updates & Monitoring', quantity: 1, rate: 200 },
                    { description: 'Performance Optimization', quantity: 1, rate: 400 }
                ],
                taxRate: 8,
                paymentTerms: 'Payment is due within 30 days of invoice date.'
            },
            'training': {
                items: [
                    { description: 'Team Training Session', quantity: 2, rate: 800 },
                    { description: 'Training Materials & Documentation', quantity: 1, rate: 300 },
                    { description: 'Follow-up Support (3 months)', quantity: 1, rate: 500 }
                ],
                taxRate: 10,
                paymentTerms: 'Payment is due within 21 days of invoice date.'
            }
        };
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.setupUI();
        this.setDefaultDates();
    }

    bindEvents() {
        const generateBtn = document.getElementById('generateInvoice');
        const previewBtn = document.getElementById('previewInvoice');
        const clearBtn = document.getElementById('clearInvoice');
        const addItemBtn = document.getElementById('addItem');
        const downloadPDFBtn = document.getElementById('downloadPDF');
        const printBtn = document.getElementById('printInvoice');

        generateBtn.addEventListener('click', () => this.generateInvoice());
        previewBtn.addEventListener('click', () => this.previewInvoice());
        clearBtn.addEventListener('click', () => this.clearInvoice());
        addItemBtn.addEventListener('click', () => this.addItem());
        downloadPDFBtn.addEventListener('click', () => this.downloadPDF());
        printBtn.addEventListener('click', () => this.printInvoice());

        // Template buttons
        document.querySelectorAll('.template-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const template = btn.getAttribute('data-template');
                this.loadTemplate(template);
            });
        });

        // Auto-calculate on input changes
        document.addEventListener('input', (e) => {
            if (e.target.classList.contains('item-quantity') || 
                e.target.classList.contains('item-rate') ||
                e.target.id === 'taxRate' ||
                e.target.id === 'discountRate') {
                this.calculateTotals();
            }
        });
    }

    setupUI() {
        // Add custom styles for invoice generator
        const style = document.createElement('style');
        style.textContent = `
            .invoice-header-section, .company-section, .invoice-items-section, 
            .invoice-totals-section, .invoice-notes-section {
                background: var(--bg-secondary);
                border: 1px solid var(--border-color);
                border-radius: 0.5rem;
                padding: 1.5rem;
                margin-bottom: 1.5rem;
            }
            
            .section-heading {
                color: var(--accent-primary);
                margin-bottom: 1rem;
                font-size: 1.1rem;
            }
            
            .header-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 1rem;
            }
            
            .company-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 2rem;
            }
            
            .company-from, .company-to {
                display: flex;
                flex-direction: column;
                gap: 1rem;
            }
            
            .subsection-heading {
                color: var(--accent-primary);
                margin-bottom: 1rem;
                font-size: 1rem;
            }
            
            .items-table {
                background: var(--bg-primary);
                border: 1px solid var(--border-color);
                border-radius: 0.5rem;
                overflow: hidden;
            }
            
            .table-header {
                display: grid;
                grid-template-columns: 2fr 1fr 1fr 1fr 0.5fr;
                background: var(--accent-primary);
                color: white;
                font-weight: bold;
            }
            
            .header-cell {
                padding: 1rem;
                border-right: 1px solid rgba(255,255,255,0.2);
            }
            
            .header-cell:last-child {
                border-right: none;
            }
            
            .items-list {
                max-height: 400px;
                overflow-y: auto;
            }
            
            .item-row {
                display: grid;
                grid-template-columns: 2fr 1fr 1fr 1fr 0.5fr;
                border-bottom: 1px solid var(--border-color);
                align-items: center;
            }
            
            .item-row:last-child {
                border-bottom: none;
            }
            
            .item-row input {
                border: none;
                padding: 1rem;
                background: transparent;
                color: var(--text-primary);
            }
            
            .item-row input:focus {
                outline: 2px solid var(--accent-primary);
                background: var(--bg-secondary);
            }
            
            .item-amount {
                font-weight: bold;
                color: var(--accent-primary);
            }
            
            .remove-item {
                background: #ef4444;
                color: white;
                border: none;
                border-radius: 50%;
                width: 30px;
                height: 30px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto;
            }
            
            .totals-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 1rem;
            }
            
            .total-field {
                font-size: 1.25rem;
                font-weight: bold;
                color: var(--accent-primary);
                background: var(--bg-primary);
            }
            
            .invoice-preview {
                background: var(--bg-secondary);
                border: 1px solid var(--border-color);
                border-radius: 0.5rem;
                padding: 1.5rem;
                margin: 1.5rem 0;
            }
            
            .preview-heading {
                color: var(--accent-primary);
                margin-bottom: 1.5rem;
            }
            
            .invoice-content {
                background: white;
                padding: 2rem;
                border-radius: 0.5rem;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                font-family: Arial, sans-serif;
                line-height: 1.6;
            }
            
            .invoice-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 2rem;
                padding-bottom: 1rem;
                border-bottom: 2px solid #333;
            }
            
            .invoice-title {
                font-size: 2rem;
                font-weight: bold;
                color: #333;
            }
            
            .invoice-details {
                text-align: right;
            }
            
            .invoice-details div {
                margin-bottom: 0.5rem;
            }
            
            .invoice-details strong {
                color: #333;
            }
            
            .company-info {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 2rem;
                margin-bottom: 2rem;
            }
            
            .company-from, .company-to {
                background: #f8f9fa;
                padding: 1rem;
                border-radius: 0.25rem;
            }
            
            .company-label {
                font-weight: bold;
                color: #333;
                margin-bottom: 0.5rem;
            }
            
            .items-table-preview {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 2rem;
            }
            
            .items-table-preview th,
            .items-table-preview td {
                padding: 0.75rem;
                text-align: left;
                border-bottom: 1px solid #ddd;
            }
            
            .items-table-preview th {
                background: #f8f9fa;
                font-weight: bold;
                color: #333;
            }
            
            .items-table-preview .text-right {
                text-align: right;
            }
            
            .totals-section {
                display: flex;
                justify-content: flex-end;
                margin-bottom: 2rem;
            }
            
            .totals-table {
                width: 300px;
            }
            
            .totals-table td {
                padding: 0.5rem;
                border-bottom: 1px solid #ddd;
            }
            
            .totals-table .total-row {
                font-weight: bold;
                font-size: 1.1rem;
                background: #f8f9fa;
            }
            
            .notes-section {
                margin-top: 2rem;
                padding-top: 1rem;
                border-top: 1px solid #ddd;
            }
            
            .notes-section h4 {
                color: #333;
                margin-bottom: 0.5rem;
            }
            
            .preview-actions {
                display: flex;
                gap: 1rem;
                justify-content: center;
                margin-top: 1.5rem;
            }
            
            .templates-section {
                background: var(--bg-secondary);
                border: 1px solid var(--border-color);
                border-radius: 0.5rem;
                padding: 1.5rem;
                margin: 1.5rem 0;
            }
            
            .templates-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 0.5rem;
            }
            
            .template-btn {
                padding: 0.75rem 1rem;
                background: var(--bg-primary);
                border: 1px solid var(--border-color);
                border-radius: 0.25rem;
                color: var(--text-primary);
                cursor: pointer;
                transition: all 0.2s ease;
                font-size: 0.875rem;
            }
            
            .template-btn:hover {
                background: var(--accent-primary);
                color: white;
                border-color: var(--accent-primary);
            }
            
            @media print {
                .invoice-content {
                    box-shadow: none;
                    border: none;
                }
                
                .preview-actions {
                    display: none;
                }
            }
        `;
        document.head.appendChild(style);
    }

    setDefaultDates() {
        const today = new Date();
        const dueDate = new Date(today);
        dueDate.setDate(today.getDate() + 30);
        
        document.getElementById('invoiceDate').value = today.toISOString().split('T')[0];
        document.getElementById('dueDate').value = dueDate.toISOString().split('T')[0];
    }

    addItem() {
        const itemsList = document.getElementById('itemsList');
        const newItem = document.createElement('div');
        newItem.className = 'item-row';
        newItem.innerHTML = `
            <input type="text" class="item-description" placeholder="Item description" data-en-placeholder="Item description" data-ar-placeholder="وصف العنصر">
            <input type="number" class="item-quantity" placeholder="1" min="0" step="0.01" value="1">
            <input type="number" class="item-rate" placeholder="0.00" min="0" step="0.01" value="0">
            <input type="text" class="item-amount" readonly value="0.00">
            <button class="remove-item">×</button>
        `;
        
        itemsList.appendChild(newItem);
        
        // Bind remove event
        newItem.querySelector('.remove-item').addEventListener('click', () => {
            newItem.remove();
            this.calculateTotals();
        });
        
        // Bind calculation events
        newItem.querySelector('.item-quantity').addEventListener('input', () => this.calculateItemAmount(newItem));
        newItem.querySelector('.item-rate').addEventListener('input', () => this.calculateItemAmount(newItem));
        
        this.calculateTotals();
    }

    calculateItemAmount(itemRow) {
        const quantity = parseFloat(itemRow.querySelector('.item-quantity').value) || 0;
        const rate = parseFloat(itemRow.querySelector('.item-rate').value) || 0;
        const amount = quantity * rate;
        
        itemRow.querySelector('.item-amount').value = amount.toFixed(2);
        this.calculateTotals();
    }

    calculateTotals() {
        const itemRows = document.querySelectorAll('.item-row');
        let subtotal = 0;
        
        itemRows.forEach(row => {
            const amount = parseFloat(row.querySelector('.item-amount').value) || 0;
            subtotal += amount;
        });
        
        const taxRate = parseFloat(document.getElementById('taxRate').value) || 0;
        const discountRate = parseFloat(document.getElementById('discountRate').value) || 0;
        
        const taxAmount = (subtotal * taxRate) / 100;
        const discountAmount = (subtotal * discountRate) / 100;
        const total = subtotal + taxAmount - discountAmount;
        
        document.getElementById('subtotal').value = subtotal.toFixed(2);
        document.getElementById('taxAmount').value = taxAmount.toFixed(2);
        document.getElementById('discountAmount').value = discountAmount.toFixed(2);
        document.getElementById('totalAmount').value = total.toFixed(2);
    }

    loadTemplate(templateName) {
        const template = this.templates[templateName];
        if (!template) return;
        
        // Clear existing items
        const itemsList = document.getElementById('itemsList');
        itemsList.innerHTML = '';
        
        // Add template items
        template.items.forEach(item => {
            const itemRow = document.createElement('div');
            itemRow.className = 'item-row';
            itemRow.innerHTML = `
                <input type="text" class="item-description" value="${item.description}">
                <input type="number" class="item-quantity" value="${item.quantity}" min="0" step="0.01">
                <input type="number" class="item-rate" value="${item.rate}" min="0" step="0.01">
                <input type="text" class="item-amount" readonly>
                <button class="remove-item">×</button>
            `;
            
            itemsList.appendChild(itemRow);
            
            // Bind events
            itemRow.querySelector('.remove-item').addEventListener('click', () => {
                itemRow.remove();
                this.calculateTotals();
            });
            
            itemRow.querySelector('.item-quantity').addEventListener('input', () => this.calculateItemAmount(itemRow));
            itemRow.querySelector('.item-rate').addEventListener('input', () => this.calculateItemAmount(itemRow));
        });
        
        // Set template values
        document.getElementById('taxRate').value = template.taxRate;
        document.getElementById('paymentTerms').value = template.paymentTerms;
        
        this.calculateTotals();
        this.showNotification('Template loaded successfully', 'success');
    }

    generateInvoice() {
        this.previewInvoice();
        this.showNotification('Invoice generated successfully', 'success');
    }

    previewInvoice() {
        const invoiceData = this.getInvoiceData();
        const invoiceHTML = this.generateInvoiceHTML(invoiceData);
        
        document.getElementById('invoiceContent').innerHTML = invoiceHTML;
        document.getElementById('invoicePreview').style.display = 'block';
        document.getElementById('invoicePreview').scrollIntoView({ behavior: 'smooth' });
    }

    getInvoiceData() {
        const items = [];
        document.querySelectorAll('.item-row').forEach(row => {
            const description = row.querySelector('.item-description').value;
            const quantity = parseFloat(row.querySelector('.item-quantity').value) || 0;
            const rate = parseFloat(row.querySelector('.item-rate').value) || 0;
            const amount = parseFloat(row.querySelector('.item-amount').value) || 0;
            
            if (description.trim()) {
                items.push({ description, quantity, rate, amount });
            }
        });
        
        return {
            invoiceNumber: document.getElementById('invoiceNumber').value,
            invoiceDate: document.getElementById('invoiceDate').value,
            dueDate: document.getElementById('dueDate').value,
            fromCompany: document.getElementById('fromCompany').value,
            fromAddress: document.getElementById('fromAddress').value,
            fromEmail: document.getElementById('fromEmail').value,
            fromPhone: document.getElementById('fromPhone').value,
            toClient: document.getElementById('toClient').value,
            toAddress: document.getElementById('toAddress').value,
            toEmail: document.getElementById('toEmail').value,
            items: items,
            subtotal: parseFloat(document.getElementById('subtotal').value) || 0,
            taxRate: parseFloat(document.getElementById('taxRate').value) || 0,
            taxAmount: parseFloat(document.getElementById('taxAmount').value) || 0,
            discountRate: parseFloat(document.getElementById('discountRate').value) || 0,
            discountAmount: parseFloat(document.getElementById('discountAmount').value) || 0,
            total: parseFloat(document.getElementById('totalAmount').value) || 0,
            paymentTerms: document.getElementById('paymentTerms').value,
            additionalNotes: document.getElementById('additionalNotes').value
        };
    }

    generateInvoiceHTML(data) {
        const formatDate = (dateString) => {
            if (!dateString) return '';
            const date = new Date(dateString);
            return date.toLocaleDateString();
        };
        
        const formatCurrency = (amount) => {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
            }).format(amount);
        };
        
        let itemsHTML = '';
        data.items.forEach(item => {
            itemsHTML += `
                <tr>
                    <td>${item.description}</td>
                    <td class="text-right">${item.quantity}</td>
                    <td class="text-right">${formatCurrency(item.rate)}</td>
                    <td class="text-right">${formatCurrency(item.amount)}</td>
                </tr>
            `;
        });
        
        return `
            <div class="invoice-header">
                <div class="invoice-title">INVOICE</div>
                <div class="invoice-details">
                    <div><strong>Invoice #:</strong> ${data.invoiceNumber}</div>
                    <div><strong>Date:</strong> ${formatDate(data.invoiceDate)}</div>
                    <div><strong>Due Date:</strong> ${formatDate(data.dueDate)}</div>
                </div>
            </div>
            
            <div class="company-info">
                <div class="company-from">
                    <div class="company-label">From:</div>
                    <div><strong>${data.fromCompany || 'Your Company Name'}</strong></div>
                    <div>${data.fromAddress || 'Your Address'}</div>
                    <div>${data.fromEmail || 'your@email.com'}</div>
                    <div>${data.fromPhone || 'Your Phone'}</div>
                </div>
                <div class="company-to">
                    <div class="company-label">To:</div>
                    <div><strong>${data.toClient || 'Client Company Name'}</strong></div>
                    <div>${data.toAddress || 'Client Address'}</div>
                    <div>${data.toEmail || 'client@email.com'}</div>
                </div>
            </div>
            
            <table class="items-table-preview">
                <thead>
                    <tr>
                        <th>Description</th>
                        <th class="text-right">Quantity</th>
                        <th class="text-right">Rate</th>
                        <th class="text-right">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHTML}
                </tbody>
            </table>
            
            <div class="totals-section">
                <table class="totals-table">
                    <tr>
                        <td>Subtotal:</td>
                        <td class="text-right">${formatCurrency(data.subtotal)}</td>
                    </tr>
                    ${data.taxRate > 0 ? `
                    <tr>
                        <td>Tax (${data.taxRate}%):</td>
                        <td class="text-right">${formatCurrency(data.taxAmount)}</td>
                    </tr>
                    ` : ''}
                    ${data.discountRate > 0 ? `
                    <tr>
                        <td>Discount (${data.discountRate}%):</td>
                        <td class="text-right">-${formatCurrency(data.discountAmount)}</td>
                    </tr>
                    ` : ''}
                    <tr class="total-row">
                        <td><strong>Total:</strong></td>
                        <td class="text-right"><strong>${formatCurrency(data.total)}</strong></td>
                    </tr>
                </table>
            </div>
            
            <div class="notes-section">
                ${data.paymentTerms ? `
                <h4>Payment Terms:</h4>
                <p>${data.paymentTerms}</p>
                ` : ''}
                ${data.additionalNotes ? `
                <h4>Notes:</h4>
                <p>${data.additionalNotes}</p>
                ` : ''}
            </div>
        `;
    }

    downloadPDF() {
        const invoiceContent = document.getElementById('invoiceContent');
        const printWindow = window.open('', '_blank');
        
        printWindow.document.write(`
            <html>
                <head>
                    <title>Invoice - ${document.getElementById('invoiceNumber').value}</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
                        .invoice-content { max-width: 800px; margin: 0 auto; }
                        ${document.querySelector('style').textContent}
                    </style>
                </head>
                <body>
                    ${invoiceContent.innerHTML}
                </body>
            </html>
        `);
        
        printWindow.document.close();
        printWindow.print();
        
        this.showNotification('PDF download initiated', 'success');
    }

    printInvoice() {
        const invoiceContent = document.getElementById('invoiceContent');
        const printWindow = window.open('', '_blank');
        
        printWindow.document.write(`
            <html>
                <head>
                    <title>Invoice - ${document.getElementById('invoiceNumber').value}</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
                        .invoice-content { max-width: 800px; margin: 0 auto; }
                        ${document.querySelector('style').textContent}
                    </style>
                </head>
                <body>
                    ${invoiceContent.innerHTML}
                </body>
            </html>
        `);
        
        printWindow.document.close();
        printWindow.print();
        
        this.showNotification('Print dialog opened', 'success');
    }

    clearInvoice() {
        // Clear all inputs
        document.getElementById('invoiceNumber').value = 'INV-001';
        document.getElementById('fromCompany').value = '';
        document.getElementById('fromAddress').value = '';
        document.getElementById('fromEmail').value = '';
        document.getElementById('fromPhone').value = '';
        document.getElementById('toClient').value = '';
        document.getElementById('toAddress').value = '';
        document.getElementById('toEmail').value = '';
        document.getElementById('taxRate').value = '0';
        document.getElementById('discountRate').value = '0';
        document.getElementById('paymentTerms').value = '';
        document.getElementById('additionalNotes').value = '';
        
        // Clear items
        const itemsList = document.getElementById('itemsList');
        itemsList.innerHTML = `
            <div class="item-row">
                <input type="text" class="item-description" placeholder="Item description" data-en-placeholder="Item description" data-ar-placeholder="وصف العنصر">
                <input type="number" class="item-quantity" placeholder="1" min="0" step="0.01" value="1">
                <input type="number" class="item-rate" placeholder="0.00" min="0" step="0.01" value="0">
                <input type="text" class="item-amount" readonly value="0.00">
                <button class="remove-item" style="display: none;">×</button>
            </div>
        `;
        
        // Hide preview
        document.getElementById('invoicePreview').style.display = 'none';
        
        // Reset dates
        this.setDefaultDates();
        
        // Recalculate
        this.calculateTotals();
        
        this.showNotification('Invoice cleared', 'success');
    }

    showNotification(message, type = 'info') {
        // Use existing notification system from main.js
        if (window.Utils && window.Utils.showNotification) {
            window.Utils.showNotification(message, type);
        } else {
            alert(message);
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new InvoiceGenerator();
});
