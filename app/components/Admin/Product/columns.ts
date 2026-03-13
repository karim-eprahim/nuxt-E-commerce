// columns.ts
import type { ColumnDef, ColumnFiltersState } from "@tanstack/vue-table";
import { h } from "vue";
import ActionMenu from "@/components/Admin/Color/CellAction.vue";
import { valueUpdater } from "@/lib/utils";

export interface Products {
  name: string
  images: {
    url: string
  }[]
  price: number
  categoryId: string
  colorId: string
  sizeId: string
  isFeatured?: boolean
  isArchived?: boolean
}

export const columns: ColumnDef<Products>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const color = row.original.price;
      return h("div", { class: "flex items-center gap-2" }, [
        h("div", {
          class: "w-6 h-6 rounded-full border shadow-sm",
          style: { backgroundColor: color },
        }),
        h("span", { class: "text-muted-foreground text-sm" }, color),
      ]);
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => row.original.categoryId,
  },
  {
    accessorKey: "size",
    header: "Size",
    cell: ({ row }) => row.original.sizeId,
  },
  {
    accessorKey: "color",
    header: "Color",
    cell: ({ row }) => row.original.colorId,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const products = row.original;

      // return h("div", {
      // // class: "flex items-center gap-2",
      // // }, [
      // // h("button", {
      // // class: "btn btn-primary",
      // // onClick: () => navigateTo(/admin/colors/${color.id}),
      // // }, "Edit"),
      // // h("button", {
      // // class: "btn btn-error",
      // // onClick: () => navigateTo(/admin/colors/${color.id}),
      // // }, "Delete"),
      // // ])

      return h(`div`, { class: "relative" }, h(ActionMenu, { products }));
    },
  },
];
