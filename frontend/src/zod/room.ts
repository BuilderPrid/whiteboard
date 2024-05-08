import {z } from 'zod';

export const roomSchema = z.object({
    name:z.string().min(3).max(255),
})
export type roomType = z.infer<typeof roomSchema>;