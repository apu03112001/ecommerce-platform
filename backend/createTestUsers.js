const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/User");

const createUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected.");

    const users = [
      {
        name: "New Admin",
        email: "admin@test.com",
        password: "123456",
        role: "admin",
      },
      {
        name: "Sales Person",
        email: "sales@test.com",
        password: "123456",
        role: "sales_person",
      },
      {
        name: "Normal User",
        email: "user@test.com",
        password: "123456",
        role: "user",
      },
    ];

    for (const userData of users) {
      const existingUser = await User.findOne({
        email: userData.email,
      });

      if (existingUser) {
        console.log(
          `${userData.email} already exists.`
        );
        continue;
      }

      const hashedPassword = await bcrypt.hash(
        userData.password,
        10
      );

      await User.create({
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        role: userData.role,
      });

      console.log(
        `${userData.role} created: ${userData.email}`
      );
    }

    console.log("Done.");
    process.exit(0);
  } catch (error) {
    console.error("ERROR:", error);
    process.exit(1);
  }
};

createUsers();