import "reflect-metadata";
import { TypeInspector, TypeInfo, TypeInfoLog, TypeInfoSave, demonstrateEnhancedTypeInfo } from "./src/index";

// Test enhanced type inspector features
console.log("🧪 Testing Enhanced TypeScript Type Inspector\n");

// Test 1: Basic type checking
console.log("=== Test 1: Basic Type Checking ===");
const stringType: TypeInfo = { kind: "Primitive", type: "string" };
const numberType: TypeInfo = { kind: "Primitive", type: "number" };
const booleanType: TypeInfo = { kind: "Primitive", type: "boolean" };

console.log("Is string primitive?", TypeInspector.isPrimitive(stringType));
console.log("Is number primitive?", TypeInspector.isPrimitive(numberType));
console.log("Is boolean primitive?", TypeInspector.isPrimitive(booleanType));

// Test 2: Collection types
console.log("\n=== Test 2: Collection Types ===");
const arrayType: TypeInfo = { kind: "Array", inner: stringType };
const setType: TypeInfo = { kind: "Set", inner: numberType };
const mapType: TypeInfo = { kind: "Map", key: stringType, value: numberType };

console.log("Is array?", TypeInspector.isArray(arrayType));
console.log("Is set?", TypeInspector.isSet(setType));
console.log("Is map?", TypeInspector.isMap(mapType));

// Test 3: Union types
console.log("\n=== Test 3: Union Types ===");
const unionType: TypeInfo = {
  kind: "Union",
  types: [stringType, numberType, booleanType]
};

console.log("Is union?", TypeInspector.isUnion(unionType));
console.log("Union types count:", TypeInspector.getUnionTypes(unionType).length);
console.log("Union type path:", TypeInspector.printTypePath(unionType));

// Test 4: Array types
console.log("\n=== Test 4: Array Types ===");
console.log("Is array?", TypeInspector.isArray(arrayType));
console.log("Array item type:", TypeInspector.printTypePath(TypeInspector.getItemType(arrayType)));

// Test 5: Object types
console.log("\n=== Test 5: Object Types ===");
const userType: TypeInfo = {
  kind: "Object",
  properties: {
    id: { kind: "Primitive", type: "number" },
    name: { kind: "Primitive", type: "string" },
    email: { kind: "Optional", inner: { kind: "Primitive", type: "string" } },
    roles: { kind: "Array", inner: { kind: "Primitive", type: "string" } }
  }
};

console.log("Is object?", TypeInspector.isObject(userType));
console.log("Has 'id' property?", TypeInspector.hasProperty(userType, "id"));
console.log("Has 'age' property?", TypeInspector.hasProperty(userType, "age"));
console.log("ID property type:", TypeInspector.printTypePath(TypeInspector.getPropertyType(userType, "id")));

// Test 6: Function types
console.log("\n=== Test 6: Function Types ===");
const functionType: TypeInfo = {
  kind: "Function",
  parameters: [
    { kind: "Primitive", type: "number" },
    { kind: "Primitive", type: "string" }
  ],
  returnType: { kind: "Primitive", type: "boolean" }
};

console.log("Is function?", TypeInspector.isFunction(functionType));
console.log("Function parameters count:", TypeInspector.getFunctionParameters(functionType).length);
console.log("Function return type:", TypeInspector.printTypePath(TypeInspector.getFunctionReturnType(functionType)));

// Test 7: Promise types
console.log("\n=== Test 7: Promise Types ===");
const promiseType: TypeInfo = {
  kind: "Promise",
  inner: userType
};

console.log("Is promise?", TypeInspector.isPromise(promiseType));
console.log("Promise inner type:", TypeInspector.printTypePath(TypeInspector.getAwaitedType(promiseType)));

// Test 8: Tuple types
console.log("\n=== Test 8: Tuple Types ===");
const tupleType: TypeInfo = {
  kind: "Tuple",
  elements: [stringType, numberType, booleanType]
};

console.log("Is tuple?", TypeInspector.isTuple(tupleType));
console.log("Tuple elements count:", TypeInspector.getTupleElements(tupleType).length);

// Test 9: Literal types
console.log("\n=== Test 9: Literal Types ===");
const literalType: TypeInfo = {
  kind: "Literal",
  value: "hello"
};

console.log("Is literal?", TypeInspector.isLiteral(literalType));
console.log("Literal value:", TypeInspector.getLiteralValue(literalType));

// Test 10: Type compatibility
console.log("\n=== Test 10: Type Compatibility ===");
const stringLiteral: TypeInfo = { kind: "Literal", value: "test" };
const stringPrimitive: TypeInfo = { kind: "Primitive", type: "string" };

console.log("String literal assignable to string primitive?", 
  TypeInspector.isAssignableTo(stringLiteral, stringPrimitive));
console.log("String primitive assignable to union?", 
  TypeInspector.isAssignableTo(stringPrimitive, unionType));

// Test 11: Optional and Nullable types
console.log("\n=== Test 11: Optional and Nullable Types ===");
const optionalString: TypeInfo = { 
  kind: "Optional", 
  inner: { kind: "Primitive", type: "string" } 
};
const nullableString: TypeInfo = { 
  kind: "Nullable", 
  inner: { kind: "Primitive", type: "string" } 
};

console.log("Is optional?", TypeInspector.isOptional(optionalString));
console.log("Is nullable?", TypeInspector.isNullable(nullableString));
console.log("Optional<string> assignable to string?", 
  TypeInspector.isAssignableTo(optionalString, stringPrimitive));

// Test 12: Array covariance
console.log("\n=== Test 12: Array Covariance ===");
const stringArray: TypeInfo = { 
  kind: "Array", 
  inner: { kind: "Primitive", type: "string" } 
};
const anyArray: TypeInfo = { 
  kind: "Array", 
  inner: { kind: "Primitive", type: "any" } 
};

console.log("string[] assignable to any[]?", 
  TypeInspector.isAssignableTo(stringArray, anyArray));

// Test 13: Complex type tree
console.log("\n=== Test 13: Complex Type Tree ===");
const complexType: TypeInfo = {
  kind: "Object",
  properties: {
    data: {
      kind: "Array",
      inner: {
        kind: "Object",
        properties: {
          id: { kind: "Primitive", type: "number" },
          name: { kind: "Primitive", type: "string" },
          status: {
            kind: "Union",
            types: [
              { kind: "Literal", value: "active" },
              { kind: "Literal", value: "inactive" }
            ]
          }
        }
      }
    },
    success: { kind: "Primitive", type: "boolean" },
    message: { kind: "Optional", inner: { kind: "Primitive", type: "string" } }
  }
};

console.log("Complex type tree:");
console.log(TypeInspector.printTypeTree(complexType));

// Test 14: Class with decorators
console.log("\n=== Test 14: Class with Decorators ===");

class TestService {
  @TypeInfoLog()
  @TypeInfoSave()
  data: string[] = [];

  @TypeInfoLog()
  @TypeInfoSave()
  async processData(input: string): Promise<{ result: string; success: boolean }> {
    return { result: input.toUpperCase(), success: true };
  }
}

const service = new TestService();
console.log("Service created with decorators applied");

// Test 15: Error handling
console.log("\n=== Test 15: Error Handling ===");
console.log("getUnionTypes with null:", TypeInspector.getUnionTypes(undefined));
console.log("getUnionTypes with non-union:", TypeInspector.getUnionTypes(stringType));
console.log("hasProperty with null:", TypeInspector.hasProperty(undefined, "test"));
console.log("getPropertyType with null:", TypeInspector.getPropertyType(undefined, "test"));

// Test 16: Run full demonstration
console.log("\n=== Test 16: Full Demonstration ===");
demonstrateEnhancedTypeInfo();

console.log("\n✅ All tests completed successfully!");
