import { UserService } from "./examples/user-service";

async function demonstrateDecorators() {
  const userService = new UserService();

  console.log("=".repeat(80));
  console.log("TYPESCRIPT DECORATORS SYSTEM DEMO");
  console.log("=".repeat(80));

  try {
    await userService.clearDatabase();

    console.log(
      "\n1. Testing single user creation with validation and transaction..."
    );
    const newUser = await userService.createUser({
      email: "john@example.com",
      name: "John Doe",
    });
    console.log("User created:", newUser);

    console.log("\n2. Testing cache and retry with findByEmail...");
    const user = await userService.findByEmail("john@example.com");
    console.log("User found:", user);

    console.log("\n3. Testing cache hit with same email...");
    const cachedUser = await userService.findByEmail("john@example.com");
    console.log("User from cache:", cachedUser);

    console.log("\n4. Testing user update with transaction...");
    if (user) {
      const updatedUser = await userService.updateUser(user.id, {
        name: "John Updated",
      });
      console.log("User updated:", updatedUser);
    }

    console.log(
      "\n5. Testing multiple users creation (transaction rollback on error)..."
    );
    try {
      await userService.createMultipleUsers([
        { email: "user1@example.com", name: "User 1" },
        { email: "user2@example.com", name: "User 2" },
        { email: "john@example.com", name: "Duplicate User" },
      ]);
    } catch (error) {
      console.log(
        "Multiple users creation failed (as expected):",
        error instanceof Error ? error.message : String(error)
      );

      // Verificar que no se crearon los usuarios debido al rollback
      const allUsers = await userService.getAllUsers();
      console.log(
        `Total users in database after rollback: ${allUsers.length}`
      );
    }

    console.log("\n6. Testing successful multiple users creation...");
    const multipleUsers = await userService.createMultipleUsers([
      { email: "alice@example.com", name: "Alice Smith" },
      { email: "bob@example.com", name: "Bob Johnson" },
    ]);
    console.log("Multiple users created:", multipleUsers);

    console.log("\n7. Testing validation error...");
    try {
      await userService.createUser({ email: "", name: "Invalid User" } as any);
    } catch (error) {
      console.log(
        "Validation error (as expected):",
        error instanceof Error ? error.message : String(error)
      );
    }

    console.log("\n8. Final database state...");
    const finalUsers = await userService.getAllUsers();
    console.log(`Total users in database: ${finalUsers.length}`);
    finalUsers.forEach((user, index) => {
      console.log(
        `   ${index + 1}. ${user.name} (${user.email}) - ID: ${user.id}`
      );
    });
  } catch (error) {
    console.error("Unexpected error:", error);
  }

  console.log("\n" + "=".repeat(80));
  console.log("DEMO COMPLETED");
  console.log("=".repeat(80));
}

// Ejecutar la demostración
demonstrateDecorators().catch(console.error);
