import { Router } from "express";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../middleware/requireAuth";

const router = Router();

router.use(requireAuth);

router.get("/", async (req, res) => {
    const articulos = await prisma.articulo.findMany();
    res.json({ articulos });
})

router.get("/:id", async (req, res) => {
    const id = Number(req.params.id);

    const articulo = await prisma.articulo.findUnique({ 
        where: { articuloId: id } 
    });

    if (!articulo) {
        return res.status(404).json({ error: "Articulo no encontrado" });
    }

    res.json({ articulo });
});

router.post("/", async (req, res) => {
    const articulo = await prisma.articulo.create({
        data: req.body,
    })

    res.status(201).json({ articulo });
})

router.put("/:id", async (req, res) => {
    const id = Number(req.params.id);

    try {
        const articulo = await prisma.articulo.update({
        where: { articuloId: id },
        data: req.body,
    });

    res.json({ articulo });
    } catch (error) {
        res.status(404).json({ error: "Articulo no encontrado" });
    }
});

router.delete("/:id", async (req, res) => {
    const id = Number(req.params.id);

    try {
        await prisma.articulo.delete({ where: { articuloId: id } });
        res.json({ message: "Articulo eliminado correctamente" });
    } catch (error) {
        res.status(409).json({ error: "Error al eliminar el articulo, este tiene facturas asociadas" });
    }
});

export default router;

