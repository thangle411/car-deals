import { z } from "zod";

export const getDataQuerySchema = z.object({
    hostname: z.string().optional().default(""),
    limit: z.coerce.number().int().positive().max(1000).default(100),
    orderBy: z.enum(["asc", "desc"]).default("asc"),
    date: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/)
        .default(() => new Date().toISOString().split("T")[0]),
});

export type GetDataQuery = z.infer<typeof getDataQuerySchema>;

export const saveDealsSchema = z.object({
    hostname: z.string(),
    data: z.array(z.object({
        id: z.string(),
        title: z.string(),
        price: z.number(),
        image: z.string(),
        link: z.string(),
    })),
});


