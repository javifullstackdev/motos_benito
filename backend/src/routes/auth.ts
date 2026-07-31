import { Router } from "express";
import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";
import { requireAuth } from "../middleware/requireAuth";

const router = Router();

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await prisma.empleado.findUnique({
        where: { emailEmpl: email },
    });
    if (!user) {
        return res.status(401).json({ error: "Usuario o contraseña incorrectos" });
    }

    const validPassword = await bcrypt.compare(password, user.passwordEmpl);
    if (!validPassword) {
        return res.status(401).json({ error: "Usuario o contraseña incorrectos" });
    }

    req.session.emplId = user.emplId;
    res.json({ message: "Bienvenido de nuevo, " + user.nombreEmpl });
});

router.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: "Error al cerrar sesión" });
        }
        res.json({ message: "Sesión cerrada correctamente" });
    })
})

router.get("/me", requireAuth, async (req, res) => {
    const emplId = req.session.emplId;
    const user = await prisma.empleado.findUnique({
        where: { emplId },
        select: {
            emplId: true,
            nombreEmpl: true,
            apellido1Empl: true,
            apellido2Empl: true,
            emailEmpl: true,
            activoEmpl: true,
        },
    });
    res.json({ user });
});

export default router;