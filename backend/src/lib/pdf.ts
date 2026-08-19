import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";

const logoSvg = fs.readFileSync(
  path.join(__dirname, "../assets/logo.svg"),
  "utf-8"
);

export async function generatePdf(html: string): Promise<Buffer> {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });
  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: {
      top: "0mm",
      right: "0mm",
      bottom: "0mm",
      left: "0mm",
    },
  });
  await browser.close();
  return pdfBuffer;
}

export function buildInvoiceHtml(invoice: any, qrDataUrl: string): string {
  const formattedDate = new Date(invoice.issueDate).toLocaleDateString(
    "es-ES",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }
  );

  const rowsHtml = invoice.invoiceLines
    .map(
      (line: any) => `
        <tr>
          <td class="desc-cell">${line.description}</td>
          <td class="right font-mono">${line.quantity}</td>
          <td class="right font-mono">${Number(line.unitPrice).toFixed(2)} €</td>
          <td class="right font-mono font-semibold">${Number(line.lineSubtotal).toFixed(2)} €</td>
        </tr>
      `
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
    <meta charset="utf-8" />
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600;700&display=swap');

      * { 
        box-sizing: border-box; 
        -webkit-print-color-adjust: exact; 
        print-color-adjust: exact;
      }
      
      body {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        color: #1e293b;
        background-color: #ffffff;
        margin: 0;
        padding: 44px 52px;
        font-size: 12px;
        line-height: 1.5;
      }

      .font-mono {
        font-family: 'JetBrains Mono', monospace;
      }

      /* Barra de acento superior */
      .top-stripe {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 6px;
        background: linear-gradient(90deg, #ea580c 0%, #f97316 100%);
      }

      /* Header */
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 32px;
        padding-bottom: 24px;
        border-bottom: 1px solid #e2e8f0;
      }

      .logo-container {
        display: flex;
        align-items: center;
        max-width: 360px;
      }

      /* Logo ampliado con escala visual destacada */
      .logo-container svg {
        height: 110px;
        width: auto;
        max-width: 340px;
        display: block;
      }

      .invoice-title {
        text-align: right;
      }

      .invoice-badge {
        display: inline-block;
        background-color: #fff7ed;
        color: #ea580c;
        border: 1px solid #ffedd5;
        font-weight: 800;
        font-size: 22px;
        letter-spacing: 1.5px;
        padding: 6px 16px;
        border-radius: 8px;
        margin-bottom: 8px;
      }

      .invoice-meta {
        font-size: 11.5px;
        color: #64748b;
        margin: 2px 0;
      }

      .invoice-meta strong {
        color: #0f172a;
      }

      /* Emisor y Receptor */
      .parties {
        display: flex;
        justify-content: space-between;
        gap: 24px;
        margin-bottom: 28px;
      }

      .party-card {
        flex: 1;
        background-color: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        padding: 16px 18px;
      }

      .party-card h3 {
        text-transform: uppercase;
        font-size: 10px;
        letter-spacing: 1px;
        font-weight: 700;
        color: #ea580c;
        margin: 0 0 10px;
        border-bottom: 1px solid #e2e8f0;
        padding-bottom: 4px;
      }

      .party-card .name {
        font-weight: 700;
        font-size: 13px;
        color: #0f172a;
        margin-bottom: 4px;
      }

      .party-card p {
        margin: 2px 0;
        color: #475569;
        font-size: 11.5px;
      }

      /* Tabla de Líneas */
      table.invoice-table {
        width: 100%;
        border-collapse: separate;
        border-spacing: 0;
        margin-bottom: 24px;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        overflow: hidden;
      }

      table.invoice-table thead tr {
        background-color: #0f172a;
        color: #ffffff;
      }

      table.invoice-table th {
        font-size: 10.5px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.8px;
        padding: 10px 14px;
        text-align: left;
      }

      table.invoice-table th.right { text-align: right; }

      table.invoice-table tbody tr {
        border-bottom: 1px solid #f1f5f9;
      }

      table.invoice-table tbody tr:nth-child(even) {
        background-color: #f8fafc;
      }

      table.invoice-table td {
        padding: 10px 14px;
        color: #334155;
        border-bottom: 1px solid #e2e8f0;
      }

      table.invoice-table tr:last-child td {
        border-bottom: none;
      }

      table.invoice-table td.desc-cell {
        font-weight: 500;
        color: #0f172a;
      }

      table.invoice-table td.right { text-align: right; }

      /* Bloque de Totales */
      .summary-section {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 32px;
      }

      .totals-table {
        width: 280px;
        border-collapse: collapse;
      }

      .totals-table td {
        padding: 6px 12px;
        font-size: 12px;
        color: #475569;
      }

      .totals-table td.right {
        text-align: right;
      }

      .totals-table .total-highlight {
        background-color: #0f172a;
        color: #ffffff;
      }

      .totals-table .total-highlight td {
        color: #ffffff;
        font-size: 14px;
        font-weight: 700;
        padding: 10px 12px;
      }

      .totals-table .total-highlight td.right {
        color: #ea580c;
        font-size: 16px;
      }

      /* Pie de Documento y QR */
      .footer {
        margin-top: auto;
        padding-top: 20px;
        border-top: 1px dashed #cbd5e1;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .footer-info {
        max-width: 380px;
      }

      .footer-info .legal {
        font-size: 10px;
        color: #64748b;
        margin: 0 0 4px;
      }

      .footer-info .guarantee {
        font-size: 10px;
        font-weight: 600;
        color: #0f172a;
      }

      .qr-block {
        display: flex;
        align-items: center;
        gap: 12px;
        background-color: #f8fafc;
        border: 1px solid #e2e8f0;
        padding: 6px 10px;
        border-radius: 6px;
      }

      .qr-block img {
        width: 60px;
        height: 60px;
        display: block;
      }

      .qr-caption {
        font-size: 9px;
        color: #64748b;
        text-transform: uppercase;
        font-weight: 600;
        letter-spacing: 0.5px;
        line-height: 1.3;
      }
    </style>
    </head>
    <body>
      <div class="top-stripe"></div>

      <!-- Cabecera -->
      <div class="header">
        <div class="logo-container">
          ${logoSvg}
        </div>
        <div class="invoice-title">
          <div class="invoice-badge">FACTURA</div>
          <p class="invoice-meta">Nº Documento: <strong class="font-mono">${invoice.invoiceNumber}</strong></p>
          <p class="invoice-meta">Fecha de emisión: <strong class="font-mono">${formattedDate}</strong></p>
        </div>
      </div>

      <!-- Datos Emisor / Receptor -->
      <div class="parties">
        <div class="party-card">
          <h3>Emisor</h3>
          <p class="name">${invoice.workshop.name}</p>
          <p>NIF/CIF: <span class="font-mono">${invoice.employee.nationalId}</span></p>
          <p>${invoice.workshop.streetType} ${invoice.workshop.streetName} ${invoice.workshop.streetNumber}</p>
          <p>${invoice.workshop.postalCode} ${invoice.workshop.city}, ${invoice.workshop.province}</p>
          <p>${invoice.workshop.phone} · ${invoice.workshop.email}</p>
          <p style="margin-top: 6px; font-size: 10.5px; color: #94a3b8;">
            Mecánico responsable: ${invoice.employee.firstName} ${invoice.employee.lastName1}
          </p>
        </div>

        <div class="party-card">
          <h3>Facturar a</h3>
          <p class="name">${invoice.customer.name}</p>
          <p>NIF/CIF: <span class="font-mono">${invoice.customer.taxId || "—"}</span></p>
          <p>${invoice.customer.streetType || ""} ${invoice.customer.streetName || ""}, ${invoice.customer.streetNumber || ""}</p>
          <p>${invoice.customer.postalCode || ""} ${invoice.customer.city || ""}, ${invoice.customer.province || ""}</p>
          <p>${invoice.customer.phone} · ${invoice.customer.email}</p>
        </div>
      </div>

      <!-- Tabla de conceptos -->
      <table class="invoice-table">
        <thead>
          <tr>
            <th>Descripción del producto / servicio</th>
            <th class="right" style="width: 70px;">Cant.</th>
            <th class="right" style="width: 110px;">Precio Unit.</th>
            <th class="right" style="width: 110px;">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>

      <!-- Resumen de Importes -->
      <div class="summary-section">
        <table class="totals-table">
          <tr>
            <td>Base imponible</td>
            <td class="right font-mono font-semibold">${Number(invoice.subtotal).toFixed(2)} €</td>
          </tr>
          <tr>
            <td>IVA (${invoice.taxRate}%)</td>
            <td class="right font-mono font-semibold">${Number(invoice.taxAmount).toFixed(2)} €</td>
          </tr>
          <tr class="total-highlight">
            <td style="border-radius: 6px 0 0 6px;">TOTAL FACTURA</td>
            <td class="right font-mono" style="border-radius: 0 6px 6px 0;">${Number(invoice.total).toFixed(2)} €</td>
          </tr>
        </table>
      </div>

      <!-- Pie de página -->
      <div class="footer">
        <div class="footer-info">
          <p class="guarantee">Garantía en reparaciones y repuestos según normativa vigente.</p>
          <p class="legal">Motos Benito | Taller mecánico especializado</p>
          <p class="legal">Documento electrónico emitido conforme a la legislación fiscal aplicable.</p>
        </div>

        <div class="qr-block">
          <div class="qr-caption">Verificación<br />digital</div>
          <img src="${qrDataUrl}" alt="Código QR de Verificación" />
        </div>
      </div>
    </body>
    </html>`;
}