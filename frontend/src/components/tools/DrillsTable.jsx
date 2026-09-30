import { createDrill, deleteDrill, getDrills, updateDrill } from "@/api/drills";
import ToolsCrudTable from "@/components/tools/ToolsCrudTable";
import { DRILL_COLUMNS, DRILL_FIELDS } from "@/constants/toolFields";

const CONFIG = {
  heading: "Wiertła", addLabel: "Dodaj wiertło", itemTitle: "Wiertło",
  fields: DRILL_FIELDS, columns: DRILL_COLUMNS,
  api: { fetchItems: getDrills, createItem: createDrill, updateItem: updateDrill, deleteItem: deleteDrill },
};

export default function DrillsTable() {
  return <ToolsCrudTable config={CONFIG} />;
}
