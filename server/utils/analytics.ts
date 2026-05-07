import type { GraphData } from "~~/types";

export const getTotalRevenue = async () => {
  const paidOrders = await db.order.findMany({
    where: {
      isPaid: true,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });

  const totalRevenue = paidOrders.reduce((total, order) => {
    const orderTotal = order.orderItems.reduce((orderSum, item) => {
      return orderSum + item.product.price;
    }, 0);
    return total + orderTotal;
  }, 0);
  return totalRevenue;
};

// stockcount
export const getStockCount = async () => {
  const stockcount = await db.product.count({
    where: {
      isArchived: false,
    },
  });
  return stockcount;
};

// salescount
export const getSalesCount = async () => {
  const salescount = await db.order.count({
    where: {
      isPaid: true,
    },
  });
  return salescount;
};

export const getGraphData = async (): Promise<GraphData[]> => {
  const paidOrders = await db.order.findMany({
    where: {
      isPaid: true,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });

  const monthlyRevenue: { [key: number]: number } = {};

  for (const order of paidOrders) {
    const month = order.createdAt.getMonth();
    let revenueForOrder = 0;
    for (const item of order.orderItems) {
      revenueForOrder += item.product.price;
    }

    monthlyRevenue[month] = (monthlyRevenue[month] || 0) + revenueForOrder;
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
