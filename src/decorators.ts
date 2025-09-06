import { TypeInspector, TypeInfo } from "./type-inspector";

function saveTypeInfo(target: any, propertyKey: string | symbol) {
  const info: TypeInfo = { kind: "unknown" };
  Reflect.defineMetadata(
    "design:typeinfo",
    JSON.stringify(info),
    target,
    propertyKey
  );
}

export function TypeInfoLog(): PropertyDecorator & MethodDecorator {
  return (target: any, propertyKey: string | symbol) => {
    const info =
      TypeInspector.getPropertyTypeInfo(target, propertyKey.toString()) ||
      TypeInspector.getMethodTypeInfo(target, propertyKey.toString());
    console.log(`[@TypeInfoLog] ${String(propertyKey)} =>`, info);
  };
}

export function TypeInfoSave(): PropertyDecorator & MethodDecorator {
  return (target: any, propertyKey: string | symbol) => {
    saveTypeInfo(target, propertyKey);
  };
}
