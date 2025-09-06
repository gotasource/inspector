import "reflect-metadata";

export type TypeInfo =
  | { kind: "Simple"; type: string }
  | { kind: "Primitive"; type: "string" | "number" | "boolean" | "bigint" | "symbol" | "undefined" | "null" }
  | { kind: "Array" | "ReadonlyArray" | "Set"; inner: TypeInfo }
  | { kind: "Promise" | "PromiseLike"; inner: TypeInfo }
  | { kind: "Observable"; inner: TypeInfo }
  | { kind: "Map" | "Record"; key: TypeInfo; value: TypeInfo }
  | { kind: "Union"; types: TypeInfo[] }
  | { kind: "Intersection"; types: TypeInfo[] }
  | { kind: "Optional"; inner: TypeInfo }
  | { kind: "Nullable"; inner: TypeInfo }
  | { kind: "Function"; parameters: TypeInfo[]; returnType: TypeInfo }
  | { kind: "Class"; name: string; constructor: TypeInfo; methods: Record<string, TypeInfo>; properties: Record<string, TypeInfo> }
  | { kind: "Interface"; name: string; properties: Record<string, TypeInfo> }
  | { kind: "Generic"; name: string; typeParameters: TypeInfo[] }
  | { kind: "Literal"; value: string | number | boolean }
  | { kind: "Enum"; name: string; values: Record<string, string | number> }
  | { kind: "Tuple"; elements: TypeInfo[] }
  | { kind: "Object"; properties: Record<string, TypeInfo> }
  | { kind: "IndexSignature"; keyType: TypeInfo; valueType: TypeInfo }
  | { kind: "Conditional"; checkType: TypeInfo; extendsType: TypeInfo; trueType: TypeInfo; falseType: TypeInfo }
  | { kind: "Mapped"; keyType: TypeInfo; valueType: TypeInfo }
  | { kind: "TemplateLiteral"; parts: string[]; types: TypeInfo[] }
  | { kind: "unknown" };

export class TypeInspector {
  static getMethodTypeInfo(target: any, propertyKey: string): TypeInfo | undefined {
    return this._getTypeInfo(target, propertyKey);
  }

  static getPropertyTypeInfo(target: any, propertyKey: string): TypeInfo | undefined {
    return this._getTypeInfo(target, propertyKey);
  }

  static getAwaitedType(typeInfo?: TypeInfo): TypeInfo | undefined {
    if (!typeInfo) return;
    if (typeInfo.kind === "Promise" || typeInfo.kind === "PromiseLike") {
      return typeInfo.inner;
    }
    return typeInfo;
  }

  static getItemType(typeInfo?: TypeInfo): TypeInfo | undefined {
    if (!typeInfo) return;
    if (
      typeInfo.kind === "Array" ||
      typeInfo.kind === "ReadonlyArray" ||
      typeInfo.kind === "Set"
    ) {
      return typeInfo.inner;
    }
    return typeInfo;
  }

  static getSubscribeType(typeInfo?: TypeInfo): TypeInfo | undefined {
    if (!typeInfo) return;
    if (typeInfo.kind === "Observable") {
      return typeInfo.inner;
    }
    return typeInfo;
  }

  static resolveDeepestType(typeInfo?: TypeInfo): TypeInfo | undefined {
    if (!typeInfo) return;

    switch (typeInfo.kind) {
      case "Promise":
      case "PromiseLike":
      case "Array":
      case "ReadonlyArray":
      case "Set":
      case "Observable":
        return this.resolveDeepestType(typeInfo.inner);
      case "Map":
      case "Record":
        return this.resolveDeepestType(typeInfo.value);
      case "Optional":
      case "Nullable":
        return this.resolveDeepestType(typeInfo.inner);
      case "Union":
        // Return the first non-unknown type from union
        const nonUnknownType = typeInfo.types.find(t => t.kind !== "unknown");
        return nonUnknownType ? this.resolveDeepestType(nonUnknownType) : typeInfo.types[0];
      case "Intersection":
        // Return the last type from intersection (most specific)
        return this.resolveDeepestType(typeInfo.types[typeInfo.types.length - 1]);
      case "Function":
        return this.resolveDeepestType(typeInfo.returnType);
      case "Class":
      case "Interface":
      case "Object":
        return typeInfo; // These are already resolved
      case "Generic":
        return this.resolveDeepestType(typeInfo.typeParameters[0]);
      case "Tuple":
        return this.resolveDeepestType(typeInfo.elements[0]);
      case "Conditional":
        return this.resolveDeepestType(typeInfo.trueType);
      case "Mapped":
        return this.resolveDeepestType(typeInfo.valueType);
      case "TemplateLiteral":
        return this.resolveDeepestType(typeInfo.types[0]);
      case "Simple":
      case "Primitive":
      case "Literal":
      case "Enum":
      case "IndexSignature":
      case "unknown":
      default:
        return typeInfo;
    }
  }

  static printTypePath(typeInfo?: TypeInfo): string {
    if (!typeInfo) return "undefined";
    const path: string[] = [];
    let current: TypeInfo | undefined = typeInfo;

    while (current) {
      switch (current.kind) {
        case "Simple":
          path.push(current.type);
          current = undefined;
          break;
        case "Primitive":
          path.push(current.type);
          current = undefined;
          break;
        case "Promise":
        case "PromiseLike":
        case "Observable":
        case "Array":
        case "ReadonlyArray":
        case "Set":
          path.push(current.kind);
          current = current.inner;
          break;
        case "Map":
        case "Record":
          path.push(current.kind);
          current = current.value;
          break;
        case "Union":
          path.push(`Union<${current.types.length}>`);
          current = current.types[0];
          break;
        case "Intersection":
          path.push(`Intersection<${current.types.length}>`);
          current = current.types[current.types.length - 1];
          break;
        case "Optional":
          path.push("Optional");
          current = current.inner;
          break;
        case "Nullable":
          path.push("Nullable");
          current = current.inner;
          break;
        case "Function":
          path.push("Function");
          current = current.returnType;
          break;
        case "Class":
          path.push(`Class<${current.name}>`);
          current = undefined;
          break;
        case "Interface":
          path.push(`Interface<${current.name}>`);
          current = undefined;
          break;
        case "Generic":
          path.push(`Generic<${current.name}>`);
          current = current.typeParameters[0];
          break;
        case "Literal":
          path.push(`Literal<${current.value}>`);
          current = undefined;
          break;
        case "Enum":
          path.push(`Enum<${current.name}>`);
          current = undefined;
          break;
        case "Tuple":
          path.push(`Tuple<${current.elements.length}>`);
          current = current.elements[0];
          break;
        case "Object":
          path.push("Object");
          current = undefined;
          break;
        case "IndexSignature":
          path.push("IndexSignature");
          current = current.valueType;
          break;
        case "Conditional":
          path.push("Conditional");
          current = current.trueType;
          break;
        case "Mapped":
          path.push("Mapped");
          current = current.valueType;
          break;
        case "TemplateLiteral":
          path.push("TemplateLiteral");
          current = current.types[0];
          break;
        case "unknown":
          path.push("unknown");
          current = undefined;
          break;
      }
    }
    return path.join(" -> ");
  }

  static printTypeTree(typeInfo?: TypeInfo, depth: number = 0): string {
    if (!typeInfo) return "undefined";
    const pad = "  ".repeat(depth);

    switch (typeInfo.kind) {
      case "Simple":
        return `${pad}{ kind: "Simple", type: "${typeInfo.type}" }`;
      case "Primitive":
        return `${pad}{ kind: "Primitive", type: "${typeInfo.type}" }`;
      case "Array":
      case "ReadonlyArray":
      case "Set":
      case "Promise":
      case "PromiseLike":
      case "Observable":
        return `${pad}{ kind: "${typeInfo.kind}",\n${pad}  inner: \n${this.printTypeTree(
          typeInfo.inner,
          depth + 2
        )}\n${pad}}`;
      case "Map":
      case "Record":
        return `${pad}{ kind: "${typeInfo.kind}",\n${pad}  key: \n${this.printTypeTree(
          typeInfo.key,
          depth + 2
        )},\n${pad}  value: \n${this.printTypeTree(typeInfo.value, depth + 2)}\n${pad}}`;
      case "Union":
        return `${pad}{ kind: "Union",\n${pad}  types: [\n${typeInfo.types.map(t => this.printTypeTree(t, depth + 2)).join(',\n')}\n${pad}  ]\n${pad}}`;
      case "Intersection":
        return `${pad}{ kind: "Intersection",\n${pad}  types: [\n${typeInfo.types.map(t => this.printTypeTree(t, depth + 2)).join(',\n')}\n${pad}  ]\n${pad}}`;
      case "Optional":
        return `${pad}{ kind: "Optional",\n${pad}  inner: \n${this.printTypeTree(typeInfo.inner, depth + 2)}\n${pad}}`;
      case "Nullable":
        return `${pad}{ kind: "Nullable",\n${pad}  inner: \n${this.printTypeTree(typeInfo.inner, depth + 2)}\n${pad}}`;
      case "Function":
        return `${pad}{ kind: "Function",\n${pad}  parameters: [\n${typeInfo.parameters.map(p => this.printTypeTree(p, depth + 2)).join(',\n')}\n${pad}  ],\n${pad}  returnType: \n${this.printTypeTree(typeInfo.returnType, depth + 2)}\n${pad}}`;
      case "Class":
        return `${pad}{ kind: "Class", name: "${typeInfo.name}" }`;
      case "Interface":
        return `${pad}{ kind: "Interface", name: "${typeInfo.name}" }`;
      case "Generic":
        return `${pad}{ kind: "Generic", name: "${typeInfo.name}", typeParameters: [\n${typeInfo.typeParameters.map(tp => this.printTypeTree(tp, depth + 2)).join(',\n')}\n${pad}  ]\n${pad}}`;
      case "Literal":
        return `${pad}{ kind: "Literal", value: ${JSON.stringify(typeInfo.value)} }`;
      case "Enum":
        return `${pad}{ kind: "Enum", name: "${typeInfo.name}", values: ${JSON.stringify(typeInfo.values)} }`;
      case "Tuple":
        return `${pad}{ kind: "Tuple",\n${pad}  elements: [\n${typeInfo.elements.map(e => this.printTypeTree(e, depth + 2)).join(',\n')}\n${pad}  ]\n${pad}}`;
      case "Object":
        return `${pad}{ kind: "Object",\n${pad}  properties: {\n${Object.entries(typeInfo.properties).map(([key, value]) => `${pad}    ${key}: ${this.printTypeTree(value, depth + 2)}`).join(',\n')}\n${pad}  }\n${pad}}`;
      case "IndexSignature":
        return `${pad}{ kind: "IndexSignature",\n${pad}  keyType: \n${this.printTypeTree(typeInfo.keyType, depth + 2)},\n${pad}  valueType: \n${this.printTypeTree(typeInfo.valueType, depth + 2)}\n${pad}}`;
      case "Conditional":
        return `${pad}{ kind: "Conditional",\n${pad}  checkType: \n${this.printTypeTree(typeInfo.checkType, depth + 2)},\n${pad}  extendsType: \n${this.printTypeTree(typeInfo.extendsType, depth + 2)},\n${pad}  trueType: \n${this.printTypeTree(typeInfo.trueType, depth + 2)},\n${pad}  falseType: \n${this.printTypeTree(typeInfo.falseType, depth + 2)}\n${pad}}`;
      case "Mapped":
        return `${pad}{ kind: "Mapped",\n${pad}  keyType: \n${this.printTypeTree(typeInfo.keyType, depth + 2)},\n${pad}  valueType: \n${this.printTypeTree(typeInfo.valueType, depth + 2)}\n${pad}}`;
      case "TemplateLiteral":
        return `${pad}{ kind: "TemplateLiteral",\n${pad}  parts: [${typeInfo.parts.map(p => `"${p}"`).join(', ')}],\n${pad}  types: [\n${typeInfo.types.map(t => this.printTypeTree(t, depth + 2)).join(',\n')}\n${pad}  ]\n${pad}}`;
      case "unknown":
        return `${pad}{ kind: "unknown" }`;
    }
  }

  // New utility methods for enhanced type information
  static isUnion(typeInfo?: TypeInfo): boolean {
    return typeInfo?.kind === "Union";
  }

  static isIntersection(typeInfo?: TypeInfo): boolean {
    return typeInfo?.kind === "Intersection";
  }

  static isOptional(typeInfo?: TypeInfo): boolean {
    return typeInfo?.kind === "Optional";
  }

  static isNullable(typeInfo?: TypeInfo): boolean {
    return typeInfo?.kind === "Nullable";
  }

  static isFunction(typeInfo?: TypeInfo): boolean {
    return typeInfo?.kind === "Function";
  }

  static isClass(typeInfo?: TypeInfo): boolean {
    return typeInfo?.kind === "Class";
  }

  static isInterface(typeInfo?: TypeInfo): boolean {
    return typeInfo?.kind === "Interface";
  }

  static isGeneric(typeInfo?: TypeInfo): boolean {
    return typeInfo?.kind === "Generic";
  }

  static isLiteral(typeInfo?: TypeInfo): boolean {
    return typeInfo?.kind === "Literal";
  }

  static isEnum(typeInfo?: TypeInfo): boolean {
    return typeInfo?.kind === "Enum";
  }

  static isTuple(typeInfo?: TypeInfo): boolean {
    return typeInfo?.kind === "Tuple";
  }

  static isObject(typeInfo?: TypeInfo): boolean {
    return typeInfo?.kind === "Object";
  }

  static isPrimitive(typeInfo?: TypeInfo): boolean {
    return typeInfo?.kind === "Primitive";
  }

  static isArray(typeInfo?: TypeInfo): boolean {
    return typeInfo?.kind === "Array" || typeInfo?.kind === "ReadonlyArray";
  }

  static isPromise(typeInfo?: TypeInfo): boolean {
    return typeInfo?.kind === "Promise" || typeInfo?.kind === "PromiseLike";
  }

  static isSet(typeInfo?: TypeInfo): boolean {
    return typeInfo?.kind === "Set";
  }

  static isMap(typeInfo?: TypeInfo): boolean {
    return typeInfo?.kind === "Map" || typeInfo?.kind === "Record";
  }

  static isObservable(typeInfo?: TypeInfo): boolean {
    return typeInfo?.kind === "Observable";
  }

  static getUnionTypes(typeInfo?: TypeInfo): TypeInfo[] {
    if (!typeInfo || typeInfo.kind !== "Union") return [];
    return typeInfo.types || [];
  }

  static getIntersectionTypes(typeInfo?: TypeInfo): TypeInfo[] {
    if (!typeInfo || typeInfo.kind !== "Intersection") return [];
    return typeInfo.types || [];
  }

  static getFunctionParameters(typeInfo?: TypeInfo): TypeInfo[] {
    if (!typeInfo || typeInfo.kind !== "Function") return [];
    return typeInfo.parameters || [];
  }

  static getFunctionReturnType(typeInfo?: TypeInfo): TypeInfo | undefined {
    if (!typeInfo || typeInfo.kind !== "Function") return undefined;
    return typeInfo.returnType;
  }

  static getTupleElements(typeInfo?: TypeInfo): TypeInfo[] {
    if (!typeInfo || typeInfo.kind !== "Tuple") return [];
    return typeInfo.elements || [];
  }

  static getObjectProperties(typeInfo?: TypeInfo): Record<string, TypeInfo> {
    if (!typeInfo || typeInfo.kind !== "Object") return {};
    return typeInfo.properties || {};
  }

  static getGenericTypeParameters(typeInfo?: TypeInfo): TypeInfo[] {
    if (!typeInfo || typeInfo.kind !== "Generic") return [];
    return typeInfo.typeParameters || [];
  }

  static getEnumValues(typeInfo?: TypeInfo): Record<string, string | number> {
    if (!typeInfo || typeInfo.kind !== "Enum") return {};
    return typeInfo.values || {};
  }

  static getLiteralValue(typeInfo?: TypeInfo): string | number | boolean | undefined {
    if (!typeInfo || typeInfo.kind !== "Literal") return undefined;
    return typeInfo.value;
  }

  static hasProperty(typeInfo: TypeInfo | undefined, propertyName: string): boolean {
    if (typeInfo?.kind === "Object") {
      return propertyName in typeInfo.properties;
    }
    if (typeInfo?.kind === "Class") {
      return propertyName in typeInfo.properties;
    }
    if (typeInfo?.kind === "Interface") {
      return propertyName in typeInfo.properties;
    }
    return false;
  }

  static getPropertyType(typeInfo: TypeInfo | undefined, propertyName: string): TypeInfo | undefined {
    if (typeInfo?.kind === "Object") {
      return typeInfo.properties[propertyName];
    }
    if (typeInfo?.kind === "Class") {
      return typeInfo.properties[propertyName];
    }
    if (typeInfo?.kind === "Interface") {
      return typeInfo.properties[propertyName];
    }
    return undefined;
  }

  static isAssignableTo(typeInfo1?: TypeInfo, typeInfo2?: TypeInfo): boolean {
    if (!typeInfo1 || !typeInfo2) return false;
    
    // Same type
    if (typeInfo1.kind === typeInfo2.kind) {
      switch (typeInfo1.kind) {
        case "Primitive":
          return typeInfo1.type === (typeInfo2 as any).type;
        case "Literal":
          return typeInfo1.value === (typeInfo2 as any).value;
        case "Union":
          return (typeInfo2 as any).types?.some((t: TypeInfo) => 
            typeInfo1.types.some(t1 => this.isAssignableTo(t1, t))
          );
        case "Intersection":
          return (typeInfo2 as any).types?.every((t: TypeInfo) => 
            typeInfo1.types.some(t1 => this.isAssignableTo(t1, t))
          );
        case "Array":
        case "ReadonlyArray":
          return this.isAssignableTo(typeInfo1.inner, (typeInfo2 as any).inner);
        case "Set":
          return this.isAssignableTo(typeInfo1.inner, (typeInfo2 as any).inner);
        case "Map":
        case "Record":
          return this.isAssignableTo(typeInfo1.key, (typeInfo2 as any).key) &&
                 this.isAssignableTo(typeInfo1.value, (typeInfo2 as any).value);
        case "Promise":
        case "PromiseLike":
          return this.isAssignableTo(typeInfo1.inner, (typeInfo2 as any).inner);
        case "Function":
          const func2 = typeInfo2 as any;
          return this.isAssignableTo(typeInfo1.returnType, func2.returnType) &&
                 this.areParametersCompatible(typeInfo1.parameters, func2.parameters);
        case "Tuple":
          const tuple2 = typeInfo2 as any;
          return typeInfo1.elements.length === tuple2.elements.length &&
                 typeInfo1.elements.every((elem, i) => this.isAssignableTo(elem, tuple2.elements[i]));
        case "Object":
          const obj2 = typeInfo2 as any;
          return Object.keys(obj2.properties).every(key => 
            this.isAssignableTo(typeInfo1.properties[key], obj2.properties[key])
          );
        default:
          return true;
      }
    }

    // Optional type compatibility: Optional<T> is assignable to T
    if (typeInfo1.kind === "Optional") {
      return this.isAssignableTo(typeInfo1.inner, typeInfo2);
    }

    // Nullable type compatibility: Nullable<T> is assignable to T | null
    if (typeInfo1.kind === "Nullable") {
      return this.isAssignableTo(typeInfo1.inner, typeInfo2) ||
             (typeInfo2.kind === "Union" && typeInfo2.types.some(t => t.kind === "Primitive" && (t as any).type === "null"));
    }

    // Array covariance: Array<Derived> is assignable to Array<Base>
    if (typeInfo1.kind === "Array" && typeInfo2.kind === "Array") {
      return this.isAssignableTo(typeInfo1.inner, (typeInfo2 as any).inner);
    }

    // Set covariance: Set<Derived> is assignable to Set<Base>
    if (typeInfo1.kind === "Set" && typeInfo2.kind === "Set") {
      return this.isAssignableTo(typeInfo1.inner, (typeInfo2 as any).inner);
    }

    // Promise covariance: Promise<Derived> is assignable to Promise<Base>
    if (typeInfo1.kind === "Promise" && typeInfo2.kind === "Promise") {
      return this.isAssignableTo(typeInfo1.inner, (typeInfo2 as any).inner);
    }

    // Union compatibility: T is assignable to Union<T, ...>
    if (typeInfo2.kind === "Union") {
      return typeInfo2.types.some(t => this.isAssignableTo(typeInfo1, t));
    }

    // Intersection compatibility: Intersection<T, ...> is assignable to T
    if (typeInfo1.kind === "Intersection") {
      return typeInfo1.types.every(t => this.isAssignableTo(t, typeInfo2));
    }

    // Literal to Primitive: "hello" is assignable to string
    if (typeInfo1.kind === "Literal" && typeInfo2.kind === "Primitive") {
      const literalValue = typeInfo1.value;
      const primitiveType = (typeInfo2 as any).type;
      return typeof literalValue === primitiveType;
    }

    return false;
  }

  private static areParametersCompatible(params1: TypeInfo[], params2: TypeInfo[]): boolean {
    if (params1.length !== params2.length) return false;
    return params1.every((param, i) => this.isAssignableTo(params2[i], param)); // Contravariant
  }

  private static _getTypeInfo(target: any, propertyKey: string): TypeInfo | undefined {
    const raw = (Reflect as any).getMetadata("design:typeinfo", target, propertyKey);
    if (!raw) return;
    try {
      return JSON.parse(raw) as TypeInfo;
    } catch {
      return undefined;
    }
  }
}
