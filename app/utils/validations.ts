import { z } from 'zod';

export const authSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().max(255).default('').optional(),
})
export const categorySchema = z.object({
    name: z.string().min(1),
    // slug: z.string().min(3),
    // description: z.string().min(3),
    // image: z.string().min(3),
})

export type AuthSchema = z.infer<typeof authSchema>