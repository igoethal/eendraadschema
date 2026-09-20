import { propertyStyles, ui } from "../uiStyles";

export type PropertyOption<Value extends string> = readonly [Value, string];

interface SelectFieldProps<Value extends string> {
  readonly label: string;
  readonly value: string;
  readonly options: ReadonlyArray<PropertyOption<Value>>;
  readonly onChange: (value: Value) => void;
}

export function SelectField<Value extends string>({
  label,
  value,
  options,
  onChange,
}: SelectFieldProps<Value>) {
  const isKnownValue = options.some(([optionValue]) => optionValue === value);
  return (
    <label className={propertyStyles.field}>
      <span>{label}</span>
      <select className={ui.field} value={value} onChange={(event) => onChange(event.target.value as Value)}>
        {isKnownValue ? null : <option value={value}>Huidige waarde: {value}</option>}
        {options.map(([optionValue, optionLabel]) => (
          <option key={optionValue} value={optionValue}>{optionLabel}</option>
        ))}
      </select>
    </label>
  );
}

interface CheckboxFieldProps {
  readonly label: string;
  readonly checked: boolean;
  readonly onChange: (checked: boolean) => void;
}

export function CheckboxField({ label, checked, onChange }: CheckboxFieldProps) {
  return (
    <label className={propertyStyles.checkbox}>
      <input
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        type="checkbox"
      />
      <span>{label}</span>
    </label>
  );
}
