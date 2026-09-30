import { createMillingHead, deleteMillingHead, getMillingHeads, updateMillingHead } from "@/api/millingHeads";
import ToolsCrudTable from "@/components/tools/ToolsCrudTable";
import { MILLING_HEAD_COLUMNS, MILLING_HEAD_FIELDS } from "@/constants/toolFields";

const CONFIG = {
  heading: "Głowice frezarskie", addLabel: "Dodaj głowicę", itemTitle: "Głowica frezarska",
  fields: MILLING_HEAD_FIELDS, columns: MILLING_HEAD_COLUMNS,
  api: { fetchItems: getMillingHeads, createItem: createMillingHead,
    updateItem: updateMillingHead, deleteItem: deleteMillingHead },
};

export default function MillingHeadsTable() {
  return <ToolsCrudTable config={CONFIG} />;
}
