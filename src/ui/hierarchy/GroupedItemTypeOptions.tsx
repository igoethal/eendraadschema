const TYPE_GROUPS: readonly [label: string, types: ReadonlySet<string>][] = [
  ["Structuur en verdeling", new Set(["Aansluiting", "Bord", "Kring", "Splitsing", "Verlenging", "Leiding", "Vrije ruimte"])],
  ["Stopcontacten en aansluitingen", new Set(["Contactdoos", "Aansluitpunt", "Aftakdoos", "USB lader", "Media"])],
  ["Verlichting en bediening", new Set(["Lichtpunt", "Lichtcircuit", "Schakelaars", "Drukknop", "Bel", "Domotica", "Domotica module (verticaal)", "Domotica gestuurde verbruiker"])],
  ["Toestellen en verbruikers", new Set(["Boiler", "Diepvriezer", "Droogkast", "Elektrische oven", "Ketel", "Koelkast", "Kookfornuis", "Microgolfoven", "Motor", "Stoomoven", "Vaatwasmachine", "Ventilator", "Verwarmingstoestel", "Verbruiker", "Warmtepomp/airco", "Wasmachine", "Meerdere verbruikers"])],
  ["Energie en beveiliging", new Set(["Batterij", "Elektriciteitsmeter", "EV lader", "Omvormer", "Overspanningsbeveiliging", "Transformator", "Zekering/differentieel", "Zonnepaneel"])],
];

export function GroupedItemTypeOptions({ types }: { readonly types: readonly string[] }) {
  const remaining = new Set(types);
  const groups = TYPE_GROUPS.flatMap(([label, candidates]) => {
    const matches = types.filter((type) => candidates.has(type));
    for (const match of matches) remaining.delete(match);
    return matches.length > 0 ? [{ label, types: matches }] : [];
  });
  if (remaining.size > 0) groups.push({ label: "Overige symbolen", types: [...remaining] });

  return <>{groups.map((group) => (
    <optgroup key={group.label} label={group.label}>
      {group.types.map((type) => <option key={type} value={type}>{type}</option>)}
    </optgroup>
  ))}</>;
}
