import { z } from 'zod';

export const authSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().max(255).default('').optional(),
})

export type AuthSchema = z.infer<typeof authSchema>