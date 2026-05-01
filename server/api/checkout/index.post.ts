export default defineEventHandler(async (event) => {
    const productIds = await readBody(event)

    if(!productIds || !productIds.length){
        throw createError({
            statusCode: 400,
            statusMessage: 'Products are required'
        })
    }
    
    const products = await db.product.findMany({
        where: {
            id: {
                in: productIds
            }
        }
    })

    if(!products){
        throw createError({
            statusCode: 404,
            statusMessage: 'Products not found'
        })
    }else{
        const order = await db.order.create({
            data: {
                isPaid: false,
                orderItems: {
                    create: productIds.map((productId: string) => ({
                        product: {
                            connect: {
                                id: productId
                            }
                        }
                    }))
                }
            }
        })
        
        return {
            order
        }
    }
})