export default defineEventHandler(async (event) => {
    const products = await db.product.findMany({
        orderBy: {
            createdAt: 'desc'
        }
    })
    return products
})