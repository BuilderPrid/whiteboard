import {z } from 'zod';

export const roomSchema = z.object({
    name:z.string().min(3).max(255),
    host:z.string().email(),
    createdAt:z.date()
})
export type roomType = z.infer<typeof roomSchema>;