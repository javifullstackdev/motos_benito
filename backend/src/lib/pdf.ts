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
    const rowsHtml = invoice.invoiceLines
      .map(
        (line: any) => `
          <tr>
            <td>${line.description}</td>
            <td>${line.quantity}</td>
            <td>${line.unitPrice}</td>
            <td>${line.lineSubtotal}</td>
          </tr>
        `
      )
      .join("");
  
    return `
      <html>
        <head>
          <style>
            .container {
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
  
            <h1>Factura ${invoice.invoiceNumber}</h1>
            <p>Fecha: ${invoice.issueDate}</p>
  
            <h2>Taller</h2>
            <p>${invoice.workshop.name}</p>
            <p>${invoice.workshop.address}</p>
            <p>${invoice.workshop.phone} — ${invoice.workshop.email}</p>
  
            <h2>Emitida por</h2>
            <p>${invoice.employee.firstName} ${invoice.employee.lastName1} ${invoice.employee.lastName2}</p>
            <p>NIF: ${invoice.employee.nationalId}</p>
  
            <h2>Cliente</h2>
            <p>${invoice.customer.name}</p>
            <p>NIF/CIF: ${invoice.customer.taxId}</p>
            <p>${invoice.customer.streetType} ${invoice.customer.streetName}, ${invoice.customer.streetNumber}</p>
            <p>${invoice.customer.postalCode} ${invoice.customer.city}, ${invoice.customer.province}</p>
  
            <table class="invoice-table">
              <thead>
                <tr>
                  <th>Descripción</th>
                  <th>Cantidad</th>
                  <th>Precio unitario</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${rowsHtml}
              </tbody>
            </table>
  
            <p>Subtotal: ${invoice.subtotal}</p>
            <p>IVA (${invoice.taxRate}%): ${invoice.taxAmount}</p>
            <p><strong>Total: ${invoice.total}</strong></p>
  
            <img src="${qrDataUrl}" />
  
          </div>
        </body>
      </html>`;
  }