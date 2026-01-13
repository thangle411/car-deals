import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { ApiData } from "../../../types.ts";

// ES module compatibility for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getDeals = (req: Request, res: Response) => {
    const { hostname, limit, orderBy, date } = req.validatedData?.query ?? {};

    let results: ApiData[] = [];

    const filePath = path.join(__dirname, "..", "..", "data", `data-${date}.json`);
    console.log(filePath);
    if (!fs.existsSync(filePath)) {
        console.log("File does not exist");
        res.status(404).send({ message: "File does not exist" });
        return;
    }
    const fileData = fs.readFileSync(filePath);
    const fileDataJson = JSON.parse(fileData.toString());

    for (const brand in fileDataJson) {
        if (hostname && brand !== hostname) {
            continue;
        }
        results.push(...fileDataJson[brand]);
    }

    if (orderBy === "desc") {
        results.reverse();
    }

    if (limit && Number(limit) < results.length) {
        results = results.slice(0, Number(limit));
    }

    res.status(200).send(results);
}

export const saveDeals = (req: Request<{}, {}, {
    hostname: string,
    data: ApiData[]
}, any, Record<string, any>>, res: Response) => {
    if (!req.body) {
        res.status(400).send({ message: "No data" });
        return;
    }
    const { body } = req;
    if (!body.hostname || !body.data) {
        res.status(400).send({ message: "No data" });
        return;
    }
    const today = new Date();
    const now = today.toISOString().split("T")[0];
    if (!fs.existsSync(path.join(__dirname, "..", "..", "data"))) {
        fs.mkdirSync(path.join(__dirname, "..", "..", "data"));
    }

    const fileName = `data-${now}.json`;
    const filePath = path.join(__dirname, "..", "..", "data", fileName);


    if (fs.existsSync(filePath)) {
        const fileData = fs.readFileSync(filePath);
        const fileDataJson = JSON.parse(fileData.toString());
        // handle overwriting data issue when extension keeps sending data over on the same day
        // due to extension lifecycle
        if (fileDataJson[body.hostname]) {
            console.log(`Data already exists for hostname for ${now} for ${body.hostname}`);
            res.status(400).send({ message: "Data already exists" });
            return;
        }
        fileDataJson[body.hostname] = body.data;
        fs.writeFileSync(filePath, JSON.stringify(fileDataJson));
    } else {
        const fileDataJson: any = {};
        fileDataJson[body.hostname] = body.data;
        console.log(`New file created for ${now} for ${body.hostname}`, filePath);
        fs.writeFileSync(filePath, JSON.stringify(fileDataJson));
    }

    res.status(200).send({ message: "success" });
}