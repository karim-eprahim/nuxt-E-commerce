<script setup lang="ts" generic="TData, TValue">
import type { ColumnDef, ColumnFiltersState } from "@tanstack/vue-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FlexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useVueTable,
  getFilteredRowModel,
} from "@tanstack/vue-table";
import { valueUpdater } from "~/lib/utils";

const props = defineProps<{
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  columnToSearch: string;
}>();

const columnFilters = ref<ColumnFiltersState>([]);

const table = useVueTable({
  get data() {
    return props.data;
  },
  get columns() {
    return props.columns;
  },
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  onColumnFiltersChange: updateOrValue => valueUpdater(updateOrValue, columnFilters),
  getFilteredRowModel: getFilteredRowModel(),
  state: {
    get columnFilters() { return columnFilters.value },
  },
  initialState: {
    pagination: {
      pageSize: 10,
    },
  },
});
</script>

<template>
  <div>
            <!-- <Input
          placeholder="Filter emails..."
          :value="table.getColumn(props.columnToSearch)?.getFilterValue() as string"
          @onchange="(event) => table.getColumn(props.columnToSearch)?.setFilterValue(event.target.value)"
          className="max-w-sm"
        /> -->
        <div class="flex items-center py-4">
          <Input
            placeholder="Filter..."
            :value="table.getColumn(props.columnToSearch)?.getFilterValue() as string"
            @update:model-value="table.getColumn(props.columnToSearch)?.setFilterValue($event)"
            class="max-w-sm"
          />
        </div>

    <div class="border rounded-md">
      <Table>
        <TableHeader class="bg-muted">
          <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
            <TableHead v-for="header in headerGroup.headers" :key="header.id">
              <FlexRender :render="header.column.columnDef.header" :props="header.getContext()" />
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          <TableRow v-for="row in table.getRowModel().rows" :key="row.id">
            <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
              <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
    <!-- pagination  -->
    <div className="flex items-center justify-end space-x-2 py-4">
      <Button variant="outline" size="sm" @click="table.previousPage()" :disabled="!table.getCanPreviousPage()">
        Previous
      </Button>
      <Button variant="outline" size="sm" @click="table.nextPage()" :disabled="!table.getCanNextPage()">
        Next
      </Button>
    </div>
  </div>
</template>
