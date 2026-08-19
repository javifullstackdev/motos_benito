import { Router } from "express";
import { prisma } from "../lib/prisma";
import { Prisma } from "../generated/prisma/client";
import { requireAuth } from "../middleware/requireAuth";
import crypto from "crypto";
import QRCode from "qrcode";
import { generatePdf, buildInvoiceHtml } from "../lib/pdf";

const router = Router();

router.use(requireAuth);

function calculateInitials(firstName: string, lastName1: string, lastName2: string) : string {
    return (firstName[0]! + lastName1[0] + lastName2[0]).toUpperCase();
}

function calculateHash(previousHash: string, data: string): string {
    return crypto.createHash("sha256").update(previousHash + data).digest("hex");
}

async function generateInvoiceQr(invoice: any): Promise<string> {
    const qrContent = `NIF:${invoice.employee.nationalId}|NUM:${invoice.invoiceNumber}|FECHA:${invoice.issueDate}|IMPORTE:${invoice.total}`;
    return await QRCode.toDataURL(qrContent);
}

async function createInvoiceWithRetry(
    employee: any,
    workshopId: number,
    customerId: number,
    lines: { itemId: number; description: string; unitPrice: Prisma.Decimal; quantity: number }[],
    maxAttempts = 5
) {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            return await prisma.$transaction(
                async (tsx) => {
                    const currentYear = new Date().getFullYear();
                    const initials = calculateInitials(
                        employee.firstName,
                        employee.lastName1,
                        employee.lastName2
                    );
                    const prefix = `${initials}-${currentYear}-`;
                    const lastInvoice = await tsx.invoice.findFirst({
                        where: {
                            emplId: employee.emplId,
                            invoiceNumber: { startsWith: prefix },
                        },
                        orderBy: { invoiceId: "desc" },
                    });
                    const nextNumber = lastInvoice
                        ? Number (lastInvoice.invoiceNumber.split("-")[2]) + 1
                        : 1;
                    
                    const invoiceNumber = `${prefix}${String(nextNumber).padStart(4, "0")}`;

                    const previousHash = lastInvoice?.currentHash ?? "";

                    const lineSubtotals = lines.map((line) => ({
                        ...line,
                        lineSubtotal: line.unitPrice.mul(line.quantity),
                      }));
                      
                    const total = lineSubtotals.reduce(
                        (acc, line) => acc.plus(line.lineSubtotal),
                        new Prisma.Decimal(0)
                    );
                      
                    const taxRate = new Prisma.Decimal(21);
                    const subtotal = total.div(taxRate.div(100).plus(1));
                    const taxAmount = total.minus(subtotal);

                    const dataToHash = `${employee.nationalId}-${invoiceNumber}-${total.toString()}`;
                    const currentHash = calculateHash(previousHash, dataToHash);

                    const invoice = await tsx.invoice.create({
                        data: {
                            invoiceNumber,
                            workshopId,
                            emplId: employee.emplId,
                            customerId,
                            subtotal,
                            taxRate,
                            taxAmount,
                            total,
                            currentHash,
                            previousHash,
                            status: "issued",
                            invoiceLines: {
                                create: lineSubtotals.map((line) => ({
                                    itemId: line.itemId,
                                    description: line.description,
                                    unitPrice: line.unitPrice,
                                    quantity: line.quantity,
                                    lineSubtotal: line.lineSubtotal,
                                })),
                            }
                        },
                        include: {
                            invoiceLines: true,
                        },
                    });

                    return invoice;
                },
                { isolationLevel: "Serializable"}
            );
        } catch (error : any) {
            if (error.code === "P2034" && attempt < maxAttempts) {
                continue;
            }
            throw error;
        }
    }
}

router.post("/", async (req, res) => {
    const emplId = req.session.emplId!;
    const employee = await prisma.employee.findUnique({
        where: { emplId }
    });

    const { workshopId, customerId, lines } = req.body;

    const itemsIds = lines.map((line : any) => line.itemId);
    const items = await prisma.item.findMany({
        where: { itemId: { in: itemsIds } },
    });

    const resolvedLines = lines.map((line : any) => {
        const item = items.find((i) => i.itemId === line.itemId);
        return {
            itemId: line.itemId,
            description: item!.name,
            unitPrice: item!.unitPrice,
            quantity: line.quantity,
        };
    });

    const invoice = await createInvoiceWithRetry(employee, workshopId, customerId, resolvedLines);

    res.status(201).json({ invoice });
});

router.get("/:id/qr", async (req, res) => {

    const id = Number(req.params.id);

    const invoice = await prisma.invoice.findUnique({
        where: { invoiceId: id },
        include: { employee: true },
    });

    if (!invoice) {
        return res.status(404).json({ error: "Invoice not found" });
    }

    const qr = await generateInvoiceQr(invoice);

    res.json({ qr });

});

router.get("/:id/pdf", async (req, res) => {
    const id = Number(req.params.id);

    const invoice = await prisma.invoice.findUnique({
        where: { invoiceId: id },
        include: {
            employee: true,
            customer: true,
            workshop: true,
            invoiceLines: true,
        },
    });

    if (!invoice) {
        return res.status(404).json({ error: "Invoice not found" });
    }

    const qrDataUrl = await generateInvoiceQr(invoice);
    const html = buildInvoiceHtml(invoice, qrDataUrl);
    const pdfBuffer = await generatePdf(html);

    res.setHeader("Content-Type", "application/pdf");
    res.send(pdfBuffer);
});

router.get("/", async (req, res) => {
    const invoices = await prisma.invoice.findMany({
      include: {
        customer: {
          select: { customerId: true, name: true },
        },
        workshop: {
          select: { workshopId: true, name: true },
        },
        employee: {
          select: { emplId: true, firstName: true, lastName1: true },
        },
      },
      orderBy: { invoiceId: "desc" },
    });
  
    res.json({ invoices });
  });

export default router;