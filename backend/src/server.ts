import express from "express";
import "dotenv/config";

const app = express();

const port = process.env.PORT ?? 3000;

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.get("/api/health", (req, res) => {
    res.json({ status: "OK" });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});