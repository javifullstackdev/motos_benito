import express from "express";
import "dotenv/config";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { Pool } from "pg";
import cors from "cors";
import authRoutes from "./routes/auth";
import customersRoutes from "./routes/customers";
import itemsRoutes from "./routes/items";
import invoicesRoutes from "./routes/invoices";
import workshopsRoutes from "./routes/workshops";
import statsRoutes from "./routes/stats";

const app = express();

const port = process.env.PORT ?? 3000;

const pgPool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const PgStore = connectPgSimple(session);

app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
    })
);

app.use(
    session({
        store: new PgStore({
            pool: pgPool,
            createTableIfMissing: true,
        }),
        secret: process.env.SESSION_SECRET ?? "dev-secret-change-me",
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 8,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        },
    })
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/customers", customersRoutes);
app.use("/api/items", itemsRoutes);
app.use("/api/invoices", invoicesRoutes);
app.use("/api/workshops", workshopsRoutes);
app.use("/api/stats", statsRoutes);

declare module "express-session" {
    interface SessionData {
        emplId?: number;
    }
}

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.get("/api/health", (req, res) => {
    res.json({ status: "OK" });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});