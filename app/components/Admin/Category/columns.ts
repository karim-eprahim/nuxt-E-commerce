// columns.ts
import type { ColumnDef,ColumnFiltersState  } from "@tanstack/vue-table";
import { h } from "vue";
import ActionMenu from "@/components/Admin/Category/CellAction.vue"
import { valueUpdater } from "@/lib/utils";

export interface Category {
  id: string;
  name: string;
  createdAt: Date;
}

export const columns: ColumnDef<Category>[] = [
  {
    accessorKey: "name",
    header: "Name",
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
      const category = row.original;

      // return h("div", { 
      // // class: "flex items-center gap-2", 
      // // }, [ 
      // // h("button", { 
      // // class: "btn btn-primary", 
      // // onClick: () => navigateTo(/admin/categories/${category.id}), 
      // // }, "Edit"), 
      // // h("button", { 
      // // class: "btn btn-error", 
      // // onClick: () => navigateTo(/admin/categories/${category.id}), 
      // // }, "Delete"), 
      // // ])

      // return h(
      //   DropdownMenu,
      //   {},
      //   {
      //     default: () =>
      //       h("div", { class: "relative" }, [
      //         h(
      //           DropdownMenuTrigger,
      //           { asChild: true },
      //           {
      //             default: () =>
      //               h(
      //                 Button,
      //                 {
      //                   variant: "ghost",
      //                   size: "icon",
      //                   "aria-label": "More Options",
      //                 },
      //                 {
      //                   default: () => h(MoreHorizontalIcon),
      //                 },
      //               ),
      //           },
      //         ),

      //         h(
      //           DropdownMenuContent,
      //           {},
      //           {
      //             default: () => [
      //               h(
      //                 DropdownMenuItem,
      //                 {
      //                   onClick: () =>
      //                     navigateTo(`/admin/categories/${category.id}`),
      //                 },
      //                 () => "Edit",
      //               ),

      //               h(
      //                 DropdownMenuItem,
      //                 {
      //                   class: "text-red-500 hover:text-red-500",
      //                   variant: "destructive",
      //                   onClick: () => {
      //                     console.log("Delete", category.id);
      //                   },
      //                 },
      //                 () => "Delete",
      //               ),
      //             ],
      //           },
      //         ),
      //       ]),
      //   },
      // );

      return h(`div`,{class:'relative'},h(ActionMenu,{category}))
    },
  },
];
