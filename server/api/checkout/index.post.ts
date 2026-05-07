import { stripe } from "../../utils/stripe";

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

    if(!products.length){
        throw createError({
            statusCode: 404,
            statusMessage: 'Products not found'
        })
    }
    
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

    // stripe session
    const origin = getRequestURL(event).origin
    const session = await stripe().checkout.sessions.create({
        // mode: 'payment',
        // paymentMethodTypes: ['card'],
        line_items: products.map(product => {
            return {
                quantity: 1,
                price_data:{
                    currency:"usd",
                    product_data:{
                        name: product.name,
                    },
                    unit_amount: product.price * 100,
                }

            }
        }),
        mode: "payment",
        billing_address_collection: "required",
        phone_number_collection:{
            enabled:true
        },
        success_url: `${origin}/cart?success=1`,
        cancel_url: `${origin}/cart?success=2`,
        metadata: {
            orderId: order.id
        }
    })
    
    return {
        url: session.url
    }
})