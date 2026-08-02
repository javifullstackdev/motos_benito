import { Router } from "express";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../middleware/requireAuth";

const router = Router();

router.use(requireAuth);

router.get("/", async (req, res) => {
    const clientes = await prisma.cliente.findMany();
    res.json({ clientes });
});

router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const cliente = await prisma.cliente.findUnique({ where: { clienteId: parseInt(id) } });
    if (!cliente) {
        return res.status(404).json({ error: "Cliente no encontrado" });
    }
    res.json( { cliente });
});

router.post("/", async (req, res) => {
    const cliente = await prisma.cliente.create({ data: req.body });
    res.status(201).json({ cliente });
});

router.put("/:id", async (req, res) => {
    const id = Number(req.params.id);
    const cliente = await prisma.cliente.update({ 
        where: { clienteId: id }, 
        data: req.body 
    });
    res.json({ cliente });
});

router.delete("/:id", async (req, res) => {
    const id  = Number(req.params.id);
    try {
        await prisma.cliente.delete({ where: { clienteId: id } });
        res.json({ message: "Cliente eliminado correctamente" });
    } catch (error) {
        res.status(409).json({ error: "Error al eliminar el cliente, este tiene facturas asociadas" });
    }
});

export default router;