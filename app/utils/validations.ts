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
export const colorSchema = z.object({
    name: z.string().min(1, { message: 'color name is required' }),
    value: z.string().min(1, { message: 'color value is required' }).default('#000000'),
})
export const sizeSchema = z.object({
    name: z.string().min(1, { message: 'size name is required' }),
    value: z.string().min(1, { message: 'size value is required' }),
})

export type AuthSchema = z.infer<typeof authSchema>
export type ColorSchema = z.infer<typeof colorSchema>
export type SizeSchema = z.infer<typeof sizeSchema>