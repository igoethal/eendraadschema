export const OMSCHAKELAAR_PORTS = ["IN", "OUT1", "OUT2"] as const;
/** Fixed left-to-right (vertical) / top-to-bottom (horizontal) slot order; also the child order. */
export const OMSCHAKELAAR_SLOT_ORDER = ["OUT1", "IN", "OUT2"] as const;
export const OMSCHAKELAAR_POLES = ["2", "4"] as const;
export const OMSCHAKELAAR_RATINGS = ["16", "25", "32", "40", "63", "80", "100"] as const;

export type OmschakelaarPort = typeof OMSCHAKELAAR_PORTS[number];

export function isOmschakelaarPort(value: unknown): value is OmschakelaarPort {
  return typeof value === "string" && OMSCHAKELAAR_PORTS.includes(value as OmschakelaarPort);
}
