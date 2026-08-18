import { Router } from "express";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../middleware/requireAuth";

const router = Router();

router.use(requireAuth);

router.get("/", async (req, res) => {
    const customers = await prisma.customer.findMany({
        orderBy: { customerId: "desc" },
    });
    res.json({ customers });
});

router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const customer = await prisma.customer.findUnique({ where: { customerId: parseInt(id) } });
    if (!customer) {
        return res.status(404).json({ error: "Cliente no encontrado" });
    }
    res.json( { customer });
});

router.post("/", async (req, res) => {
    const customer = await prisma.customer.create({ data: req.body });
    res.status(201).json({ customer });
});

router.put("/:id", async (req, res) => {
    const id = Number(req.params.id);
    const customer = await prisma.customer.update({ 
        where: { customerId: id }, 
        data: req.body 
    });
    res.json({ customer });
});

router.delete("/:id", async (req, res) => {
    const id  = Number(req.params.id);
    try {
        await prisma.customer.delete({ where: { customerId: id } });
        res.json({ message: "Cliente eliminado correctamente" });
    } catch (error) {
        res.status(409).json({ error: "Error al eliminar el cliente, este tiene facturas asociadas" });
    }
});

export default router;