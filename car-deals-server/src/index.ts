import express from "express";
import dealsRoutes from "./routes/dealsRoutes.ts";

const app = express();

// routes
app.use("/deals", dealsRoutes);

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(3000, () => {
    console.log("Server started on port 3000");
});

