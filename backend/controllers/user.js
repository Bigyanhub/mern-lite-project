import db from "../database/db.js";
import bcrypt from "bcrypt";

const saltRounds = 10;

/* -------------------------------------------------------------------------- */
/*                               Test Route (GET)                             */
/* -------------------------------------------------------------------------- */
// Simple test endpoint to confirm server/controller is working
export const getData = (req, res) => {
  res.send("Hello, this is the data you requested! using getData controller");
};

/* -------------------------------------------------------------------------- */
/*                             Add New User (POST)                            */
/* -------------------------------------------------------------------------- */
// Inserts a new user into the database
// Endpoint: POST /addUser
export const addUser = async (req, res) => {
  const { name, email, password } = req.body;

  // Validate required fields
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Hash the password with bcrypt
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const q1 = "INSERT INTO user (name, email, password) VALUES (?, ?, ?)";
    db.query(q1, [name, email, hashedPassword], (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Error inserting data", err });
      }

      return res.status(201).json({ message: "User created successfully", result });
    });
  } catch (err) {
    console.error("Bcrypt error:", err);
    return res.status(500).json({ message: "Error hashing password", err });
  }
};

/* -------------------------------------------------------------------------- */
/*                             Delete User (DELETE)                           */
/* -------------------------------------------------------------------------- */
// Deletes a user by ID from the database
// Endpoint: DELETE /deleteUser/:id
export const deleteUser = (req, res) => {
  const { id } = req.params;

  // Check if user exists before deleting
  const checkQuery = "SELECT * FROM user WHERE id = ?";
  db.query(checkQuery, [id], (err, checkResult) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Error checking user", err });
    }

    if (checkResult.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const deleteQuery = "DELETE FROM user WHERE id = ?";
    db.query(deleteQuery, [id], (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Error deleting user", err });
      }

      return res.status(200).json({ message: "User deleted successfully", result });
    });
  });
};

/* -------------------------------------------------------------------------- */
/*                             Update User (PUT)                              */
/* -------------------------------------------------------------------------- */
// Updates a user by ID with new data
// Endpoint: PUT /updateUser/:id
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;

  // Validate input fields
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Hash the new password with bcrypt
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Check if user exists before updating
    const checkQuery = "SELECT * FROM user WHERE id = ?";
    db.query(checkQuery, [id], (err, checkResult) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Error checking user", err });
      }

      if (checkResult.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      const updateQuery = "UPDATE user SET name = ?, email = ?, password = ? WHERE id = ?";
      db.query(updateQuery, [name, email, hashedPassword, id], (err, result) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ message: "Error updating user", err });
        }

        return res.status(200).json({
          message: "User updated successfully",
          result,
          updatedUser: { id, name, email }
        });
      });
    });
  } catch (err) {
    console.error("Bcrypt error:", err);
    return res.status(500).json({ message: "Error hashing password", err });
  }
};

/* -------------------------------------------------------------------------- */
/*                          Get All Users (GET)                               */
/* -------------------------------------------------------------------------- */
// Retrieves all users from the database
// Endpoint: GET /showAllUsers
export const showAllUser = (req, res) => {
  const q2 = "SELECT * FROM user";
  db.query(q2, (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Error fetching users", err });
    }

    return res.status(200).json({
      message: "Users retrieved successfully",
      result,
      count: result.length
    });
  });
};

/* -------------------------------------------------------------------------- */
/*                          Get Single User (GET)                             */
/* -------------------------------------------------------------------------- */
// Retrieves one user by ID
// Endpoint: GET /getOneUser/:id
export const getOneUser = (req, res) => {
  const { id } = req.params;

  // Validate that ID is provided
  if (!id) {
    return res.status(400).json({ message: "User ID is required" });
  }

  const query = "SELECT * FROM user WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Error fetching user", err });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // User found, return user details
    return res.status(200).json({
      message: "User retrieved successfully",
      user: result[0]
    });
  });
};

/* -------------------------------------------------------------------------- */
/*                                 Login User                                 */
/* -------------------------------------------------------------------------- */
// Authenticates a user by email and password
// Endpoint: POST /login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Validate required fields
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // Check if user exists
    const query = "SELECT * FROM user WHERE email = ?";
    db.query(query, [email], async (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Error fetching user", err });
      }

      if (result.length === 0) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const user = result[0];
      // Compare provided password with stored hashed password
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      return res.status(200).json({
        message: "Login successful",
        user: { id: user.id, name: user.name, email: user.email }
      });
    });
  } catch (err) {
    console.error("Bcrypt error:", err);
    return res.status(500).json({ message: "Error verifying password", err });
  }
};