import { Router } from "express";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../middleware/requireAuth";

const router = Router();

router.use(requireAuth);

router.get("/", async (req, res) => {
  const employees = await prisma.employee.findMany({
    select: { emplId: true, firstName: true, lastName1: true, lastName2: true },
    where: { active: true },
    orderBy: { firstName: "asc" },
  });
  res.json({ employees });
});

export default router;