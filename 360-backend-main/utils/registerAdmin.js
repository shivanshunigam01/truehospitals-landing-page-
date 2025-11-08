const Admin = require("../models/Admin");

/**
 * Automatically registers a default admin if none exists.
 * This helps avoid manual registration in MongoDB or Postman.
 */
const registerDefaultAdmin = async () => {
  try {
    const existingAdmin = await Admin.findOne({ email: "admin@truehospitals.com" });

    if (existingAdmin) {
      console.log("✅ Default admin already exists:", existingAdmin.email);
      return;
    }

    const newAdmin = new Admin({
      email: "admin@truehospitals.com",
      password: "Admin@123", // plain password will be auto-hashed by pre-save hook
    });

    await newAdmin.save();
    console.log("🎉 Default admin created successfully!");
    console.log("🪪 Email:", newAdmin.email);
    console.log("🔑 Password: Admin@123");
  } catch (err) {
    console.error("❌ Error creating default admin:", err.message);
  }
};

module.exports = registerDefaultAdmin;
