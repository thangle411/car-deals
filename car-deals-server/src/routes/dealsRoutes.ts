import { Router } from "express";
import { getDeals, saveDeals } from "../lib/controllers/dealsControllers.ts";
import { validate } from "../lib/validators/validate.ts";
import { getDataQuerySchema, saveDealsSchema } from "../lib/validators/data.query.ts";

const app = Router();

app.get("/", validate(getDataQuerySchema, "query"), getDeals)

app.post("/", validate(saveDealsSchema, "body"), saveDeals);

export default app;
