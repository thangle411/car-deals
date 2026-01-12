import express from "express";
import { Request, Response } from "express";
import { ApiData } from "../types.ts";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// ES module compatibility for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.post("/submit", (req: Request<{}, {}, {
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

app.listen(3000, () => {
    console.log("Server started on port 3000");
});

const saveData = (body: {
    hostname: string,
    data: ApiData[]
}) => {
    if (!body.hostname || !body.data) {
        console.log("No hostname or data")
        return;
    }
    const today = new Date();
    const now = today.toISOString().split("T")[0];
    if (!fs.existsSync(path.join(__dirname, "data"))) {
        fs.mkdirSync(path.join(__dirname, "data"));
    }

    const fileName = `data-${now}.json`;
    const filePath = path.join(__dirname, "data", fileName);


    if (fs.existsSync(filePath)) {
        const fileData = fs.readFileSync(filePath);
        const fileDataJson = JSON.parse(fileData.toString());
        // handle overwriting data issue when extension keeps sending data over on the same day
        // due to extension lifecycle
        if (fileDataJson[body.hostname]) {
            console.log(`Data already exists for hostname for ${now} for ${body.hostname}`);
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
}

const dedupe = () => {

}