// src/types/express.d.ts
import "express";
import type { GetDataQuery } from "../lib/validators/data.query.ts";

declare global {
    namespace Express {
        interface Request {
            validatedData?: {
                body?: unknown;
                query?: GetDataQuery;
                params?: unknown;
            };
        }
    }
}
