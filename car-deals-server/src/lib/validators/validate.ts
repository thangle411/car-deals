import { ZodType } from "zod";
import { Request, Response, NextFunction } from "express";

type RequestProperty = "body" | "query" | "params";

export const validate =
    (schema: ZodType, property: RequestProperty) =>
        (req: Request, res: Response, next: NextFunction) => {
            const parsed = schema.safeParse(req[property]);

            if (!parsed.success) {
                return res.status(400).json({
                    error: "Invalid request",
                    details: parsed.error.flatten(),
                });
            }

            req.validatedData = {
                ...req.validatedData,
                [property]: parsed.data,
            };

            next();
        };
