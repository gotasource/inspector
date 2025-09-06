import { TypeInspector, TypeInfo } from "./type-inspector";
import { TypeInfoLog, TypeInfoSave } from "./decorators";

// Example types for demonstration
interface User {
  id: number;
  name: string;
  email?: string;
  roles: string[];
}

type Status = "active" | "inactive" | "pending";

type UserWithStatus = User & { status: Status };

type ApiResponse<T> = {
  data: T;
  success: boolean;
  message?: string;
};

// Example class with decorators
class UserService {
  @TypeInfoLog()
  @TypeInfoSave()
  users: User[] = [];

  @TypeInfoLog()
  @TypeInfoSave()
  async getUser(id: number): Promise<User | null> {
    return this.users.find(u => u.id === id) || null;
  }

  @TypeInfoLog()
  @TypeInfoSave()
  createUser(userData: Omit<User, 'id'>): User {
    const newUser: User = {
      id: Math.random(),
      ...userData
    };
    this.users.push(newUser);
    return newUser;
  }

  @TypeInfoLog()
  @TypeInfoSave()
  getUsersByStatus(status: Status): UserWithStatus[] {
    return this.users.map(user => ({ ...user, status: "active" as Status }));
  }

  @TypeInfoLog()
  @TypeInfoSave()
  async fetchUserData(id: number): Promise<ApiResponse<User>> {
    const user = await this.getUser(id);
    return {
      data: user!,
      success: !!user,
      message: user ? "User found" : "User not found"
    };
  }
}

// Example usage and testing
export function demonstrateEnhancedTypeInfo() {
  console.log("=== Enhanced Type Inspector Demo ===\n");

  const service = new UserService();
  
  // Get type information for different properties and methods
  const usersType = TypeInspector.getPropertyTypeInfo(service, 'users');
  const getUserType = TypeInspector.getMethodTypeInfo(service, 'getUser');
  const createUserType = TypeInspector.getMethodTypeInfo(service, 'createUser');
  const fetchUserDataType = TypeInspector.getMethodTypeInfo(service, 'fetchUserData');

  console.log("1. Basic Type Information:");
  console.log("Users property type:", TypeInspector.printTypePath(usersType));
  console.log("GetUser method type:", TypeInspector.printTypePath(getUserType));
  console.log("CreateUser method type:", TypeInspector.printTypePath(createUserType));
  console.log("FetchUserData method type:", TypeInspector.printTypePath(fetchUserDataType));

  console.log("\n2. Detailed Type Trees:");
  console.log("Users type tree:");
  console.log(TypeInspector.printTypeTree(usersType));
  
  console.log("\nGetUser return type tree:");
  console.log(TypeInspector.printTypeTree(getUserType));

  console.log("\n3. Type Analysis:");
  if (usersType) {
    console.log("Is users an array?", TypeInspector.isArray(usersType));
    console.log("Array item type:", TypeInspector.printTypePath(TypeInspector.getItemType(usersType)));
  }

  if (getUserType) {
    console.log("Is getUser a function?", TypeInspector.isFunction(getUserType));
    const returnType = TypeInspector.getFunctionReturnType(getUserType);
    console.log("GetUser return type:", TypeInspector.printTypePath(returnType));
    
    if (returnType) {
      console.log("Is return type a Promise?", TypeInspector.isPromise(returnType));
      const awaitedType = TypeInspector.getAwaitedType(returnType);
      console.log("Awaited type:", TypeInspector.printTypePath(awaitedType));
    }
  }

  console.log("\n4. Type Compatibility:");
  const stringType: TypeInfo = { kind: "Primitive", type: "string" };
  const numberType: TypeInfo = { kind: "Primitive", type: "number" };
  const unionType: TypeInfo = { 
    kind: "Union", 
    types: [stringType, numberType] 
  };

  console.log("String assignable to Union<string | number>?", 
    TypeInspector.isAssignableTo(stringType, unionType));
  console.log("Number assignable to Union<string | number>?", 
    TypeInspector.isAssignableTo(numberType, unionType));

  console.log("\n5. Complex Type Examples:");
  
  // Create example complex types
  const userType: TypeInfo = {
    kind: "Object",
    properties: {
      id: { kind: "Primitive", type: "number" },
      name: { kind: "Primitive", type: "string" },
      email: { kind: "Optional", inner: { kind: "Primitive", type: "string" } },
      roles: { kind: "Array", inner: { kind: "Primitive", type: "string" } }
    }
  };

  const apiResponseType: TypeInfo = {
    kind: "Object",
    properties: {
      data: { kind: "Generic", name: "T", typeParameters: [userType] },
      success: { kind: "Primitive", type: "boolean" },
      message: { kind: "Optional", inner: { kind: "Primitive", type: "string" } }
    }
  };

  console.log("User type tree:");
  console.log(TypeInspector.printTypeTree(userType));
  
  console.log("\nAPI Response type tree:");
  console.log(TypeInspector.printTypeTree(apiResponseType));

  console.log("\n6. Property Analysis:");
  console.log("User has 'id' property?", TypeInspector.hasProperty(userType, "id"));
  console.log("User has 'age' property?", TypeInspector.hasProperty(userType, "age"));
  
  const idType = TypeInspector.getPropertyType(userType, "id");
  console.log("User.id type:", TypeInspector.printTypePath(idType));

  console.log("\n7. Advanced Type Compatibility:");
  
  // Optional type compatibility
  const optionalString: TypeInfo = { 
    kind: "Optional", 
    inner: { kind: "Primitive", type: "string" } 
  };
  console.log("Optional<string> assignable to string?", 
    TypeInspector.isAssignableTo(optionalString, stringType));

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

  // Literal to Primitive
  const literalType: TypeInfo = { kind: "Literal", value: "hello" };
  console.log("Literal 'hello' assignable to string?", 
    TypeInspector.isAssignableTo(literalType, stringType));

  console.log("\n=== Demo Complete ===");
}

// Note: isArray and isPromise methods are now built into TypeInspector class
