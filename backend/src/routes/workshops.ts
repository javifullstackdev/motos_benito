import { Router } from "express";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../middleware/requireAuth";

const router = Router();

router.use(requireAuth);

router.get("/", async (req, res) => {
  const workshops = await prisma.workshop.findMany();
  res.json({ workshops });
});

export default router;