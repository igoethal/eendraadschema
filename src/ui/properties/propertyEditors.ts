import type { ComponentType } from "react";
import { CircuitPropertiesEditor } from "./CircuitPropertiesEditor";
import { SocketPropertiesEditor } from "./socket/SocketPropertiesEditor";
import { BASIC_CONSUMER_TYPES } from "../../application/SchemaPropertyReader";
import { BasicConsumerPropertiesEditor } from "./basic/BasicConsumerPropertiesEditor";
import { LightPointPropertiesEditor } from "./light/LightPointPropertiesEditor";
import type { ItemEditorProps } from "./ItemEditorProps";
import { configuredItemTypes } from "../../application/ConfiguredItemProperties";
import { ConfiguredItemPropertiesEditor } from "./configured/ConfiguredItemPropertiesEditor";

const basicConsumerEditors = Object.fromEntries(
  BASIC_CONSUMER_TYPES.map((type) => [type, BasicConsumerPropertiesEditor]),
) as Record<string, ComponentType<ItemEditorProps>>;

const configuredItemEditors = Object.fromEntries(
  [...configuredItemTypes].map((type) => [type, ConfiguredItemPropertiesEditor]),
) as Record<string, ComponentType<ItemEditorProps>>;

export const propertyEditors: Readonly<Record<string, ComponentType<ItemEditorProps>>> = Object.freeze({
  ...basicConsumerEditors,
  ...configuredItemEditors,
  Kring: CircuitPropertiesEditor,
  Contactdoos: SocketPropertiesEditor,
  Lichtpunt: LightPointPropertiesEditor,
});
