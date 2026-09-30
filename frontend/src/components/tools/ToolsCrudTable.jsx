import { Plus } from "lucide-react";

import DeleteConfirmDialog from "@/components/tools/DeleteConfirmDialog";
import ToolForm from "@/components/tools/ToolForm";
import ToolsFilterBar from "@/components/tools/ToolsFilterBar";
import ToolsTableHeader from "@/components/tools/ToolsTableHeader";
import ToolsTableRows from "@/components/tools/ToolsTableRows";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table } from "@/components/ui/table";
import useToolCrud from "@/hooks/useToolCrud";
import useToolsData from "@/hooks/useToolsData";

export default function ToolsCrudTable({ config }) {
  const data = useToolsData(config.api.fetchItems);
  const actions = useToolCrud({
    createItem: config.api.createItem,
    updateItem: config.api.updateItem,
    deleteItem: config.api.deleteItem,
    refetch: data.refetch,
  });
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl font-semibold">{config.heading}</CardTitle>
        <Button onClick={actions.add}><Plus className="mr-2 h-4 w-4" /> {config.addLabel}</Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <ToolsFilterBar fields={config.fields} filters={data.filters} setFilters={data.setFilters} />
        <div className="overflow-x-auto rounded-md border border-border"><Table>
          <ToolsTableHeader columns={config.columns} sortConfig={data.sortConfig} onSort={data.handleSort} />
          <ToolsTableRows loading={data.loading} items={data.filteredData} columns={config.columns} actions={actions} />
        </Table></div>
      </CardContent>
      <ToolForm open={actions.formOpen} onOpenChange={actions.setFormOpen} fields={config.fields}
        initialData={actions.editItem} onSubmit={actions.save} title={config.itemTitle} />
      <ToolForm open={actions.detailOpen} onOpenChange={actions.setDetailOpen} fields={config.fields}
        initialData={actions.detailItem} onSubmit={() => {}} title={config.itemTitle} readOnly />
      <DeleteConfirmDialog open={actions.deleteOpen} onOpenChange={actions.setDeleteOpen}
        onConfirm={actions.confirmDelete} itemName={actions.selectedDeleteItem?.symbol_narzedzia || ""} />
    </Card>
  );
}
