import { Router } from "express";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../middleware/requireAuth";

const router = Router();

router.use(requireAuth);

router.get("/top-items", async (req, res) => {
  const grouped = await prisma.invoiceLine.groupBy({
    by: ["itemId"],
    _sum: {
      quantity: true,
    },
    orderBy: {
      _sum: {
        quantity: "desc",
      },
    },
    take: 5,
  });

  const itemIds = grouped.map((entry) => entry.itemId);

  const items = await prisma.item.findMany({
    where: { itemId: { in: itemIds } },
  });

  const topItems = grouped.map((entry) => {
    const item = items.find((i) => i.itemId === entry.itemId);
    return {
      itemId: entry.itemId,
      name: item?.name,
      totalSold: Number(entry._sum.quantity),
    };
  });

  res.json({ topItems });
});

router.get("/revenue-by-month", async (req, res) => {
    const invoices = await prisma.invoice.findMany({
      select: { issueDate: true, total: true },
    });
  
    const revenueByMonth: Record<string, number> = {};
  
    for (const invoice of invoices) {
      const monthKey = invoice.issueDate.toISOString().slice(0, 7);
      const total = Number(invoice.total);
      revenueByMonth[monthKey] = (revenueByMonth[monthKey] ?? 0) + total;
    }
  
    const result = Object.entries(revenueByMonth)
      .map(([month, revenue]) => ({ month, revenue }))
      .sort((a, b) => a.month.localeCompare(b.month));
  
    res.json({ revenueByMonth: result });
  });

export default router;