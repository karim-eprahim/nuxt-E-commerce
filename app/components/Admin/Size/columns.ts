// columns.ts
import type { ColumnDef, ColumnFiltersState } from "@tanstack/vue-table";
import { h } from "vue";
import ActionMenu from "@/components/Admin/Size/CellAction.vue";
import { valueUpdater } from "@/lib/utils";

export interface Size {
  id: string;
  name: string;
  value: string;
  createdAt: Date;
}

export const columns: ColumnDef<Size>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "value",
    header: "Value",
    // cell: ({ row }) => {
    //   const size = row.original.value;
    //   return h("div", { class: "flex items-center gap-2" }, [
    //     h("span", { class: "text-muted-foreground text-sm" }, size),
    //   ]);
    // },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const size = row.original;

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

      return h(`div`, { class: "relative" }, h(ActionMenu, { size }));
    },
  },
];
