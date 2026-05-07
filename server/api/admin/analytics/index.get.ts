import { getTotalRevenue, getStockCount, getSalesCount, getGraphData } from "~~/server/utils/analytics";

export default defineEventHandler(async (event) => {
    const totalRevenue = await getTotalRevenue()
    const salesCount = await getSalesCount()
    const stockcount = await getStockCount()
    const graphData = await getGraphData()
    return {
        totalRevenue,
        salesCount,
        stockcount,
        graphData,
    }
})