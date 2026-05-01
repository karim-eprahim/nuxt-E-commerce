export type APIError = {
    statusCode: number,
    statusMessage: string,
    message: string,
    data?: Record<string, string>
}

export type RouteParams = {
    categoryId: string;
    colorId: string;
    productId: string;
    sizeId: string;
}

export type SafeProduct = {
    id: string
    name: string
    price: number
    description: string
    images: any
    categoryId: string
    categoryName: string
    sizeId: string
    colorId: string
    size?: any
    color?: any
    category?: any
    colorName: string
    createdAt: string
    updatedAt: string
}
