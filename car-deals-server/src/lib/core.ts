import fs from "fs";
import path from "path";
import { ApiData } from "../../types.ts";
import { fileURLToPath } from "url";

// ES module compatibility for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const saveData = (body: {
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

export const getData = ({ date, hostname, limit, orderBy }: { date?: string, hostname: string, limit: number, orderBy: "asc" | "desc" }) => {
    let results: ApiData[] = [];

    const filePath = path.join(__dirname, "data", `data-${date}.json`);
    if (!fs.existsSync(filePath)) {
        console.log("File does not exist");
        return [];
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

    if (limit > results.length) {
        return results;
    } else if (limit < results.length) {
        results = results.slice(0, limit);
    }

    return results;
}