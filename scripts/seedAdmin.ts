// scripts/seedAdmin.ts
import { supabase } from "./supabaseAdmin.ts";




import readline from "readline";

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Utility function to ask a question and wait for input
function ask(question: string): Promise<string> {
  return new Promise((resolve) => rl.question(question, resolve));
}

async function createAdmin() {
  try {
    // Ask for email and password dynamically
    const email = await ask("Enter admin email: ");
    const password = await ask("Enter admin password: ");

    // Close the readline interface
    rl.close();

    // Create the user via Supabase admin API
    const { data: user, error } = await supabase.auth.admin.createUser({
      email,
      password,
    });

    if (error || !user) {
      throw new Error(error?.message || "Failed to create admin user.");
    }

    // Assign admin role
    const { error: roleError } = await supabase.from("user_roles").insert({
      user_id: user.id,
      role: "admin",
    });

    if (roleError) {
      throw new Error(roleError.message);
    }

    console.log("✅ Admin successfully created:", user.email);
  } catch (err: any) {
    console.error("❌ Error creating admin:", err.message || err);
    rl.close();
  }
}

// Run the function
createAdmin();
