import { createMillingCutter, deleteMillingCutter, getMillingCutters, updateMillingCutter } from "@/api/millingCutters";
import ToolsCrudTable from "@/components/tools/ToolsCrudTable";
import { MILLING_CUTTER_COLUMNS, MILLING_CUTTER_FIELDS } from "@/constants/toolFields";

const CONFIG = {
  heading: "Frezy", addLabel: "Dodaj frez", itemTitle: "Frez",
  fields: MILLING_CUTTER_FIELDS, columns: MILLING_CUTTER_COLUMNS,
  api: { fetchItems: getMillingCutters, createItem: createMillingCutter,
    updateItem: updateMillingCutter, deleteItem: deleteMillingCutter },
};

export default function MillingCuttersTable() {
  return <ToolsCrudTable config={CONFIG} />;
}
