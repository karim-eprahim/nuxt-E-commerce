import type { ColumnDef } from "@tanstack/vue-table";
import { h } from "vue";
import ActionMenu from "@/components/Admin/Product/CellAction.vue";

export interface Products {
  id: string;
  name: string;
  title?: string;
  slug?: string;
  images: { url: string }[];
  price: number;
  category: {
    name: string;
    id: string;
  };
  options?: {
    id: string;
    name: string;
    values: { id: string; value: string }[];
  }[];
  variants?: {
    id: string;
    title: string;
    sku: string;
    price: number;
    isActive: boolean;
    inventory?: {
      stockQuantity: number;
      reservedQuantity: number;
      lowStockThreshold?: number;
    };
  }[];
  isFeatured?: boolean;
  isArchived?: boolean;
  isActive?: boolean;
}

export const columns: ColumnDef<Products>[] = [
  {
    accessorKey: "title",
    header: "Product",
    cell: ({ row }) => {
      const product = row.original;
      return h("div", { class: "min-w-[220px]" }, [
        h("div", { class: "font-medium" }, product.title ?? product.name),
        h("div", { class: "text-xs text-muted-foreground" }, product.slug ?? product.id),
      ]);
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => row.original.category?.name ?? "-",
  },
  {
    accessorKey: "options",
    header: "Options",
    cell: ({ row }) => {
      const options = row.original.options ?? [];
      if (!options.length) return "Default";

      return h("div", { class: "flex flex-wrap gap-1" }, options.map((option) =>
        h("span", { class: "rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground" }, `${option.name}: ${option.values.length}`),
      ));
    },
  },
  {
    accessorKey: "variants",
    header: "Variants",
    cell: ({ row }) => {
      const variants = row.original.variants ?? [];
      const active = variants.filter((variant) => variant.isActive).length;
      return `${active}/${variants.length}`;
    },
  },
  {
    accessorKey: "price",
    header: "Price Range",
    cell: ({ row }) => {
      const prices = (row.original.variants ?? []).map((variant) => variant.price);
      if (!prices.length) return "$0.00";
      const min = Math.min(...prices);
      const max = Math.max(...prices);
      return min === max ? money(min) : `${money(min)} - ${money(max)}`;
    },
  },
  {
    id: "inventory",
    header: "Inventory",
    cell: ({ row }) => {
      const available = (row.original.variants ?? []).reduce((sum, variant) => {
        const stock = variant.inventory?.stockQuantity ?? 0;
        const reserved = variant.inventory?.reservedQuantity ?? 0;
        return sum + stock - reserved;
      }, 0);
      const tone = available <= 0 ? "text-destructive" : "text-foreground";
      return h("span", { class: `font-medium ${tone}` }, `${available} available`);
    },
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      const product = row.original;
      const label = product.isArchived ? "Archived" : product.isActive === false ? "Inactive" : "Active";
      const classes = product.isArchived || product.isActive === false
        ? "rounded-md border px-2 py-1 text-xs text-muted-foreground"
        : "rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary";
      return h("span", { class: classes }, label);
    },
  },
  {
    accessorKey: "isFeatured",
    header: "Featured",
    cell: ({ row }) => (row.original.isFeatured ? "Yes" : "No"),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => h("div", { class: "relative" }, h(ActionMenu, { products: row.original })),
  },
];

const money = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
