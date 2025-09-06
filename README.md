# TypeScript Type Inspector

A comprehensive TypeScript library for runtime type inspection with advanced type support and decorator metadata.

## 🚀 Features

- **Comprehensive Type Support**: 20+ TypeScript types including Union, Intersection, Generic, Function, Class, Interface, Tuple, Literal, Enum, and more
- **Runtime Type Inspection**: Get detailed type information at runtime
- **Decorator Support**: Easy-to-use decorators for logging and saving type information
- **Type Validation**: Advanced type compatibility and assignability checking
- **Rich Utilities**: 25+ utility methods for working with complex types
- **Beautiful Formatting**: Pretty-print type information as trees and paths
- **Error Handling**: Robust error handling and validation throughout

## 📦 Installation

```bash
npm install inspector
```

## 🔧 Setup

1. **Enable decorators in your `tsconfig.json`:**
```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

2. **Import reflect-metadata at the top of your entry file:**
```typescript
import "reflect-metadata";
```

## 🎯 Quick Start

### Basic Usage

```typescript
import { TypeInspector, TypeInfoLog, TypeInfoSave } from 'inspector';

class UserService {
  @TypeInfoLog()
  @TypeInfoSave()
  users: User[] = [];

  @TypeInfoLog()
  @TypeInfoSave()
  async getUser(id: number): Promise<User | null> {
    return this.users.find(u => u.id === id) || null;
  }
}

// Get type information
const service = new UserService();
const usersType = TypeInspector.getPropertyTypeInfo(service, 'users');
console.log("Users type:", TypeInspector.printTypePath(usersType));
// Output: Array -> Object
```

### Advanced Type Analysis

```typescript
// Check type kinds
console.log("Is array?", TypeInspector.isArray(usersType));
console.log("Is union?", TypeInspector.isUnion(usersType));

// Get detailed information
const itemType = TypeInspector.getItemType(usersType);
console.log("Array item type:", TypeInspector.printTypePath(itemType));

// Check object properties
if (TypeInspector.isObject(itemType)) {
  console.log("Has 'id' property?", TypeInspector.hasProperty(itemType, 'id'));
  const idType = TypeInspector.getPropertyType(itemType, 'id');
  console.log("ID type:", TypeInspector.printTypePath(idType));
}
```

## 📚 Supported Types

### Primitive Types
- `string`, `number`, `boolean`, `bigint`, `symbol`, `undefined`, `null`

### Complex Types
- **Union**: `string | number | boolean`
- **Intersection**: `User & { status: string }`
- **Optional**: `string?`
- **Nullable**: `string | null`
- **Array**: `string[]`, `ReadonlyArray<string>`
- **Set**: `Set<string>`
- **Map**: `Map<string, number>`
- **Record**: `Record<string, any>`
- **Tuple**: `[string, number, boolean]`
- **Function**: `(id: number) => Promise<User>`
- **Promise**: `Promise<string>`
- **Class**: Custom class types
- **Interface**: Interface types
- **Generic**: `ApiResponse<T>`
- **Literal**: `"active"`, `42`, `true`
- **Enum**: Enum types
- **Object**: Object types with properties
- **IndexSignature**: `{ [key: string]: any }`
- **Conditional**: `T extends U ? X : Y`
- **Mapped**: `{ [K in keyof T]: T[K] }`
- **TemplateLiteral**: `` `Hello ${string}` ``

## 🛠️ API Reference

### Core Methods

#### Type Information
```typescript
TypeInspector.getPropertyTypeInfo(target, propertyKey): TypeInfo | undefined
TypeInspector.getMethodTypeInfo(target, propertyKey): TypeInfo | undefined
```

#### Type Checking
```typescript
TypeInspector.isArray(typeInfo): boolean
TypeInspector.isUnion(typeInfo): boolean
TypeInspector.isIntersection(typeInfo): boolean
TypeInspector.isOptional(typeInfo): boolean
TypeInspector.isNullable(typeInfo): boolean
TypeInspector.isFunction(typeInfo): boolean
TypeInspector.isClass(typeInfo): boolean
TypeInspector.isInterface(typeInfo): boolean
TypeInspector.isGeneric(typeInfo): boolean
TypeInspector.isLiteral(typeInfo): boolean
TypeInspector.isEnum(typeInfo): boolean
TypeInspector.isTuple(typeInfo): boolean
TypeInspector.isObject(typeInfo): boolean
TypeInspector.isPrimitive(typeInfo): boolean
TypeInspector.isPromise(typeInfo): boolean
TypeInspector.isSet(typeInfo): boolean
TypeInspector.isMap(typeInfo): boolean
TypeInspector.isObservable(typeInfo): boolean
```

#### Data Extraction
```typescript
TypeInspector.getUnionTypes(typeInfo): TypeInfo[]
TypeInspector.getIntersectionTypes(typeInfo): TypeInfo[]
TypeInspector.getFunctionParameters(typeInfo): TypeInfo[]
TypeInspector.getFunctionReturnType(typeInfo): TypeInfo | undefined
TypeInspector.getTupleElements(typeInfo): TypeInfo[]
TypeInspector.getObjectProperties(typeInfo): Record<string, TypeInfo>
TypeInspector.getGenericTypeParameters(typeInfo): TypeInfo[]
TypeInspector.getEnumValues(typeInfo): Record<string, string | number>
TypeInspector.getLiteralValue(typeInfo): string | number | boolean | undefined
```

#### Property Access
```typescript
TypeInspector.hasProperty(typeInfo, propertyName): boolean
TypeInspector.getPropertyType(typeInfo, propertyName): TypeInfo | undefined
```

#### Type Resolution
```typescript
TypeInspector.resolveDeepestType(typeInfo): TypeInfo | undefined
TypeInspector.getAwaitedType(typeInfo): TypeInfo | undefined
TypeInspector.getItemType(typeInfo): TypeInfo | undefined
TypeInspector.getSubscribeType(typeInfo): TypeInfo | undefined
```

#### Type Compatibility
```typescript
TypeInspector.isAssignableTo(typeInfo1, typeInfo2): boolean
```

#### Formatting
```typescript
TypeInspector.printTypePath(typeInfo): string
TypeInspector.printTypeTree(typeInfo, depth?): string
```

### Decorators

#### `@TypeInfoLog()`
Logs type information to console when applied to properties or methods.

#### `@TypeInfoSave()`
Saves type information to metadata for later retrieval.

## 🧪 Testing

Run the test suite to see all features in action:

```bash
# Install dependencies
npm install

# Run tests
npm test

# Or build and run demo
npm run demo
```

## 📖 Examples

### Complex Type Analysis

```typescript
interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

type UserStatus = "active" | "inactive" | "pending";

type UserWithStatus = User & { status: UserStatus };

// Create complex type info
const apiResponseType: TypeInfo = {
  kind: "Object",
  properties: {
    data: { kind: "Generic", name: "T", typeParameters: [userType] },
    success: { kind: "Primitive", type: "boolean" },
    message: { kind: "Optional", inner: { kind: "Primitive", type: "string" } }
  }
};

// Analyze the type
console.log("API Response type tree:");
console.log(TypeInspector.printTypeTree(apiResponseType));

// Check properties
console.log("Has 'data' property?", TypeInspector.hasProperty(apiResponseType, "data"));
console.log("Has 'error' property?", TypeInspector.hasProperty(apiResponseType, "error"));
```

### Type Compatibility Checking

```typescript
const stringType: TypeInfo = { kind: "Primitive", type: "string" };
const numberType: TypeInfo = { kind: "Primitive", type: "number" };
const unionType: TypeInfo = { 
  kind: "Union", 
  types: [stringType, numberType] 
};

// Check compatibility
console.log("String assignable to Union?", 
  TypeInspector.isAssignableTo(stringType, unionType));
console.log("Number assignable to Union?", 
  TypeInspector.isAssignableTo(numberType, unionType));

// Optional type compatibility
const optionalString: TypeInfo = { 
  kind: "Optional", 
  inner: { kind: "Primitive", type: "string" } 
};
console.log("Optional<string> assignable to string?", 
  TypeInspector.isAssignableTo(optionalString, stringType));
```

### Advanced Type Validation

```typescript
// Array covariance
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

// Function parameter contravariance
const func1: TypeInfo = {
  kind: "Function",
  parameters: [{ kind: "Primitive", type: "any" }],
  returnType: { kind: "Primitive", type: "string" }
};

const func2: TypeInfo = {
  kind: "Function",
  parameters: [{ kind: "Primitive", type: "string" }],
  returnType: { kind: "Primitive", type: "any" }
};

console.log("(any) => string assignable to (string) => any?", 
  TypeInspector.isAssignableTo(func1, func2));
```

## 🔄 Migration from v0.1.0

The enhanced version is fully backward compatible. All existing APIs continue to work:

```typescript
// Old API still works
const typeInfo = TypeInspector.getPropertyTypeInfo(target, propertyKey);
console.log(TypeInspector.printTypePath(typeInfo));

// New APIs available
console.log("Is union?", TypeInspector.isUnion(typeInfo));
console.log("Union types:", TypeInspector.getUnionTypes(typeInfo));
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - see LICENSE file for details.

## 🙏 Acknowledgments

- Built on top of `reflect-metadata` for decorator support
- Inspired by TypeScript's type system
- Enhanced with comprehensive type support for modern TypeScript development
