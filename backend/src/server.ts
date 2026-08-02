import express from "express";
import "dotenv/config";
import session from "express-session";
import authRoutes from "./routes/auth";
import customersRoutes from "./routes/customers";
import itemsRoutes from "./routes/items";


const app = express();

const port = process.env.PORT ?? 3000;

app.use(express.json());

app.use(
    session({
        secret: process.env.SESSION_SECRET ?? "dev-secret-change-me",
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 8, // 8 hours
        },
    })
);

app.use("/api/auth", authRoutes);
app.use("/api/customers", customersRoutes);
app.use("/api/items", itemsRoutes);

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