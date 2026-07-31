import { Request, Response, NextFunction } from "express";

function requireAuth(req: Request, res: Response, next: NextFunction) {
    if (!req.session.emplId) {
        return res.status(401).json({ error: "No estás autenticado" });
    }
    next();
}

export { requireAuth };