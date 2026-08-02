import { Router } from "express";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../middleware/requireAuth";

const router = Router();

router.use(requireAuth);

router.get("/", async (req, res) => {
    const items = await prisma.item.findMany();
    res.json({ items });
})

router.get("/:id", async (req, res) => {
    const id = Number(req.params.id);

    const item = await prisma.item.findUnique({ 
        where: { itemId: id } 
    });

    if (!item) {
        return res.status(404).json({ error: "Articulo no encontrado" });
    }

    res.json({ item });
});

router.post("/", async (req, res) => {
    const item = await prisma.item.create({
        data: req.body,
    })

    res.status(201).json({ item });
})

router.put("/:id", async (req, res) => {
    const id = Number(req.params.id);

    try {
        const item = await prisma.item.update({
        where: { itemId: id },
        data: req.body,
    });

    res.json({ item });
    } catch (error) {
        res.status(404).json({ error: "Articulo no encontrado" });
    }
});

router.delete("/:id", async (req, res) => {
    const id = Number(req.params.id);

    try {
        await prisma.item.delete({ where: { itemId: id } });
        res.json({ message: "Articulo eliminado correctamente" });
    } catch (error) {
        res.status(409).json({ error: "Error al eliminar el articulo, este tiene facturas asociadas" });
    }
});

export default router;

