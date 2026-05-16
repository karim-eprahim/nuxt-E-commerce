import type { GraphData } from "~~/types";

export const getTotalRevenue = async () => {
  const paidOrders = await db.order.findMany({
    where: {
      paymentStatus: "PAID",
    },
  });

  const totalRevenue = paidOrders.reduce((total, order) => total + order.total, 0);
  return totalRevenue;
};

// stockcount
export const getStockCount = async () => {
  const stockcount = await db.productVariant.count({
    where: {
      isActive: true,
      product: {
        isArchived: false,
      },
    },
  });
  return stockcount;
};

// salescount
export const getSalesCount = async () => {
  const salescount = await db.order.count({
    where: {
      paymentStatus: "PAID",
    },
  });
  return salescount;
};

export const getGraphData = async (): Promise<GraphData[]> => {
  const paidOrders = await db.order.findMany({
    where: {
      paymentStatus: "PAID",
    },
  });

  const monthlyRevenue: { [key: number]: number } = {};

  for (const order of paidOrders) {
    const month = order.createdAt.getMonth();
    monthlyRevenue[month] = (monthlyRevenue[month] || 0) + order.total;
  }

  // converting the grouped data into the format of graphData
  const graphData: GraphData[] = Object.entries(monthlyRevenue).map(
    ([month, revenue]) => {
      return {
        name: new Date(Date.UTC(new Date().getFullYear(), Number(month), 1)).toLocaleString("default", { month: "short" }),
        total: revenue,
      };
    }
  );

  return graphData;
};

// // total orders
// export const getTotalOrders = async () => {
//   const totalOrders = await db.order.count();
//   return totalOrders;
// };

// // graph data

// export const getGraphData = async () => {
//   const graphData = await db.order.findMany({
//     where: {
//       isPaid: true,
//     },
//     include: {
//       orderItems: {
//         include: {
//           product: true,
//         },
//       },
//     },
//   });
//   return graphData;
// };
