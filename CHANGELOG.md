# Changelog

All notable changes to this project will be documented in this file.

## [0.2.0] - 2024-01-XX

### Added
- **Enhanced TypeInfo Support**: Added support for 20+ TypeScript types including:
  - Union types (`string | number`)
  - Intersection types (`User & { status: string }`)
  - Optional types (`string?`)
  - Nullable types (`string | null`)
  - Function types with parameters and return types
  - Class and Interface types
  - Generic types with type parameters
  - Literal types (`"active"`, `42`, `true`)
  - Enum types
  - Tuple types (`[string, number, boolean]`)
  - Object types with properties
  - IndexSignature types
  - Conditional types (`T extends U ? X : Y`)
  - Mapped types (`{ [K in keyof T]: T[K] }`)
  - TemplateLiteral types (`` `Hello ${string}` ``)

- **New Utility Methods**: Added 25+ utility methods for type analysis:
  - `isArray()`, `isPromise()`, `isSet()`, `isMap()`, `isObservable()`
  - `getUnionTypes()`, `getIntersectionTypes()`
  - `getFunctionParameters()`, `getFunctionReturnType()`
  - `getTupleElements()`, `getObjectProperties()`
  - `getGenericTypeParameters()`, `getEnumValues()`, `getLiteralValue()`
  - `hasProperty()`, `getPropertyType()`

- **Advanced Type Compatibility**: Enhanced `isAssignableTo()` method with:
  - Optional type compatibility (`Optional<T>` assignable to `T`)
  - Nullable type compatibility (`Nullable<T>` assignable to `T | null`)
  - Array covariance (`Array<Derived>` assignable to `Array<Base>`)
  - Set covariance (`Set<Derived>` assignable to `Set<Base>`)
  - Promise covariance (`Promise<Derived>` assignable to `Promise<Base>`)
  - Function parameter contravariance
  - Literal to Primitive compatibility (`"hello"` assignable to `string`)

- **Error Handling**: Added comprehensive error handling and validation:
  - Null/undefined checks for all methods
  - Safe property access with fallbacks
  - Type validation before operations

- **Documentation**: Added comprehensive documentation:
  - Complete README.md with examples
  - JSDoc comments for all public methods
  - Type definitions and usage examples
  - Migration guide from v0.1.0

- **Test Suite**: Added comprehensive test coverage:
  - 16 test categories covering all functionality
  - Error handling tests
  - Type compatibility tests
  - Complex type analysis tests
  - Decorator functionality tests

### Improved
- **Type Resolution**: Enhanced `resolveDeepestType()` to handle all new type kinds
- **Type Formatting**: Improved `printTypePath()` and `printTypeTree()` for better readability
- **Performance**: Optimized type checking and compatibility algorithms
- **Developer Experience**: Better error messages and type safety

### Fixed
- **Type Safety**: Fixed all TypeScript compilation errors
- **Import Issues**: Resolved circular dependencies and import problems
- **Linting**: Fixed all ESLint/TSLint warnings and errors

### Breaking Changes
- None - fully backward compatible with v0.1.0

## [0.1.0] - 2024-01-XX

### Added
- Basic TypeScript type inspector
- Support for Simple, Array, Promise, Observable, Map, Record types
- Decorator support with `@TypeInfoLog()` and `@TypeInfoSave()`
- Basic type formatting with `printTypePath()` and `printTypeTree()`
- Core utility methods: `getAwaitedType()`, `getItemType()`, `getSubscribeType()`
