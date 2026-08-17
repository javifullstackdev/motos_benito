import puppeteer from "puppeteer";

export async function generatePdf(html: string): Promise<Buffer> {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html);
    const pdfBuffer = await page.pdf({ format: "A4" });
    await browser.close();
    return pdfBuffer;
}

export function buildInvoiceHtml(invoice: any, qrDataUrl: string): string {
  const formattedDate = new Date(invoice.issueDate).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const rowsHtml = invoice.invoiceLines
    .map(
      (line: any) => `
        <tr>
          <td>${line.description}</td>
          <td class="right">${line.quantity}</td>
          <td class="right">${line.unitPrice} €</td>
          <td class="right">${line.lineSubtotal} €</td>
        </tr>
      `
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html>
    <head>
    <meta charset="utf-8" />
    <style>
      * { box-sizing: border-box; }
      body {
        font-family: 'Helvetica Neue', Arial, sans-serif;
        color: #1f2937;
        margin: 0;
        padding: 40px;
        font-size: 13px;
      }
      .header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 40px;
      }
      .logo-placeholder {
        width: 64px;
        height: 64px;
        border-radius: 12px;
        background: #2563eb;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 20px;
      }
      .invoice-title {
        text-align: right;
      }
      .invoice-title h1 {
        margin: 0;
        font-size: 24px;
        color: #2563eb;
        letter-spacing: 1px;
      }
      .invoice-title p {
        margin: 4px 0 0;
        color: #6b7280;
      }
      .parties {
        display: flex;
        justify-content: space-between;
        gap: 40px;
        margin-bottom: 32px;
      }
      .party {
        flex: 1;
      }
      .party h3 {
        text-transform: uppercase;
        font-size: 11px;
        letter-spacing: 0.5px;
        color: #9ca3af;
        margin: 0 0 8px;
      }
      .party p {
        margin: 2px 0;
      }
      .party .name {
        font-weight: 600;
        font-size: 14px;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 24px;
      }
      th {
        text-align: left;
        font-size: 11px;
        text-transform: uppercase;
        color: #6b7280;
        border-bottom: 2px solid #e5e7eb;
        padding: 8px;
      }
      td {
        padding: 10px 8px;
        border-bottom: 1px solid #f3f4f6;
      }
      td.right, th.right { text-align: right; }
      .totals {
        display: flex;
        justify-content: flex-end;
      }
      .totals table {
        width: 260px;
        margin: 0;
      }
      .totals td {
        border: none;
        padding: 4px 8px;
      }
      .totals .total-row td {
        border-top: 2px solid #1f2937;
        font-weight: 700;
        font-size: 15px;
        padding-top: 10px;
      }
      .footer {
        margin-top: 48px;
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
      }
      .footer img {
        width: 100px;
        height: 100px;
      }
      .footer .note {
        color: #9ca3af;
        font-size: 11px;
        max-width: 300px;
      }
    </style>
    </head>
    <body>
      <div class="header">
        <div class="logo-placeholder">MB</div>
        <div class="invoice-title">
          <h1>FACTURA</h1>
          <p>Nº ${invoice.invoiceNumber}</p>
          <p>Fecha: ${formattedDate}</p>
        </div>
      </div>

      <div class="parties">
        <div class="party">
          <h3>Datos del emisor</h3>
          <p class="name">${invoice.employee.firstName} ${invoice.employee.lastName1} ${invoice.employee.lastName2}</p>
          <p>NIF: ${invoice.employee.nationalId}</p>
          <p>${invoice.workshop.name}</p>
          <p>${invoice.workshop.address}</p>
          <p>${invoice.workshop.phone} · ${invoice.workshop.email}</p>
        </div>
        <div class="party">
          <h3>Facturar a</h3>
          <p class="name">${invoice.customer.name}</p>
          <p>NIF/CIF: ${invoice.customer.taxId}</p>
          <p>${invoice.customer.streetType} ${invoice.customer.streetName}, ${invoice.customer.streetNumber}</p>
          <p>${invoice.customer.postalCode} ${invoice.customer.city}, ${invoice.customer.province}</p>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Descripción</th>
            <th class="right">Cantidad</th>
            <th class="right">Precio (IVA incluido)</th>
            <th class="right">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>

      <div class="totals">
        <table>
          <tr><td>Base imponible</td><td class="right">${invoice.subtotal} €</td></tr>
          <tr><td>IVA (${invoice.taxRate}%)</td><td class="right">${invoice.taxAmount} €</td></tr>
          <tr class="total-row"><td>Total</td><td class="right">${invoice.total} €</td></tr>
        </table>
      </div>

      <div class="footer">
        <div class="note">Factura generada digitalmente. Escanea el código QR para verificar su autenticidad.</div>
        <img src="${qrDataUrl}" />
      </div>
    </body>
    </html>`;
}