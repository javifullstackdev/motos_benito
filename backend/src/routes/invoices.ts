import { Router } from "express";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../middleware/requireAuth";

const router = Router();

router.use(requireAuth);

function calculateInitials(firstName: string, lastName1: string, lastName2: string) : string {
    return (firstName[0] + lastName1[0] + lastName2[0]).toUpperCase();
}

async function createInvoiceWithRetry(employee: any, maxAttempts = 5) {
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

export default router;