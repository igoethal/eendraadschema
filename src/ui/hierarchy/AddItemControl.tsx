import { useState } from "react";
import { ui } from "../uiStyles";
import { GroupedItemTypeOptions } from "./GroupedItemTypeOptions";

interface AddItemControlProps {
  readonly allowedTypes: readonly string[];
  readonly label: string;
  readonly onAdd: (type: string) => void;
}

export function AddItemControl({ allowedTypes, label, onAdd }: AddItemControlProps) {
  const [selectedType, setSelectedType] = useState(allowedTypes[0] ?? "");
  const currentType = allowedTypes.includes(selectedType) ? selectedType : (allowedTypes[0] ?? "");

  if (allowedTypes.length === 0) return null;

  return (
    <div className="mt-1 mb-2 ml-9 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-1 rounded-md bg-neutral-100 p-1.5">
      <label className="min-w-0">
        <span className="sr-only">{label}</span>
        <select
          className={ui.field}
          aria-label={label}
          value={currentType}
          onChange={(event) => setSelectedType(event.currentTarget.value)}
        >
          <GroupedItemTypeOptions types={allowedTypes} />
        </select>
      </label>
      <button className={ui.button} type="button" onClick={() => onAdd(currentType)} disabled={currentType === ""}>
        Toevoegen
      </button>
    </div>
  );
}
