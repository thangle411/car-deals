import { Router } from "express";
import { Request, Response } from "express";
import { ApiData } from "../../types.ts";
import { getData, saveData } from "../lib/core.ts";

const app = Router();

app.get("/", (req, res) => {
    const { hostname, limit, orderBy, date } = req.query;

    const validatedDate = (typeof date === "string" ? date : undefined) || new Date().toISOString().split("T")[0];
    const validatedOrderBy: "asc" | "desc" =
        (typeof orderBy === "string" && (orderBy === "asc" || orderBy === "desc"))
            ? orderBy
            : "asc";
    const validatedLimit = limit || 100;
    const validatedHostname = (typeof hostname === "string" ? hostname : "");

    console.log("hostname", validatedHostname);
    console.log("limit", validatedLimit);
    console.log("orderBy", validatedOrderBy);
    console.log("date", validatedDate);

    const data = getData({
        date: validatedDate,
        hostname: validatedHostname,
        limit: Number(validatedLimit),
        orderBy: validatedOrderBy
    });

    res.send(data);
})

app.post("/", (req: Request<{}, {}, {
    hostname: string,
    data: ApiData[]
}, any, Record<string, any>>, res: Response) => {
    if (!req.body) {
        res.status(400).send({ message: "No data" });
        return;
    }
    saveData(req.body);
    res.status(200).send({ message: "success" });
});

export default app;
