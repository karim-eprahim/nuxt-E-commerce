import { z } from 'zod';

const numeric = z.preprocess((value) => {
    if (value === '' || value === undefined || value === null) return undefined
    return typeof value === 'string' ? Number(value) : value
}, z.number())

const integer = z.preprocess((value) => {
    if (value === '' || value === undefined || value === null) return undefined
    return typeof value === 'string' ? Number(value) : value
}, z.number().int())

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
export const productSchema = z.object({
    title: z.string().min(1, { message: 'product title is required' }).optional(),
    name: z.string().min(1, { message: 'product name is required' }).optional(),
    slug: z.string().min(1).optional(),
    description: z.string().optional(),
    brandId: z.string().optional(),
    images: z.object({
        url: z.string().min(1),
        altText: z.string().optional(),
        isThumbnail: z.boolean().optional(),
        sortOrder: z.number().optional(),
    }).array().default([]),
    price: numeric.pipe(z.number().min(0, { message: 'product price is required' })).optional(),
    compareAtPrice: numeric.pipe(z.number().min(0)).optional(),
    costPrice: numeric.pipe(z.number().min(0)).optional(),
    sku: z.string().optional(),
    barcode: z.string().optional(),
    stockQuantity: integer.pipe(z.number().int().min(0)).optional(),
    reservedQuantity: integer.pipe(z.number().int().min(0)).optional(),
    lowStockThreshold: integer.pipe(z.number().int().min(0)).optional(),
    allowBackorders: z.boolean().optional(),
    categoryId: z.string().min(1, { message: 'product category is required' }),
    colorId: z.string().optional(),
    sizeId: z.string().optional(),
    options: z.object({
        name: z.string().min(1),
        values: z.string().min(1).array().min(1),
    }).array().optional(),
    variants: z.object({
        title: z.string().optional(),
        sku: z.string().optional(),
        barcode: z.string().optional(),
        price: numeric.pipe(z.number().min(0)),
        compareAtPrice: numeric.pipe(z.number().min(0)).optional(),
        costPrice: numeric.pipe(z.number().min(0)).optional(),
        weight: numeric.pipe(z.number().min(0)).optional(),
        trackInventory: z.boolean().optional(),
        isActive: z.boolean().optional(),
        position: integer.optional(),
        stockQuantity: integer.pipe(z.number().int().min(0)).optional(),
        reservedQuantity: integer.pipe(z.number().int().min(0)).optional(),
        lowStockThreshold: integer.pipe(z.number().int().min(0)).optional(),
        allowBackorders: z.boolean().optional(),
        images: z.object({
            url: z.string().min(1),
            altText: z.string().optional(),
            isThumbnail: z.boolean().optional(),
            sortOrder: z.number().optional(),
        }).array().optional(),
        options: z.record(z.string()).optional(),
    }).array().optional(),
    isFeatured: z.boolean().default(false).optional(),
    isArchived: z.boolean().default(false).optional(),
    isActive: z.boolean().default(true).optional(),
    tags: z.string().array().optional(),
}).refine((value) => value.title || value.name, {
    message: 'product title is required',
    path: ['title'],
})

export type AuthSchema = z.infer<typeof authSchema>
export type ColorSchema = z.infer<typeof colorSchema>
export type SizeSchema = z.infer<typeof sizeSchema>
export type ProductSchema = z.infer<typeof productSchema>
